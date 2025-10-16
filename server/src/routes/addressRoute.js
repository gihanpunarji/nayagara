const { getAllDistricts, getAllProvinces, getDistrictsByProvince, getCitiesByDistrict } = require('../controllers/addressController');

const router = require('express').Router();

router.get('/fetchData', (req, res) => getAllDistricts(req, res));
router.get('/provinces', getAllProvinces);
router.get('/districts/:provinceId', getDistrictsByProvince);
router.get('/cities/:districtId', getCitiesByDistrict);

module.exports = router;

module.exports = router;
