const express = require('express');
const router = express.Router();
const { addReview, getAllReviews } = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');
const { reviewImageUpload } = require('../middleware/cloudinaryUpload');

// Add a new review
router.post('/', authenticateToken, ...reviewImageUpload.array('images', 3), addReview);

// Get reviews (Public)
router.get('/', getAllReviews);

module.exports = router;
