const { getConnection } = require("../config/database");

class Category {
  static async getAllCategories() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT category_id, category_name, category_slug FROM categories WHERE is_active = TRUE"
    );
    return rows;
    
  }
}

module.exports = Category;
