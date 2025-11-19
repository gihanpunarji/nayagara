const { getConnection } = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [
        rows,
      ] = await connection.execute("SELECT * FROM users WHERE user_email = ?", [
        email,
      ]);
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
      const [
        rows,
      ] = await connection.execute("SELECT * FROM users WHERE user_id = ?", [
        id,
      ]);
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
      const [
        rows,
      ] = await connection.execute(
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
      const [
        result,
      ] = await connection.execute(
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
      const [
        rows,
      ] = await connection.execute(
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
      const [
        rows,
      ] = await connection.execute(
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
      const [
        rows,
      ] = await connection.execute(
        "SELECT * FROM users WHERE user_mobile = ?",
        [mobile]
      );
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
      const [
        rows,
      ] = await connection.execute("SELECT * FROM users WHERE nic = ?", [
        identifier,
      ]);
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
      const [
        result,
      ] = await connection.execute(
        "INSERT INTO users (user_email, user_password, first_name, last_name, user_mobile, nic, user_type, user_status, email_verified, mobile_verified, profile_image, last_login, created_at, updated_at, mobile_verification_code, reset_token, reset_token_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          email,
          hashedPassword,
          firstName,
          lastName,
          mobile,
          null,
          role,
          "active",
          0,
          0,
          null,
          new Date(),
          new Date(),
          new Date(),
          null,
          null,
          null,
        ]
      );
      return this.findById(result.insertId);
    } finally {
      if (connection) connection.release();
    }
  }

  static async createSeller({
    email,
    password,
    firstName,
    lastName,
    role,
    nic,
  }) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const hashedPassword = await bcrypt.hash(password, 10);
      const [
        result,
      ] = await connection.execute(
        "INSERT INTO users (user_email, user_password, first_name, last_name, user_mobile, nic, user_type, user_status, email_verified, mobile_verified, profile_image, last_login, created_at, updated_at, mobile_verification_code, reset_token, reset_token_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          email,
          hashedPassword,
          firstName,
          lastName,
          null,
          nic,
          role,
          "pending_verification",
          0,
          0,
          null,
          new Date(),
          new Date(),
          new Date(),
          null,
          null,
          null,
        ]
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
      const [
        result,
      ] = await connection.execute(
        "SELECT * FROM users WHERE user_email = ? AND user_mobile = ? AND mobile_verification_code = ?",
        [email, mobile, verificationCode]
      );
      if (result.length === 0) {
        throw new Error("Invalid verification details");
      }
      const [
        updateResult,
      ] = await connection.execute(
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
      const [
        result,
      ] = await connection.execute(
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
      const [
        result,
      ] = await connection.execute(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_email = ?",
        [resetToken, resetTokenExpires, email]
      );
      return result;
    } finally {
      if (connection) connection.release();
    }
  }

  static async updatePurchaseInfo(userId, orderTotal, referralUnlockThreshold) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Get current user data
      const [rows] = await connection.execute("SELECT total_purchase_amount, referral_link_unlocked FROM users WHERE user_id = ? FOR UPDATE", [userId]);
      const user = rows[0];

      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      const newTotalPurchaseAmount = parseFloat(user.total_purchase_amount) + parseFloat(orderTotal);
      let newReferralStatus = user.referral_link_unlocked;

      // Check if the referral link should be unlocked
      if (!user.referral_link_unlocked && newTotalPurchaseAmount >= referralUnlockThreshold) {
        newReferralStatus = true;
        console.log(`Referral link for user ${userId} unlocked.`);
      }

      // Update the user record
      await connection.execute(
        "UPDATE users SET total_purchase_amount = ?, referral_link_unlocked = ? WHERE user_id = ?",
        [newTotalPurchaseAmount, newReferralStatus, userId]
      );

      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Failed to update purchase info for user ${userId}:`, error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getReferralSummary(userId) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();

      // Get total referrals
      const [referralsResult] = await connection.execute(
        "SELECT COUNT(*) as total_referrals FROM referral WHERE referred_by = ?",
        [userId]
      );
      const total_referrals = referralsResult[0].total_referrals;

      // Get total commission earned
      const [commissionResult] = await connection.execute(
        "SELECT SUM(reward_amount) as total_commission_earned FROM referral_rewards WHERE users_user_id = ?",
        [userId]
      );
      const total_commission_earned = commissionResult[0].total_commission_earned || 0;

      // Get user's total purchase amount
      const [userResult] = await connection.execute(
        "SELECT total_purchase_amount, referral_link_unlocked FROM users WHERE user_id = ?",
        [userId]
      );
      const user = userResult[0];

      // Determine current discount tier
      let current_discount_tier = '0%';
      if (user.total_purchase_amount > 10000) {
        current_discount_tier = '30%';
      } else if (user.total_purchase_amount > 5000) {
        const progress = (user.total_purchase_amount - 5000) / 5000;
        const discount = 15 + (progress * 15);
        current_discount_tier = `${discount.toFixed(2)}%`;
      } else if (user.total_purchase_amount > 0) {
        current_discount_tier = '15%';
      }

      // Get referral link
      const referral_link = user.referral_link_unlocked ? `https://nayagara.lk/register?ref=${userId}` : null;

      return {
        total_referrals,
        total_commission_earned,
        current_discount_tier,
        referral_link,
      };
    } finally {
      if (connection) connection.release();
    }
  }

  static async getAllWithReferralInfo() {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT u.user_id, u.first_name, u.last_name, u.total_purchase_amount, u.referral_link_unlocked, r.referred_by
         FROM users u
         LEFT JOIN referral r ON u.user_id = r.users_user_id`
      );
      return rows;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = User;
