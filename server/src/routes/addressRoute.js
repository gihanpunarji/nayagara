const { 
  getAllDistricts, 
  getAllProvinces, 
  getDistrictsByProvince, 
  getCitiesByDistrict,
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress
} = require('../controllers/addressController');
const { authenticateToken } = require('../middleware/auth');

const router = require('express').Router();

// Public routes
router.get('/fetchData', (req, res) => getAllDistricts(req, res));
router.get('/provinces', getAllProvinces);
router.get('/districts/:provinceId', getDistrictsByProvince);
router.get('/cities/:districtId', getCitiesByDistrict);

// Protected user address routes
router.get('/user', authenticateToken, getUserAddresses);
router.post('/user', authenticateToken, createUserAddress);
router.put('/user/:addressId', authenticateToken, updateUserAddress);
router.delete('/user/:addressId', authenticateToken, deleteUserAddress);

module.exports = router;
