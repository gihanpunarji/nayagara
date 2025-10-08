const { getConnection } = require("../config/database")

class Store {
  static async findByUserId(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM store WHERE user_id = ?",
      [userId]
    );
    return rows[0];
  }

  static async create({ userId, storeName, storeDescription }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO store (user_id, store_name, store_description) VALUES (?, ?, ?)",
      [userId, storeName, storeDescription]
    );
    console.log(result);
    
    return result.insertId;
  }

  static async update({ userId, storeName, storeDescription }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE store SET store_name = ?, store_description = ? WHERE user_id = ?",
      [storeName, storeDescription, userId]
    );
    return result.affectedRows;
  }

  static async createOrUpdate({ userId, storeName, storeDescription }) {
    console.log(userId, storeName, storeDescription);
    const existingStore = await this.findByUserId(userId);
    
    if (existingStore) {
      return await this.update({ userId, storeName, storeDescription });
    } else {
      return await this.create({ userId, storeName, storeDescription });
    }
  }
}

module.exports = Store;