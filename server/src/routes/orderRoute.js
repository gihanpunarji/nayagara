const express = require('express');
const {
  createOrder,
  updateOrderPaymentStatus,
  getUserOrders,
  getOrderDetails,
  getSellerOrders,
  getSellerOrderDetails,
  updateSellerOrderStatus,
  calculateShipping
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Calculate shipping cost
router.post('/calculate-shipping', calculateShipping);

// Create order (protected)
router.post('/create', authenticateToken, createOrder);

// Update order payment status (protected)
router.put('/payment-status', authenticateToken, updateOrderPaymentStatus);

// Get user orders (protected)
router.get('/user', authenticateToken, getUserOrders);

// Get seller orders (protected)
router.get('/seller', authenticateToken, getSellerOrders);

// Get seller order details (protected)
router.get('/seller/:order_id', authenticateToken, getSellerOrderDetails);

// Update seller order item status (protected)
router.put('/seller/status', authenticateToken, updateSellerOrderStatus);

// Get specific order details (protected)
router.get('/:order_number', authenticateToken, getOrderDetails);

module.exports = router;