import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'

class Venue extends Model {
  // Instance methods
  get formattedBasePrice() {
    return `৳${this.pricing?.basePrice?.toLocaleString('bn-BD') || '0'}`
  }

  get capacityRange() {
    if (this.capacity?.min && this.capacity?.max) {
      return `${this.capacity.min}-${this.capacity.max} জন`
    }
    return `${this.capacity?.max || this.capacity?.min || 0} জন`
  }

  get fullAddress() {
    const parts = [this.location?.street, this.location?.city, this.location?.state, this.location?.zipCode, this.location?.country]
    return parts.filter(Boolean).join(', ')
  }

  get ratingDisplay() {
    if (!this.rating) return 'No ratings yet'
    return `${this.rating.toFixed(1)}/5.0`
  }

  isAvailable(date) {
    if (!this.availability) return true
    return this.availability.some(slot => 
      new Date(slot.date) >= new Date(date) && slot.status === 'available'
    )
  }
}

Venue.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100],
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000],
      notEmpty: true
    }
  },
  location: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidLocation(value) {
        if (!value.street || !value.city || !value.country) {
          throw new Error('Location must include street, city, and country')
        }
      }
    }
  },
  capacity: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidCapacity(value) {
        if (!value.min || !value.max || value.min > value.max) {
          throw new Error('Invalid capacity range')
        }
      }
    }
  },
  pricing: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidPricing(value) {
        if (!value.basePrice || value.basePrice < 0) {
          throw new Error('Base price must be positive')
        }
      }
    }
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  availability: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'unavailable', 'maintenance'),
    defaultValue: 'available',
    allowNull: false
  },
  contact: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  policies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  }
}, {
  sequelize,
  modelName: 'Venue',
  tableName: 'venues',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['location.city']
    },
    {
      fields: ['capacity.max']
    },
    {
      fields: ['rating']
    }
  ]
})

export { Venue }
