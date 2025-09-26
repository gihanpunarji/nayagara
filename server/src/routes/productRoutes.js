const express = require("express");

const router = express.Router();

router.get("/filter", (req, res) => filterProducts(req, res))


module.exports = router;