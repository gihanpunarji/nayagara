const express = require('express');
const router = express.Router();
const {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  getUserAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  getPendingAdvertisements,
  approveAdvertisement,
  rejectAdvertisement,
  getPackageInfo
} = require('../controllers/advertisementController');

const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.get('/', getAdvertisements);
router.get('/packages', getPackageInfo);
router.get('/:id', getAdvertisementById);

// Protected routes - require login
router.post('/', authenticateToken, createAdvertisement);
router.get('/user/my-ads', authenticateToken, getUserAdvertisements);
router.put('/:id', authenticateToken, updateAdvertisement);
router.delete('/:id', authenticateToken, deleteAdvertisement);

// Admin routes
router.get('/admin/pending', authenticateToken, authorizeRole(['admin']), getPendingAdvertisements);
router.post('/admin/:id/approve', authenticateToken, authorizeRole(['admin']), approveAdvertisement);
router.post('/admin/:id/reject', authenticateToken, authorizeRole(['admin']), rejectAdvertisement);

module.exports = router;