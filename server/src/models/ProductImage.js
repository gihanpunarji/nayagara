const { getConnection } = require("../config/database");

class ProductImage {
  static async create({ productId, imageUrl, imageAlt, isPrimary = 0 }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO product_images (product_id, image_url, image_alt, is_primary) VALUES (?, ?, ?, ?)",
      [productId, imageUrl, imageAlt, isPrimary]
    );
    return result;
  }

  static async createMultiple(productId, images) {
    const connection = getConnection();
    
    // Prepare bulk insert
    const values = images.map((image, index) => [
      productId, 
      image.imageUrl, 
      image.imageAlt || '', 
      index === 0 ? 1 : 0 // First image is primary
    ]);

    if (values.length === 0) return { insertId: null, affectedRows: 0 };

    const placeholders = values.map(() => "(?, ?, ?, ?)").join(", ");
    const flatValues = values.flat();

    const [result] = await connection.execute(
      `INSERT INTO product_images (product_id, image_url, image_alt, is_primary) VALUES ${placeholders}`,
      flatValues
    );
    return result;
  }

  static async findByProductId(productId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, image_id ASC",
      [productId]
    );
    return rows;
  }

  static async findById(imageId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM product_images WHERE image_id = ?",
      [imageId]
    );
    return rows[0];
  }

  static async findPrimaryByProductId(productId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM product_images WHERE product_id = ? AND is_primary = 1",
      [productId]
    );
    return rows[0];
  }

  static async update({ imageId, imageUrl, imageAlt, isPrimary }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE product_images SET image_url = ?, image_alt = ?, is_primary = ? WHERE image_id = ?",
      [imageUrl, imageAlt, isPrimary, imageId]
    );
    return result.affectedRows;
  }

  static async delete(imageId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM product_images WHERE image_id = ?",
      [imageId]
    );
    return result.affectedRows;
  }

  static async deleteByProductId(productId) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM product_images WHERE product_id = ?",
      [productId]
    );
    return result.affectedRows;
  }

  static async setPrimary(productId, imageId) {
    const connection = getConnection();
    
    // Start transaction
    await connection.execute("START TRANSACTION");
    
    try {
      // First, set all images for this product as non-primary
      await connection.execute(
        "UPDATE product_images SET is_primary = 0 WHERE product_id = ?",
        [productId]
      );
      
      // Then set the specified image as primary
      await connection.execute(
        "UPDATE product_images SET is_primary = 1 WHERE image_id = ? AND product_id = ?",
        [imageId, productId]
      );
      
      await connection.execute("COMMIT");
      return true;
    } catch (error) {
      await connection.execute("ROLLBACK");
      throw error;
    }
  }

  static async reorderImages(productId, imageIds) {
    const connection = getConnection();
    
    // Start transaction
    await connection.execute("START TRANSACTION");
    
    try {
      // Reset all images to non-primary first
      await connection.execute(
        "UPDATE product_images SET is_primary = 0 WHERE product_id = ?",
        [productId]
      );
      
      // Set the first image as primary
      if (imageIds.length > 0) {
        await connection.execute(
          "UPDATE product_images SET is_primary = 1 WHERE image_id = ? AND product_id = ?",
          [imageIds[0], productId]
        );
      }
      
      await connection.execute("COMMIT");
      return true;
    } catch (error) {
      await connection.execute("ROLLBACK");
      throw error;
    }
  }

  static async getImageCount(productId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM product_images WHERE product_id = ?",
      [productId]
    );
    return rows[0].count;
  }

  // Helper method to generate image URL
  static generateImageUrl(filename) {
    return `/uploads/products/${filename}`;
  }

  // Helper method to extract filename from URL
  static extractFilename(imageUrl) {
    return imageUrl.split('/').pop();
  }
}

module.exports = ProductImage;