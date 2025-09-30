import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { User } from '../models/User.js'

// Verify JWT token middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET)
    
    // Check if user still exists
    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      })
    }

    // Check if password was changed after token was issued
    if (user.passwordResetExpires && decoded.iat < new Date(user.passwordResetExpires).getTime() / 1000) {
      return res.status(401).json({
        success: false,
        message: 'Password was changed recently. Please login again'
      })
    }

    // Add user to request object
    req.user = user
    next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    })
  }
}

// Role-based access control middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      })
    }

    next()
  }
}

// Admin only middleware
export const requireAdmin = (req, res, next) => {
  return authorize('admin')(req, res, next)
}

// Manager or Admin middleware
export const requireManagerOrAdmin = (req, res, next) => {
  return authorize('admin', 'manager')(req, res, next)
}

// Optional authentication middleware (for public routes that can show user-specific content)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET)
      const user = await User.findByPk(decoded.id)
      
      if (user && user.isActive) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  )
}

// Verify refresh token
export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    
    if (!user || !user.isActive) {
      throw new Error('Invalid refresh token')
    }

    return user
  } catch (error) {
    throw new Error('Invalid refresh token')
  }
}

// Rate limiting middleware
export const rateLimit = {
  windowMs: config.RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes
  max: config.RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
}

// Logging middleware
export const logRequest = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`)
  })
  
  next()
}

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message)
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    })
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
}

// Not found middleware
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
}
