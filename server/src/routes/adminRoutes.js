const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { getAdminProfile, updateAdminProfile, getCustomers, getAdminDashboardData } = require("../controllers/adminController");

const router = express.Router();

router.get("/profile", authenticateToken, getAdminProfile);
router.put("/profile", authenticateToken, updateAdminProfile);
router.get("/customers", authenticateToken, getCustomers);
router.get("/dashboard", authenticateToken, getAdminDashboardData);

module.exports = router;