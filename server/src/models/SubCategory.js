const { getConnection } = require("../config/database");

class SubCategory {
  static async findAll() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT sc.*, c.category_name FROM sub_categories sc JOIN categories c ON sc.categories_category_id = c.category_id WHERE c.is_active = TRUE ORDER BY c.category_name, sc.sub_category_name"
    );
    return rows;
  }

  static async findByCategoryId(categoryId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM sub_categories WHERE categories_category_id = ? ORDER BY sub_category_name",
      [categoryId]
    );
    return rows;
  }

  static async findById(subCategoryId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT sc.*, c.category_name FROM sub_categories sc JOIN categories c ON sc.categories_category_id = c.category_id WHERE sc.sub_category_id = ?",
      [subCategoryId]
    );
    return rows[0];
  }

  static async create({ subCategoryName, categoryId }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO sub_categories (sub_category_name, categories_category_id) VALUES (?, ?)",
      [subCategoryName, categoryId]
    );
    return result;
  }

  static async update({ subCategoryId, subCategoryName, categoryId }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE sub_categories SET sub_category_name = ?, categories_category_id = ? WHERE sub_category_id = ?",
      [subCategoryName, categoryId, subCategoryId]
    );
    return result.affectedRows;
  }

  static async delete(subCategoryId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM sub_categories WHERE sub_category_id = ?",
      [subCategoryId]
    );
    return result.affectedRows;
  }
}

module.exports = SubCategory;