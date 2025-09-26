const { getAllDistricts } = require('../controllers/addressController');

const router = require('express').Router();

router.get('/districts', (req, res) => getAllDistricts(req, res));

module.exports = router;
