import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'

class Booking extends Model {
  // Instance methods
  get formattedTotal() {
    return `৳${this.pricing?.total?.toLocaleString('bn-BD') || '0'}`
  }

  get formattedEventDate() {
    if (!this.event?.date) return 'Date not set'
    return new Date(this.event.date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  get statusColor() {
    const colors = {
      pending: 'text-yellow-600',
      confirmed: 'text-green-600',
      cancelled: 'text-red-600',
      completed: 'text-blue-600'
    }
    return colors[this.status] || 'text-gray-600'
  }

  get paymentStatusColor() {
    const colors = {
      pending: 'text-yellow-600',
      partial: 'text-orange-600',
      completed: 'text-green-600',
      failed: 'text-red-600',
      refunded: 'text-purple-600'
    }
    return colors[this.payment?.status] || 'text-gray-600'
  }

  isConfirmed() {
    return this.status === 'confirmed'
  }

  isCancelled() {
    return this.status === 'cancelled'
  }

  isCompleted() {
    return this.status === 'completed'
  }

  getDaysUntilEvent() {
    if (!this.event?.date) return null
    const eventDate = new Date(this.event.date)
    const today = new Date()
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
}

Booking.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bookingId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [8, 20],
      notEmpty: true
    }
  },
  customer: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  event: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidEvent(value) {
        if (!value.type || !value.date || !value.guestCount) {
          throw new Error('Event must include type, date, and guest count')
        }
      }
    }
  },
  package: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'packages',
      key: 'id'
    }
  },
  venue: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'venues',
      key: 'id'
    }
  },
  services: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  pricing: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidPricing(value) {
        if (!value.subtotal || value.subtotal < 0) {
          throw new Error('Subtotal must be positive')
        }
      }
    }
  },
  payment: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timeline: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  }
}, {
  sequelize,
  modelName: 'Booking',
  tableName: 'bookings',
  timestamps: true,
  hooks: {
    beforeCreate: async (booking) => {
      // Generate booking ID if not provided
      if (!booking.bookingId) {
        const date = new Date()
        const year = date.getFullYear().toString().slice(-2)
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        booking.bookingId = `BK${year}${month}${random}`
      }
      
      // Add initial timeline entry
      if (!booking.timeline || booking.timeline.length === 0) {
        booking.timeline = [{
          status: 'pending',
          timestamp: new Date(),
          message: 'Booking created',
          updatedBy: booking.createdBy
        }]
      }
    },
    beforeUpdate: async (booking) => {
      // Update timeline when status changes
      if (booking.changed('status')) {
        const timelineEntry = {
          status: booking.status,
          timestamp: new Date(),
          message: `Status changed to ${booking.status}`,
          updatedBy: booking.createdBy
        }
        
        if (!booking.timeline) {
          booking.timeline = []
        }
        booking.timeline.push(timelineEntry)
      }
    }
  },
  indexes: [
    {
      fields: ['bookingId']
    },
    {
      fields: ['customer']
    },
    {
      fields: ['status']
    },
    {
      fields: ['event.date']
    }
  ]
})

export { Booking }
