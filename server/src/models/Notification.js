const { getConnection } = require("../config/database");

class Notification {
  /**
   * Fetch all notifications with pagination
   * @param {number} limit 
   * @param {number} offset 
   */
  static async getAll(limit = 50, offset = 0) {
    const connection = getConnection();
    // Use format to handle numbers correctly if needed, but execute usually handles params
    // Note: LIMIT/OFFSET params in prepared statements can sometimes be strict about types
    const [rows] = await connection.execute(
      `SELECT 
        notification_id,
        notification_type,
        title,
        message,
        created_at
       FROM notifications 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [String(limit), String(offset)] 
    );
    return rows;
  }
  
  /**
   * Get total count of notifications
   */
  static async getCount() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as total FROM notifications`
    );
    return rows[0].total;
  }
}

module.exports = Notification;
