import express from 'express'
import { Package } from '../models/Package.js'
import { User } from '../models/User.js'
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth.js'
import { handleValidationErrors, validatePackageCreation, validatePackageUpdate } from '../middleware/validation.js'

const router = express.Router()

// Get all packages (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, minPrice, maxPrice, search } = req.query
    
    const whereClause = {}
    if (category) whereClause.category = category
    if (status) whereClause.status = status
    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price.$gte = parseFloat(minPrice)
      if (maxPrice) whereClause.price.$lte = parseFloat(maxPrice)
    }
    if (search) {
      whereClause.$or = [
        { name: { $iLike: `%${search}%` } },
        { description: { $iLike: `%${search}%` } }
      ]
    }

    const offset = (page - 1) * limit
    const { count, rows: packages } = await Package.findAndCountAll({
      where: whereClause,
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: packages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch packages' })
  }
})

// Get active packages (public)
router.get('/active', async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { status: 'active' },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']]
    })
    
    res.json({ success: true, data: packages })
  } catch (error) {
    console.error('Error fetching active packages:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch active packages' })
  }
})

// Get popular packages (public)
router.get('/popular', async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { isPopular: true, status: 'active' },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']]
    })
    
    res.json({ success: true, data: packages })
  } catch (error) {
    console.error('Error fetching popular packages:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch popular packages' })
  }
})

// Get package by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const packageItem = await Package.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }]
    })
    
    if (!packageItem) {
      return res.status(404).json({ success: false, message: 'Package not found' })
    }
    
    res.json({ success: true, data: packageItem })
  } catch (error) {
    console.error('Error fetching package:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch package' })
  }
})

// Create new package (Manager/Admin only)
router.post('/', authenticateToken, requireManagerOrAdmin, validatePackageCreation, handleValidationErrors, async (req, res) => {
  try {
    const packageData = {
      ...req.body,
      createdBy: req.user.id
    }
    
    const newPackage = await Package.create(packageData)
    
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: newPackage
    })
  } catch (error) {
    console.error('Error creating package:', error)
    res.status(500).json({ success: false, message: 'Failed to create package' })
  }
})

// Update package (Manager/Admin only)
router.put('/:id', authenticateToken, requireManagerOrAdmin, validatePackageUpdate, handleValidationErrors, async (req, res) => {
  try {
    const packageItem = await Package.findByPk(req.params.id)
    
    if (!packageItem) {
      return res.status(404).json({ success: false, message: 'Package not found' })
    }
    
    // Check if user has permission to edit this package
    if (packageItem.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only edit packages you created' })
    }
    
    await packageItem.update(req.body)
    
    res.json({
      success: true,
      message: 'Package updated successfully',
      data: packageItem
    })
  } catch (error) {
    console.error('Error updating package:', error)
    res.status(500).json({ success: false, message: 'Failed to update package' })
  }
})

// Delete package (Manager/Admin only)
router.delete('/:id', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const packageItem = await Package.findByPk(req.params.id)
    
    if (!packageItem) {
      return res.status(404).json({ success: false, message: 'Package not found' })
    }
    
    // Check if user has permission to delete this package
    if (packageItem.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete packages you created' })
    }
    
    await packageItem.destroy()
    
    res.json({
      success: true,
      message: 'Package deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting package:', error)
    res.status(500).json({ success: false, message: 'Failed to delete package' })
  }
})

// Toggle package popularity (Manager/Admin only)
router.patch('/:id/toggle-popular', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const packageItem = await Package.findByPk(req.params.id)
    
    if (!packageItem) {
      return res.status(404).json({ success: false, message: 'Package not found' })
    }
    
    packageItem.isPopular = !packageItem.isPopular
    await packageItem.save()
    
    res.json({
      success: true,
      message: `Package ${packageItem.isPopular ? 'marked as' : 'removed from'} popular`,
      data: packageItem
    })
  } catch (error) {
    console.error('Error toggling package popularity:', error)
    res.status(500).json({ success: false, message: 'Failed to toggle package popularity' })
  }
})

// Get packages by category (public)
router.get('/category/:category', async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { 
        category: req.params.category,
        status: 'active'
      },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']]
    })
    
    res.json({ success: true, data: packages })
  } catch (error) {
    console.error('Error fetching packages by category:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch packages by category' })
  }
})

// Get packages by price range (public)
router.get('/price-range/:min/:max', async (req, res) => {
  try {
    const { min, max } = req.params
    const packages = await Package.findAll({
      where: {
        price: {
          $gte: parseFloat(min),
          $lte: parseFloat(max)
        },
        status: 'active'
      },
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }],
      order: [['price', 'ASC']]
    })
    
    res.json({ success: true, data: packages })
  } catch (error) {
    console.error('Error fetching packages by price range:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch packages by price range' })
  }
})

export default router
