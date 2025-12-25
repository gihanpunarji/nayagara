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
      const [productViews] = await connection.execute(
        "SELECT SUM(view_count) as sum FROM products WHERE seller_id = ?",
        [sellerId]
      );
      const totalViews = parseInt(productViews[0].sum) || 0;

      return {
        totalProducts: totalProducts[0].count || 0,
        totalOrders: totalOrders[0].count || 0,
        totalRevenue: totalRevenue[0].sum || 0,
        totalCustomers: totalCustomers[0].count || 0,
        avgRating: avgRating[0].avg || 0,
        pendingOrders: pendingOrders[0].count || 0,
        lowStockProducts: lowStockProducts[0].count || 0,
        views: totalViews
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
  static async getSellerRevenueOverTime(sellerId, days = 30) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const [rows] = await connection.execute(
        `SELECT
          DATE(o.order_datetime) as date,
          COUNT(DISTINCT o.order_id) as orders,
          SUM(oi.total_price) as revenue
         FROM orders o
         JOIN order_items oi ON o.order_id = oi.order_id
         WHERE oi.seller_id = ? 
           AND o.payment_status = 'completed'
           AND o.order_datetime >= ?
         GROUP BY DATE(o.order_datetime)
         ORDER BY date ASC`,
        [sellerId, startDateStr]
      );

      // Fill in missing dates with 0
      const result = [];
      const map = new Map(rows.map(r => [r.date.toISOString().split('T')[0], r]));

      for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const data = map.get(dateStr);
        result.push({
          date: dateStr,
          orders: data ? parseInt(data.orders) : 0,
          revenue: data ? parseFloat(data.revenue) : 0
        });
      }

      return result;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getSellerTopProducts(sellerId, days = 30, limit = 5) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const [rows] = await connection.execute(
        `SELECT
          p.product_id as id,
          p.product_title as title,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id LIMIT 1) as image,
          p.view_count as views,
          COUNT(oi.order_item_id) as orders,
          SUM(oi.total_price) as revenue,
          CAST(SUM(oi.quantity) / NULLIF(p.view_count, 0) * 100 AS DECIMAL(10,2)) as conversionRate
         FROM products p
         LEFT JOIN order_items oi ON p.product_id = oi.product_id
         LEFT JOIN orders o ON oi.order_id = o.order_id AND o.payment_status = 'completed' AND o.order_datetime >= ?
         WHERE p.seller_id = ?
         GROUP BY p.product_id
         ORDER BY revenue DESC
         LIMIT ?`,
        [startDateStr, sellerId, limit]
      );

      return rows.map(row => ({
        ...row,
        views: parseInt(row.views) || 0,
        orders: parseInt(row.orders) || 0,
        revenue: parseFloat(row.revenue) || 0,
        conversionRate: parseFloat(row.conversionRate) || 0,
        // Add default image if null
        image: row.image || 'https://via.placeholder.com/400'
      }));
    } finally {
      if (connection) connection.release();
    }
  }

  static async getSellerCategoryPerformance(sellerId, days = 30) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const [rows] = await connection.execute(
        `SELECT
          c.category_name as category,
          SUM(p.view_count) as views,
          COUNT(oi.order_item_id) as orders,
          SUM(oi.total_price) as revenue
         FROM categories c
         JOIN products p ON c.category_id = p.category_id
         LEFT JOIN order_items oi ON p.product_id = oi.product_id
         LEFT JOIN orders o ON oi.order_id = o.order_id AND o.payment_status = 'completed' AND o.order_datetime >= ?
         WHERE p.seller_id = ?
         GROUP BY c.category_id
         ORDER BY revenue DESC`,
        [startDateStr, sellerId]
      );

      return rows.map(row => ({
        category: row.category,
        views: parseInt(row.views) || 0,
        orders: parseInt(row.orders) || 0,
        revenue: parseFloat(row.revenue) || 0
      }));
    } finally {
      if (connection) connection.release();
    }
  }

  static async getSellerOverviewStats(sellerId, days = 30) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      // Previous period start date
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - days);
      const prevStartDateStr = prevStartDate.toISOString().split('T')[0];

      // Helper for range stats
      const getRangeStats = async (start, end) => {
        const [res] = await connection.execute(
          `SELECT
            COUNT(DISTINCT o.order_id) as orders,
            COALESCE(SUM(oi.total_price), 0) as revenue,
            COUNT(DISTINCT o.customer_id) as customers
           FROM orders o
           JOIN order_items oi ON o.order_id = oi.order_id
           WHERE oi.seller_id = ? 
             AND o.payment_status = 'completed'
             AND o.order_datetime >= ? AND o.order_datetime < ?`,
          [sellerId, start, end]
        );
        return res[0];
      };

      // Get Products Views (Total for period is hard because view_count is cumulative, 
      // typically we'd track daily views in a separate table.
      // For now, we will sum current view counts of all products
      const [storeViewsResult] = await connection.execute(
        "SELECT view_count FROM store WHERE user_id = ?",
        [sellerId]
      );
      const totalViews = parseInt(storeViewsResult[0].view_count) || 0;

      const [productCountResult] = await connection.execute(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN product_status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN product_status != 'active' THEN 1 ELSE 0 END) as inactive
         FROM products WHERE seller_id = ?`,
        [sellerId]
      );
      const totalProducts = parseInt(productCountResult[0].total) || 0;
      const activeProducts = parseInt(productCountResult[0].active) || 0;
      const inactiveProducts = parseInt(productCountResult[0].inactive) || 0;

      // Current Period Stats
      const currentStats = await getRangeStats(startDateStr, new Date().toISOString().split('T')[0] + ' 23:59:59');

      // Previous Period Stats
      const prevStats = await getRangeStats(prevStartDateStr, startDateStr);

      // Ratings
      const [ratingResult] = await connection.execute(
        `SELECT AVG(rating) as rating, COUNT(*) as count FROM product_reviews pr 
         JOIN products p ON pr.product_id = p.product_id 
         WHERE p.seller_id = ?`,
        [sellerId]
      );

      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      return {
        overview: {
          totalProducts: totalProducts,
          activeProducts: activeProducts,
          inactiveProducts: inactiveProducts,
          totalViews: totalViews, // Note: This is lifetime views, not period specific without tracking table
          totalOrders: parseInt(currentStats.orders),
          totalRevenue: parseFloat(currentStats.revenue),
          averageOrderValue: parseInt(currentStats.orders) ? parseFloat(currentStats.revenue) / parseInt(currentStats.orders) : 0,
          newCustomers: parseInt(currentStats.customers), // Approximation
          returningCustomers: 0, // Need complex logic to track returning within period
          rating: parseFloat(ratingResult[0].rating) || 0,
          ratingCount: parseInt(ratingResult[0].count) || 0,
          conversionRate: totalViews ? (parseInt(currentStats.orders) / totalViews) * 100 : 0
        },
        trends: {
          views: { current: totalViews, previous: 0, change: 0 }, // Placeholder
          orders: {
            current: parseInt(currentStats.orders),
            previous: parseInt(prevStats.orders),
            change: calculateChange(parseInt(currentStats.orders), parseInt(prevStats.orders))
          },
          revenue: {
            current: parseFloat(currentStats.revenue),
            previous: parseFloat(prevStats.revenue),
            change: calculateChange(parseFloat(currentStats.revenue), parseFloat(prevStats.revenue))
          },
          customers: {
            current: parseInt(currentStats.customers),
            previous: parseInt(prevStats.customers),
            change: calculateChange(parseInt(currentStats.customers), parseInt(prevStats.customers))
          }
        }
      };
    } finally {
      if (connection) connection.release();
    }
  }
}


module.exports = Dashboard;
