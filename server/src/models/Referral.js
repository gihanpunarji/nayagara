const { getConnection } = require("../config/database");

class Referral {
  static async create({ userId, referrerId }) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        "INSERT INTO referral (users_user_id, referred_by) VALUES (?, ?)",
        [userId, referrerId]
      );
      return result.insertId;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Finds the direct referrer of a given user.
   * @param {number} userId The ID of the user whose referrer is to be found.
   * @returns {Promise<object|null>} The referrer user object or null if not found.
   */
  static async findReferrerByUserId(userId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      // The 'referral' table links the new user (users_user_id) to the one who referred them (referred_by)
      const [rows] = await connection.execute(
        "SELECT referred_by FROM referral WHERE users_user_id = ?",
        [userId]
      );
      return rows[0] ? { user_id: rows[0].referred_by } : null;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Creates a record for a referral reward.
   * @param {object} rewardData
   * @param {number} rewardData.userId The ID of the user receiving the reward.
   * @param {number} rewardData.orderId The ID of the order that generated the reward.
   * @param {number} rewardData.level The referral level (1-8).
   * @param {number} rewardData.amount The commission amount.
   * @returns {Promise<number>} The ID of the inserted reward record.
   */
  static async createReward(rewardData) {
    const { userId, orderId, level, amount } = rewardData;
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        "INSERT INTO referral_rewards (users_user_id, orders_order_id, level, reward_amount, created_at) VALUES (?, ?, ?, ?, ?)",
        [userId, orderId, level, amount, new Date()]
      );
      return result.insertId;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getHistory(page = 1, limit = 15) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const offset = (page - 1) * limit;
      const [rows] = await connection.execute(
        `SELECT rr.rewards_id, u.first_name, u.last_name, u.user_email, o.order_number, rr.level, rr.reward_amount, rr.created_at
         FROM referral_rewards rr
         JOIN users u ON rr.users_user_id = u.user_id
         JOIN orders o ON rr.orders_order_id = o.order_id
         ORDER BY rr.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [[{ total }]] = await connection.execute("SELECT COUNT(*) as total FROM referral_rewards");
      return {
        rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Referral;
