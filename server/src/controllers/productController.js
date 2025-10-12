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
      category,
      subcategory,
      stock,
      dynamicFields,
      weightKg,
      locationCityId,
      metaTitle,
      metaDescription,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category || !subcategory || !stock) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, category, subcategory, and stock are required"
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
      currencyCode: 'LKR',
      weightKg: weightKg ? parseFloat(weightKg) : null,
      stockQuantity: parseInt(stock),
      productStatus: 'pending', // All products start as pending approval
      isFeatured: 0,
      isPromoted: 0,
      locationCityId: locationCityId || null,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160),
      productAttributes: productAttributes,
      expiresAt: expirationDate
    });

    const productId = productResult.insertId;

    // Handle image uploads if any
    if (req.files && req.files.length > 0) {
      const imageData = req.files.map((file, index) => ({
        imageUrl: ProductImage.generateImageUrl(file.filename),
        imageAlt: `${title} - Image ${index + 1}`
      }));

      await ProductImage.createMultiple(productId, imageData);
    }

    // Get the created product with images
    const createdProduct = await Product.findById(productId);
    const productImages = await ProductImage.findByProductId(productId);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
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

    // If no filters are applied, use the simple method
    if (!search && (!status || status === 'all') && !category && sort === 'newest') {
      const products = await Product.findBySellerId(sellerId, parseInt(limit), offset);

      // Get images for each product
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await ProductImage.findByProductId(product.product_id);
          return {
            ...product,
            product_attributes: Product.parseProductAttributes(product.product_attributes),
            images: images
          };
        })
      );

      return res.json({
        success: true,
        message: "Products fetched successfully",
        data: productsWithImages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: productsWithImages.length
        }
      });
    }

    // For filtered queries, use custom SQL
    const { getConnection } = require("../config/database");
    const connection = getConnection();
    
    let query = `
      SELECT p.*, 
             c.category_name,
             sc.sub_category_name
      FROM products p
      LEFT JOIN sub_categories sc ON p.category_id = sc.sub_category_id
      LEFT JOIN categories c ON sc.categories_category_id = c.category_id
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

    // Get images for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ProductImage.findByProductId(product.product_id);
        return {
          ...product,
          product_attributes: Product.parseProductAttributes(product.product_attributes),
          images: images
        };
      })
    );

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
      stock,
      dynamicFields,
      weightKg,
      locationCityId,
      metaTitle,
      metaDescription,
      expiresAt
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, and stock are required"
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

    // Update product
    const affectedRows = await Product.update({
      productId: parseInt(productId),
      productTitle: title,
      productSlug: productSlug,
      productDescription: description,
      categoryId: existingProduct.category_id, // Keep original category
      price: parseFloat(price),
      currencyCode: existingProduct.currency_code || 'LKR',
      weightKg: weightKg ? parseFloat(weightKg) : existingProduct.weight_kg,
      stockQuantity: parseInt(stock),
      productStatus: existingProduct.product_status, // Keep original status
      isFeatured: existingProduct.is_featured,
      isPromoted: existingProduct.is_promoted,
      locationCityId: locationCityId || existingProduct.location_city_id,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160),
      productAttributes: productAttributes,
      expiresAt: expirationDate
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no changes made"
      });
    }

    // Handle new image uploads if any
    if (req.files && req.files.length > 0) {
      const imageData = req.files.map((file, index) => ({
        imageUrl: ProductImage.generateImageUrl(file.filename),
        imageAlt: `${title} - Image ${index + 1}`
      }));

      await ProductImage.createMultiple(productId, imageData);
    }

    // Get the updated product with images
    const updatedProduct = await Product.findById(productId);
    const productImages = await ProductImage.findByProductId(productId);

    res.json({
      success: true,
      message: "Product updated successfully",
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
      message: "Internal server error"
    });
  }
};

// Get public products for customer views (no authentication required)
const getPublicProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12,
      search,
      category,
      subcategory,
      sort = 'newest',
      featured = false
    } = req.query;
    
    const offset = (page - 1) * limit;
    const { getConnection } = require("../config/database");
    const connection = getConnection();
    
    // First check if any products exist at all
    const [countResult] = await connection.execute("SELECT COUNT(*) as total FROM products");

    let query = `
      SELECT p.*, 
             c.category_name,
             c.category_slug,
             sc.sub_category_name,
             u.first_name as seller_first_name,
             u.last_name as seller_last_name,
             c2.city_name as location_city_name,
             d.district_name as location_district_name,
             GROUP_CONCAT(pi.image_url SEPARATOR ',') as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      LEFT JOIN users u ON p.seller_id = u.user_id
      LEFT JOIN cities c2 ON p.location_city_id = c2.city_id
      LEFT JOIN districts d ON c2.district_id = d.district_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
    `;
    const queryParams = [];

    // Only show products (including empty status and active status)
    query += ` WHERE (p.product_status = 'active' OR p.product_status = '' OR p.product_status IS NULL)`;

    // Add search filter
    if (search && search.trim()) {
      query += ` AND (p.product_title LIKE ? OR p.product_description LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Add category filter
    if (category && category.trim() && category !== 'all') {
      query += ` AND (c.category_slug = ? OR c.category_name = ?)`;
      queryParams.push(category.trim(), category.trim());
    }

    // Add subcategory filter
    if (subcategory && subcategory.trim()) {
      query += ` AND sc.sub_category_id = ?`;
      queryParams.push(parseInt(subcategory.trim()));
    }

    // Add featured filter
    if (featured === 'true') {
      query += ` AND p.is_featured = 1`;
    }

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
    queryParams.push(parseInt(limit), offset);

    const [products] = await connection.execute(query, queryParams);

    // Get images for each product
    const ProductImage = require("../models/ProductImage");
    const Product = require("../models/Product");
    
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await ProductImage.findByProductId(product.product_id);
        return {
          ...product,
          product_attributes: Product.parseProductAttributes(product.product_attributes),
          images: images,
          seller_name: `${product.seller_first_name || ''} ${product.seller_last_name || ''}`.trim()
        };
      })
    );

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
    console.error("Get public products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const filterProducts = async (req, res) => {
  // This can use the same logic as getPublicProducts for now
  return getPublicProducts(req, res);
}

// Get public product by ID (no authentication required)
const getPublicProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const { getConnection } = require("../config/database");
    const connection = getConnection();
    
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
        GROUP_CONCAT(pi.image_url SEPARATOR ',') as images
      FROM 
        products p
        LEFT JOIN sub_categories sc ON p.category_id = sc.sub_category_id
        LEFT JOIN categories c ON sc.categories_category_id = c.category_id
        LEFT JOIN users u ON p.seller_id = u.user_id
        LEFT JOIN store s ON u.user_id = s.user_id
        LEFT JOIN cities c2 ON p.location_city_id = c2.city_id
        LEFT JOIN districts d ON c2.district_id = d.district_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id
      WHERE 
        p.product_id = ? 
        AND (p.product_status = 'active' OR p.product_status = '' OR p.product_status IS NULL)
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
  }
};

module.exports = {
    createProduct,
    getSellerProducts,
    getProductById,
    updateProduct,
    getPublicProducts,
    filterProducts,
    getPublicProductById
}