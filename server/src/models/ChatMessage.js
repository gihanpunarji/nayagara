const { getConnection } = require("../config/database");

class ChatMessage {
  // Send a new message
  static async create({ conversationId, senderId, senderType, messageText, messageType = 'text', attachmentUrl = null }) {
    const connection = getConnection();
    console.log('Creating message with:', { conversationId, senderId, senderType, messageText, messageType, attachmentUrl });
    
    try {
      const [result] = await connection.execute(`
        INSERT INTO messages (conversation_id, sender_id, sender_type, message_text, message_type, attachment_url, is_read, sent_at)
        VALUES (?, ?, ?, ?, ?, ?, 0, NOW())
      `, [conversationId, senderId, senderType, messageText, messageType, attachmentUrl]);
      
      // Update conversation's last message timestamp
      await connection.execute(`
        UPDATE conversations 
        SET last_message_at = NOW()
        WHERE conversation_id = ?
      `, [conversationId]);
      
      // Get the created message with sender details
      const [message] = await connection.execute(`
        SELECT 
          m.*,
          u.first_name,
          u.last_name,
          s.store_name,
          u.user_type
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.user_id
        LEFT JOIN store s ON u.user_id = s.user_id
        WHERE m.message_id = ?
      `, [result.insertId]);
      
      return message[0];
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }
  
  // Get messages for a conversation
  static async getByConversationId(conversationId, userId, page = 1, limit = 50) {
    const connection = getConnection();
    
    try {
      // Verify user has access to this conversation
      const [accessCheck] = await connection.execute(`
        SELECT conversation_id 
        FROM conversations 
        WHERE conversation_id = ? AND (customer_id = ? OR seller_id = ?)
      `, [conversationId, userId, userId]);
      
      if (accessCheck.length === 0) {
        throw new Error('Access denied to this conversation');
      }
      
      const offset = (page - 1) * limit;
      
      const [messages] = await connection.execute(`
        SELECT 
          m.*,
          u.first_name,
          u.last_name,
          s.store_name,
          u.user_type
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.user_id
        LEFT JOIN store s ON u.user_id = s.user_id
        WHERE m.conversation_id = ?
        ORDER BY m.sent_at ASC
        LIMIT ? OFFSET ?
      `, [conversationId, limit, offset]);
      
      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }
  
  // Mark messages as read
  static async markAsRead(conversationId, userId) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        UPDATE messages m
        JOIN conversations c ON m.conversation_id = c.conversation_id
        SET m.is_read = 1
        WHERE m.conversation_id = ? 
        AND m.sender_id != ?
        AND m.is_read = 0
        AND (c.customer_id = ? OR c.seller_id = ?)
      `, [conversationId, userId, userId, userId]);
      
      return result.affectedRows;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
  
  // Get unread message count for a user
  static async getUnreadCount(userId) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        SELECT COUNT(*) as unread_count
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.conversation_id
        WHERE (c.customer_id = ? OR c.seller_id = ?)
        AND m.sender_id != ?
        AND m.is_read = 0
      `, [userId, userId, userId]);
      
      return result[0].unread_count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
  
  // Delete a message (remove from database since no soft delete column exists)
  static async delete(messageId, userId) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        DELETE FROM messages 
        WHERE message_id = ? AND sender_id = ?
      `, [messageId, userId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
  
  // Search messages in conversations
  static async search(userId, searchTerm, page = 1, limit = 20) {
    const connection = getConnection();
    
    try {
      const offset = (page - 1) * limit;
      
      const [messages] = await connection.execute(`
        SELECT 
          m.*,
          c.customer_id,
          c.seller_id,
          c.product_id,
          p.product_title,
          sender.first_name as sender_first_name,
          sender.last_name as sender_last_name,
          sender.business_name as sender_business_name,
          sender.user_type as sender_type
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.conversation_id
        JOIN users sender ON m.sender_id = sender.user_id
        LEFT JOIN products p ON c.product_id = p.product_id
        WHERE (c.customer_id = ? OR c.seller_id = ?)
        AND m.message_text LIKE ?
        ORDER BY m.sent_at DESC
        LIMIT ? OFFSET ?
      `, [userId, userId, `%${searchTerm}%`, limit, offset]);
      
      return messages;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }
  
  // Get recent messages for a user (for notifications)
  static async getRecentMessages(userId, minutes = 5) {
    const connection = getConnection();
    
    try {
      const [messages] = await connection.execute(`
        SELECT 
          m.*,
          c.customer_id,
          c.seller_id,
          c.product_id,
          p.product_title,
          sender.first_name as sender_first_name,
          sender.last_name as sender_last_name,
          sender.business_name as sender_business_name
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.conversation_id
        JOIN users sender ON m.sender_id = sender.user_id
        LEFT JOIN products p ON c.product_id = p.product_id
        WHERE (c.customer_id = ? OR c.seller_id = ?)
        AND m.sender_id != ?
        AND m.sent_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
        AND m.is_read = 0
        ORDER BY m.sent_at DESC
      `, [userId, userId, userId, minutes]);
      
      return messages;
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  }

  // Get conversations for seller dashboard
  static async getSellerConversations(sellerId, limit = 20) {
    const connection = getConnection();
    
    try {
      const [conversations] = await connection.execute(`
        SELECT 
          c.conversation_id,
          c.product_id,
          c.subject,
          c.created_at,
          c.last_message_at,
          p.product_title,
          pi.image_url as product_image,
          cust.first_name as customer_first_name,
          cust.last_name as customer_last_name,
          cust.user_email as customer_email,
          cust.profile_image as customer_profile_image,
          (SELECT m.message_text FROM messages m WHERE m.conversation_id = c.conversation_id ORDER BY m.sent_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.conversation_id AND m.sender_id != c.seller_id AND m.is_read = 0) as unread_count
        FROM 
          conversations c
        JOIN 
          users cust ON c.customer_id = cust.user_id
        LEFT JOIN 
          products p ON c.product_id = p.product_id
        LEFT JOIN 
          product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        WHERE 
          c.seller_id = ? AND c.conversation_type = 'customer_seller'
        GROUP BY 
          c.conversation_id
        ORDER BY 
          c.last_message_at DESC
        LIMIT ?
      `, [sellerId, limit]);
      
      return conversations;
    } catch (error) {
      console.error('Error getting seller conversations:', error);
      throw error;
    }
  }

  // Get conversations for customer
  static async getCustomerConversations(customerId, limit = 20) {
    const connection = getConnection();
    
    try {
      const [conversations] = await connection.execute(`
        SELECT 
          c.conversation_id,
          c.product_id,
          c.subject,
          c.created_at,
          c.last_message_at,
          p.product_title,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          seller.business_name as seller_business_name,
          seller.email as seller_email,
          seller.profile_image as seller_profile_image,
          (SELECT m.message_text FROM messages m 
           WHERE m.conversation_id = c.conversation_id 
           ORDER BY m.sent_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*) FROM messages m 
           WHERE m.conversation_id = c.conversation_id 
           AND m.sender_id != ? AND m.is_read = 0) as unread_count
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        LEFT JOIN store s ON seller.user_id = store.seller_id
        WHERE c.customer_id = ? AND c.conversation_type = 'customer_seller'
        ORDER BY c.last_message_at DESC
        LIMIT ?
      `, [customerId, customerId, limit]);
      
      return conversations;
    } catch (error) {
      console.error('Error getting customer conversations:', error);
      throw error;
    }
  }
}

module.exports = ChatMessage;