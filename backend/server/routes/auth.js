import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import { config } from '../config/env.js'
import { User } from '../models/User.js'
import { 
  authenticateToken, 
  generateToken 
} from '../middleware/auth.js'
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateEmail, 
  validatePasswordReset 
} from '../middleware/validation.js'

const router = express.Router()

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { firstName, lastName, email, password, company, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      company,
      phone
    })

    // Generate JWT token
    const token = generateToken(user.id)

    // Remove password from response
    const userResponse = user.toJSON()
    delete userResponse.password

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
})

// @desc    User login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email and include password
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = generateToken(user.id)

    // Remove password from response
    const userResponse = user.toJSON()
    delete userResponse.password

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
})

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    
    res.json({
      success: true,
      data: { user }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    })
  }
})

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, company, phone, address } = req.body

    // Find and update user
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    await user.update({
      firstName,
      lastName,
      company,
      phone,
      address
    })

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    })
  }
})

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticateToken, validatePasswordReset, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    })
  }
})

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', validateEmail, async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Generate password reset token
    const resetToken = jwt.sign(
      { id: user.id },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Save reset token to user
    user.passwordResetToken = resetToken
    user.passwordResetExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    // TODO: Send email with reset link
    // For now, just return the token (in production, send via email)
    res.json({
      success: true,
      message: 'Password reset email sent',
      data: {
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      }
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset',
      error: error.message
    })
  }
})

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      })
    }

    // Verify reset token
    const decoded = jwt.verify(resetToken, config.JWT_SECRET)
    
    // Find user with reset token
    const user = await User.findOne({
      where: {
        id: decoded.id,
        passwordResetToken: resetToken,
        passwordResetExpires: { [Op.gt]: Date.now() }
      }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Update password and clear reset token
    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successfully'
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired'
      })
    }

    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    })
  }
})

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
    
    // Check if user exists and is active
    const user = await User.findByPk(decoded.id)
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }

    // Generate new access token
    const newToken = generateToken(user.id)

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user,
        token: newToken
      }
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired'
      })
    }

    console.error('Refresh token error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    })
  }
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    })
  }
})

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { verificationToken } = req.body

    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      })
    }

    // Verify token
    const decoded = jwt.verify(verificationToken, config.JWT_SECRET)
    
    // Find user with verification token
    const user = await User.findOne({
      where: {
        id: decoded.id,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: { [Op.gt]: Date.now() }
      }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      })
    }

    // Mark email as verified
    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Email verified successfully'
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired'
      })
    }

    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message
    })
  }
})

export default router
