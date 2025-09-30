import express from 'express'
import { Message } from '../models/Message.js'
import { User } from '../models/User.js'
import { authenticateToken, requireManagerOrAdmin } from '../middleware/auth.js'
import { handleValidationErrors, validateMessageCreation } from '../middleware/validation.js'

const router = express.Router()

// Get all messages (Manager/Admin only)
router.get('/', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, category, sender, recipient, search } = req.query
    
    const whereClause = {}
    if (status) whereClause.status = status
    if (priority) whereClause.priority = priority
    if (category) whereClause.category = category
    if (sender) whereClause.sender = sender
    if (recipient) whereClause.recipient = recipient
    if (search) {
      whereClause.$or = [
        { subject: { $iLike: `%${search}%` } },
        { content: { $iLike: `%${search}%` } }
      ]
    }

    const offset = (page - 1) * limit
    const { count, rows: messages } = await Message.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'recipientInfo', attributes: ['firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch messages' })
  }
})

// Get user's messages (authenticated users)
router.get('/my-messages', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type = 'all' } = req.query
    
    let whereClause = {}
    
    if (type === 'sent') {
      whereClause.sender = req.user.id
    } else if (type === 'received') {
      whereClause.recipient = req.user.id
    } else {
      whereClause.$or = [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    }
    
    if (status) whereClause.status = status

    const offset = (page - 1) * limit
    const { count, rows: messages } = await Message.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'recipientInfo', attributes: ['firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching user messages:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch messages' })
  }
})

// Get unread message count (authenticated users)
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await Message.count({
      where: {
        recipient: req.user.id,
        status: 'unread'
      }
    })
    
    res.json({
      success: true,
      data: { unreadCount: count }
    })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' })
  }
})

// Get message by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'recipientInfo', attributes: ['firstName', 'lastName', 'email'] }
      ]
    })
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    
    // Check if user has permission to view this message
    if (message.sender !== req.user.id && message.recipient !== req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    // Mark as read if recipient is viewing
    if (message.recipient === req.user.id && message.status === 'unread') {
      message.status = 'read'
      message.readAt = new Date()
      await message.save()
    }
    
    res.json({ success: true, data: message })
  } catch (error) {
    console.error('Error fetching message:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch message' })
  }
})

// Create new message (authenticated users)
router.post('/', authenticateToken, validateMessageCreation, handleValidationErrors, async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      sender: req.user.id,
      createdBy: req.user.id
    }
    
    const newMessage = await Message.create(messageData)
    
    // Populate the created message with related data
    const populatedMessage = await Message.findByPk(newMessage.id, {
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'recipientInfo', attributes: ['firstName', 'lastName', 'email'] }
      ]
    })
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    })
  } catch (error) {
    console.error('Error creating message:', error)
    res.status(500).json({ success: false, message: 'Failed to send message' })
  }
})

// Reply to message (authenticated users)
router.post('/:id/reply', authenticateToken, validateMessageCreation, handleValidationErrors, async (req, res) => {
  try {
    const originalMessage = await Message.findByPk(req.params.id)
    
    if (!originalMessage) {
      return res.status(404).json({ success: false, message: 'Original message not found' })
    }
    
    // Check if user has permission to reply to this message
    if (originalMessage.sender !== req.user.id && originalMessage.recipient !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    const replyData = {
      ...req.body,
      sender: req.user.id,
      recipient: originalMessage.sender === req.user.id ? originalMessage.recipient : originalMessage.sender,
      thread: originalMessage.thread || originalMessage.id,
      category: originalMessage.category,
      priority: originalMessage.priority,
      createdBy: req.user.id
    }
    
    const reply = await Message.create(replyData)
    
    // Update original message status to replied
    originalMessage.status = 'replied'
    originalMessage.repliedAt = new Date()
    await originalMessage.save()
    
    // Add reply to original message's replies array
    if (!originalMessage.replies) originalMessage.replies = []
    originalMessage.replies.push(reply.id)
    await originalMessage.save()
    
    // Populate the reply with related data
    const populatedReply = await Message.findByPk(reply.id, {
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'recipientInfo', attributes: ['firstName', 'lastName', 'email'] }
      ]
    })
    
    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: populatedReply
    })
  } catch (error) {
    console.error('Error sending reply:', error)
    res.status(500).json({ success: false, message: 'Failed to send reply' })
  }
})

// Update message status (authenticated users)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['unread', 'read', 'replied', 'closed']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      })
    }
    
    const message = await Message.findByPk(req.params.id)
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    
    // Check if user has permission to update this message
    if (message.sender !== req.user.id && message.recipient !== req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    message.status = status
    await message.save()
    
    res.json({
      success: true,
      message: `Message status updated to ${status}`,
      data: message
    })
  } catch (error) {
    console.error('Error updating message status:', error)
    res.status(500).json({ success: false, message: 'Failed to update message status' })
  }
})

// Delete message (authenticated users)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id)
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    
    // Check if user has permission to delete this message
    if (message.sender !== req.user.id && message.recipient !== req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    await message.destroy()
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    res.status(500).json({ success: false, message: 'Failed to delete message' })
  }
})

// Get message thread (authenticated users)
router.get('/:id/thread', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id)
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    
    // Check if user has permission to view this message thread
    if (message.sender !== req.user.id && message.recipient !== req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    
    const threadId = message.thread || message.id
    const threadMessages = await Message.findAll({
      where: {
        $or: [
          { id: threadId },
          { thread: threadId }
        ]
      },
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'recipientInfo', attributes: ['firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'ASC']]
    })
    
    res.json({
      success: true,
      data: threadMessages
    })
  } catch (error) {
    console.error('Error fetching message thread:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch message thread' })
  }
})

// Mark all messages as read (authenticated users)
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await Message.update(
      { 
        status: 'read',
        readAt: new Date()
      },
      {
        where: {
          recipient: req.user.id,
          status: 'unread'
        }
      }
    )
    
    res.json({
      success: true,
      message: 'All messages marked as read'
    })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' })
  }
})

// Get urgent messages (Manager/Admin only)
router.get('/urgent/list', authenticateToken, requireManagerOrAdmin, async (req, res) => {
  try {
    const urgentMessages = await Message.findAll({
      where: {
        priority: 'urgent',
        status: { $ne: 'closed' }
      },
      include: [
        { model: User, as: 'senderInfo', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'recipientInfo', attributes: ['firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    })
    
    res.json({
      success: true,
      data: urgentMessages
    })
  } catch (error) {
    console.error('Error fetching urgent messages:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch urgent messages' })
  }
})

export default router
