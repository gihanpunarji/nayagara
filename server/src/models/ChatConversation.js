const { getConnection } = require("../config/database");

class ChatConversation {
  // Start or get existing conversation between customer and seller about a product
  static async startConversation(customerId, sellerId, productId, subject = null) {
    const connection = getConnection();
    
    try {
      // First check if conversation already exists
      const [existing] = await connection.execute(`
        SELECT 
          c.*,
          p.product_title,
          p.price,
          pi.image_url as product_image,
          customer.first_name as customer_first_name,
          customer.last_name as customer_last_name,
          customer.user_email as customer_email,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          s.store_name as seller_business_name,
          seller.user_email as seller_email
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON c.customer_id = customer.user_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        LEFT JOIN store s ON seller.user_id = s.user_id
        WHERE c.customer_id = ? AND c.seller_id = ? AND c.product_id = ? 
        AND c.conversation_type = 'customer_seller'
      `, [customerId, sellerId, productId]);
      
      if (existing.length > 0) {
        return existing[0];
      }
      
      // Create new conversation
      const [result] = await connection.execute(`
        INSERT INTO conversations (
          product_id, 
          customer_id, 
          seller_id, 
          conversation_type, 
          subject, 
          status,
          created_at,
          last_message_at
        ) VALUES (?, ?, ?, 'customer_seller', ?, 'active', NOW(), NOW())
      `, [productId, customerId, sellerId, subject]);
      
      // Get the newly created conversation with details
      const [newConversation] = await connection.execute(`
        SELECT 
          c.*,
          p.product_title,
          p.price,
          pi.image_url as product_image,
          customer.first_name as customer_first_name,
          customer.last_name as customer_last_name,
          customer.user_email as customer_email,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          s.store_name as seller_business_name,
          seller.user_email as seller_email
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON c.customer_id = customer.user_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        LEFT JOIN store s ON seller.user_id = s.user_id
        WHERE c.conversation_id = ?
      `, [result.insertId]);
      
      return newConversation[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Get all conversations for a user (customer or seller)
  static async getUserConversations(userId, userType) {
    const connection = getConnection();
    
    try {
      let whereClause = '';
      if (userType === 'customer') {
        whereClause = 'c.customer_id = ?';
      } else if (userType === 'seller') {
        whereClause = 'c.seller_id = ?';
      }
      
      const [conversations] = await connection.execute(`
        SELECT 
          c.*,
          p.product_title,
          p.price,
          pi.image_url as product_image,
          customer.first_name as customer_first_name,
          customer.last_name as customer_last_name,
          customer.user_email as customer_email,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          s.store_name as seller_business_name,
          seller.user_email as seller_email,
          (SELECT COUNT(*) FROM messages m 
           WHERE m.conversation_id = c.conversation_id 
           AND m.sender_id != ? AND m.is_read = 0) as unread_count,
          (SELECT m.message_text FROM messages m 
           WHERE m.conversation_id = c.conversation_id 
           ORDER BY m.sent_at DESC LIMIT 1) as last_message,
          (SELECT m.sent_at FROM messages m 
           WHERE m.conversation_id = c.conversation_id 
           ORDER BY m.sent_at DESC LIMIT 1) as last_message_time
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON c.customer_id = customer.user_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        LEFT JOIN store s ON seller.user_id = s.user_id
        WHERE ${whereClause} AND c.conversation_type = 'customer_seller'
        ORDER BY c.last_message_at DESC
      `, [userId]);
      
      return conversations;
    } catch (error) {
      throw error;
    }
  }
  
  // Get conversation by ID with access check
  static async getConversationById(conversationId, userId) {
    const connection = getConnection();
    
    try {
      const [conversation] = await connection.execute(`
        SELECT 
          c.*,
          p.product_title,
          p.price,
          pi.image_url as product_image,
          customer.first_name as customer_first_name,
          customer.last_name as customer_last_name,
          customer.user_email as customer_email,
          seller.first_name as seller_first_name,
          seller.last_name as seller_last_name,
          s.store_name as seller_business_name,
          seller.user_email as seller_email
        FROM conversations c
        LEFT JOIN products p ON c.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users customer ON c.customer_id = customer.user_id
        LEFT JOIN users seller ON c.seller_id = seller.user_id
        LEFT JOIN store s ON seller.user_id = s.user_id
        WHERE c.conversation_id = ? 
        AND (c.customer_id = ? OR c.seller_id = ?)
      `, [conversationId, userId, userId]);
      
      return conversation.length > 0 ? conversation[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Update last message timestamp
  static async updateLastMessageTime(conversationId) {
    const connection = getConnection();
    
    try {
      await connection.execute(`
        UPDATE conversations 
        SET last_message_at = NOW()
        WHERE conversation_id = ?
      `, [conversationId]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChatConversation;