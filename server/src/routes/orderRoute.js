const express = require('express');
const { 
  createOrder, 
  updateOrderPaymentStatus, 
  getUserOrders, 
  getOrderDetails 
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create order (protected)
router.post('/create', authenticateToken, createOrder);

// Update order payment status (protected)
router.put('/payment-status', authenticateToken, updateOrderPaymentStatus);

// Get user orders (protected)
router.get('/user', authenticateToken, getUserOrders);

// Get specific order details (protected)
router.get('/:order_number', authenticateToken, getOrderDetails);

module.exports = router;