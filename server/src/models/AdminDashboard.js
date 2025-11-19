const { getConnection } = require("../config/database");

class AdminDashboard {
  static async getAdminStats() {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();

      const [totalUsers] = await connection.execute(
        "SELECT COUNT(*) as count FROM users"
      );
      const [activeSellers] = await connection.execute(
        "SELECT COUNT(*) as count FROM users WHERE user_type = 'seller' AND user_status = 'active'"
      );
      const [totalProducts] = await connection.execute(
        "SELECT COUNT(*) as count FROM products"
      );
      const [ordersToday] = await connection.execute(
        "SELECT COUNT(*) as count FROM orders WHERE DATE(order_datetime) = CURDATE()"
      );
      const [totalRevenue] = await connection.execute(
        "SELECT SUM(total_amount) as sum FROM orders WHERE order_status = 'delivered'"
      );
      // Placeholder for conversion rate - requires more complex logic
      const conversionRate = 0; 

      return {
        totalUsers: totalUsers[0].count || 0,
        activeSellers: activeSellers[0].count || 0,
        totalProducts: totalProducts[0].count || 0,
        ordersToday: ordersToday[0].count || 0,
        totalRevenue: totalRevenue[0].sum || 0,
        conversionRate: conversionRate,
      };
    } finally {
      if (connection) connection.release();
    }
  }

  static async getRecentActivities() {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT 'user_registration' as type, user_id as id, CONCAT(first_name, ' ', last_name) as title, 'New user registered' as description, created_at as time, 0 as urgent
         FROM users
         ORDER BY created_at DESC
         LIMIT 5`
      );
      return rows;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getSystemHealth() {
    // This would typically involve external monitoring tools or more complex internal checks
    // For now, return mock data
    return [
      {
        name: 'Database',
        status: 'healthy',
        uptime: '99.9%',
        responseTime: '12ms'
      },
      {
        name: 'API Gateway',
        status: 'healthy',
        uptime: '99.8%',
        responseTime: '45ms'
      },
      {
        name: 'Payment Service',
        status: 'warning',
        uptime: '98.2%',
        responseTime: '180ms'
      },
      {
        name: 'Search Engine',
        status: 'healthy',
        uptime: '99.5%',
        responseTime: '67ms'
      },
      {
        name: 'File Storage',
        status: 'healthy',
        uptime: '99.9%',
        responseTime: '23ms'
      }
    ];
  }
}

module.exports = AdminDashboard;
