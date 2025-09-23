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

  static async findByEmailandRoleAndNIC(email, role, nic) {
    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute(
      "SELECT * FROM users WHERE (user_email = ? OR nic = ?) AND user_type = ?",
      [email, nic, role]
    );    
    return rows[0];
  }
  static async findByMobile(mobile) {
    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute(
      "SELECT * FROM users WHERE user_mobile = ?",
      [mobile]
    );    
    return rows[0];
  }

  static async findByNIC(identifier) {
    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute(
      "SELECT * FROM users WHERE nic = ?",
      [identifier]
    );    
    return rows[0];
  }

  static async create({ mobile, email, password, firstName, lastName, role }) {
    const connection = getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);

    const [
      result,
    ] = await connection.execute(
      "INSERT INTO users (user_email, user_password, first_name, last_name, user_mobile, nic, user_type, user_status, email_verified, mobile_verified, profile_image, last_login, created_at, updated_at, mobile_verification_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, firstName, lastName, mobile, null, role, 'active', 0, 0, null, new Date(), new Date(), new Date(), null]
    );

    return this.findById(result.insertId);
  }

  static async createSeller({ email, password, firstName, lastName, role, nic }) {
    const connection = getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);

    const [
      result,
    ] = await connection.execute(
      "INSERT INTO users (user_email, user_password, first_name, last_name, user_mobile, nic, user_type, user_status, email_verified, mobile_verified, profile_image, last_login, created_at, updated_at, mobile_verification_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, firstName, lastName, null, nic, role, 'pending_verification', 0, 0, null, new Date(), new Date(), new Date(), null]
    );

    return this.findById(result.insertId);
  }

  static async verifyOtp({mobile, email, verificationCode}) {
    const connection = getConnection();
    
    const [result] = await connection.execute(
      "SELECT * FROM users WHERE user_email = ? AND user_mobile = ? AND mobile_verification_code = ?",
      [email, mobile, verificationCode]
    );

    if (result.length === 0) {
      throw new Error("Invalid verification details");
    }

    const [updateResult] = await connection.execute(
      "UPDATE users SET mobile_verified = ?, mobile_verification_code = ? WHERE user_email = ? AND user_mobile = ?",
      [1, null, email, mobile]
    );
    console.log(updateResult);

    return updateResult;
  }


  static async updateSellerMobile({ mobile, email, verificationCode }) {
    const connection = getConnection();

    const [
      result,
    ] = await connection.execute(
      "UPDATE users SET user_mobile = ?, mobile_verification_code = ? WHERE user_email = ?",
      [mobile, verificationCode, email]
    );

    console.log(result);

    return result.mobile_verification_code;
  }

}
module.exports = User;
