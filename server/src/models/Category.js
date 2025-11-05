const { getConnection } = require("../config/database");

class Category {
  static async getAllCategories() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT category_id, category_name, category_slug FROM categories WHERE is_active = TRUE ORDER BY category_name"
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

  static async findBySlug(slug) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM categories WHERE category_slug = ? AND is_active = TRUE",
      [slug]
    );
    return rows[0];
  }

  static async create({ categoryName, categorySlug, isActive = 1 }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO categories (category_name, category_slug, is_active) VALUES (?, ?, ?)",
      [categoryName, categorySlug, isActive]
    );
    return result;
  }

  static async update({ categoryId, categoryName, categorySlug, isActive }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE categories SET category_name = ?, category_slug = ?, is_active = ? WHERE category_id = ?",
      [categoryName, categorySlug, isActive, categoryId]
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
}

module.exports = Category;
