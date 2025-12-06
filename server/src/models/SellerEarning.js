const { getConnection } = require("../config/database");

class SellerEarning {
  /**
   * Get all orders for a seller with payment status
   */
  static async getSellerOrders(sellerId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT
        o.order_id,
        o.order_number,
        o.order_datetime,
        o.payment_status,
        o.order_status,
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        SUM(oi.unit_price * oi.quantity) as seller_amount,
        o.total_amount as order_total
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN users u ON o.customer_id = u.user_id
       WHERE oi.seller_id = ?
       GROUP BY o.order_id, o.order_number, o.order_datetime, o.payment_status, o.order_status, customer_name, o.total_amount
       ORDER BY o.order_datetime DESC`,
      [sellerId]
    );
    return rows;
  }

  /**
   * Get unpaid orders for a seller (for backward compatibility)
   */
  static async getUnpaidEarnings(sellerId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT
        o.order_id as earning_id,
        o.order_id,
        o.order_number,
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        SUM(oi.unit_price * oi.quantity) as amount,
        o.order_datetime as earned_at
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN users u ON o.customer_id = u.user_id
       WHERE oi.seller_id = ?
       AND o.payment_status = 'completed'
       GROUP BY o.order_id, o.order_number, customer_name, o.order_datetime
       ORDER BY o.order_datetime DESC`,
      [sellerId]
    );
    return rows;
  }

  /**
   * Get payment history for a seller
   */
  static async getPaymentHistory(sellerId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT
        p.payment_id,
        p.amount as payment_amount,
        p.paid_at,
        COUNT(se.earning_id) as orders_count,
        GROUP_CONCAT(se.order_number ORDER BY se.order_number SEPARATOR ', ') as order_numbers
       FROM payments p
       LEFT JOIN seller_earnings se ON se.payment_id = p.payment_id
       WHERE p.user_id = ?
       GROUP BY p.payment_id, p.amount, p.paid_at
       ORDER BY p.paid_at DESC
       LIMIT 20`,
      [sellerId]
    );
    return rows;
  }

  /**
   * Get earnings statistics for a seller (from orders)
   */
  static async getStats(sellerId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT
        COALESCE(SUM(CASE WHEN o.payment_status = 'pending' THEN oi.unit_price * oi.quantity ELSE 0 END), 0) as unpaid_amount,
        COALESCE(SUM(CASE WHEN o.payment_status = 'completed' THEN oi.unit_price * oi.quantity ELSE 0 END), 0) as completed_amount,
        COALESCE(SUM(oi.unit_price * oi.quantity), 0) as total_earned,
        COUNT(DISTINCT CASE WHEN o.payment_status = 'pending' THEN o.order_id END) as unpaid_count,
        COUNT(DISTINCT CASE WHEN o.payment_status = 'completed' THEN o.order_id END) as completed_count
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.order_id
       WHERE oi.seller_id = ?`,
      [sellerId]
    );
    return rows[0];
  }

  /**
   * Calculate total amount from selected earning IDs
   */
  static async calculateTotal(earningIds) {
    const connection = getConnection();
    const placeholders = earningIds.map(() => '?').join(',');
    const [rows] = await connection.execute(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM seller_earnings
       WHERE earning_id IN (${placeholders}) AND payment_status = 'unpaid'`,
      earningIds
    );
    return rows[0].total;
  }

  /**
   * Mark earnings as paid
   */
  static async markAsPaid(earningIds, paymentId) {
    const connection = getConnection();
    const placeholders = earningIds.map(() => '?').join(',');
    const [result] = await connection.execute(
      `UPDATE seller_earnings
       SET payment_status = 'paid', paid_at = NOW(), payment_id = ?
       WHERE earning_id IN (${placeholders}) AND payment_status = 'unpaid'`,
      [paymentId, ...earningIds]
    );
    return result;
  }

  /**
   * Get earnings by IDs (for validation)
   */
  static async getByIds(earningIds) {
    const connection = getConnection();
    const placeholders = earningIds.map(() => '?').join(',');
    const [rows] = await connection.execute(
      `SELECT * FROM seller_earnings WHERE earning_id IN (${placeholders})`,
      earningIds
    );
    return rows;
  }
}

module.exports = SellerEarning;
