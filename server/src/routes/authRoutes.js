const express = require('express');
const { register, login, sellerLogin, sellerRegister } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register, "customer");
router.post('/login', login);
router.poot('/seller-register', sellerRegister, "seller"); 
router.post('/seller-login', sellerLogin, "seller");

module.exports = router;