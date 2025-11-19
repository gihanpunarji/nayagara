const express = require("express");
const { getWalletData } = require("../controllers/walletController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get wallet data for the authenticated user
router.get("/wallet", authenticateToken, getWalletData);

module.exports = router;
