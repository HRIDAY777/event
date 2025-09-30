import express from 'express'
import { Venue } from '../models/Venue.js'
import { User } from '../models/User.js'
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth.js'
import { handleValidationErrors, validateVenueCreation, validateVenueUpdate } from '../middleware/validation.js'

const router = express.Router()

// Get all venues (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, city, status, minCapacity, maxCapacity, minPrice, maxPrice, search } = req.query
    
    const whereClause = {}
    if (city) whereClause['location.city'] = { $iLike: `%${city}%` }
    if (status) whereClause.status = status
    if (minCapacity || maxCapacity) {
      whereClause['capacity.max'] = {}
      if (minCapacity) whereClause['capacity.max'].$gte = parseInt(minCapacity)
      if (maxCapacity) whereClause['capacity.max'].$lte = parseInt(maxCapacity)
    }
    if (minPrice || maxPrice) {
      whereClause['pricing.basePrice'] = {}
      if (minPrice) whereClause['pricing.basePrice'].$gte = parseFloat(minPrice)
      if (maxPrice) whereClause['pricing.basePrice'].$lte = parseFloat(maxPrice)
    }
    if (search) {
      whereClause.$or = [
        { name: { $iLike: `%${search}%` } },
        { description: { $iLike: `%${search}%` } },
        { 'location.city': { $iLike: `%${search}%` } }
      ]
    }

    const offset = (page - 1) * limit
    const { count, rows: venues } = await Venue.findAndCountAll({
      where: whereClause,
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: venues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching venues:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch venues' })
  }
})

// Get available venues (public)
router.get('/available', async (req, res) => {
  try {
    const { date, guestCount, city } = req.query
    
    const whereClause = { status: 'available' }
    if (city) whereClause['location.city'] = { $iLike: `%${city}%` }
    if (guestCount) whereClause['capacity.max'] = { $gte: parseInt(guestCount) }

    const venues = await Venue.findAll({
      where: whereClause,
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['rating', 'DESC'], ['createdAt', 'DESC']]
    })

    // Filter by date availability if provided
    let availableVenues = venues
    if (date) {
      availableVenues = venues.filter(venue => venue.isAvailable(date))
    }
    
    res.json({ success: true, data: availableVenues })
  } catch (error) {
    console.error('Error fetching available venues:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch available venues' })
  }
})

// Get venue by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }]
    })
    
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' })
    }
    
    res.json({ success: true, data: venue })
  } catch (error) {
    console.error('Error fetching venue:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch venue' })
  }
})

// Create new venue (Manager/Admin only)
router.post('/', authenticateToken, requireManagerOrAdmin, validateVenueCreation, handleValidationErrors, async (req, res) => {
  try {
    const venueData = {
      ...req.body,
      createdBy: req.user.id
    }
    
    const newVenue = await Venue.create(venueData)
    
    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: newVenue
    })
  } catch (error) {
    console.error('Error creating venue:', error)
    res.status(500).json({ success: false, message: 'Failed to create venue' })
  }
})

// Update venue (Manager/Admin only)
router.put('/:id', authenticateToken, requireManagerOrAdmin, validateVenueUpdate, handleValidationErrors, async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id)
    
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' })
    }
    
    // Check if user has permission to edit this venue
    if (venue.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only edit venues you created' })
    }
    
    await venue.update(req.body)
    
    res.json({
      success: true,
      message: 'Venue updated successfully',
      data: venue
    })
  } catch (error) {
    console.error('Error updating venue:', error)
    res.status(500).json({ success: false, message: 'Failed to update venue' })
  }
})

// Delete venue (Manager/Admin only)
router.delete('/:id', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id)
    
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' })
    }
    
    // Check if user has permission to delete this venue
    if (venue.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete venues you created' })
    }
    
    await venue.destroy()
    
    res.json({
      success: true,
      message: 'Venue deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting venue:', error)
    res.status(500).json({ success: false, message: 'Failed to delete venue' })
  }
})

// Get venues by city (public)
router.get('/city/:city', async (req, res) => {
  try {
    const venues = await Venue.findAll({
      where: { 
        'location.city': { $iLike: `%${req.params.city}%` },
        status: 'available'
      },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['rating', 'DESC'], ['createdAt', 'DESC']]
    })
    
    res.json({ success: true, data: venues })
  } catch (error) {
    console.error('Error fetching venues by city:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch venues by city' })
  }
})

// Get venues by capacity range (public)
router.get('/capacity/:min/:max', async (req, res) => {
  try {
    const { min, max } = req.params
    const venues = await Venue.findAll({
      where: {
        'capacity.max': {
          $gte: parseInt(min),
          $lte: parseInt(max)
        },
        status: 'available'
      },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['capacity.max', 'ASC']]
    })
    
    res.json({ success: true, data: venues })
  } catch (error) {
    console.error('Error fetching venues by capacity:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch venues by capacity' })
  }
})

// Get venues by price range (public)
router.get('/price/:min/:max', async (req, res) => {
  try {
    const { min, max } = req.params
    const venues = await Venue.findAll({
      where: {
        'pricing.basePrice': {
          $gte: parseFloat(min),
          $lte: parseFloat(max)
        },
        status: 'available'
      },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['pricing.basePrice', 'ASC']]
    })
    
    res.json({ success: true, data: venues })
  } catch (error) {
    console.error('Error fetching venues by price:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch venues by price' })
  }
})

// Toggle venue status (Manager/Admin only)
router.patch('/:id/toggle-status', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id)
    
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' })
    }
    
    const newStatus = venue.status === 'available' ? 'unavailable' : 'available'
    venue.status = newStatus
    await venue.save()
    
    res.json({
      success: true,
      message: `Venue status changed to ${newStatus}`,
      data: venue
    })
  } catch (error) {
    console.error('Error toggling venue status:', error)
    res.status(500).json({ success: false, message: 'Failed to toggle venue status' })
  }
})

export default router
