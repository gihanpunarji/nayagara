const express = require("express");
const { getSellerProfile, updateSellerProfile, uploadProfilePicture, getSellerPaymentDetails, updateSellerPaymentDetails, getSellerCustomers, getSellerDashboardData, getSellerAnalytics } = require("../controllers/sellerController");
const { authenticateToken } = require("../middleware/auth");
const { upload } = require("../middleware/cloudinaryUpload");

const router = express.Router();

router.get("/profile", authenticateToken, getSellerProfile);
router.put("/profile", authenticateToken, updateSellerProfile);
router.post("/profile/picture", authenticateToken, ...upload.single('profilePicture'), uploadProfilePicture);

// Payment/Bank details routes
router.get("/payment", authenticateToken, getSellerPaymentDetails);
router.put("/payment", authenticateToken, updateSellerPaymentDetails);

router.get("/customers", authenticateToken, getSellerCustomers);
router.get("/dashboard", authenticateToken, getSellerDashboardData);
router.get("/analytics", authenticateToken, getSellerAnalytics);

module.exports = router;