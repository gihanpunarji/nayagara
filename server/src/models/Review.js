const { getConnection } = require("../config/database");

class Review {
  // Get all reviews with optional filtering
  static async getAll(limit = 25, offset = 0, search = '', status = 'all', rating = 'all', productId = null, userId = null) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      
      let whereClause = "WHERE 1=1";
      const queryParams = [];

      // Add status filter
      if (status && status !== 'all') {
        whereClause += " AND pr.status = ?";
        queryParams.push(status);
      }

      // Add rating filter
      if (rating && rating !== 'all') {
        whereClause += " AND pr.rating = ?";
        queryParams.push(parseInt(rating));
      }

      // Add product filter
      if (productId) {
        whereClause += " AND pr.product_id = ?";
        queryParams.push(productId);
      }

      // Add user filter (for filtering by reviewer)
      if (userId) {
        whereClause += " AND pr.user_id = ?";
        queryParams.push(userId);
      }

      // Add search filter
      if (search && search.trim()) {
        whereClause += ` AND (
          pr.review_title LIKE ? OR 
          pr.review_comment LIKE ? OR 
          u.first_name LIKE ? OR 
          u.last_name LIKE ? OR 
          p.product_title LIKE ?
        )`;
        const searchTerm = `%${search.trim()}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(DISTINCT pr.review_id) as total
        FROM product_reviews pr
        JOIN users u ON pr.user_id = u.user_id
        JOIN products p ON pr.product_id = p.product_id
        ${whereClause}
      `;
      
      const [countResult] = await connection.execute(countQuery, queryParams);
      const total = countResult[0].total;

      // Get paginated data
      const query = `
        SELECT 
          pr.review_id as id,
          pr.rating,
          pr.review_title as title,
          pr.review_comment as comment,
          pr.status,
          pr.created_at as reviewDate,
          pr.is_verified_purchase as verified,
          pr.helpful_count as helpful,
          pr.not_helpful_count as notHelpful,
          pr.order_id as orderId,
          CONCAT(u.first_name, ' ', u.last_name) as customerName,
          u.user_email as customerEmail,
          p.product_title as productName,
          p.product_id as productId,
          (SELECT CONCAT(s_u.first_name, ' ', s_u.last_name) FROM users s_u WHERE s_u.user_id = p.seller_id) as seller,
          (SELECT GROUP_CONCAT(image_url) FROM review_images ri WHERE ri.review_id = pr.review_id) as images
        FROM product_reviews pr
        JOIN users u ON pr.user_id = u.user_id
        JOIN products p ON pr.product_id = p.product_id
        ${whereClause}
        ORDER BY pr.created_at DESC
        LIMIT ? OFFSET ?
      `;

      // Copy query params and add limit/offset
      const finalQueryParams = [...queryParams, parseInt(limit), parseInt(offset)];
      
      const [rows] = await connection.execute(query, finalQueryParams);
      
      // Process rows to format images array
      const formattedRows = rows.map(row => ({
        ...row,
        images: row.images ? row.images.split(',') : []
      }));

      return { reviews: formattedRows, total };
    } finally {
      if (connection) connection.release();
    }
  }

  // Update review status
  static async updateStatus(reviewId, status) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        "UPDATE product_reviews SET status = ? WHERE review_id = ?",
        [status, reviewId]
      );
      return result.affectedRows > 0;
    } finally {
      if (connection) connection.release();
    }
  }

  // Delete review
  static async delete(reviewId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        "DELETE FROM product_reviews WHERE review_id = ?",
        [reviewId]
      );
      return result.affectedRows > 0;
    } finally {
      if (connection) connection.release();
    }
  }

  // Get review by ID
  static async findById(reviewId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT * FROM product_reviews WHERE review_id = ?`,
        [reviewId]
      );
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }
  // Create a new review
  static async create({ userId, productId, orderId, rating, title, comment, isVerified = false }) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO product_reviews (
          user_id, product_id, order_id, rating, review_title, review_comment, is_verified_purchase, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
        [userId, productId, orderId, rating, title, comment, isVerified]
      );
      return result.insertId;
    } finally {
      if (connection) connection.release();
    }
  }

  // Add images for a review
  static async addImages(reviewId, imageUrls) {
    if (!imageUrls || imageUrls.length === 0) return;
    
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      
      // Bulk insert
      const placeholders = imageUrls.map(() => '(?, ?)').join(', ');
      const values = [];
      imageUrls.forEach(url => {
        values.push(reviewId, url);
      });

      await connection.execute(
        `INSERT INTO review_images (review_id, image_url) VALUES ${placeholders}`,
        values
      );
    } finally {
      if (connection) connection.release();
    }
  }

  // Check if user has already reviewed a product for a specific order
  static async hasReviewed(userId, productId, orderId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      // If orderId is provided, check specifically for that order
      // Otherwise fallback to simple product check (backward compatibility)
      let query = "SELECT review_id FROM product_reviews WHERE user_id = ? AND product_id = ?";
      const params = [userId, productId];

      if (orderId) {
        query += " AND order_id = ?";
        params.push(orderId);
      }

      const [rows] = await connection.execute(query, params);
      return rows.length > 0;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Review;
