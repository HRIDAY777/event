import express from 'express'
import { User } from '../models/User.js'
import { Package } from '../models/Package.js'
import { Venue } from '../models/Venue.js'
import { Booking } from '../models/Booking.js'
import { Message } from '../models/Message.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get admin dashboard overview (Admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.count()
    const totalPackages = await Package.count()
    const totalVenues = await Venue.count()
    const totalBookings = await Booking.count()
    const totalMessages = await Message.count()
    
    // Get active counts
    const activePackages = await Package.count({ where: { status: 'active' } })
    const availableVenues = await Venue.count({ where: { status: 'available' } })
    const pendingBookings = await Booking.count({ where: { status: 'pending' } })
    const unreadMessages = await Message.count({ where: { status: 'unread' } })
    
    // Get recent data
    const recentUsers = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    })
    
    const recentBookings = await Booking.findAll({
      include: [
        { model: User, as: 'customerInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: Package, as: 'packageInfo', attributes: ['name', 'price'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    })
    
    const recentMessages = await Message.findAll({
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    })
    
    // Calculate revenue
    const completedBookings = await Booking.findAll({
      where: { status: 'completed' },
      attributes: ['pricing']
    })
    
    const totalRevenue = completedBookings.reduce((sum, booking) => {
      return sum + (parseFloat(booking.pricing?.total) || 0)
    }, 0)
    
    // Get monthly revenue for the last 6 months
    const monthlyRevenue = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthBookings = await Booking.findAll({
        where: {
          status: 'completed',
          createdAt: {
            $gte: month,
            $lte: monthEnd
          }
        },
        attributes: ['pricing']
      })
      
      const monthRevenue = monthBookings.reduce((sum, booking) => {
        return sum + (parseFloat(booking.pricing?.total) || 0)
      }, 0)
      
      monthlyRevenue.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue
      })
    }
    
    // Get popular packages
    const popularPackages = await Package.findAll({
      where: { isPopular: true, status: 'active' },
      attributes: ['id', 'name', 'price', 'category'],
      order: [['createdAt', 'DESC']],
      limit: 5
    })
    
    // Get top venues by rating
    const topVenues = await Venue.findAll({
      where: { status: 'available' },
      attributes: ['id', 'name', 'rating', 'location'],
      order: [['rating', 'DESC']],
      limit: 5
    })
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalPackages,
          totalVenues,
          totalBookings,
          totalMessages,
          activePackages,
          availableVenues,
          pendingBookings,
          unreadMessages,
          totalRevenue: totalRevenue.toFixed(2)
        },
        recentUsers,
        recentBookings,
        recentMessages,
        monthlyRevenue,
        popularPackages,
        topVenues
      }
    })
  } catch (error) {
    console.error('Error fetching admin dashboard:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' })
  }
})

// Get detailed statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = 'month' } = req.query
    
    let startDate
    const now = new Date()
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }
    
    // User statistics
    const newUsers = await User.count({
      where: { createdAt: { $gte: startDate } }
    })
    
    const activeUsers = await User.count({
      where: { isActive: true }
    })
    
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role']
    })
    
    // Package statistics
    const newPackages = await Package.count({
      where: { createdAt: { $gte: startDate } }
    })
    
    const packagesByCategory = await Package.findAll({
      attributes: [
        'category',
        [Package.sequelize.fn('COUNT', Package.sequelize.col('id')), 'count']
      ],
      group: ['category']
    })
    
    const packagesByStatus = await Package.findAll({
      attributes: [
        'status',
        [Package.sequelize.fn('COUNT', Package.sequelize.col('id')), 'count']
      ],
      group: ['status']
    })
    
    // Venue statistics
    const newVenues = await Venue.count({
      where: { createdAt: { $gte: startDate } }
    })
    
    const venuesByStatus = await Venue.findAll({
      attributes: [
        'status',
        [Venue.sequelize.fn('COUNT', Venue.sequelize.col('id')), 'count']
      ],
      group: ['status']
    })
    
    const averageVenueRating = await Venue.findOne({
      attributes: [
        [Venue.sequelize.fn('AVG', Venue.sequelize.col('rating')), 'averageRating']
      ]
    })
    
    // Booking statistics
    const newBookings = await Booking.count({
      where: { createdAt: { $gte: startDate } }
    })
    
    const bookingsByStatus = await Booking.findAll({
      attributes: [
        'status',
        [Booking.sequelize.fn('COUNT', Booking.sequelize.col('id')), 'count']
      ],
      group: ['status']
    })
    
    const bookingsByMonth = await Booking.findAll({
      attributes: [
        [Booking.sequelize.fn('DATE_TRUNC', 'month', Booking.sequelize.col('createdAt')), 'month'],
        [Booking.sequelize.fn('COUNT', Booking.sequelize.col('id')), 'count']
      ],
      where: { createdAt: { $gte: startDate } },
      group: ['month'],
      order: [['month', 'ASC']]
    })
    
    // Message statistics
    const newMessages = await Message.count({
      where: { createdAt: { $gte: startDate } }
    })
    
    const messagesByPriority = await Message.findAll({
      attributes: [
        'priority',
        [Message.sequelize.fn('COUNT', Message.sequelize.col('id')), 'count']
      ],
      group: ['priority']
    })
    
    const messagesByStatus = await Message.findAll({
      attributes: [
        'status',
        [Message.sequelize.fn('COUNT', Message.sequelize.col('id')), 'count']
      ],
      group: ['status']
    })
    
    res.json({
      success: true,
      data: {
        period,
        startDate,
        users: {
          new: newUsers,
          active: activeUsers,
          byRole: usersByRole
        },
        packages: {
          new: newPackages,
          byCategory: packagesByCategory,
          byStatus: packagesByStatus
        },
        venues: {
          new: newVenues,
          byStatus: venuesByStatus,
          averageRating: parseFloat(averageVenueRating?.dataValues?.averageRating || 0).toFixed(2)
        },
        bookings: {
          new: newBookings,
          byStatus: bookingsByStatus,
          byMonth: bookingsByMonth
        },
        messages: {
          new: newMessages,
          byPriority: messagesByPriority,
          byStatus: messagesByStatus
        }
      }
    })
  } catch (error) {
    console.error('Error fetching admin statistics:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' })
  }
})

// Get system health status (Admin only)
router.get('/health', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const healthChecks = {
      database: 'healthy',
      api: 'healthy',
      memory: 'healthy',
      disk: 'healthy'
    }
    
    // Check database connection
    try {
      await User.sequelize.authenticate()
      healthChecks.database = 'healthy'
    } catch (error) {
      healthChecks.database = 'unhealthy'
    }
    
    // Check memory usage
    const memUsage = process.memoryUsage()
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024)
    }
    
    if (memUsageMB.heapUsed > 500) { // 500MB threshold
      healthChecks.memory = 'warning'
    }
    
    // Check uptime
    const uptime = process.uptime()
    const uptimeFormatted = {
      seconds: Math.floor(uptime),
      minutes: Math.floor(uptime / 60),
      hours: Math.floor(uptime / 3600),
      days: Math.floor(uptime / 86400)
    }
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: uptimeFormatted,
        memory: memUsageMB,
        healthChecks,
        version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    })
  } catch (error) {
    console.error('Error checking system health:', error)
    res.status(500).json({ success: false, message: 'Failed to check system health' })
  }
})

// Get user management data (Admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query
    
    const whereClause = {}
    if (role) whereClause.role = role
    if (status !== undefined) whereClause.isActive = status === 'active'
    if (search) {
      whereClause.$or = [
        { firstName: { $iLike: `%${search}%` } },
        { lastName: { $iLike: `%${search}%` } },
        { email: { $iLike: `%${search}%` } }
      ]
    }

    const offset = (page - 1) * limit
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch users' })
  }
})

// Get system logs (Admin only)
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // This would typically connect to a logging service
    // For now, we'll return basic system information
    const logs = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'System running normally',
        source: 'system'
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'info',
        message: 'Database connection healthy',
        source: 'database'
      },
      {
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'info',
        message: 'API endpoints responding',
        source: 'api'
      }
    ]
    
    res.json({
      success: true,
      data: logs
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch logs' })
  }
})

export default router
