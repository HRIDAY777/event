import express from 'express'
import { User } from '../models/User.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { validateId, validatePagination } from '../middleware/validation.js'

const router = express.Router()

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit
    })

    const total = count

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    })
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Only allow users to view their own profile or admins to view any profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    res.json({
      success: true,
      data: { user }
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    })
  }
})

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', authenticateToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { firstName, lastName, email, role, isActive } = req.body

    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    await user.update({
      firstName,
      lastName,
      email,
      role,
      isActive
    })

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    })

  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    })
  }
})

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, validateId, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      })
    }

    await user.destroy()

    res.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    })
  }
})

export default router
