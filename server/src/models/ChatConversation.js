const { getConnection } = require("../config/database");

class ChatConversation {
  // Create a new conversation or get existing one
  static async findOrCreate({ customerId, sellerId, productId }) {
    const connection = getConnection();
    
    try {
      // First, try to find existing conversation
      const [existingConversations] = await connection.execute(`
        SELECT 
          cc.*,
          p.product_title,
          p.price,
          pi.image_url as product_image,
          customer.first_name as customer_first_name,
          customer.last_name as customer_last_name,
          customer.email as customer_email,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          seller.business_name as seller_business_name,
          seller.email as seller_email
        FROM chat_conversations cc
        LEFT JOIN products p ON cc.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON cc.customer_id = customer.user_id
        LEFT JOIN users seller ON cc.seller_id = seller.user_id
        WHERE cc.customer_id = ? AND cc.seller_id = ? AND cc.product_id = ?
      `, [customerId, sellerId, productId]);
      
      if (existingConversations.length > 0) {
        return existingConversations[0];
      }
      
      // Create new conversation
      const [result] = await connection.execute(`
        INSERT INTO chat_conversations (customer_id, seller_id, product_id, status)
        VALUES (?, ?, ?, 'active')
      `, [customerId, sellerId, productId]);
      
      // Create participants
      await connection.execute(`
        INSERT INTO chat_participants (conversation_id, user_id, role)
        VALUES (?, ?, 'customer'), (?, ?, 'seller')
      `, [result.insertId, customerId, result.insertId, sellerId]);
      
      // Get the newly created conversation with details
      const [newConversation] = await connection.execute(`
        SELECT 
          cc.*,
          p.product_title,
          p.price,
          pi.image_url as product_image,
          customer.first_name as customer_first_name,
          customer.last_name as customer_last_name,
          customer.email as customer_email,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          seller.business_name as seller_business_name,
          seller.email as seller_email
        FROM chat_conversations cc
        LEFT JOIN products p ON cc.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON cc.customer_id = customer.user_id
        LEFT JOIN users seller ON cc.seller_id = seller.user_id
        WHERE cc.conversation_id = ?
      `, [result.insertId]);
      
      return newConversation[0];
    } catch (error) {
      console.error('Error creating/finding conversation:', error);
      throw error;
    }
  }
  
  // Get all conversations for a user (customer or seller)
  static async getByUserId(userId, userRole) {
    const connection = getConnection();
    
    try {
      let query;
      let params;
      
      if (userRole === 'seller') {
        query = `
          SELECT 
            cc.*,
            p.product_title,
            p.price,
            pi.image_url as product_image,
            customer.first_name as customer_first_name,
            customer.last_name as customer_last_name,
            customer.email as customer_email,
            seller.first_name as seller_first_name,
            seller.last_name as seller_last_name,
            seller.business_name as seller_business_name,
            seller.email as seller_email,
            (SELECT COUNT(*) FROM chat_messages cm 
             WHERE cm.conversation_id = cc.conversation_id 
             AND cm.sender_id != ? AND cm.is_read = 0) as unread_count,
            (SELECT cm.message_text FROM chat_messages cm 
             WHERE cm.conversation_id = cc.conversation_id 
             ORDER BY cm.sent_at DESC LIMIT 1) as last_message,
            (SELECT cm.sent_at FROM chat_messages cm 
             WHERE cm.conversation_id = cc.conversation_id 
             ORDER BY cm.sent_at DESC LIMIT 1) as last_message_time
          FROM chat_conversations cc
          LEFT JOIN products p ON cc.product_id = p.product_id
          LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
          LEFT JOIN users customer ON cc.customer_id = customer.user_id
          LEFT JOIN users seller ON cc.seller_id = seller.user_id
          WHERE cc.seller_id = ?
          ORDER BY cc.last_message_at DESC, cc.created_at DESC
        `;
        params = [userId, userId];
      } else {
        query = `
          SELECT 
            cc.*,
            p.product_title,
            p.price,
            pi.image_url as product_image,
            customer.first_name as customer_first_name,
            customer.last_name as customer_last_name,
            customer.email as customer_email,
            seller.first_name as seller_first_name,
            seller.last_name as seller_last_name,
            seller.business_name as seller_business_name,
            seller.email as seller_email,
            (SELECT COUNT(*) FROM chat_messages cm 
             WHERE cm.conversation_id = cc.conversation_id 
             AND cm.sender_id != ? AND cm.is_read = 0) as unread_count,
            (SELECT cm.message_text FROM chat_messages cm 
             WHERE cm.conversation_id = cc.conversation_id 
             ORDER BY cm.sent_at DESC LIMIT 1) as last_message,
            (SELECT cm.sent_at FROM chat_messages cm 
             WHERE cm.conversation_id = cc.conversation_id 
             ORDER BY cm.sent_at DESC LIMIT 1) as last_message_time
          FROM chat_conversations cc
          LEFT JOIN products p ON cc.product_id = p.product_id
          LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
          LEFT JOIN users customer ON cc.customer_id = customer.user_id
          LEFT JOIN users seller ON cc.seller_id = seller.user_id
          WHERE cc.customer_id = ?
          ORDER BY cc.last_message_at DESC, cc.created_at DESC
        `;
        params = [userId, userId];
      }
      
      const [conversations] = await connection.execute(query, params);
      return conversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }
  
  // Get conversation by ID with user validation
  static async getById(conversationId, userId) {
    const connection = getConnection();
    
    try {
      const [conversations] = await connection.execute(`
        SELECT 
          cc.*,
          p.product_title,
          p.price,
          pi.image_url as product_image,
          customer.first_name as customer_first_name,
          customer.last_name as customer_last_name,
          customer.email as customer_email,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          seller.business_name as seller_business_name,
          seller.email as seller_email
        FROM chat_conversations cc
        LEFT JOIN products p ON cc.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON cc.customer_id = customer.user_id
        LEFT JOIN users seller ON cc.seller_id = seller.user_id
        WHERE cc.conversation_id = ? AND (cc.customer_id = ? OR cc.seller_id = ?)
      `, [conversationId, userId, userId]);
      
      return conversations.length > 0 ? conversations[0] : null;
    } catch (error) {
      console.error('Error getting conversation by ID:', error);
      throw error;
    }
  }
  
  // Update last message timestamp
  static async updateLastMessage(conversationId) {
    const connection = getConnection();
    
    try {
      await connection.execute(`
        UPDATE chat_conversations 
        SET last_message_at = CURRENT_TIMESTAMP
        WHERE conversation_id = ?
      `, [conversationId]);
    } catch (error) {
      console.error('Error updating last message timestamp:', error);
      throw error;
    }
  }
  
  // Update conversation status
  static async updateStatus(conversationId, status, userId) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        UPDATE chat_conversations 
        SET status = ?
        WHERE conversation_id = ? AND (customer_id = ? OR seller_id = ?)
      `, [status, conversationId, userId, userId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating conversation status:', error);
      throw error;
    }
  }
  
  // Get conversation statistics for seller dashboard
  static async getSellerStats(sellerId) {
    const connection = getConnection();
    
    try {
      const [stats] = await connection.execute(`
        SELECT 
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_conversations,
          (SELECT COUNT(*) FROM chat_messages cm 
           JOIN chat_conversations cc ON cm.conversation_id = cc.conversation_id
           WHERE cc.seller_id = ? AND cm.sender_id != ? AND cm.is_read = 0) as unread_messages
        FROM chat_conversations 
        WHERE seller_id = ?
      `, [sellerId, sellerId, sellerId]);
      
      return stats[0];
    } catch (error) {
      console.error('Error getting seller stats:', error);
      throw error;
    }
  }
}

module.exports = ChatConversation;