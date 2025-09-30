import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database.js'

class Message extends Model {
  // Instance methods
  get preview() {
    if (!this.content) return 'No content'
    return this.content.length > 100 
      ? this.content.substring(0, 100) + '...' 
      : this.content
  }

  get priorityColor() {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    }
    return colors[this.priority] || 'text-gray-600'
  }

  get statusColor() {
    const colors = {
      unread: 'text-blue-600',
      read: 'text-green-600',
      replied: 'text-purple-600',
      closed: 'text-gray-600'
    }
    return colors[this.status] || 'text-gray-600'
  }

  get timeAgo() {
    if (!this.createdAt) return 'Unknown time'
    
    const now = new Date()
    const diffInSeconds = Math.floor((now - this.createdAt) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return this.createdAt.toLocaleDateString()
  }

  isUnread() {
    return this.status === 'unread'
  }

  isReplied() {
    return this.status === 'replied'
  }

  isClosed() {
    return this.status === 'closed'
  }

  hasReplies() {
    return this.replies && this.replies.length > 0
  }
}

Message.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  subject: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [3, 200],
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 5000],
      notEmpty: true
    }
  },
  sender: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  recipient: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.ENUM('general', 'support', 'booking', 'payment', 'feedback', 'other'),
    defaultValue: 'general',
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'replied', 'closed'),
    defaultValue: 'unread',
    allowNull: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  repliedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  relatedTo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  thread: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id'
    }
  },
  replies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  metadata: {
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
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
  timestamps: true,
  hooks: {
    beforeUpdate: async (message) => {
      // Update timestamps based on status changes
      if (message.changed('status')) {
        const now = new Date()
        
        switch (message.status) {
          case 'read':
            if (!message.readAt) message.readAt = now
            break
          case 'replied':
            if (!message.repliedAt) message.repliedAt = now
            break
          case 'closed':
            if (!message.closedAt) message.closedAt = now
            break
        }
      }
    }
  },
  indexes: [
    {
      fields: ['sender']
    },
    {
      fields: ['recipient']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['category']
    },
    {
      fields: ['thread']
    },
    {
      fields: ['createdAt']
    }
  ]
})

export { Message }
