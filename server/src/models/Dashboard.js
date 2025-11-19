const { getConnection } = require("../config/database");

class Dashboard {
  static async getSellerStats(sellerId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();

      const [totalProducts] = await connection.execute(
        "SELECT COUNT(*) as count FROM products WHERE seller_id = ?",
        [sellerId]
      );
      const [totalOrders] = await connection.execute(
        "SELECT COUNT(DISTINCT o.order_id) as count FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE oi.seller_id = ?",
        [sellerId]
      );
      const [totalRevenue] = await connection.execute(
        "SELECT SUM(total_price) as sum FROM order_items WHERE seller_id = ?",
        [sellerId]
      );
      const [totalCustomers] = await connection.execute(
        "SELECT COUNT(DISTINCT o.customer_id) as count FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE oi.seller_id = ?",
        [sellerId]
      );
      const [avgRating] = await connection.execute(
        "SELECT AVG(rating) as avg FROM product_reviews pr JOIN products p ON pr.product_id = p.product_id WHERE p.seller_id = ?",
        [sellerId]
      );
      const [pendingOrders] = await connection.execute(
        "SELECT COUNT(DISTINCT o.order_id) as count FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE oi.seller_id = ? AND o.order_status = 'pending'",
        [sellerId]
      );
      const [lowStockProducts] = await connection.execute(
        "SELECT COUNT(*) as count FROM products WHERE seller_id = ? AND stock_quantity < 5",
        [sellerId]
      );

      return {
        totalProducts: totalProducts[0].count || 0,
        totalOrders: totalOrders[0].count || 0,
        totalRevenue: totalRevenue[0].sum || 0,
        totalCustomers: totalCustomers[0].count || 0,
        avgRating: avgRating[0].avg || 0,
        pendingOrders: pendingOrders[0].count || 0,
        lowStockProducts: lowStockProducts[0].count || 0,
      };
    } finally {
      if (connection) connection.release();
    }
  }

  static async getMonthlyGrowth(sellerId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [currentMonth] = await connection.execute(
        "SELECT SUM(oi.total_price) as sum FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE oi.seller_id = ? AND MONTH(o.order_datetime) = MONTH(CURRENT_DATE()) AND YEAR(o.order_datetime) = YEAR(CURRENT_DATE())",
        [sellerId]
      );
      const [lastMonth] = await connection.execute(
        "SELECT SUM(oi.total_price) as sum FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE oi.seller_id = ? AND MONTH(o.order_datetime) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(o.order_datetime) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)",
        [sellerId]
      );

      const currentMonthRevenue = currentMonth[0].sum || 0;
      const lastMonthRevenue = lastMonth[0].sum || 0;

      if (lastMonthRevenue === 0) {
        return currentMonthRevenue > 0 ? 100 : 0;
      }

      return (
        ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      ).toFixed(2);
    } finally {
      if (connection) connection.release();
    }
  }

  static async getRecentOrders(sellerId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT o.order_id as id, CONCAT(u.first_name, ' ', u.last_name) as customer, oi.total_price as amount, o.order_status as status, o.order_datetime as date
         FROM orders o
         JOIN order_items oi ON o.order_id = oi.order_id
         JOIN users u ON o.customer_id = u.user_id
         WHERE oi.seller_id = ?
         ORDER BY o.order_datetime DESC
         LIMIT 5`,
        [sellerId]
      );
      return rows;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Dashboard;
