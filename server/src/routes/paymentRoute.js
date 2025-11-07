const express = require('express');
const { createPayHerePayment, handlePayHereNotify } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create PayHere payment
router.post('/payhere/create', authenticateToken, createPayHerePayment);

// PayHere notification webhook (no auth needed)
router.post('/payhere/notify', handlePayHereNotify);

module.exports = router;