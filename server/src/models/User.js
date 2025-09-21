const { getConnection } = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async findByMobile(mobile) {
    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute("SELECT * FROM users WHERE user_mobile = ?", [
      mobile,
    ]);
    return rows[0];
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [id]
    );
    return rows[0];
  }

  static async findByEmailOrMobile(identifier) {
    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute(
      "SELECT * FROM users WHERE user_email = ? OR user_mobile = ?",
      [identifier, identifier]
    );    
    return rows[0];
  }

  static async create({ mobile, email, password, firstName, lastName }) {
    const connection = getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);

    const [
      result,
    ] = await connection.execute(
      "INSERT INTO users (user_email, user_password, first_name, last_name, user_mobile, nic, user_type, user_status, email_verified, mobile_verified, profile_image, last_login, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, firstName, lastName, mobile, null, 'customer', 'active', 0, 0, null, null, new Date(), new Date()]
    );

    console.log(result);

    return this.findById(result.insertId);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
