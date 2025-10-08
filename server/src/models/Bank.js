const { getConnection } = require("../config/database");

class Bank {
  static async findByUserId(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM bank WHERE users_user_id = ?",
      [userId]
    );
    return rows[0];
  }

  static async create({ userId, bankName, accountNumber, holderName, bankCode, branchName }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO bank (bank_name, account_number, holder_name, bank_code, branch_name, users_user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [bankName, accountNumber, holderName, bankCode, branchName, userId]
    );
    return result;
  }

  static async update({ userId, bankName, accountNumber, holderName, bankCode, branchName }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE bank SET bank_name = ?, account_number = ?, holder_name = ?, bank_code = ?, branch_name = ? WHERE users_user_id = ?",
      [bankName, accountNumber, holderName, bankCode, branchName, userId]
    );
    return result.affectedRows;
  }

  static async createOrUpdate({ userId, bankName, accountNumber, holderName, bankCode, branchName }) {
    const existingBank = await this.findByUserId(userId);
    
    if (existingBank) {
      return await this.update({ userId, bankName, accountNumber, holderName, bankCode, branchName });
    } else {
      return await this.create({ userId, bankName, accountNumber, holderName, bankCode, branchName });
    }
  }

  static async deleteByUserId(userId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM bank WHERE users_user_id = ?",
      [userId]
    );
    return result.affectedRows;
  }
}

module.exports = Bank;