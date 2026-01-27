const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const User = require("../models/User");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const {
      title,
      description,
      price,
      market_price,
      cost,
      category,
      subcategory,
      stock,
      dynamicFields,
      weightKg,
      locationCityId,
      metaTitle,
      metaDescription,
      expiresAt,
      shippingCost
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !market_price || !category || !subcategory || !stock || !cost) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, market_price, category, subcategory, stock and cost are required"
      });
    }

    // Check if user is a seller
    const user = await User.findById(sellerId);
    if (!user || user.user_type !== 'seller') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not a seller account."
      });
    }

    // Generate slug from title
    const baseSlug = Product.generateSlug(title);
    let productSlug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await Product.findBySlug(productSlug)) {
      productSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Prepare product attributes (dynamic fields)
    const productAttributes = Product.formatProductAttributes(dynamicFields || {});

    // Calculate expires at (default 30 days from now if not provided)
    const expirationDate = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create product
    const productResult = await Product.create({
      productTitle: title,
      productSlug: productSlug,
      productDescription: description,
      categoryId: category, // Using main category as the category_id
      subcategoryId: subcategory, // Store subcategory separately
      sellerId: sellerId,
      price: parseFloat(price),
      market_price: parseFloat(market_price),
      cost: parseFloat(cost),
      currencyCode: 'LKR',
      weightKg: weightKg ? parseFloat(weightKg) : null,
      stockQuantity: parseInt(stock),
      productStatus: 'pending_approval', // All products start as pending approval
      isFeatured: 0,
      isPromoted: 0,
      locationCityId: locationCityId || null,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160),
      productAttributes: productAttributes,
      expiresAt: expirationDate,
      shippingCost: shippingCost ? parseFloat(shippingCost) : 0
    });

    const productId = productResult.insertId;

    // Handle image uploads if any
    if (req.files && req.files.length > 0) {
      const imageData = req.files.map((file, index) => ({
        imageUrl: file.path, // Now contains the full Cloudinary URL
        imageAlt: `${title} - Image ${index + 1}`
      }));

      await ProductImage.createMultiple(productId, imageData);
    }

    // Get the created product with images
    const createdProduct = await Product.findById(productId);
    const productImages = await ProductImage.findByProductId(productId);

    res.status(201).json({
      success: true,
      message: "Product created successfully and submitted for admin approval. It will be visible on the website once approved.",
      data: {
        product: {
          ...createdProduct,
          product_attributes: Product.parseProductAttributes(createdProduct.product_attributes)
        },
        images: productImages
      }
    });

  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get seller's products with search and filtering
const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const {
      page = 1,
      limit = 50,
      search,
      status,
      category,
      sort = 'newest'
    } = req.query;

    const offset = (page - 1) * limit;

    // If no filters are applied, use the optimized method
    if (!search && (!status || status === 'all') && !category && sort === 'newest') {
      // OPTIMIZED: Single query with JOIN instead of N+1
      const productsWithImages = await Product.findBySellerIdWithImages(sellerId, parseInt(limit), offset);

      const formattedProducts = productsWithImages.map(product => ({
        ...product,
        product_attributes: Product.parseProductAttributes(product.product_attributes),
        images: product.images
      }));

      return res.json({
        success: true,
        message: "Products fetched successfully",
        data: formattedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: formattedProducts.length
        }
      });
    }

    // For filtered queries, use custom SQL
    const { getConnection } = require("../config/database");
    const connection = getConnection();

    // OPTIMIZED: Add images to the JOIN query to avoid N+1
    let query = `
      SELECT p.*,
             c.category_name,
             sc.sub_category_name,
             GROUP_CONCAT(
               JSON_OBJECT(
                 'image_id', pi.image_id,
                 'image_url', pi.image_url,
                 'image_alt', pi.image_alt
               ) ORDER BY pi.is_primary DESC, pi.image_id ASC
             ) as images_json
      FROM products p
      LEFT JOIN sub_categories sc ON p.category_id = sc.sub_category_id
      LEFT JOIN categories c ON sc.categories_category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      WHERE p.seller_id = ?
    `;
    const queryParams = [sellerId];

    // Add search filter
    if (search && search.trim()) {
      query += ` AND (p.product_title LIKE ? OR p.product_description LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Add status filter
    if (status && status !== 'all') {
      if (status === 'out_of_stock') {
        query += ` AND p.stock_quantity = 0`;
      } else {
        query += ` AND p.product_status = ?`;
        queryParams.push(status);
      }
    }

    // Add category filter
    if (category && category.trim()) {
      query += ` AND c.category_name = ?`;
      queryParams.push(category.trim());
    }

    // GROUP BY is required when using GROUP_CONCAT
    query += ` GROUP BY p.product_id`;

    // Add sorting
    switch (sort) {
      case 'oldest':
        query += ` ORDER BY p.created_at ASC`;
        break;
      case 'price_high':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'price_low':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'most_viewed':
        query += ` ORDER BY p.view_count DESC`;
        break;
      case 'best_selling':
        query += ` ORDER BY p.inquiry_count DESC`;
        break;
      case 'newest':
      default:
        query += ` ORDER BY p.created_at DESC`;
        break;
    }

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), offset);

    const [products] = await connection.execute(query, queryParams);

    // OPTIMIZED: Parse images from JSON instead of separate queries
    const productsWithImages = products.map(product => ({
      ...product,
      product_attributes: Product.parseProductAttributes(product.product_attributes),
      images: product.images_json ? JSON.parse(`[${product.images_json}]`) : []
    }));

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: productsWithImages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: productsWithImages.length
      }
    });

  } catch (error) {
    console.error("Get seller products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.user_id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if the product belongs to the seller
    if (product.seller_id !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Product does not belong to you."
      });
    }

    // Get product images
    const images = await ProductImage.findByProductId(productId);

    res.json({
      success: true,
      message: "Product fetched successfully",
      data: {
        product: {
          ...product,
          product_attributes: Product.parseProductAttributes(product.product_attributes)
        },
        images: images
      }
    });

  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.user_id;
    const {
      title,
      description,
      price,
      market_price,
      cost,
      stock,
      dynamicFields,
      weightKg,
      locationCityId,
      metaTitle,
      metaDescription,
      expiresAt,
      shippingCost,
      category,
      subcategory,
      productStatus,
      deletedImageIds
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !market_price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, market_price, and stock are required"
      });
    }

    // Check if product exists and belongs to seller
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (existingProduct.seller_id !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Product does not belong to you."
      });
    }

    // --- CHANGE DETECTION LOGIC ---
    let hasContentChanged = false;

    // Helper to compare values safely
    const hasChanged = (val1, val2) => {
      // Handle null/undefined vs empty string
      const v1 = val1 === null || val1 === undefined ? '' : String(val1).trim();
      const v2 = val2 === null || val2 === undefined ? '' : String(val2).trim();
      return v1 !== v2;
    };

    // 1. Direct Field Comparison
    if (
      hasChanged(title, existingProduct.product_title) ||
      hasChanged(description, existingProduct.product_description) ||
      parseFloat(price) !== parseFloat(existingProduct.price) ||
      parseFloat(market_price) !== parseFloat(existingProduct.market_price) ||
      parseFloat(cost) !== parseFloat(existingProduct.cost) ||
      // category/subcategory might be strings or ints
      (category && String(category) !== String(existingProduct.category_id)) ||
      (subcategory && String(subcategory) !== String(existingProduct.subcategory_id)) ||
      (weightKg && parseFloat(weightKg) !== parseFloat(existingProduct.weight_kg)) ||
      (shippingCost && parseFloat(shippingCost) !== parseFloat(existingProduct.shipping_cost))
    ) {
      hasContentChanged = true;
      console.log(`Product ${productId}: Content fields changed.`);
    }

    // 2. Image Changes
    // Check for NEW images
    if (req.files && req.files.length > 0) {
      hasContentChanged = true;
      console.log(`Product ${productId}: New images uploaded.`);
    }

    // Check for DELETED images
    let idsToDelete = [];
    if (deletedImageIds) {
      try {
        if (typeof deletedImageIds === 'string') {
          // Try parsing JSON first
          try {
            const parsed = JSON.parse(deletedImageIds);
            if (Array.isArray(parsed)) idsToDelete = parsed;
            else idsToDelete = [String(deletedImageIds)];
          } catch (e) {
            // If not JSON, assume comma-separated or single ID
            if (deletedImageIds.includes(',')) {
              idsToDelete = deletedImageIds.split(',').map(id => id.trim());
            } else {
              idsToDelete = [deletedImageIds.trim()];
            }
          }
        } else if (Array.isArray(deletedImageIds)) {
          idsToDelete = deletedImageIds;
        } else {
          // Fallback
          idsToDelete = [String(deletedImageIds)];
        }
        
        // Filter out empty/invalid IDs
        idsToDelete = idsToDelete.filter(id => id && String(id).trim() !== '' && !String(id).includes('image-'));

        if (idsToDelete.length > 0) {
          hasContentChanged = true;
          console.log(`Product ${productId}: Images marked for deletion:`, idsToDelete);
        }
      } catch (e) {
        console.error("Error parsing deletedImageIds:", e);
      }
    }

    // --- STATUS ENFORCEMENT ---
    let finalStatus = existingProduct.product_status;

    if (hasContentChanged) {
      // IF content changed -> Force 'pending_approval'
      // UNLESS: The seller EXPLICITLY set it to 'inactive' to hide it.
      // Prioritize safety: If they strictly want to hide it, let them.
      if (productStatus === 'inactive') {
        finalStatus = 'inactive';
      } else {
        finalStatus = 'pending_approval';
      }
    } else {
      // IF NO content change -> Allow status toggle (Active <-> Inactive)
      // BUT: If it was 'pending_approval', do NOT allow 'active' (admin hasn't approved yet)
      if (productStatus) {
        if (existingProduct.product_status === 'pending_approval' && productStatus === 'active') {
          // Trying to activate unapproved product -> Keep pending
          finalStatus = 'pending_approval';
        } else {
          // Allow normal toggle
          finalStatus = productStatus;
        }
      }
    }
    
    console.log(`Product ${productId}: Status Update - Old: ${existingProduct.product_status}, Requested: ${productStatus}, Final: ${finalStatus}`);


    // Generate new slug if title changed
    let productSlug = existingProduct.product_slug;
    if (title !== existingProduct.product_title) {
      const baseSlug = Product.generateSlug(title);
      productSlug = baseSlug;
      let counter = 1;

      // Ensure slug is unique (exclude current product)
      while (true) {
        const existingSlugProduct = await Product.findBySlug(productSlug);
        if (!existingSlugProduct || existingSlugProduct.product_id === parseInt(productId)) {
          break;
        }
        productSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Prepare product attributes (dynamic fields)
    const productAttributes = Product.formatProductAttributes(dynamicFields || {});

    // Calculate expires at
    const expirationDate = expiresAt ? new Date(expiresAt) : existingProduct.expires_at;

    // Handle deleted images FIRST
    if (idsToDelete.length > 0) {
       await ProductImage.deleteMultipleByIds(idsToDelete);
    }

    // Update product
    const affectedRows = await Product.updateRobust({
      productId: parseInt(productId),
      productTitle: title,
      productSlug: productSlug,
      productDescription: description,
      categoryId: category || existingProduct.category_id,
      subcategoryId: subcategory || existingProduct.subcategory_id,
      price: parseFloat(price),
      market_price: parseFloat(market_price),
      cost: parseFloat(cost),
      currencyCode: existingProduct.currency_code || 'LKR',
      weightKg: weightKg ? parseFloat(weightKg) : existingProduct.weight_kg,
      stockQuantity: parseInt(stock),
      productStatus: finalStatus,
      isFeatured: existingProduct.is_featured,
      isPromoted: existingProduct.is_promoted,
      locationCityId: locationCityId || existingProduct.location_city_id,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160),
      productAttributes: productAttributes,
      expiresAt: expirationDate,
      shippingCost: shippingCost ? parseFloat(shippingCost) : 0
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no changes made"
      });
    }

    // Handle Main Image Logic (New vs Existing)
    // 1. If user set a NEW image as primary, we must reset existing primaries first.
    if (req.body.newImageIsPrimary === 'true') {
      await ProductImage.resetPrimaries(productId);
    }

    // Handle new image uploads if any
    if (req.files && req.files.length > 0) {
      const imageData = req.files.map((file, index) => ({
        imageUrl: file.path,
        imageAlt: `${title} - Image ${index + 1}`
      }));

      // Only set first as primary if user explicitly requested it (via newImageIsPrimary flag)
      // For updates, this prevents overriding an existing primary image
      const setFirstAsPrimary = req.body.newImageIsPrimary === 'true';
      await ProductImage.createMultiple(productId, imageData, setFirstAsPrimary);
    }

    // 2. If user set an EXISTING image as primary, we force it here.
    if (req.body.primaryImageId) {
      await ProductImage.setPrimary(productId, req.body.primaryImageId);
    }

    // Get the updated product with images
    const updatedProduct = await Product.findById(productId);
    const productImages = await ProductImage.findByProductId(productId);

    res.json({
      success: true,
      message: hasContentChanged 
        ? "Product updated and submitted for approval." 
        : "Product status updated successfully.",
      data: {
        product: {
          ...updatedProduct,
          product_attributes: Product.parseProductAttributes(updatedProduct.product_attributes)
        },
        images: productImages
      }
    });

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Get public products for customer views (no authentication required)
const getPublicProducts = async (req, res) => {
  const { getConnection } = require("../config/database");
  const Product = require("../models/Product"); // Move requires to top of function or file if possible, but keeping scope is okay if needed. Better to rely on existing requires if available.

  const pool = getConnection();
  let connection;
  try {
    connection = await pool.getConnection();
    const {
      page = 1,
      limit = 12,
      search,
      category,
      subcategory,
      sort = 'newest',
      featured = false,
      priceMin,
      priceMax
    } = req.query;

    const offset = (page - 1) * limit;

    let whereClause = ` WHERE p.product_status = 'active'`;
    const queryParams = [];

    // Add search filter
    if (search && search.trim()) {
      whereClause += ` AND (p.product_title LIKE ? OR p.product_description LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Add category filter
    if (category && category.trim() && category !== 'all') {
      whereClause += ` AND (c.category_slug = ? OR c.category_name = ?)`;
      queryParams.push(category.trim(), category.trim());
    }

    // Add subcategory filter
    if (subcategory && subcategory.trim()) {
      whereClause += ` AND sc.sub_category_id = ?`;
      queryParams.push(parseInt(subcategory.trim()));
    }

    // Add featured filter
    if (featured === 'true') {
      whereClause += ` AND p.is_featured = 1`;
    }

    // Add seller filter
    if (req.query.seller) {
      whereClause += ` AND p.seller_id = ?`;
      queryParams.push(req.query.seller);
    }

    // Add price range filter
    if (priceMin && !isNaN(priceMin)) {
      whereClause += ` AND p.price >= ?`;
      queryParams.push(parseFloat(priceMin));
    }

    if (priceMax && !isNaN(priceMax)) {
      whereClause += ` AND p.price <= ?`;
      queryParams.push(parseFloat(priceMax));
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      ${whereClause}
    `;
    const [countResult] = await connection.execute(countQuery, queryParams);
    const totalProducts = countResult[0].total;

    let query = `
      SELECT p.*, 
             c.category_name,
             c.category_slug,
             sc.sub_category_name,
             u.first_name as seller_first_name,
             u.last_name as seller_last_name,
             c2.city_name as location_city_name,
             d.district_name as location_district_name,
             GROUP_CONCAT(pi.image_url ORDER BY pi.is_primary DESC, pi.image_id ASC SEPARATOR ',') as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      LEFT JOIN users u ON p.seller_id = u.user_id
      LEFT JOIN cities c2 ON p.location_city_id = c2.city_id
      LEFT JOIN districts d ON c2.district_id = d.district_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      ${whereClause}
    `;

    // Add GROUP BY for the image concatenation
    query += ` GROUP BY p.product_id`;

    // Add sorting
    switch (sort) {
      case 'oldest':
        query += ` ORDER BY p.created_at ASC`;
        break;
      case 'price_high':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'price_low':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'most_viewed':
        query += ` ORDER BY p.view_count DESC`;
        break;
      case 'best_selling':
        query += ` ORDER BY p.inquiry_count DESC`;
        break;
      case 'featured':
        query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;
        break;
      case 'newest':
      default:
        query += ` ORDER BY p.created_at DESC`;
        break;
    }

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    const finalQueryParams = [...queryParams, parseInt(limit), offset];

    const [products] = await connection.execute(query, finalQueryParams);

    // Format products using the data we already fetched
    const productsWithImages = products.map((product) => {
      // Process images string back into array
      const images = product.images
        ? product.images.split(',').map(url => ({ image_url: url.trim() }))
        : [];

      return {
        ...product,
        product_attributes: Product.parseProductAttributes(product.product_attributes),
        images: images,
        seller_name: `${product.seller_first_name || ''} ${product.seller_last_name || ''}`.trim()
      };
    });

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: productsWithImages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalProducts,
        totalPages: Math.ceil(totalProducts / limit)
      }
    });

  } catch (error) {
    console.error("Get public products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  } finally {
    if (connection) connection.release();
  }
};

const filterProducts = async (req, res) => {
  // This can use the same logic as getPublicProducts for now
  return getPublicProducts(req, res);
}

// Get public product by ID (no authentication required)
const getPublicProductById = async (req, res) => {
  const { getConnection } = require("../config/database");
  const pool = getConnection();
  let connection;
  try {
    connection = await pool.getConnection();
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Query to get product with all related data
    const query = `
      SELECT 
        p.*,
        c.category_name,
        c.category_slug,
        sc.sub_category_name,
        u.first_name as seller_first_name,
        u.last_name as seller_last_name,
        u.profile_image as seller_avatar,
        u.user_mobile as seller_phone,
        u.user_email as seller_email,
        u.profile_image as seller_image,
        s.store_name,
        c2.city_name as location_city_name,
        d.district_name as location_district_name,
        COALESCE(r.review_count, 0) as review_count,
        COALESCE(r.avg_rating, 0) as average_rating,
        GROUP_CONCAT(pi.image_url ORDER BY pi.is_primary DESC, pi.image_id ASC SEPARATOR ',') as images
      FROM 
        products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
        LEFT JOIN users u ON p.seller_id = u.user_id
        LEFT JOIN store s ON u.user_id = s.user_id
        LEFT JOIN cities c2 ON p.location_city_id = c2.city_id
        LEFT JOIN districts d ON c2.district_id = d.district_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id
        LEFT JOIN (
          SELECT product_id, COUNT(*) as review_count, AVG(rating) as avg_rating
          FROM product_reviews 
          WHERE status = 'active'
          GROUP BY product_id
        ) r ON p.product_id = r.product_id
      WHERE
        p.product_id = ?
        AND p.product_status = 'active'
      GROUP BY p.product_id
    `;

    const [results] = await connection.execute(query, [productId]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = results[0];

    // Get category fields for this product's subcategory to provide field metadata
    let categoryFields = [];
    if (product.category_id) {
      const fieldsQuery = `
        SELECT field_name, field_label, field_type, field_options 
        FROM category_fields 
        WHERE sub_categories_sub_category_id = ?
        ORDER BY field_id
      `;
      const [fieldsResults] = await connection.execute(fieldsQuery, [product.category_id]);
      categoryFields = fieldsResults;
    }

    // Process images
    const images = product.images
      ? product.images.split(',').map(url => ({ image_url: url.trim() }))
      : [];

    // Parse and enhance product attributes with field metadata
    let productAttributes = {};
    try {
      productAttributes = product.product_attributes ? JSON.parse(product.product_attributes) : {};
    } catch (error) {
      console.error('Error parsing product attributes:', error);
      productAttributes = {};
    }

    // Enhance attributes with field metadata
    const enhancedAttributes = categoryFields.map(field => {
      const value = productAttributes[field.field_name] || '';
      let displayValue = value;

      // Format display value based on field type
      if (field.field_type === 'select' && field.field_options) {
        try {
          const options = JSON.parse(field.field_options);
          displayValue = options.includes(value) ? value : value;
        } catch (e) {
          displayValue = value;
        }
      } else if (field.field_type === 'boolean') {
        displayValue = value === '1' || value === 'true' || value === true ? 'Yes' : 'No';
      } else if (field.field_type === 'number' && value) {
        displayValue = parseFloat(value).toLocaleString();
      }

      return {
        field_name: field.field_name,
        field_label: field.field_label,
        field_type: field.field_type,
        value: value,
        display_value: displayValue,
        has_value: value !== '' && value !== null && value !== undefined
      };
    }).filter(attr => attr.has_value); // Only include attributes that have values

    // Format the response
    const formattedProduct = {
      ...product,
      images,
      seller_name: `${product.seller_first_name} ${product.seller_last_name}`,
      price: parseFloat(product.price) || 0,
      created_at: product.created_at,
      updated_at: product.updated_at,
      category_attributes: enhancedAttributes,
      raw_product_attributes: productAttributes // Keep raw attributes for backwards compatibility
    };

    // Remove individual seller name fields
    delete formattedProduct.seller_first_name;
    delete formattedProduct.seller_last_name;

    res.json({
      success: true,
      message: "Product fetched successfully",
      data: formattedProduct
    });

  } catch (error) {
    console.error("Get public product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  } finally {
    if (connection) connection.release();
  }
};

// End of public functions

// Get admin products with advanced filtering (cross-seller)
const getAdminProducts = async (req, res) => {
  const { getConnection } = require("../config/database");
  const pool = getConnection();
  let connection;
  try {
    connection = await pool.getConnection();
    const {
      page = 1,
      limit = 25,
      search,
      status,
      category,
      sellerId,
      sort = 'newest'
    } = req.query;

    const offset = (page - 1) * limit;

    let whereClause = ' WHERE 1=1';
    const queryParams = [];

    // Add search filter
    if (search && search.trim()) {
      whereClause += ` AND (p.product_title LIKE ? OR p.product_description LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add status filter
    if (status && status !== 'all') {
      if (status === 'out_of_stock') {
        whereClause += ` AND p.stock_quantity = 0`;
      } else {
        whereClause += ` AND p.product_status = ?`;
        queryParams.push(status);
      }
    }

    // Add category filter
    if (category && category !== 'all') {
      whereClause += ` AND c.category_name = ?`;
      queryParams.push(category);
    }

    // Add seller filter
    if (sellerId) {
      whereClause += ` AND p.seller_id = ?`;
      queryParams.push(sellerId);
    }

    // Get stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN product_status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN product_status = 'pending_approval' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN product_status = 'suspended' THEN 1 ELSE 0 END) as suspended,
        SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock
      FROM products
    `;
    const [statsResult] = await connection.execute(statsQuery);
    const stats = {
      total: parseInt(statsResult[0].total) || 0,
      active: parseInt(statsResult[0].active) || 0,
      pending: parseInt(statsResult[0].pending) || 0,
      suspended: parseInt(statsResult[0].suspended) || 0,
      featured: parseInt(statsResult[0].featured) || 0,
      out_of_stock: parseInt(statsResult[0].out_of_stock) || 0
    };

    // Get total count for pagination (respecting filters)
    const countQuery = `
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN users u ON p.seller_id = u.user_id
      ${whereClause}
    `;
    const [countResult] = await connection.execute(countQuery, queryParams);
    const total = countResult[0].total;

    let query = `
      SELECT p.*, 
             c.category_name,
             sc.sub_category_name,
             u.first_name as seller_first_name,
             u.last_name as seller_last_name,
             s.store_name,
             GROUP_CONCAT(pi.image_url SEPARATOR ',') as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      LEFT JOIN users u ON p.seller_id = u.user_id
      LEFT JOIN store s ON u.user_id = s.user_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      ${whereClause}
      GROUP BY p.product_id
    `;

    // Add sorting
    switch (sort) {
      case 'oldest':
        query += ` ORDER BY p.created_at ASC`;
        break;
      case 'price_high':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'price_low':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'newest':
      default:
        query += ` ORDER BY p.created_at DESC`;
        break;
    }

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), offset);

    const [products] = await connection.execute(query, queryParams);

    // Format products
    const formattedProducts = products.map(product => {
      const images = product.images
        ? product.images.split(',').map(url => ({ image_url: url.trim() }))
        : [];

      return {
        ...product,
        images,
        seller_name: product.store_name || `${product.seller_first_name || ''} ${product.seller_last_name || ''}`.trim()
      };
    });

    res.json({
      success: true,
      message: "Admin products fetched successfully",
      data: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    });

  } catch (error) {
    console.error("Get admin products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  } finally {
    if (connection) connection.release();
  }
};

// Update product status (Admin only)
// Update product status (Isolated toggle for Sellers)
const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.user_id;
    const { status } = req.body;

    console.log(`[DEBUG] updateProductStatus: productId=${productId}, sellerId=${sellerId}, status=${status}`);

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Only 'active' or 'inactive' allowed."
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check ownership only if not admin
    if (req.user.role !== 'admin' && product.seller_id !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Product does not belong to you."
      });
    }

    // Safety Logic
    // If current status is pending_approval, suspended, or draft
    // Prevent switching to 'active' (Unapproved activation attempt)
    // ADMIN OVERRIDE: Admins can activate from any status
    if (status === 'active' && req.user.role !== 'admin') {
      const restrictedStatuses = ['pending_approval', 'suspended', 'draft'];
      if (restrictedStatuses.includes(product.product_status)) {
        return res.status(403).json({
          success: false,
          message: `Cannot activate product from '${product.product_status}' status. Wait for admin approval.`
        });
      }
    }

    // If allowed, update status
    await Product.updateStatus(productId, status);

    res.json({
      success: true,
      message: `Product ${status === 'active' ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error("Update product status error:", error);
    // DEBUG: Exposing specific error message to client for production debugging
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}` 
    });
  }
};


// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check product relations
    const relations = await Product.checkProductRelations(productId);

    if (!relations.canDelete) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this product. It has ${relations.orderCount} order(s) associated with it. Products with orders cannot be deleted to maintain order history.`,
        data: {
          orderCount: relations.orderCount,
          reviewCount: relations.reviewCount
        }
      });
    }

    // Delete the product
    const affectedRows = await Product.delete(productId);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or already deleted"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

module.exports = {
  createProduct,
  getSellerProducts,
  getProductById,
  updateProduct,
  getPublicProducts,
  filterProducts,
  getPublicProductById,
  getAdminProducts,
  updateProductStatus,
  deleteProduct
}