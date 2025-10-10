const { getConnection } = require("../config/database");

class ChatMessage {
  // Send a new message
  static async create({ conversationId, senderId, messageText, messageType = 'text', attachmentUrl = null }) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        INSERT INTO chat_messages (conversation_id, sender_id, message_text, message_type, attachment_url)
        VALUES (?, ?, ?, ?, ?)
      `, [conversationId, senderId, messageText, messageType, attachmentUrl]);
      
      // Update conversation's last message timestamp
      await connection.execute(`
        UPDATE chat_conversations 
        SET last_message_at = CURRENT_TIMESTAMP
        WHERE conversation_id = ?
      `, [conversationId]);
      
      // Get the created message with sender details
      const [message] = await connection.execute(`
        SELECT 
          cm.*,
          u.first_name,
          u.last_name,
          u.business_name,
          u.user_type
        FROM chat_messages cm
        LEFT JOIN users u ON cm.sender_id = u.user_id
        WHERE cm.message_id = ?
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
        FROM chat_conversations 
        WHERE conversation_id = ? AND (customer_id = ? OR seller_id = ?)
      `, [conversationId, userId, userId]);
      
      if (accessCheck.length === 0) {
        throw new Error('Access denied to this conversation');
      }
      
      const offset = (page - 1) * limit;
      
      const [messages] = await connection.execute(`
        SELECT 
          cm.*,
          u.first_name,
          u.last_name,
          u.business_name,
          u.user_type
        FROM chat_messages cm
        LEFT JOIN users u ON cm.sender_id = u.user_id
        WHERE cm.conversation_id = ? AND cm.is_deleted = 0
        ORDER BY cm.sent_at DESC
        LIMIT ? OFFSET ?
      `, [conversationId, limit, offset]);
      
      // Reverse to show oldest first
      return messages.reverse();
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
        UPDATE chat_messages cm
        JOIN chat_conversations cc ON cm.conversation_id = cc.conversation_id
        SET cm.is_read = 1, cm.read_at = CURRENT_TIMESTAMP
        WHERE cm.conversation_id = ? 
        AND cm.sender_id != ?
        AND cm.is_read = 0
        AND (cc.customer_id = ? OR cc.seller_id = ?)
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
        FROM chat_messages cm
        JOIN chat_conversations cc ON cm.conversation_id = cc.conversation_id
        WHERE (cc.customer_id = ? OR cc.seller_id = ?)
        AND cm.sender_id != ?
        AND cm.is_read = 0
        AND cm.is_deleted = 0
      `, [userId, userId, userId]);
      
      return result[0].unread_count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
  
  // Delete a message (soft delete)
  static async delete(messageId, userId) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        UPDATE chat_messages 
        SET is_deleted = 1
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
          cm.*,
          cc.customer_id,
          cc.seller_id,
          cc.product_id,
          p.product_title,
          sender.first_name as sender_first_name,
          sender.last_name as sender_last_name,
          sender.business_name as sender_business_name,
          sender.user_type as sender_type
        FROM chat_messages cm
        JOIN chat_conversations cc ON cm.conversation_id = cc.conversation_id
        JOIN users sender ON cm.sender_id = sender.user_id
        LEFT JOIN products p ON cc.product_id = p.product_id
        WHERE (cc.customer_id = ? OR cc.seller_id = ?)
        AND cm.message_text LIKE ?
        AND cm.is_deleted = 0
        ORDER BY cm.sent_at DESC
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
          cm.*,
          cc.customer_id,
          cc.seller_id,
          cc.product_id,
          p.product_title,
          sender.first_name as sender_first_name,
          sender.last_name as sender_last_name,
          sender.business_name as sender_business_name
        FROM chat_messages cm
        JOIN chat_conversations cc ON cm.conversation_id = cc.conversation_id
        JOIN users sender ON cm.sender_id = sender.user_id
        LEFT JOIN products p ON cc.product_id = p.product_id
        WHERE (cc.customer_id = ? OR cc.seller_id = ?)
        AND cm.sender_id != ?
        AND cm.sent_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
        AND cm.is_read = 0
        AND cm.is_deleted = 0
        ORDER BY cm.sent_at DESC
      `, [userId, userId, userId, minutes]);
      
      return messages;
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  }
}

module.exports = ChatMessage;