const express = require("express");
const { getAllCategories } = require("../controllers/categoryController");
const router = express.Router();

router.get("/categories", getAllCategories);

module.exports = router;
