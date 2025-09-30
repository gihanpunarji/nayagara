const { getConnection } = require("../config/database");

class Advertisement {
  static async create({
    user_id,
    title,
    description,
    category,
    subcategory,
    price,
    is_negotiable,
    contact_number,
    location_city,
    location_district,
    images,
    ad_type, // 'vehicle' or 'property'
    package_type, // 'standard', 'urgent', 'featured'
    payment_amount,
    vehicle_data, // JSON for vehicle-specific fields
    property_data, // JSON for property-specific fields
  }) {
    const connection = getConnection();

    const [result] = await connection.execute(
      `INSERT INTO advertisements (
        user_id, title, description, category, subcategory, price,
        is_negotiable, contact_number, location_city, location_district,
        images, ad_type, package_type, payment_amount, vehicle_data,
        property_data, status, views, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, title, description, category, subcategory, price,
        is_negotiable, contact_number, location_city, location_district,
        JSON.stringify(images || []), ad_type, package_type, payment_amount,
        JSON.stringify(vehicle_data || {}), JSON.stringify(property_data || {}),
        'pending_approval', 0, new Date(), new Date()
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM advertisements WHERE ad_id = ?",
      [id]
    );

    if (rows[0]) {
      rows[0].images = JSON.parse(rows[0].images || '[]');
      rows[0].vehicle_data = JSON.parse(rows[0].vehicle_data || '{}');
      rows[0].property_data = JSON.parse(rows[0].property_data || '{}');
    }

    return rows[0];
  }

  static async findByUserId(userId, status = null) {
    const connection = getConnection();
    let query = "SELECT * FROM advertisements WHERE user_id = ?";
    let params = [userId];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await connection.execute(query, params);

    return rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      vehicle_data: JSON.parse(row.vehicle_data || '{}'),
      property_data: JSON.parse(row.property_data || '{}')
    }));
  }

  static async findByCategory(category, subcategory = null, filters = {}) {
    const connection = getConnection();
    let query = "SELECT * FROM advertisements WHERE category = ? AND status = 'approved'";
    let params = [category];

    if (subcategory) {
      query += " AND subcategory = ?";
      params.push(subcategory);
    }

    if (filters.city) {
      query += " AND location_city = ?";
      params.push(filters.city);
    }

    if (filters.district) {
      query += " AND location_district = ?";
      params.push(filters.district);
    }

    if (filters.minPrice) {
      query += " AND price >= ?";
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += " AND price <= ?";
      params.push(filters.maxPrice);
    }

    // Sort by package type priority (featured first, then urgent, then standard)
    query += " ORDER BY CASE WHEN package_type = 'featured' THEN 1 WHEN package_type = 'urgent' THEN 2 ELSE 3 END, created_at DESC";

    const [rows] = await connection.execute(query, params);

    return rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      vehicle_data: JSON.parse(row.vehicle_data || '{}'),
      property_data: JSON.parse(row.property_data || '{}')
    }));
  }

  static async findPendingApproval() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM advertisements WHERE status = 'pending_approval' ORDER BY created_at ASC"
    );

    return rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      vehicle_data: JSON.parse(row.vehicle_data || '{}'),
      property_data: JSON.parse(row.property_data || '{}')
    }));
  }

  static async updateStatus(id, status, admin_notes = null) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE advertisements SET status = ?, admin_notes = ?, updated_at = ? WHERE ad_id = ?",
      [status, admin_notes, new Date(), id]
    );
    return result.affectedRows > 0;
  }

  static async incrementViews(id) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE advertisements SET views = views + 1 WHERE ad_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async update(id, updateData) {
    const connection = getConnection();
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (key === 'images' || key === 'vehicle_data' || key === 'property_data') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(updateData[key]));
      } else {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);

    const [result] = await connection.execute(
      `UPDATE advertisements SET ${fields.join(', ')} WHERE ad_id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM advertisements WHERE ad_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async search(searchTerm, filters = {}) {
    const connection = getConnection();
    let query = `
      SELECT * FROM advertisements
      WHERE status = 'approved'
      AND (title LIKE ? OR description LIKE ?)
    `;
    let params = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (filters.category) {
      query += " AND category = ?";
      params.push(filters.category);
    }

    if (filters.city) {
      query += " AND location_city = ?";
      params.push(filters.city);
    }

    query += " ORDER BY CASE WHEN package_type = 'featured' THEN 1 WHEN package_type = 'urgent' THEN 2 ELSE 3 END, created_at DESC";

    const [rows] = await connection.execute(query, params);

    return rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      vehicle_data: JSON.parse(row.vehicle_data || '{}'),
      property_data: JSON.parse(row.property_data || '{}')
    }));
  }
}

module.exports = Advertisement;