import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'

class Package extends Model {
  // Instance methods
  get formattedPrice() {
    return `৳${this.price.toLocaleString('bn-BD')}`
  }

  get durationText() {
    if (this.duration <= 1) return `${this.duration} দিন`
    return `${this.duration} দিন`
  }

  isActive() {
    return this.status === 'active'
  }

  isPopular() {
    return this.isPopular
  }
}

Package.init({
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
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      notEmpty: true
    }
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  category: {
    type: DataTypes.ENUM('basic', 'standard', 'premium', 'luxury', 'custom'),
    defaultValue: 'standard',
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 30
    }
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 10,
      max: 1000
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'active',
    allowNull: false
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  images: {
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
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  customizations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationPolicy: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Package',
  tableName: 'packages',
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isPopular']
    },
    {
      fields: ['price']
    }
  ]
})

export { Package }
