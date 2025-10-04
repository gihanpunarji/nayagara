const express = require("express");
const { getSellerProfile } = require("../controllers/sellerController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", authenticateToken, getSellerProfile);

module.exports = router;