const express = require("express");
const { 
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
} = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get all cart items
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update item quantity in cart
router.put("/item/:productId", updateCartItem);

// Remove item from cart
router.delete("/item/:productId", removeFromCart);

// Clear entire cart
router.delete("/", clearCart);

// Merge guest cart when user logs in
router.post("/merge", mergeCart);

module.exports = router;