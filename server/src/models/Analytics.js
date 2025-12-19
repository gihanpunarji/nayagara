const { getConnection } = require("../config/database");

class Analytics {
  /**
   * Get total revenue for a given time period
   */
  static async getTotalRevenue(startDate) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `SELECT COALESCE(SUM(total_amount), 0) as total_revenue
       FROM orders
       WHERE payment_status = 'completed' AND order_datetime >= ?`,
      [startDate]
    );
    return parseFloat(result[0].total_revenue);
  }

  /**
   * Get active users count
   */
  static async getActiveUsersCount(startDate) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(DISTINCT user_id) as active_users
       FROM users
       WHERE user_type IN ('customer', 'seller') AND created_at >= ?`,
      [startDate]
    );
    return parseInt(result[0].active_users);
  }

  /**
   * Get total orders count
   */
  static async getTotalOrdersCount(startDate) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(order_id) as total_orders
       FROM orders
       WHERE order_datetime >= ?`,
      [startDate]
    );
    return parseInt(result[0].total_orders);
  }

  /**
   * Get active sellers count
   */
  static async getActiveSellersCount() {
    const connection = getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(user_id) as active_sellers
       FROM users
       WHERE user_type = 'seller' AND user_status = 'active'`
    );
    return parseInt(result[0].active_sellers);
  }

  /**
   * Get total products count
   */
  static async getTotalProductsCount(startDate) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(product_id) as total_products
       FROM products
       WHERE created_at >= ?`,
      [startDate]
    );
    return parseInt(result[0].total_products);
  }

  /**
   * Get top categories by sales
   */
  static async getTopCategories(startDate, limit = 6) {
    const connection = getConnection();
    const [categories] = await connection.execute(
      `SELECT
        c.category_name as name,
        COALESCE(SUM(o.total_amount), 0) as sales,
        COUNT(o.order_id) as orders
       FROM categories c
       LEFT JOIN products p ON c.category_id = p.category_id
       LEFT JOIN order_items oi ON p.product_id = oi.product_id
       LEFT JOIN orders o ON oi.order_id = o.order_id
         AND o.payment_status = 'completed'
         AND o.order_datetime >= ?
       GROUP BY c.category_id, c.category_name
       ORDER BY sales DESC
       LIMIT ?`,
      [startDate, limit]
    );

    // Calculate total sales for percentage
    const totalSales = categories.reduce((sum, cat) => sum + parseFloat(cat.sales), 0);

    return categories.map(cat => ({
      name: cat.name,
      sales: parseFloat(cat.sales),
      orders: parseInt(cat.orders),
      percentage: totalSales > 0 ? Math.round((parseFloat(cat.sales) / totalSales) * 100) : 0
    }));
  }

  /**
   * Get top sellers by revenue
   */
  static async getTopSellers(startDate, limit = 5) {
    const connection = getConnection();
    const [sellers] = await connection.execute(
      `SELECT
        u.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        s.store_name,
        COALESCE(SUM(oi.unit_price * oi.quantity), 0) as revenue,
        COUNT(DISTINCT o.order_id) as orders
       FROM users u
       LEFT JOIN order_items oi ON u.user_id = oi.seller_id
       LEFT JOIN store s ON u.user_id = s.user_id
       LEFT JOIN orders o ON oi.order_id = o.order_id
         AND o.payment_status = 'completed'
         AND o.order_datetime >= ?
       WHERE u.user_type = 'seller'
       GROUP BY u.user_id, name, s.store_name
       ORDER BY revenue DESC
       LIMIT ?`,
      [startDate, limit]
    );

    return sellers.map(seller => ({
      name: seller.store_name || seller.name,
      revenue: parseFloat(seller.revenue),
      orders: parseInt(seller.orders),
      rating: 4.5 // Placeholder - can be calculated from reviews if available
    }));
  }

  /**
   * Get revenue over time (daily aggregation)
   */
  static async getRevenueOverTime(startDate) {
    const connection = getConnection();
    const [data] = await connection.execute(
      `SELECT
        DATE(order_datetime) as date,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(order_id) as orders
       FROM orders
       WHERE payment_status = 'completed' AND order_datetime >= ?
       GROUP BY DATE(order_datetime)
       ORDER BY date ASC`,
      [startDate]
    );

    return data.map(row => ({
      date: row.date,
      revenue: parseFloat(row.revenue),
      orders: parseInt(row.orders)
    }));
  }

  /**
   * Get user activity over time (daily registrations)
   */
  static async getUserActivityOverTime(startDate) {
    const connection = getConnection();
    const [data] = await connection.execute(
      `SELECT
        DATE(created_at) as date,
        COUNT(CASE WHEN user_type = 'customer' THEN user_id END) as customers,
        COUNT(CASE WHEN user_type = 'seller' THEN user_id END) as sellers
       FROM users
       WHERE created_at >= ?
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [startDate]
    );

    return data.map(row => ({
      date: row.date,
      customers: parseInt(row.customers),
      sellers: parseInt(row.sellers)
    }));
  }
}

module.exports = Analytics;
