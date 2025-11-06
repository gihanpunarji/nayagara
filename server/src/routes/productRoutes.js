const express = require("express");
const { 
  createProduct, 
  getSellerProducts, 
  getProductById,
  updateProduct,
  getPublicProducts,
  filterProducts,
  getPublicProductById 
} = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");
const { productImageUpload } = require("../middleware/cloudinaryUpload");

const router = express.Router();

// Public endpoints first (before catch-all routes)
// Public products endpoint (no authentication required)
router.get("/public", getPublicProducts);

// Filter products (public endpoint)
router.get("/filter", filterProducts);

// Public single product endpoint (no authentication required)
router.get("/public/:productId", getPublicProductById);

// Create a new product with images
router.post("/", authenticateToken, ...productImageUpload.array('images', 10), createProduct);

// Get seller's products
router.get("/seller", authenticateToken, getSellerProducts);

// Update product by ID
router.put("/:productId", authenticateToken, ...productImageUpload.array('images', 10), updateProduct);

// Get single product by ID (this should be last because it's a catch-all)
router.get("/:productId", authenticateToken, getProductById);

module.exports = router;