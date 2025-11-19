const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const { getAdminProfile, updateAdminProfile, getCustomers, getSellers, getAdminDashboardData } = require("../controllers/adminController");

const router = express.Router();

router.get("/profile", authenticateAdmin, getAdminProfile);
router.put("/profile", authenticateAdmin, updateAdminProfile);
router.get("/customers", authenticateAdmin, getCustomers);
router.get("/sellers", authenticateAdmin, getSellers);
router.get("/dashboard", authenticateAdmin, getAdminDashboardData);

module.exports = router;