const express = require("express");
const crypto = require("crypto");
const redis = require("redis");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  sellerLogin,
  sellerRegister,
  forgotPassword,
  resetPassword,
  loginAdmin,
  verifyEmail,
} = require("../controllers/authController");
const { mobile, verifyOtp } = require("../utils/mobileVerify");
const { authenticateToken, authenticateAdmin, authenticateAdminLogin } = require("../middleware/auth");

const router = express.Router();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});
redisClient
  .connect()
  .catch((e) => console.error("Redis connect error (routes):", e));

// const sessionInitLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

router.post("/register", (req, res) => register(req, res, "customer"));
router.post("/login", (req, res) => login(req, res, "customer"));
router.post("/seller-register", (req, res) => sellerRegister(req, res, "seller"));

router.post("/seller-login", (req, res) => sellerLogin(req, res, "seller"));
router.post("/send-otp", mobile);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", (req, res) => forgotPassword(req, res));
router.post("/reset-password", (req, res) => resetPassword(req, res));
// router.get("/admin/session-init", sessionInitLimiter, async (req, res) => {
//   try {
//     // Optional: check Origin/Referer against your allowed admin frontend to reduce abuse
//     // const origin = req.get("origin") || req.get("referer");
//     // if (origin && !allowedOrigins.includes(origin)) return res.status(403).json({ success:false, message: 'forbidden' });

//     const nonce = crypto.randomBytes(24).toString("hex");
//     // store in Redis with TTL (60 seconds). Key is single-use.
//     await redisClient.setEx(`admin_nonce:${nonce}`, 60, "1");

//     // return the nonce in body (frontend will include it in `x-admin-nonce`)
//     return res.json({ success: true, nonce });
//   } catch (err) {
//     console.error("session-init error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });
router.post("/admin/email-verification", verifyEmail);
router.post("/admin/login", (req, res) => loginAdmin(req, res));

module.exports = router;
