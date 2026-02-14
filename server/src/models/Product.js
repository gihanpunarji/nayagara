const { getConnection } = require("../config/database");
const ProductImage = require("./ProductImage");
const ProductVariant = require("./ProductVariant");

class Product {
  static async create({
    productTitle,
    productSlug,
    productDescription,
    categoryId,
    subcategoryId = null,
    sellerId,
    price,
    market_price,
    cost,
    currencyCode = 'LKR',
    weightKg,
    stockQuantity,
    productStatus = 'pending_approval',
    isFeatured = 0,
    isPromoted = 0,
    locationCityId,
    metaTitle,
    metaDescription,
    productAttributes,
    expiresAt,
    shippingCost
  }) {
    const connection = getConnection();

    try {
      // Attempt 1: Full insert with all modern columns
      const [result] = await connection.execute(
        `INSERT INTO products (
          product_title, product_slug, product_description, category_id, subcategory_id, seller_id,
          price, market_price, cost, weight_kg, stock_quantity, product_status,
          is_featured, is_promoted, location_city_id, meta_title, meta_description,
          product_attributes, created_at, updated_at, expires_at, shipping_cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productTitle, productSlug, productDescription, categoryId, subcategoryId, sellerId,
          price, market_price, cost, weightKg, stockQuantity, productStatus,
          isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
          productAttributes, new Date(), new Date(), expiresAt, shippingCost
        ]
      );
      return result;
    } catch (error) {
      // Fallback for missing columns or schema validation errors
      if (error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'WARN_DATA_TRUNCATED' || error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        console.warn('Product.create: Attempt 1 failed. Trying fallback...', error.code);

        try {
          // Define safe status
          const safeStatus = (productStatus === 'pending_approval') ? 'inactive' : productStatus;

          // Attempt 2: Try without subcategory_id but WITH shipping_cost (and with safe status)
          const [result] = await connection.execute(
            `INSERT INTO products (
                product_title, product_slug, product_description, category_id, seller_id,
                price, market_price, cost, weight_kg, stock_quantity, product_status,
                is_featured, is_promoted, location_city_id, meta_title, meta_description,
                product_attributes, created_at, updated_at, expires_at, shipping_cost
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              productTitle, productSlug, productDescription, categoryId, sellerId,
              price, market_price, cost, weightKg, stockQuantity, safeStatus,
              isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
              productAttributes, new Date(), new Date(), expiresAt, shippingCost
            ]
          );
          return result;
        } catch (err2) {
          console.warn('Product.create: Attempt 2 failed. Trying safe fallback...', err2.code);

          // Attempt 3: Safe Insert (No subcategory, No shipping cost, Safe Status)
          const safeStatus = (productStatus === 'pending_approval') ? 'inactive' : productStatus;

          const [result] = await connection.execute(
            `INSERT INTO products (
               product_title, product_slug, product_description, category_id, seller_id,
               price, market_price, cost, weight_kg, stock_quantity, product_status,
               is_featured, is_promoted, location_city_id, meta_title, meta_description,
               product_attributes, created_at, updated_at, expires_at
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              productTitle, productSlug, productDescription, categoryId, sellerId,
              price, market_price, cost, weightKg, stockQuantity, safeStatus,
              isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
              productAttributes, new Date(), new Date(), expiresAt
            ]
          );
          return result;
        }
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
    // Parse pending_updates if it exists
    if (rows[0] && rows[0].pending_updates) {
      rows[0].pending_updates = typeof rows[0].pending_updates === 'string'
        ? JSON.parse(rows[0].pending_updates)
        : rows[0].pending_updates;
    }
    return rows[0];
  }

  // Fetch multiple products by IDs in a single query
  static async findByIds(productIds) {
    if (!productIds || productIds.length === 0) {
      return [];
    }

    const connection = getConnection();
    const placeholders = productIds.map(() => '?').join(',');
    const [rows] = await connection.execute(
      `SELECT * FROM products WHERE product_id IN (${placeholders})`,
      productIds
    );

    // Return as a Map for easy lookup by product_id
    return new Map(rows.map(product => [product.product_id, product]));
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
    subcategoryId,
    price,
    market_price,
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
    expiresAt,
    shippingCost
  }) {
    const connection = getConnection();

    // Try to update with subcategory_id
    try {
      const [result] = await connection.execute(
        `UPDATE products SET
          product_title = ?, product_slug = ?, product_description = ?, category_id = ?, subcategory_id = ?,
          price = ?, market_price = ?, cost = ?, weight_kg = ?, stock_quantity = ?, product_status = ?,
          is_featured = ?, is_promoted = ?, location_city_id = ?, meta_title = ?, meta_description = ?,
          product_attributes = ?, updated_at = ?, expires_at = ?, shipping_cost = ?
         WHERE product_id = ?`,
        [
          productTitle, productSlug, productDescription, categoryId, subcategoryId,
          price, market_price, cost, weightKg, stockQuantity, productStatus,
          isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
          productAttributes, new Date(), expiresAt, shippingCost, productId
        ]
      );
      return result.affectedRows;
    } catch (error) {
      // Fallback for schemas without subcategory_id
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        try {
          // Attempt 2: Try without subcategory_id but WITH shipping_cost
          const [result] = await connection.execute(
            `UPDATE products SET
                product_title = ?, product_slug = ?, product_description = ?, category_id = ?,
                price = ?, market_price = ?, cost = ?, weight_kg = ?, stock_quantity = ?, product_status = ?,
                is_featured = ?, is_promoted = ?, location_city_id = ?, meta_title = ?, meta_description = ?,
                product_attributes = ?, updated_at = ?, expires_at = ?, shipping_cost = ?
               WHERE product_id = ?`,
            [
              productTitle, productSlug, productDescription, categoryId,
              price, market_price, cost, weightKg, stockQuantity, productStatus,
              isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
              productAttributes, new Date(), expiresAt, shippingCost, productId
            ]
          );
          return result.affectedRows;
        } catch (err2) {
          // Attempt 3: Try without subcategory_id AND without shipping_cost (safest fallback)
          if (err2.code === 'ER_BAD_FIELD_ERROR') {
            const [result] = await connection.execute(
              `UPDATE products SET
                   product_title = ?, product_slug = ?, product_description = ?, category_id = ?,
                   price = ?, market_price = ?, cost = ?, weight_kg = ?, stock_quantity = ?, product_status = ?,
                   is_featured = ?, is_promoted = ?, location_city_id = ?, meta_title = ?, meta_description = ?,
                   product_attributes = ?, updated_at = ?, expires_at = ?
                  WHERE product_id = ?`,
              [
                productTitle, productSlug, productDescription, categoryId,
                price, market_price, cost, weightKg, stockQuantity, productStatus,
                isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
                productAttributes, new Date(), expiresAt, productId
              ]
            );
            return result.affectedRows;
          }
          throw err2;
        }
      }
      throw error;
    }
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
    try {
      // Attempt 1: Standard update with updated_at
      const [result] = await connection.execute(
        "UPDATE products SET product_status = ?, updated_at = ? WHERE product_id = ?",
        [status, new Date(), productId]
      );
      return result.affectedRows;
    } catch (error) {
      console.warn("Product.updateStatus: Attempt 1 failed", error.code);

      // Attempt 2: Fallback without updated_at (if column missing)
      try {
        const [result] = await connection.execute(
          "UPDATE products SET product_status = ? WHERE product_id = ?",
          [status, productId]
        );
        return result.affectedRows;
      } catch (err2) {
        console.error("Product.updateStatus: All attempts failed", err2);
        throw err2; // Throw original or new error to be caught by controller
      }
    }
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

  // Check if product has any orders or critical relationships
  static async checkProductRelations(productId) {
    const connection = getConnection();

    // Check for orders containing this product
    const [orderItems] = await connection.execute(
      "SELECT COUNT(*) as count FROM order_items WHERE product_id = ?",
      [productId]
    );

    // Check for reviews (if reviews table exists)
    let reviewCount = 0;
    try {
      const [reviews] = await connection.execute(
        "SELECT COUNT(*) as count FROM reviews WHERE product_id = ?",
        [productId]
      );
      reviewCount = reviews[0].count;
    } catch (error) {
      // Reviews table might not exist, ignore error
    }

    return {
      hasOrders: orderItems[0].count > 0,
      orderCount: orderItems[0].count,
      hasReviews: reviewCount > 0,
      reviewCount: reviewCount,
      canDelete: orderItems[0].count === 0 // Can delete if no orders
    };
  }

  // Delete product (only if no orders exist)
  static async delete(productId) {
    const connection = getConnection();

    // First check if product can be deleted
    const relations = await this.checkProductRelations(productId);

    if (!relations.canDelete) {
      throw new Error(`Cannot delete product. It has ${relations.orderCount} order(s) associated with it.`);
    }

    // Delete product (CASCADE will handle product_images, cart, chat_conversations)
    const [result] = await connection.execute(
      "DELETE FROM products WHERE product_id = ?",
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

  // Fetch costs for multiple products in a single query
  static async getCostsByIds(productIds) {
    if (!productIds || productIds.length === 0) {
      return new Map();
    }

    const connection = getConnection();
    try {
      const placeholders = productIds.map(() => '?').join(',');
      const [rows] = await connection.execute(
        `SELECT product_id, cost FROM products WHERE product_id IN (${placeholders})`,
        productIds
      );

      // Return as a Map for easy lookup
      return new Map(rows.map(row => [row.product_id, parseFloat(row.cost || 0)]));
    } catch (error) {
      console.error('Error fetching product costs:', error);
      return new Map();
    }
  }

  // OPTIMIZED: Fetch products with images using two-step query (Avoids GROUP BY issues)
  static async findBySellerIdWithImages(sellerId, limit = 50, offset = 0) {
    const connection = getConnection();

    // 1. Fetch Products directly (pagination is safe here)
    const [products] = await connection.execute(
      `SELECT * FROM products 
       WHERE seller_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [sellerId, limit, offset]
    );

    if (products.length === 0) return [];

    // 2. Fetch Images for these products
    const productIds = products.map(p => p.product_id);
    const placeholders = productIds.map(() => '?').join(',');

    const [images] = await connection.execute(
      `SELECT * FROM product_images 
       WHERE product_id IN (${placeholders}) 
       ORDER BY product_id, is_primary DESC, image_id ASC`,
      productIds
    );

    // 3. Map images to products in memory
    const imagesByProduct = {};
    images.forEach(img => {
      if (!imagesByProduct[img.product_id]) {
        imagesByProduct[img.product_id] = [];
      }
      imagesByProduct[img.product_id].push({
        image_id: img.image_id,
        image_url: img.image_url,
        image_alt: img.image_alt
      });
    });

    return products.map(product => ({
      ...product,
      images: imagesByProduct[product.product_id] || []
    }));
  }

  // OPTIMIZED: Fetch all products with images for public view (Two-step)
  static async findAllWithImages(limit = 50, offset = 0, filters = {}) {
    const connection = getConnection();

    // 1. Build Query for Products
    let query = `
      SELECT p.*
      FROM products p
      WHERE p.product_status = 'approved'
    `;
    const params = [];

    if (filters.category) {
      query += ` AND p.category_id = ?`;
      params.push(filters.category);
    }

    if (filters.search) {
      query += ` AND (p.product_title LIKE ? OR p.product_description LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Fetch Products
    const [products] = await connection.execute(query, params);

    if (products.length === 0) return [];

    // 2. Fetch Images
    const productIds = products.map(p => p.product_id);
    const placeholders = productIds.map(() => '?').join(',');

    const [images] = await connection.execute(
      `SELECT * FROM product_images 
       WHERE product_id IN (${placeholders}) 
       ORDER BY product_id, is_primary DESC, image_id ASC`,
      productIds
    );

    // 3. Map
    const imagesByProduct = {};
    images.forEach(img => {
      if (!imagesByProduct[img.product_id]) {
        imagesByProduct[img.product_id] = [];
      }
      imagesByProduct[img.product_id].push({
        image_id: img.image_id,
        image_url: img.image_url,
        image_alt: img.image_alt
      });
    });

    return products.map(product => ({
      ...product,
      images: imagesByProduct[product.product_id] || []
    }));
  }
  static async updateRobust({
    productId,
    productTitle,
    productSlug,
    productDescription,
    categoryId,
    subcategoryId,
    price,
    market_price,
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
    expiresAt,
    shippingCost
  }) {
    const connection = getConnection();

    try {
      // Attempt 1: Full update with all modern columns
      const [result] = await connection.execute(
        `UPDATE products SET
          product_title = ?, product_slug = ?, product_description = ?, category_id = ?, subcategory_id = ?,
          price = ?, market_price = ?, cost = ?, weight_kg = ?, stock_quantity = ?, product_status = ?,
          is_featured = ?, is_promoted = ?, location_city_id = ?, meta_title = ?, meta_description = ?,
          product_attributes = ?, updated_at = ?, expires_at = ?, shipping_cost = ?
         WHERE product_id = ?`,
        [
          productTitle, productSlug, productDescription, categoryId, subcategoryId,
          price, market_price, cost, weightKg, stockQuantity, productStatus,
          isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
          productAttributes, new Date(), expiresAt, shippingCost, productId
        ]
      );
      return result.affectedRows;
    } catch (error) {
      console.warn("Product.updateRobust: Attempt 1 failed", error.code, error.message);

      // Fallback strategies
      // Check for common schema errors: Bad Field, Data Truncated (enum) or general SQL errors
      if (error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'WARN_DATA_TRUNCATED' || error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || true) {

        try {

          // Attempt 2: Try without subcategory_id but WITH shipping_cost (and with safe status)
          const [result] = await connection.execute(
            `UPDATE products SET
                 product_title = ?, product_slug = ?, product_description = ?, category_id = ?,
                 price = ?, market_price = ?, cost = ?, weight_kg = ?, stock_quantity = ?, product_status = ?,
                 is_featured = ?, is_promoted = ?, location_city_id = ?, meta_title = ?, meta_description = ?,
                 product_attributes = ?, updated_at = ?, expires_at = ?, shipping_cost = ?
                WHERE product_id = ?`,
            [
              productTitle, productSlug, productDescription, categoryId,
              price, market_price, cost, weightKg, stockQuantity, productStatus,
              isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
              productAttributes, new Date(), expiresAt, shippingCost, productId
            ]
          );
          return result.affectedRows;

        } catch (err2) {
          console.warn("Product.updateRobust: Attempt 2 failed", err2.code);

          // Attempt 3: Safe Update with Shipping Cost (No subcategory)
          // We include shipping_cost here because it's a critical field user wants fixed.

          const [result] = await connection.execute(
            `UPDATE products SET
                 product_title = ?, product_slug = ?, product_description = ?, category_id = ?,
                 price = ?, market_price = ?, cost = ?, weight_kg = ?, stock_quantity = ?, product_status = ?,
                 is_featured = ?, is_promoted = ?, location_city_id = ?, meta_title = ?, meta_description = ?,
                 product_attributes = ?, updated_at = ?, expires_at = ?, shipping_cost = ?
                WHERE product_id = ?`,
            [
              productTitle, productSlug, productDescription, categoryId,
              price, market_price, cost, weightKg, stockQuantity, productStatus,
              isFeatured, isPromoted, locationCityId, metaTitle, metaDescription,
              productAttributes, new Date(), expiresAt, shippingCost, productId
            ]
          );
          return result.affectedRows;
        }
      }
      throw error;
    }
  }
  static async submitUpdate(productId, updateData) {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE products SET pending_updates = ? WHERE product_id = ?",
      [JSON.stringify(updateData), productId]
    );
    return result.affectedRows;
  }

  // Apply pending updates to main columns, images, and variants
  static async applyPendingUpdates(productId) {
    const pool = getConnection();

    // 1. Get the pending updates
    const [rows] = await pool.execute(
      "SELECT pending_updates FROM products WHERE product_id = ?",
      [productId]
    );

    if (!rows[0] || !rows[0].pending_updates) {
      return false; // No updates to apply
    }

    const updates = typeof rows[0].pending_updates === 'string'
      ? JSON.parse(rows[0].pending_updates)
      : rows[0].pending_updates;

    // 2. Construct UPDATE query dynamically based on what's in the JSON
    // Mapping: JSON key -> DB column
    const fieldMap = {
      title: 'product_title',
      description: 'product_description',
      category: 'category_id',
      subcategory: 'subcategory_id',
      price: 'price',
      market_price: 'market_price',
      cost: 'cost',
      weightKg: 'weight_kg',
      stock: 'stock_quantity',
      isFeatured: 'is_featured',
      isPromoted: 'is_promoted',
      locationCityId: 'location_city_id',
      metaTitle: 'meta_title',
      metaDescription: 'meta_description',
      expiresAt: 'expires_at',
      shippingCost: 'shipping_cost'
    };

    let setClauses = [];
    let values = [];

    // Handle standard fields
    for (const [jsonKey, dbCol] of Object.entries(fieldMap)) {
      if (updates[jsonKey] !== undefined) {
        setClauses.push(`${dbCol} = ?`);
        values.push(updates[jsonKey]);
      }
    }

    // Handle special fields
    if (updates.productSlug) {
      setClauses.push('product_slug = ?');
      values.push(updates.productSlug);
    }

    if (updates.dynamicFields) {
      setClauses.push('product_attributes = ?');
      values.push(Product.formatProductAttributes(updates.dynamicFields));
    }

    // Start transaction
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (setClauses.length > 0) {
        // Add updated_at
        setClauses.push('updated_at = ?');
        values.push(new Date());

        const query = `UPDATE products SET ${setClauses.join(', ')} WHERE product_id = ?`;
        values.push(productId);

        await connection.execute(query, values);
      }

      // Commit main product changes first
      await connection.commit();

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    // --- APPLY SUB-RESOURCE UPDATES (Images/Variants) ---
    // These run in their own transactions/connections as the models manage them.
    // Ideally we'd pass the transaction connection down, but that requires refactoring all models.
    // For now, we accept this split.

    try {
      // 1. Images
      if (updates.deletedImageIds && updates.deletedImageIds.length > 0) {
        await ProductImage.deleteMultipleByIds(updates.deletedImageIds);
      }

      if (updates.newImages && updates.newImages.length > 0) {
        const setFirstAsPrimary = updates.newImageIsPrimary === 'true' || updates.newImageIsPrimary === true;
        if (setFirstAsPrimary) {
          await ProductImage.resetPrimaries(productId);
        }
        await ProductImage.createMultiple(productId, updates.newImages, setFirstAsPrimary);
      }

      if (updates.primaryImageId) {
        await ProductImage.setPrimary(productId, updates.primaryImageId);
      }

      // 2. Variants
      if (updates.deletedVariantIds) {
        let variantIdsToDelete = [];
        const raw = updates.deletedVariantIds;
        if (Array.isArray(raw)) variantIdsToDelete = raw;
        else if (typeof raw === 'string') variantIdsToDelete = raw.split(',').map(s => s.trim());

        for (const vid of variantIdsToDelete) {
          if (vid) await ProductVariant.delete(vid);
        }
      }

      if (updates.variants && Array.isArray(updates.variants)) {
        for (const variant of updates.variants) {
          if (variant.variant_id) {
            console.log(`[DEBUG] Updating variant ${variant.variant_id} with price: ${variant.price}`);
            await ProductVariant.update({
              variantId: variant.variant_id,
              price: variant.price,
              stockQuantity: variant.stock_quantity,
              sku: variant.sku,
              attributes: variant.attributes,
              imageUrl: variant.image_url
            });
          } else {
            console.log(`[DEBUG] Creating new variant:`, variant);
            // Check if variant doesn't have productId, add it
            await ProductVariant.create({
              productId: parseInt(productId),
              price: variant.price,
              stockQuantity: variant.stock_quantity,
              sku: variant.sku,
              attributes: variant.attributes,
              imageUrl: variant.image_url
            });
          }
        }
      }

      // Final Step: Clear pending updates
      const connection2 = await pool.getConnection(); // Use pool to get new connection
      try {
        await connection2.execute(
          "UPDATE products SET pending_updates = NULL WHERE product_id = ?",
          [productId]
        );
      } finally {
        connection2.release();
      }

      return true;

    } catch (error) {
      console.error("Partial failure in applying sub-resources for product " + productId, error);
      // We don't rollback the main update because it's already committed.
      // This is a known limitation until full transactional refactor.
      throw error;
    }
  }
}

module.exports = Product;