const { getConnection } = require("../config/database");

class Category {
  static async getAllCategories() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT category_id, category_name, category_slug, icon, image FROM categories WHERE is_active = TRUE ORDER BY category_name"
    );
    return rows;
  }

  static async findById(categoryId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM categories WHERE category_id = ? AND is_active = TRUE",
      [categoryId]
    );
    return rows[0];
  }

  static async findByIdIncludingInactive(categoryId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM categories WHERE category_id = ?",
      [categoryId]
    );
    return rows[0];
  }

  static async findBySlug(slug) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM categories WHERE category_slug = ? AND is_active = TRUE",
      [slug]
    );
    return rows[0];
  }

  static async create({ categoryName, categorySlug, icon = null, icoFile = null, isActive = 1 }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO categories (category_name, category_slug, icon, image, is_active) VALUES (?, ?, ?, ?, ?)",
      [categoryName, categorySlug, icon, icoFile, isActive]
    );
    return result;
  }

  static async update({ categoryId, categoryName, categorySlug, icon, iconImage, isActive }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE categories SET category_name = ?, category_slug = ?, icon = ?, image = ?, is_active = ? WHERE category_id = ?",
      [categoryName, categorySlug, icon, iconImage, isActive, categoryId]
    );
    return result.affectedRows;
  }

  static async delete(categoryId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE categories SET is_active = 0 WHERE category_id = ?",
      [categoryId]
    );
    return result.affectedRows;
  }

  static async updateStatus(categoryId, isActive) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE categories SET is_active = ? WHERE category_id = ?",
      [isActive, categoryId]
    );
    return result.affectedRows;
  }

  static async hasProducts(categoryId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [categoryId]
    );
    return rows[0].count > 0;
  }

  static async getAllCategoriesWithStats() {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(`
        SELECT
          c.category_id AS id,
          c.category_name AS name,
          c.category_slug,
          c.icon,
          c.image,
          c.is_active,
          (SELECT COUNT(*) FROM sub_categories sc WHERE sc.categories_category_id = c.category_id) AS subcategory_count,
          (SELECT COUNT(*) FROM products p WHERE p.category_id = c.category_id AND p.product_status = 'active') AS active_products,
          (SELECT COUNT(*) FROM products p WHERE p.category_id = c.category_id) AS total_products,
          (SELECT COALESCE(SUM(oi.total_price), 0)
           FROM order_items oi
           JOIN products p ON oi.product_id = p.product_id
           WHERE p.category_id = c.category_id) AS total_sales
        FROM categories c
        WHERE c.is_active = 1
        ORDER BY c.category_name;
      `);
      return rows;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Category;
