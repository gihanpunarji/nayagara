const { getConnection } = require("../config/database");

class Payment {
  static async create({ userId, amount }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO payments (users_user_id, amount, paid_at) VALUES (?, ?, NOW())",
      [userId, amount]
    );
    return result;
  }

  static async findByUserId(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM payments WHERE users_user_id = ? ORDER BY paid_at DESC",
      [userId]
    );
    return rows;
  }

  static async getTotalPaidToSeller(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE users_user_id = ?",
      [userId]
    );
    return rows[0].total;
  }
}

module.exports = Payment;
