const express = require("express");
const { 
  createProduct, 
  getSellerProducts, 
  getProductById,
  updateProduct,
  filterProducts 
} = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");
const { productImageUpload } = require("../middleware/upload");

const router = express.Router();

// Create a new product with images
router.post("/", authenticateToken, productImageUpload.array('images', 10), createProduct);

// Get seller's products
router.get("/seller", authenticateToken, getSellerProducts);

// Get single product by ID
router.get("/:productId", authenticateToken, getProductById);

// Update product by ID
router.put("/:productId", authenticateToken, productImageUpload.array('images', 10), updateProduct);

// Filter products (public endpoint)
router.get("/filter", (req, res) => filterProducts(req, res));

module.exports = router;