const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const { getAdminProfile, updateAdminProfile, getCustomers, getAdminDashboardData } = require("../controllers/adminController");

const router = express.Router();

router.get("/profile", authenticateAdmin, getAdminProfile);
router.put("/profile", authenticateAdmin, updateAdminProfile);
router.get("/customers", authenticateAdmin, getCustomers);
router.get("/dashboard", authenticateAdmin, getAdminDashboardData);

module.exports = router;