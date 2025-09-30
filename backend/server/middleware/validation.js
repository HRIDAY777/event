import { body, param, query, validationResult } from 'express-validator'

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    })
  }
  next()
}

// User registration validation
export const validateUserRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('phone')
    .optional()
    .matches(/^(\+880|880|0)?1[3456789]\d{8}$/)
    .withMessage('Please enter a valid Bangladeshi phone number'),
  
  handleValidationErrors
]

// User login validation
export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
]

// Package creation validation
export const validatePackageCreation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Package name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('currency')
    .optional()
    .isIn(['BDT', 'USD', 'EUR'])
    .withMessage('Currency must be BDT, USD, or EUR'),
  
  body('features')
    .isArray({ min: 1 })
    .withMessage('At least one feature is required'),
  
  body('features.*')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Each feature must be between 3 and 100 characters'),
  
  body('category')
    .isIn(['Basic', 'Standard', 'Premium', 'Luxury', 'Custom'])
    .withMessage('Invalid package category'),
  
  body('duration')
    .isInt({ min: 1, max: 30 })
    .withMessage('Duration must be between 1 and 30 days'),
  
  body('maxGuests')
    .isInt({ min: 10, max: 1000 })
    .withMessage('Maximum guests must be between 10 and 1000'),
  
  handleValidationErrors
]

// Package update validation
export const validatePackageUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid package ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Package name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Draft', 'Archived'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
]

// Venue creation validation
export const validateVenueCreation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Venue name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Venue address is required'),
  
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State/Division is required'),
  
  body('capacity.min')
    .isInt({ min: 10 })
    .withMessage('Minimum capacity must be at least 10'),
  
  body('capacity.max')
    .isInt({ min: 50, max: 2000 })
    .withMessage('Maximum capacity must be between 50 and 2000'),
  
  body('pricing.basePrice')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  
  body('contact.phone')
    .matches(/^(\+880|880|0)?1[3456789]\d{8}$/)
    .withMessage('Please enter a valid Bangladeshi phone number'),
  
  body('contact.email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
]

// Venue update validation
export const validateVenueUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid venue ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Venue name must be between 3 and 100 characters'),
  
  body('status')
    .optional()
    .isIn(['Available', 'Booked', 'Maintenance', 'Closed'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
]

// Booking creation validation
export const validateBookingCreation = [
  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  
  body('customer.email')
    .isEmail()
    .withMessage('Please enter a valid customer email')
    .normalizeEmail(),
  
  body('customer.phone')
    .matches(/^(\+880|880|0)?1[3456789]\d{8}$/)
    .withMessage('Please enter a valid Bangladeshi phone number'),
  
  body('event.type')
    .isIn(['Wedding', 'Reception', 'Engagement', 'Mehendi', 'Haldi', 'Other'])
    .withMessage('Invalid event type'),
  
  body('event.date')
    .isISO8601()
    .withMessage('Please enter a valid event date')
    .custom((value) => {
      const eventDate = new Date(value)
      const today = new Date()
      if (eventDate <= today) {
        throw new Error('Event date must be in the future')
      }
      return true
    }),
  
  body('event.guestCount')
    .isInt({ min: 10, max: 1000 })
    .withMessage('Guest count must be between 10 and 1000'),
  
  body('package')
    .isMongoId()
    .withMessage('Valid package ID is required'),
  
  body('venue')
    .isMongoId()
    .withMessage('Valid venue ID is required'),
  
  body('pricing.total')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number'),
  
  handleValidationErrors
]

// Booking update validation
export const validateBookingUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid booking ID'),
  
  body('status')
    .optional()
    .isIn(['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Postponed'])
    .withMessage('Invalid booking status'),
  
  body('payment.status')
    .optional()
    .isIn(['Pending', 'Partial', 'Completed', 'Failed', 'Refunded'])
    .withMessage('Invalid payment status'),
  
  handleValidationErrors
]

// Message creation validation
export const validateMessageCreation = [
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message content must be between 10 and 2000 characters'),
  
  body('sender.name')
    .trim()
    .notEmpty()
    .withMessage('Sender name is required'),
  
  body('sender.email')
    .isEmail()
    .withMessage('Please enter a valid sender email')
    .normalizeEmail(),
  
  body('sender.phone')
    .optional()
    .matches(/^(\+880|880|0)?1[3456789]\d{8}$/)
    .withMessage('Please enter a valid Bangladeshi phone number'),
  
  body('category')
    .optional()
    .isIn(['General Inquiry', 'Booking Request', 'Package Inquiry', 'Venue Inquiry', 'Complaint', 'Feedback', 'Support', 'Other'])
    .withMessage('Invalid message category'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Normal', 'High', 'Urgent'])
    .withMessage('Invalid priority level'),
  
  handleValidationErrors
]

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort must be either asc or desc'),
  
  handleValidationErrors
]

// Search validation
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters'),
  
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  
  query('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
  
  handleValidationErrors
]

// File upload validation
export const validateFileUpload = [
  body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required')
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed')
      }
      
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (req.file.size > maxSize) {
        throw new Error('File size must be less than 5MB')
      }
      
      return true
    }),
  
  handleValidationErrors
]

// ID parameter validation
export const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
]

// Email validation
export const validateEmail = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
]

// Password reset validation
export const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match')
      }
      return true
    }),
  
  handleValidationErrors
]
