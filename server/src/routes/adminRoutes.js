const express = require("express");
const multer = require("multer");
const { authenticateAdmin } = require("../middleware/auth");
const { getAdminProfile, updateAdminProfile, getCustomers, getSellers, getAdminDashboardData, getAdminCategories, addCategory, updateCategory, addSubCategory, deleteSubCategory, toggleCategoryStatus, deleteCategory, getSellerBankDetails, getSellerEarnings, recordPayment } = require("../controllers/adminController");
const { getAllOrders } = require("../controllers/orderController");

const router = express.Router();

// Configure multer for category icon upload
const storage = multer.memoryStorage();
const categoryIconUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'icon' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    }
    else if (file.fieldname === 'icoFile' && (file.mimetype === 'image/x-icon' || file.originalname.endsWith('.ico'))) {
      cb(null, true);
    }
    else {
      cb(new Error('Invalid file type!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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
router.get("/categories", getAdminCategories);
router.post("/categories", categoryIconUpload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'icoFile', maxCount: 1 }
]), addCategory);
router.put("/categories/:categoryId", categoryIconUpload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'icoFile', maxCount: 1 }
]), updateCategory);
router.patch("/categories/:categoryId/status", toggleCategoryStatus);
router.delete("/categories/:categoryId", deleteCategory);

// Subcategory routes
router.post("/subcategories", addSubCategory);
router.delete("/subcategories/:subcategoryId", deleteSubCategory);

// Payment and earnings routes
router.get("/sellers/:sellerId/bank", getSellerBankDetails);
router.get("/sellers/:sellerId/earnings", getSellerEarnings);
router.post("/payments", recordPayment);

module.exports = router;