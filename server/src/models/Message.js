const { getConnection } = require("../config/database");

class Message {
  // Assuming your existing messages table structure - please update based on actual schema
  static async create({ conversationId, senderId, messageText, messageType = 'text', attachmentUrl = null }) {
    const connection = getConnection();
    
    try {
      // Adapt this query based on your actual table structure
      const [result] = await connection.execute(`
        INSERT INTO messages (conversation_id, sender_id, message_text, message_type, attachment_url, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `, [conversationId, senderId, messageText, messageType, attachmentUrl]);
      
      // Get the created message with sender details
      const [message] = await connection.execute(`
        SELECT 
          m.*,
          u.first_name,
          u.last_name,
          u.business_name,
          u.user_type
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.user_id
        WHERE m.id = ?
      `, [result.insertId]);
      
      return message[0];
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }
  
  // Get messages for a conversation
  static async getByConversationId(conversationId, page = 1, limit = 50) {
    const connection = getConnection();
    
    try {
      const offset = (page - 1) * limit;
      
      const [messages] = await connection.execute(`
        SELECT 
          m.*,
          u.first_name,
          u.last_name,
          u.business_name,
          u.user_type
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.user_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
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
        UPDATE messages 
        SET is_read = 1, read_at = NOW()
        WHERE conversation_id = ? 
        AND sender_id != ?
        AND is_read = 0
      `, [conversationId, userId]);
      
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
        JOIN conversations c ON m.conversation_id = c.id
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
  
  // Search messages
  static async search(userId, searchTerm, page = 1, limit = 20) {
    const connection = getConnection();
    
    try {
      const offset = (page - 1) * limit;
      
      const [messages] = await connection.execute(`
        SELECT 
          m.*,
          u.first_name,
          u.last_name,
          u.business_name,
          u.user_type,
          c.product_id
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.user_id
        LEFT JOIN conversations c ON m.conversation_id = c.id
        WHERE (c.customer_id = ? OR c.seller_id = ?)
        AND m.message_text LIKE ?
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
      `, [userId, userId, `%${searchTerm}%`, limit, offset]);
      
      return messages;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }
  
  // Delete a message
  static async delete(messageId, userId) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        DELETE m FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE m.id = ? 
        AND (c.customer_id = ? OR c.seller_id = ?)
        AND m.sender_id = ?
      `, [messageId, userId, userId, userId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
  
  // Get recent messages for notifications
  static async getRecentMessages(userId, minutes = 5) {
    const connection = getConnection();
    
    try {
      const [messages] = await connection.execute(`
        SELECT 
          m.*,
          u.first_name,
          u.last_name,
          u.business_name,
          u.user_type,
          c.product_id
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.user_id
        LEFT JOIN conversations c ON m.conversation_id = c.id
        WHERE (c.customer_id = ? OR c.seller_id = ?)
        AND m.sender_id != ?
        AND m.created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
        ORDER BY m.created_at DESC
      `, [userId, userId, userId, minutes]);
      
      return messages;
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  }
}

module.exports = Message;