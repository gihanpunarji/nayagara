const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { authenticateToken } = require('../middleware/auth');

// User referral management routes
router.get('/stats', authenticateToken, referralController.getUserReferralStats);
router.get('/validate/:referralCode', referralController.validateReferralCode);
router.post('/register', referralController.registerWithReferralCode);

// Referral link and code management
router.get('/my-code', authenticateToken, referralController.getMyReferralCode);
router.get('/my-earnings', authenticateToken, referralController.getMyEarnings);
router.get('/my-referrals', authenticateToken, referralController.getMyReferrals);

// Order-related referral processing
router.post('/process-order', authenticateToken, referralController.processOrderReferrals);

// Testing and calculation endpoints (for development/testing)
router.post('/calculate-profit', authenticateToken, referralController.calculateProfitMargins);
router.post('/calculate-discount', authenticateToken, referralController.calculateUserDiscount);
router.post('/simulate-commission', authenticateToken, referralController.simulateCommission);

module.exports = router;