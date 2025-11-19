const express = require('express');
const router = express.Router();
const adminReferralController = require('../controllers/adminReferralController');

// System Settings
router.get('/settings', adminReferralController.getSettings);
router.put('/settings', adminReferralController.updateSettings);

// User Referral Data
router.get('/users', adminReferralController.getUsers);

// Commission & Discount Tiers
router.get('/tiers', adminReferralController.getTiers);
router.put('/tiers', adminReferralController.updateTiers);

// Rewards Overview
router.get('/history', adminReferralController.getHistory);

module.exports = router;