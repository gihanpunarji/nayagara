const express = require("express");
const { incrementStoreView } = require("../controllers/storeController");

const router = express.Router();

router.post("/view/:sellerId", incrementStoreView);

module.exports = router;
