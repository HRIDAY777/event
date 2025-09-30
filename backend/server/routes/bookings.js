import express from 'express'
import { Booking } from '../models/Booking.js'
import { User } from '../models/User.js'
import { Package } from '../models/Package.js'
import { Venue } from '../models/Venue.js'
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth.js'
import { handleValidationErrors, validateBookingCreation, validateBookingUpdate } from '../middleware/validation.js'

const router = express.Router()

// Get all bookings (Manager/Admin only)
router.get('/', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customer, date, package: packageId, venue: venueId } = req.query
    
    const whereClause = {}
    if (status) whereClause.status = status
    if (customer) whereClause.customer = customer
    if (date) whereClause['event.date'] = { $gte: new Date(date) }
    if (packageId) whereClause.package = packageId
    if (venueId) whereClause.venue = venueId

    const offset = (page - 1) * limit
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'customerInfo', attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { model: Package, as: 'packageInfo', attributes: ['name', 'price', 'category'] },
        { model: Venue, as: 'venueInfo', attributes: ['name', 'location', 'capacity'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' })
  }
})

// Get user's own bookings (authenticated users)
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    const whereClause = { customer: req.user.id }
    if (status) whereClause.status = status

    const offset = (page - 1) * limit
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        { model: Package, as: 'packageInfo', attributes: ['name', 'price', 'category'] },
        { model: Venue, as: 'venueInfo', attributes: ['name', 'location', 'capacity'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' })
  }
})

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customerInfo', attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { model: Package, as: 'packageInfo', attributes: ['name', 'price', 'category', 'features'] },
        { model: Venue, as: 'venueInfo', attributes: ['name', 'location', 'capacity', 'amenities'] }
      ]
    })
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    
    // Check if user has permission to view this booking
    if (booking.customer !== req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    res.json({ success: true, data: booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch booking' })
  }
})

// Create new booking (authenticated users)
router.post('/', authenticateToken, validateBookingCreation, handleValidationErrors, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      customer: req.user.id,
      createdBy: req.user.id
    }
    
    // Check if venue is available for the selected date
    if (bookingData.venue) {
      const venue = await Venue.findByPk(bookingData.venue)
      if (!venue || !venue.isAvailable(bookingData.event.date)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Selected venue is not available for the chosen date' 
        })
      }
    }
    
    // Check if package exists and is active
    if (bookingData.package) {
      const packageItem = await Package.findByPk(bookingData.package)
      if (!packageItem || packageItem.status !== 'active') {
        return res.status(400).json({ 
          success: false, 
          message: 'Selected package is not available' 
        })
      }
    }
    
    const newBooking = await Booking.create(bookingData)
    
    // Populate the created booking with related data
    const populatedBooking = await Booking.findByPk(newBooking.id, {
      include: [
        { model: Package, as: 'packageInfo', attributes: ['name', 'price', 'category'] },
        { model: Venue, as: 'venueInfo', attributes: ['name', 'location', 'capacity'] }
      ]
    })
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    res.status(500).json({ success: false, message: 'Failed to create booking' })
  }
})

// Update booking (Manager/Admin or booking owner)
router.put('/:id', authenticateToken, validateBookingUpdate, handleValidationErrors, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id)
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    
    // Check if user has permission to edit this booking
    if (booking.customer !== req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    // Only managers and admins can change booking status
    if (req.body.status && booking.customer === req.user.id) {
      delete req.body.status
    }
    
    await booking.update(req.body)
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    res.status(500).json({ success: false, message: 'Failed to update booking' })
  }
})

// Delete booking (Manager/Admin or booking owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id)
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    
    // Check if user has permission to delete this booking
    if (booking.customer !== req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    // Only allow deletion of pending bookings
    if (booking.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only pending bookings can be deleted' 
      })
    }
    
    await booking.destroy()
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    res.status(500).json({ success: false, message: 'Failed to delete booking' })
  }
})

// Update booking status (Manager/Admin only)
router.patch('/:id/status', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      })
    }
    
    const booking = await Booking.findByPk(req.params.id)
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    
    booking.status = status
    await booking.save()
    
    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    })
  } catch (error) {
    console.error('Error updating booking status:', error)
    res.status(500).json({ success: false, message: 'Failed to update booking status' })
  }
})

// Get bookings by date range (Manager/Admin only)
router.get('/date-range/:start/:end', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const { start, end } = req.params
    const { page = 1, limit = 10 } = req.query
    
    const whereClause = {
      'event.date': {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }

    const offset = (page - 1) * limit
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'customerInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: Package, as: 'packageInfo', attributes: ['name', 'price'] },
        { model: Venue, as: 'venueInfo', attributes: ['name', 'location'] }
      ],
      order: [['event.date', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings by date range:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch bookings by date range' })
  }
})

// Get booking statistics (Manager/Admin only)
router.get('/stats/overview', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const totalBookings = await Booking.count()
    const pendingBookings = await Booking.count({ where: { status: 'pending' } })
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } })
    const completedBookings = await Booking.count({ where: { status: 'completed' } })
    const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } })
    
    // Calculate total revenue from completed bookings
    const completedBookingsData = await Booking.findAll({
      where: { status: 'completed' },
      attributes: ['pricing']
    })
    
    const totalRevenue = completedBookingsData.reduce((sum, booking) => {
      return sum + (parseFloat(booking.pricing?.total) || 0)
    }, 0)
    
    res.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue.toFixed(2)
      }
    })
  } catch (error) {
    console.error('Error fetching booking statistics:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch booking statistics' })
  }
})

export default router

