const { getConnection } = require("../config/database");

class Cart {
  // Get all cart items for a user
  static async getByUserId(userId) {
    const connection = getConnection();
    
    try {
      const [rows] = await connection.execute(`
        SELECT 
          sc.cart_id,
          sc.user_id,
          sc.product_id,
          sci.quantity,
          sci.cart_item_id,
          sci.updated_at,
          sc.created_at,
          p.product_title,
          p.price,
          p.stock_quantity,
          p.seller_id,
          pi.image_url,
          u.first_name as seller_first_name,
          u.last_name as seller_last_name,
          s.store_name as seller_business_name
        FROM shopping_cart sc
        LEFT JOIN shopping_cart_item sci ON sc.cart_id = sci.shopping_cart_cart_id
        LEFT JOIN products p ON sc.product_id = p.product_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        LEFT JOIN users u ON p.seller_id = u.user_id
        LEFT JOIN store s ON u.user_id = s.user_id
        WHERE sc.user_id = ? AND sci.quantity IS NOT NULL
        ORDER BY sc.created_at DESC
      `, [userId]);
      
      return rows;
    } catch (error) {
      console.error("Error in Cart.getByUserId:", error);
      throw error;
    }
  }

  // Add item to cart or update quantity if exists
  static async addItem(userId, productId, quantity = 1) {
    const connection = getConnection();
    
    try {
      // Check if cart entry exists
      const [existingCart] = await connection.execute(`
        SELECT cart_id FROM shopping_cart 
        WHERE user_id = ? AND product_id = ?
      `, [userId, productId]);
      
      let cartId;
      
      if (existingCart.length > 0) {
        // Cart exists, check if item exists
        cartId = existingCart[0].cart_id;
        
        const [existingItem] = await connection.execute(`
          SELECT cart_item_id, quantity FROM shopping_cart_item 
          WHERE shopping_cart_cart_id = ?
        `, [cartId]);
        
        if (existingItem.length > 0) {
          // Update existing item
          await connection.execute(`
            UPDATE shopping_cart_item 
            SET quantity = quantity + ?
            WHERE cart_item_id = ?
          `, [quantity, existingItem[0].cart_item_id]);
        } else {
          // Create new item
          await connection.execute(`
            INSERT INTO shopping_cart_item (quantity, shopping_cart_cart_id)
            VALUES (?, ?)
          `, [quantity, cartId]);
        }
      } else {
        // Create new cart and item
        const [cartResult] = await connection.execute(`
          INSERT INTO shopping_cart (user_id, product_id)
          VALUES (?, ?)
        `, [userId, productId]);
        
        cartId = cartResult.insertId;
        
        await connection.execute(`
          INSERT INTO shopping_cart_item (quantity, shopping_cart_cart_id)
          VALUES (?, ?)
        `, [quantity, cartId]);
      }
      
      return { success: true, cartId };
    } catch (error) {
      throw error;
    }
  }

  // Update item quantity
  static async updateQuantity(userId, productId, quantity) {
    const connection = getConnection();
    
    try {
      await connection.execute(`
        UPDATE shopping_cart_item sci
        JOIN shopping_cart sc ON sci.shopping_cart_cart_id = sc.cart_id
        SET sci.quantity = ?
        WHERE sc.user_id = ? AND sc.product_id = ?
      `, [quantity, userId, productId]);
    } catch (error) {
      throw error;
    }
  }

  // Remove item from cart
  static async removeItem(userId, productId) {
    const connection = getConnection();
    
    try {
      // Delete cart item first
      await connection.execute(`
        DELETE sci FROM shopping_cart_item sci
        JOIN shopping_cart sc ON sci.shopping_cart_cart_id = sc.cart_id
        WHERE sc.user_id = ? AND sc.product_id = ?
      `, [userId, productId]);
      
      // Delete cart entry
      await connection.execute(`
        DELETE FROM shopping_cart 
        WHERE user_id = ? AND product_id = ?
      `, [userId, productId]);
    } catch (error) {
      throw error;
    }
  }

  // Clear all cart items for user
  static async clearCart(userId) {
    const connection = getConnection();
    
    try {
      // Delete all cart items
      await connection.execute(`
        DELETE sci FROM shopping_cart_item sci
        JOIN shopping_cart sc ON sci.shopping_cart_cart_id = sc.cart_id
        WHERE sc.user_id = ?
      `, [userId]);
      
      // Delete all cart entries
      await connection.execute(`
        DELETE FROM shopping_cart WHERE user_id = ?
      `, [userId]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cart;