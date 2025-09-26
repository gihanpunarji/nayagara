const express = require("express");
const { filterProducts } = require("../controllers/productController");

const router = express.Router();

router.get("/filter", (req, res) => filterProducts(req, res))


module.exports = router;