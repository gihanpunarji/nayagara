const { getConnection } = require("../config/database");

class Conversation {
  // Create a new conversation or get existing one
  static async findOrCreate({ customerId, sellerId, productId }) {
    const connection = getConnection();
    
    try {
      // First, try to find existing conversation
      const [existingConversations] = await connection.execute(`
        SELECT 
          c.*,
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
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON c.customer_id = customer.user_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        WHERE c.customer_id = ? AND c.seller_id = ? AND c.product_id = ?
      `, [customerId, sellerId, productId]);
      
      if (existingConversations.length > 0) {
        return existingConversations[0];
      }
      
      // Create new conversation
      const [result] = await connection.execute(`
        INSERT INTO conversations (customer_id, seller_id, product_id, created_at)
        VALUES (?, ?, ?, NOW())
      `, [customerId, sellerId, productId]);
      
      // Get the newly created conversation with details
      const [newConversation] = await connection.execute(`
        SELECT 
          c.*,
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
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON c.customer_id = customer.user_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        WHERE c.id = ?
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
            c.*,
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
            (SELECT COUNT(*) FROM messages m 
             WHERE m.conversation_id = c.id 
             AND m.sender_id != ? AND m.is_read = 0) as unread_count,
            (SELECT m.message_text FROM messages m 
             WHERE m.conversation_id = c.id 
             ORDER BY m.created_at DESC LIMIT 1) as last_message,
            (SELECT m.created_at FROM messages m 
             WHERE m.conversation_id = c.id 
             ORDER BY m.created_at DESC LIMIT 1) as last_message_time
          FROM conversations c
          LEFT JOIN products p ON c.product_id = p.product_id
          LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
          LEFT JOIN users customer ON c.customer_id = customer.user_id
          LEFT JOIN users seller ON c.seller_id = seller.user_id
          WHERE c.seller_id = ?
          ORDER BY c.updated_at DESC, c.created_at DESC
        `;
        params = [userId, userId];
      } else {
        query = `
          SELECT 
            c.*,
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
            (SELECT COUNT(*) FROM messages m 
             WHERE m.conversation_id = c.id 
             AND m.sender_id != ? AND m.is_read = 0) as unread_count,
            (SELECT m.message_text FROM messages m 
             WHERE m.conversation_id = c.id 
             ORDER BY m.created_at DESC LIMIT 1) as last_message,
            (SELECT m.created_at FROM messages m 
             WHERE m.conversation_id = c.id 
             ORDER BY m.created_at DESC LIMIT 1) as last_message_time
          FROM conversations c
          LEFT JOIN products p ON c.product_id = p.product_id
          LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
          LEFT JOIN users customer ON c.customer_id = customer.user_id
          LEFT JOIN users seller ON c.seller_id = seller.user_id
          WHERE c.customer_id = ?
          ORDER BY c.updated_at DESC, c.created_at DESC
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
          c.*,
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
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON c.customer_id = customer.user_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        WHERE c.id = ? AND (c.customer_id = ? OR c.seller_id = ?)
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
        UPDATE conversations 
        SET updated_at = NOW()
        WHERE id = ?
      `, [conversationId]);
    } catch (error) {
      console.error('Error updating last message timestamp:', error);
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
          (SELECT COUNT(*) FROM messages m 
           JOIN conversations c ON m.conversation_id = c.id
           WHERE c.seller_id = ? AND m.sender_id != ? AND m.is_read = 0) as unread_messages
        FROM conversations 
        WHERE seller_id = ?
      `, [sellerId, sellerId, sellerId]);
      
      return stats[0];
    } catch (error) {
      console.error('Error getting seller stats:', error);
      throw error;
    }
  }
  
  // Update conversation status
  static async updateStatus(conversationId, status, userId) {
    const connection = getConnection();
    
    try {
      const [result] = await connection.execute(`
        UPDATE conversations 
        SET status = ?, updated_at = NOW()
        WHERE id = ? 
        AND (customer_id = ? OR seller_id = ?)
      `, [status, conversationId, userId, userId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating conversation status:', error);
      throw error;
    }
  }
}

module.exports = Conversation;