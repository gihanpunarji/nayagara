const { getConnection } = require("../config/database");

class AdPayment {
  static async create({
    user_id,
    ad_id,
    package_type,
    amount,
    payment_method,
    payment_status = 'pending',
    payment_reference = null
  }) {
    const connection = getConnection();

    const [result] = await connection.execute(
      `INSERT INTO ad_payments (
        user_id, ad_id, package_type, amount, payment_method,
        payment_status, payment_reference, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, ad_id, package_type, amount, payment_method,
        payment_status, payment_reference, new Date(), new Date()
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM ad_payments WHERE payment_id = ?",
      [id]
    );
    return rows[0];
  }

  static async findByAdId(adId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM ad_payments WHERE ad_id = ? ORDER BY created_at DESC",
      [adId]
    );
    return rows;
  }

  static async findByUserId(userId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT ap.*, a.title as ad_title FROM ad_payments ap
       LEFT JOIN advertisements a ON ap.ad_id = a.ad_id
       WHERE ap.user_id = ? ORDER BY ap.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async updatePaymentStatus(id, status, paymentReference = null) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE ad_payments SET payment_status = ?, payment_reference = ?, updated_at = ? WHERE payment_id = ?",
      [status, paymentReference, new Date(), id]
    );
    return result.affectedRows > 0;
  }

  // Package pricing configuration
  static getPackagePrices() {
    return {
      standard: 0,     // Free posting
      urgent: 500,     // Rs. 500 for urgent listing
      featured: 1000   // Rs. 1000 for featured listing
    };
  }

  static getPackageFeatures() {
    return {
      standard: {
        name: 'Standard',
        price: 0,
        features: [
          'Basic listing',
          'Visible for 30 days',
          'Standard placement'
        ]
      },
      urgent: {
        name: 'Urgent',
        price: 500,
        features: [
          'Priority placement',
          'Visible for 30 days',
          'Urgent badge',
          'Higher visibility'
        ]
      },
      featured: {
        name: 'Featured',
        price: 1000,
        features: [
          'Top placement',
          'Visible for 45 days',
          'Featured badge',
          'Maximum visibility',
          'Homepage featuring'
        ]
      }
    };
  }
}

module.exports = AdPayment;