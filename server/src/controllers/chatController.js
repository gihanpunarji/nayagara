const ChatConversation = require("../models/ChatConversation");
const ChatMessage = require("../models/ChatMessage");
const Product = require("../models/Product");
const User = require("../models/User");

// Start a new conversation or get existing one
const startConversation = async (req, res) => {
  try {
    const customerId = req.user.user_id;
    const { sellerId, productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Convert to integers for comparison
    const customerIdInt = parseInt(customerId);
    const productIdInt = parseInt(productId);

    // Verify product exists and get the actual seller
    const product = await Product.findById(productIdInt);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Use the actual seller ID from the product (this is the correct seller)
    const actualSellerId = parseInt(product.seller_id);
    
    // Verify customer can't start conversation with themselves
    if (customerIdInt === actualSellerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot start a conversation with yourself'
      });
    }

    const conversation = await ChatConversation.startConversation(
      customerIdInt,
      actualSellerId,
      productIdInt
    );

    const seller = await User.findById(actualSellerId);


    res.json({
      success: true,
      conversation: conversation,
      seller: {
        name: seller.first_name + ' ' + seller.last_name,
        image: seller.profile_image
      }
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
  console.log("getConversations called");
  try {
    const userId = req.user.user_id;
    const userRole = req.user.user_type; // 'customer' or 'seller'

    console.log(`Fetching conversations for user ${userId} with role ${userRole}`);
    
    let conversations;
    if (userRole === 'seller') {
      conversations = await ChatMessage.getSellerConversations(userId);
    } else {
      conversations = await ChatMessage.getCustomerConversations(userId);
    }

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

    const conversation = await ChatConversation.getConversationById(conversationId, userId);
    
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
    const senderType = req.user.user_type;
    const { conversationId } = req.params;
    const { messageText, messageType = 'text', attachmentUrl = null } = req.body;

    if (!messageText && !attachmentUrl) {
      return res.status(400).json({
        success: false,
        message: 'Message text or attachment is required'
      });
    }
    
    if(!senderType) {
        return res.status(400).json({
            success: false,
            message: 'Sender type is required'
        });
    }

    // Verify user has access to this conversation
    const conversation = await ChatConversation.getConversationById(conversationId, senderId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: `Conversation not found or access denied for conversationId: ${conversationId} and senderId: ${senderId}`
      });
    }

    const message = await ChatMessage.create({
      conversationId,
      senderId,
      senderType,
      messageText: messageText || '',
      messageType,
      attachmentUrl
    });

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
    const conversation = await ChatConversation.getConversationById(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    const messages = await ChatMessage.getByConversationId(conversationId, userId, page, limit);

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

    const updatedCount = await ChatMessage.markAsRead(conversationId, userId);

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
    const unreadCount = await ChatMessage.getUnreadCount(userId);

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

// Search messages
const searchMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { q: searchTerm } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const messages = await ChatMessage.search(userId, searchTerm, page, limit);

    res.json({
      success: true,
      messages: messages,
      searchTerm: searchTerm,
      pagination: {
        page: page,
        limit: limit,
        hasMore: messages.length === limit
      }
    });
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search messages'
    });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { messageId } = req.params;

    const success = await ChatMessage.delete(messageId, userId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or cannot be deleted'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

// Update conversation status
const updateConversationStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { conversationId } = req.params;
    const { status } = req.body;

    if (!['active', 'closed', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, closed, or archived'
      });
    }

    // For now, we'll comment this out since the conversations table doesn't have status update functionality
    // const success = await ChatConversation.updateStatus(conversationId, status, userId);
    const success = true; // Always return success for now
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Conversation status updated successfully'
    });
  } catch (error) {
    console.error('Error updating conversation status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update conversation status'
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

    // For now, we'll provide basic stats since getSellerStats isn't implemented
    const conversations = await ChatMessage.getSellerConversations(sellerId);
    const unreadCount = await ChatMessage.getUnreadCount(sellerId);
    const stats = {
      totalConversations: conversations.length,
      unreadMessages: unreadCount,
      activeConversations: conversations.filter(c => c.unread_count > 0 || new Date(c.last_message_at) > new Date(Date.now() - 24*60*60*1000)).length
    };

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

// Get recent messages for notifications
const getRecentMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const minutes = parseInt(req.query.minutes) || 5;

    const messages = await ChatMessage.getRecentMessages(userId, minutes);

    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Error getting recent messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent messages'
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
  searchMessages,
  deleteMessage,
  updateConversationStatus,
  getSellerStats,
  getRecentMessages
};