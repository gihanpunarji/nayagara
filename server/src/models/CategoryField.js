const { getConnection } = require("../config/database");

class CategoryField {
  static async findAll() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT cf.*, sc.sub_category_name, c.category_name FROM category_fields cf JOIN sub_categories sc ON cf.sub_categories_sub_category_id = sc.sub_category_id JOIN categories c ON sc.categories_category_id = c.category_id WHERE c.is_active = TRUE ORDER BY c.category_name, sc.sub_category_name, cf.field_name"
    );
    return rows;
  }

  static async findBySubCategoryId(subCategoryId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM category_fields WHERE sub_categories_sub_category_id = ? ORDER BY field_name",
      [subCategoryId]
    );
    return rows;
  }

  static async findById(fieldId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT cf.*, sc.sub_category_name, c.category_name FROM category_fields cf JOIN sub_categories sc ON cf.sub_categories_sub_category_id = sc.sub_category_id JOIN categories c ON sc.categories_category_id = c.category_id WHERE cf.field_id = ?",
      [fieldId]
    );
    return rows[0];
  }

  static async create({ fieldName, fieldLabel, fieldType, fieldOptions, isRequired, validationRules, subCategoryId }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO category_fields (field_name, field_label, field_type, field_options, is_required, validation_rules, sub_categories_sub_category_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [fieldName, fieldLabel, fieldType, fieldOptions, isRequired, validationRules, subCategoryId]
    );
    return result;
  }

  static async update({ fieldId, fieldName, fieldLabel, fieldType, fieldOptions, isRequired, validationRules, subCategoryId }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE category_fields SET field_name = ?, field_label = ?, field_type = ?, field_options = ?, is_required = ?, validation_rules = ?, sub_categories_sub_category_id = ? WHERE field_id = ?",
      [fieldName, fieldLabel, fieldType, fieldOptions, isRequired, validationRules, subCategoryId, fieldId]
    );
    return result.affectedRows;
  }

  static async delete(fieldId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM category_fields WHERE field_id = ?",
      [fieldId]
    );
    return result.affectedRows;
  }

  // Helper method to parse field options (stored as JSON string)
  static parseFieldOptions(fieldOptions) {
    try {
      return fieldOptions ? JSON.parse(fieldOptions) : [];
    } catch (error) {
      console.error('Error parsing field options:', error);
      return [];
    }
  }

  // Helper method to format field options for storage
  static formatFieldOptions(options) {
    try {
      return Array.isArray(options) ? JSON.stringify(options) : options;
    } catch (error) {
      console.error('Error formatting field options:', error);
      return '[]';
    }
  }
}

module.exports = CategoryField;