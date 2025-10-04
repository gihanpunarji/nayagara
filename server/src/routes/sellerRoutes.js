const express = require("express");
const { getSellerProfile, updateSellerProfile, uploadProfilePicture } = require("../controllers/sellerController");
const { authenticateToken } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.get("/profile", authenticateToken, getSellerProfile);
router.put("/profile", authenticateToken, updateSellerProfile);
router.post("/profile/picture", authenticateToken, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;