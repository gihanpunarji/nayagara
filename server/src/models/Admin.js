const { getConnection } = require("../config/database");
const bcrypt = require("bcrypt");

class Admin {
  static async checkAdmin(email) {
    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute("SELECT * FROM admins WHERE admin_email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async checkCode(code, email) {
    console.log(code + " " + email);
    
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT admin_email 
     FROM admins 
     WHERE email_code = ? AND admin_email = ?`,
      [code, email]
    );
    return rows[0];
  }

  static async deleteCode(email) {
    const connection = getConnection();
    await connection.execute(
        `UPDATE admins SET email_code = NULL WHERE admin_email = ?`, [email]
    );
  }

  static async getAdminContactMobile() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT mobile FROM admins WHERE mobile IS NOT NULL LIMIT 1"
    );
    return rows[0]?.mobile || null;
  }
}

module.exports = Admin;
