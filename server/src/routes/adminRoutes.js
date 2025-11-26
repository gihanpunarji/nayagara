const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const { getAdminProfile, updateAdminProfile, getCustomers, getSellers, getAdminDashboardData } = require("../controllers/adminController");
const { getAllOrders } = require("../controllers/orderController");

const router = express.Router();

// router.get("/profile", authenticateAdmin, getAdminProfile);
// router.put("/profile", authenticateAdmin, updateAdminProfile);
// router.get("/customers", authenticateAdmin, getCustomers);
// router.get("/sellers", authenticateAdmin, getSellers);
// router.get("/dashboard", authenticateAdmin, getAdminDashboardData);
// router.get("/orders", authenticateAdmin, getAllOrders);


router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.get("/customers", getCustomers);
router.get("/sellers", getSellers);
router.get("/dashboard", getAdminDashboardData);
router.get("/orders", getAllOrders);

module.exports = router;