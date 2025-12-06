const { getConnection } = require("../config/database");

class Payment {
  static async create({ userId, amount }) {
    const connection = getConnection();

    // Get the current total_paid for this user
    const [previousPayments] = await connection.execute(
      "SELECT COALESCE(total_paid, 0) as total_paid FROM payments WHERE user_id = ? ORDER BY paid_at DESC LIMIT 1",
      [userId]
    );

    // Calculate new total_paid (previous total + current amount)
    const newTotalPaid = (previousPayments[0]?.total_paid || 0) + parseFloat(amount);

    // Insert payment with total_paid
    const [result] = await connection.execute(
      "INSERT INTO payments (user_id, amount, paid_at, total_paid) VALUES (?, ?, NOW(), ?)",
      [userId, amount, newTotalPaid]
    );
    return result;
  }

  static async findByUserId(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM payments WHERE user_id = ? ORDER BY paid_at DESC",
      [userId]
    );
    return rows;
  }

  static async getTotalPaidToSeller(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT COALESCE(total_paid, 0) as total FROM payments WHERE user_id = ? ORDER BY paid_at DESC LIMIT 1",
      [userId]
    );
    return rows[0]?.total || 0;
  }
}

module.exports = Payment;
