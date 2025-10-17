const { getConnection } = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute("SELECT * FROM users WHERE user_email = ?", [email]);
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  static async findById(id) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute("SELECT * FROM users WHERE user_id = ?", [id]);
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  static async checkRole(emailOrMobile, role) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE (user_email = ? OR user_mobile = ?) AND user_type = ?",
        [emailOrMobile, emailOrMobile, role]
      );
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  static async isMobileVerified(identifier) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        "SELECT mobile_verified FROM users WHERE user_email = ? OR user_mobile = ?",
        [identifier, identifier]
      );
      if (result.length === 0) return false;
      return result[0].mobile_verified === 1;
    } finally {
      if (connection) connection.release();
    }
  }
  
  static async findByEmailOrMobile(identifier) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE user_email = ? OR user_mobile = ?",
        [identifier, identifier]
      );
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  static async findByEmailandRoleAndNIC(email, role, nic) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE (user_email = ? OR nic = ?) AND user_type = ?",
        [email, nic, role]
      );
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  static async findByMobile(mobile) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute("SELECT * FROM users WHERE user_mobile = ?", [mobile]);
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  static async createReferralUser() {}

  static async findByNIC(identifier) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE nic = ?",
        [identifier]
      );
      return rows[0];
    } finally {
      if (connection) connection.release();
    }
  }

  static async create({ mobile, email, password, firstName, lastName, role }) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.execute(
        "INSERT INTO users (user_email, user_password, first_name, last_name, user_mobile, nic, user_type, user_status, email_verified, mobile_verified, profile_image, last_login, created_at, updated_at, mobile_verification_code, reset_token, reset_token_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [email, hashedPassword, firstName, lastName, mobile, null, role, "active", 0, 0, null, new Date(), new Date(), new Date(), null, null, null]
      );
      return this.findById(result.insertId);
    } finally {
      if (connection) connection.release();
    }
  }

  static async createSeller({ email, password, firstName, lastName, role, nic }) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.execute(
        "INSERT INTO users (user_email, user_password, first_name, last_name, user_mobile, nic, user_type, user_status, email_verified, mobile_verified, profile_image, last_login, created_at, updated_at, mobile_verification_code, reset_token, reset_token_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [email, hashedPassword, firstName, lastName, null, nic, role, "pending_verification", 0, 0, null, new Date(), new Date(), new Date(), null, null, null]
      );
      return this.findById(result.insertId);
    } finally {
      if (connection) connection.release();
    }
  }

  static async verifyOtp({ mobile, email, verificationCode }) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
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
      return updateResult;
    } finally {
      if (connection) connection.release();
    }
  }

  static async updateSellerMobile({ newMobile, email, verificationCode }) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        "UPDATE users SET user_mobile = ?, mobile_verification_code = ? WHERE user_email = ?",
        [newMobile, verificationCode, email]
      );
      return result.mobile_verification_code;
    } finally {
      if (connection) connection.release();
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateToken(resetToken, resetTokenExpires, email) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_email = ?",
        [resetToken, resetTokenExpires, email]
      );
      return result;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = User;
