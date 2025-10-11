const express = require("express");

const {
  register,
  login,
  sellerLogin,
  sellerRegister,
  forgotPassword,
  resetPassword,
  loginAdmin,
  sendEmail,
  verifyEmailOtp
} = require("../controllers/authController");
const { mobile, verifyOtp } = require("../utils/mobileVerify");

const router = express.Router();

router.post("/register", (req, res) => register(req, res, "customer"));
router.post("/login", (req, res) => login(req, res, "customer"));
router.post("/seller/register", (req, res) => sellerRegister(req, res, "seller"));
router.post("/seller/login", (req, res) => sellerLogin(req, res, "seller"));
router.post("/send-otp", mobile);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", (req, res) => forgotPassword(req, res));
router.post("/reset-password", (req, res) => resetPassword(req, res));
router.post("/admin/send-email", sendEmail);
router.post("/admin/email-otp-verify", verifyEmailOtp);
router.post("/admin/login", (req, res) => loginAdmin(req, res));

module.exports = router;
