// Chat utility functions for frontend integration

const chatAPI = {
  baseURL: '/api/chat',
  
  // Start a conversation between customer and seller about a product
  startConversation: async (sellerId, productId) => {
    const response = await fetch(`${chatAPI.baseURL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ sellerId, productId })
    });
    return response.json();
  },
  
  // Get all conversations for current user
  getConversations: async () => {
    const response = await fetch(`${chatAPI.baseURL}/conversations`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },
  
  // Get messages for a specific conversation
  getMessages: async (conversationId, page = 1, limit = 50) => {
    const response = await fetch(`${chatAPI.baseURL}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },
  
  // Send a message
  sendMessage: async (conversationId, messageText, messageType = 'text', attachmentUrl = null) => {
    const response = await fetch(`${chatAPI.baseURL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ messageText, messageType, attachmentUrl })
    });
    return response.json();
  },
  
  // Mark messages as read
  markAsRead: async (conversationId) => {
    const response = await fetch(`${chatAPI.baseURL}/conversations/${conversationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },
  
  // Get unread message count
  getUnreadCount: async () => {
    const response = await fetch(`${chatAPI.baseURL}/unread-count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },
  
  // Search messages
  searchMessages: async (searchTerm, page = 1, limit = 20) => {
    const response = await fetch(`${chatAPI.baseURL}/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },
  
  // For sellers: Get chat statistics
  getSellerStats: async () => {
    const response = await fetch(`${chatAPI.baseURL}/seller/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};

// Usage examples for frontend integration:
/*

// 1. Start a conversation (on product page)
const handleContactSeller = async () => {
  try {
    const result = await chatAPI.startConversation(product.seller_id, product.product_id);
    if (result.success) {
      // Navigate to chat page or open chat modal
      openChat(result.conversation);
    }
  } catch (error) {
    console.error('Error starting conversation:', error);
  }
};

// 2. Load conversations list (in messages page)
const loadConversations = async () => {
  try {
    const result = await chatAPI.getConversations();
    if (result.success) {
      setConversations(result.conversations);
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
};

// 3. Load messages for a conversation
const loadMessages = async (conversationId) => {
  try {
    const result = await chatAPI.getMessages(conversationId);
    if (result.success) {
      setMessages(result.messages);
      // Mark as read
      await chatAPI.markAsRead(conversationId);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
};

// 4. Send a message
const sendMessage = async (conversationId, messageText) => {
  try {
    const result = await chatAPI.sendMessage(conversationId, messageText);
    if (result.success) {
      // Add message to UI
      setMessages(prev => [...prev, result.message]);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// 5. Real-time unread count for header
const updateUnreadCount = async () => {
  try {
    const result = await chatAPI.getUnreadCount();
    if (result.success) {
      setUnreadCount(result.unreadCount);
    }
  } catch (error) {
    console.error('Error getting unread count:', error);
  }
};

// 6. For seller dashboard
const loadSellerStats = async () => {
  try {
    const result = await chatAPI.getSellerStats();
    if (result.success) {
      setChatStats(result.stats);
    }
  } catch (error) {
    console.error('Error loading seller stats:', error);
  }
};

*/

module.exports = chatAPI;