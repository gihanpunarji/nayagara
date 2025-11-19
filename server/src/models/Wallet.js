const { getConnection } = require("../config/database");

class Wallet {
  /**
   * Gets a user's wallet by their user ID.
   * @param {number} userId The user's ID.
   * @returns {Promise<object|null>} The wallet object or null.
   */
  static async findByUserId(userId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute("SELECT * FROM user_wallet WHERE users_user_id = ?", [userId]);
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Adds funds to a user's wallet and creates a transaction record.
   * @param {object} transactionData
   * @param {number} transactionData.userId The user's ID.
   * @param {number} transactionData.amount The amount to add.
   * @param {string} transactionData.description A description for the transaction.
   * @param {number} transactionData.orderId The related order ID.
   * @returns {Promise<void>}
   */
  static async addCommission(transactionData) {
    const { userId, amount, description, orderId } = transactionData;
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Find the user's wallet
      let wallet = await this.findByUserId(userId);

      // If user doesn't have a wallet, create one
      if (!wallet) {
        const [result] = await connection.execute(
          "INSERT INTO user_wallet (users_user_id, balance, last_updated) VALUES (?, ?, ?)",
          [userId, 0, new Date()]
        );
        wallet = { wallet_id: result.insertId, balance: 0 };
      }

      // Update wallet balance
      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
      await connection.execute(
        "UPDATE user_wallet SET balance = ?, last_updated = ? WHERE wallet_id = ?",
        [newBalance, new Date(), wallet.wallet_id]
      );

      // Create a transaction record
      await connection.execute(
        "INSERT INTO wallet_transactions (user_wallet_wallet_id, amount, description, bebitted_at) VALUES (?, ?, ?, ?)",
        [wallet.wallet_id, amount, description, new Date()]
      );
      
      // Note: The schema has a `transaction_type` table that seems to be linked,
      // but the existing `wallet_transactions` table doesn't have a direct FK to it.
      // For now, we will just add to wallet_transactions as the schema seems to imply.
      // We might need to adjust this if there's a different expectation.

      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Gets all transactions for a user.
   * @param {number} userId The user's ID.
   * @param {number} limit The number of transactions to return.
   * @param {number} offset The offset for pagination.
   * @returns {Promise<Array<object>>} A list of transaction objects.
   */
  static async getTransactionsByUserId(userId, limit = 50, offset = 0) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT wt.* 
         FROM wallet_transactions wt
         JOIN user_wallet uw ON wt.user_wallet_wallet_id = uw.wallet_id
         WHERE uw.users_user_id = ?
         ORDER BY wt.bebitted_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      return rows;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Wallet;
