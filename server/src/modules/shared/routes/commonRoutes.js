const express = require('express');
const { mobile, verifyOtp } = require('../utils/mobileVerify');

const router = express.Router();

router.post('/send-otp', mobile);
router.post('/verify-otp', verifyOtp);

module.exports = router;