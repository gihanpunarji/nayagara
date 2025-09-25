const express = require('express');
const { register, login, sellerLogin, sellerRegister, forgotPassword, resetPassword } = require('../controllers/authController');
const { mobile, verifyOtp } = require('../utils/mobileVerify');

const router = express.Router();

router.post('/register', (req, res) => register(req, res, 'customer'));
router.post('/login', (req, res) => login(req, res, 'customer'));
router.post('/seller-register', (req, res) => sellerRegister(req, res, 'seller')); 
router.post('/seller-login', (req, res) => sellerLogin(req, res, 'seller'));
router.post('/send-otp', mobile);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', (req, res) => forgotPassword(req, res));
router.post('/reset-password', (req, res) => resetPassword(req, res));


module.exports = router;