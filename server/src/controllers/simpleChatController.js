const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Product = require("../models/Product");

// Start a new conversation or get existing one
const startConversation = async (req, res) => {
  try {
    const customerId = req.user.user_id;
    const { sellerId, productId } = req.body;

    if (!sellerId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID and Product ID are required'
      });
    }

    // Verify customer can't start conversation with themselves
    if (customerId === sellerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot start a conversation with yourself'
      });
    }

    // Verify product exists and belongs to the seller
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.seller_id !== sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Product does not belong to the specified seller'
      });
    }

    const conversation = await Conversation.findOrCreate({
      customerId,
      sellerId,
      productId
    });

    res.json({
      success: true,
      conversation: conversation
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start conversation'
    });
  }
};

// Get all conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userRole = req.user.user_type; // 'customer' or 'seller'

    const conversations = await Conversation.getByUserId(userId, userRole);

    res.json({
      success: true,
      conversations: conversations
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations'
    });
  }
};

// Get a specific conversation
const getConversation = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;

    const conversation = await Conversation.getById(conversationId, userId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    res.json({
      success: true,
      conversation: conversation
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation'
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.user_id;
    const { conversationId } = req.params;
    const { messageText, messageType = 'text' } = req.body;

    if (!messageText) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    // Verify user has access to this conversation
    const conversation = await Conversation.getById(conversationId, senderId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      messageText,
      messageType
    });

    // Update conversation timestamp
    await Conversation.updateLastMessage(conversationId);

    res.json({
      success: true,
      message: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Verify user has access to this conversation
    const conversation = await Conversation.getById(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    const messages = await Message.getByConversationId(conversationId, page, limit);

    res.json({
      success: true,
      messages: messages,
      pagination: {
        page: page,
        limit: limit,
        hasMore: messages.length === limit
      }
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;

    const updatedCount = await Message.markAsRead(conversationId, userId);

    res.json({
      success: true,
      updatedCount: updatedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const unreadCount = await Message.getUnreadCount(userId);

    res.json({
      success: true,
      unreadCount: unreadCount
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

// Get seller chat statistics (for dashboard)
const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    
    // Verify user is a seller
    if (req.user.user_type !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Seller account required'
      });
    }

    const stats = await Conversation.getSellerStats(sellerId);

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Error getting seller stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get seller statistics'
    });
  }
};

module.exports = {
  startConversation,
  getConversations,
  getConversation,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadCount,
  getSellerStats
};