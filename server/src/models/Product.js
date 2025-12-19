const { getConnection } = require("../config/database");

class Product {
  static async create({ 
    productTitle, 
    productSlug, 
    productDescription, 
    categoryId, 
    subcategoryId = null,
    sellerId, 
    price, 
    cost,
    currencyCode = 'LKR', 
    weightKg, 
    stockQuantity, 
    productStatus = 'pending', 
    isFeatured = 0, 
    isPromoted = 0, 
    locationCityId, 
    metaTitle, 
    metaDescription, 
    productAttributes,
    expiresAt 
  }) {
    const connection = getConnection();
    
    // Check if subcategory_id column exists, if not, create product without it
    try {
      const [result] = await connection.execute(
        `INSERT INTO products (
          product_title, product_slug, product_description, category_id, subcategory_id, seller_id, 
          price, weight_kg, stock_quantity, product_status, 
          is_featured, is_promoted, location_city_id, meta_title, meta_description, 
          product_attributes, created_at, updated_at, expires_at, cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productTitle, productSlug, productDescription, categoryId, subcategoryId, sellerId,
          price, weightKg, stockQuantity, productStatus,
          isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
          productAttributes, new Date(), new Date(), expiresAt, cost
        ]
      );
      return result;
    } catch (error) {
      // If subcategory_id column doesn't exist, fall back to original schema
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log('Subcategory field not found, using original schema...');
        const [result] = await connection.execute(
          `INSERT INTO products (
            product_title, product_slug, product_description, category_id, seller_id, 
            price, weight_kg, stock_quantity, product_status, 
            is_featured, is_promoted, location_city_id, meta_title, meta_description, 
            product_attributes, created_at, updated_at, expires_at, cost
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productTitle, productSlug, productDescription, categoryId, sellerId,
            price, weightKg, stockQuantity, productStatus,
            isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
            productAttributes, new Date(), new Date(), expiresAt, cost
          ]
        );
        return result;
      }
      throw error;
    }
  }

  static async findById(productId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM products WHERE product_id = ?",
      [productId]
    );
    return rows[0];
  }

  static async findBySellerId(sellerId, limit = 50, offset = 0) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [sellerId, limit, offset]
    );
    return rows;
  }

  static async findBySlug(slug) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM products WHERE product_slug = ?",
      [slug]
    );
    return rows[0];
  }

  static async update({ 
    productId, 
    productTitle, 
    productSlug, 
    productDescription, 
    categoryId, 
    price, 
    cost,
    weightKg, 
    stockQuantity, 
    productStatus, 
    isFeatured, 
    isPromoted, 
    locationCityId, 
    metaTitle, 
    metaDescription, 
    productAttributes,
    expiresAt 
  }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `UPDATE products SET 
        product_title = ?, product_slug = ?, product_description = ?, category_id = ?, 
        price = ?, weight_kg = ?, stock_quantity = ?, product_status = ?, 
        is_featured = ?, is_promoted = ?, location_city_id = ?, meta_title = ?, meta_description = ?, 
        product_attributes = ?, updated_at = ?, expires_at = ?, cost = ?
       WHERE product_id = ?`,
      [
        productTitle, productSlug, productDescription, categoryId,
        price, weightKg, stockQuantity, productStatus,
        isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
        productAttributes, new Date(), expiresAt, cost, productId
      ]
    );
    return result.affectedRows;
  }

  static async delete(productId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM products WHERE product_id = ?",
      [productId]
    );
    return result.affectedRows;
  }

  static async updateStatus(productId, status) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE products SET product_status = ?, updated_at = ? WHERE product_id = ?",
      [status, new Date(), productId]
    );
    return result.affectedRows;
  }

  static async incrementViewCount(productId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE products SET view_count = view_count + 1 WHERE product_id = ?",
      [productId]
    );
    return result.affectedRows;
  }

  static async incrementInquiryCount(productId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE products SET inquiry_count = inquiry_count + 1 WHERE product_id = ?",
      [productId]
    );
    return result.affectedRows;
  }

  // Helper method to generate slug from title
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  // Helper method to format product attributes for storage
  static formatProductAttributes(attributes) {
    try {
      return typeof attributes === 'object' ? JSON.stringify(attributes) : attributes;
    } catch (error) {
      console.error('Error formatting product attributes:', error);
      return '{}';
    }
  }

  // Helper method to parse product attributes from storage
  static parseProductAttributes(attributesString) {
    try {
      return attributesString ? JSON.parse(attributesString) : {};
    } catch (error) {
      console.error('Error parsing product attributes:', error);
      return {};
    }
  }

  static async getCostById(productId) {
    const connection = getConnection();
    try {
      const [rows] = await connection.execute(
        "SELECT cost FROM products WHERE product_id = ?",
        [productId]
      );
      return rows[0]?.cost || 0;
    } catch (error) {
      console.error('Error fetching product cost:', error);
      return 0;
    }
  }
}

module.exports = Product;