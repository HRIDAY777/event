import { DataTypes, Model } from 'sequelize'
import bcrypt from 'bcryptjs'
import { sequelize } from '../config/database.js'

class User extends Model {
  // Instance methods
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
  }

  hasRole(role) {
    return this.role === role
  }

  isAdmin() {
    return this.role === 'admin'
  }

  isManager() {
    return this.role === 'manager' || this.role === 'admin'
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
      notEmpty: true
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255],
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'manager', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[\+]?[1-9][\d]{0,15}$/
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailVerificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  emailVerificationExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    beforeCreate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
})

export { User }
