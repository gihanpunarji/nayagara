const Review = require('../models/Review');
const Order = require('../models/Order');

const addReview = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId, orderId, rating, title, comment } = req.body;

    // Validation
    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (comment.split(/\s+/).length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Review comment exceeds 150 words limit'
      });
    }

    // Check for "Verified Purchase" AND that the product belongs to this specific order
    const { getConnection } = require('../config/database');
    const pool = getConnection();
    const [rows] = await pool.execute(`
      SELECT o.order_id 
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.customer_id = ? 
      AND oi.product_id = ? 
      AND o.order_id = ?
      AND o.order_status = 'delivered'
      LIMIT 1
    `, [userId, productId, orderId]);

    const isVerified = rows.length > 0;

    if (!isVerified) {
       return res.status(403).json({
         success: false,
         message: 'You can only review products from delivered orders that you have purchased.'
       });
    }

    // Check if already reviewed THIS product in THIS order
    const hasReviewed = await Review.hasReviewed(userId, productId, orderId);
    if (hasReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product for this order'
      });
    }

    // Create Review
    const reviewId = await Review.create({
      userId,
      productId,
      orderId, // Store the order ID
      rating,
      title: title || '',
      comment,
      isVerified: true
    });

    // Add Images from Cloudinary upload
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      await Review.addImages(reviewId, imageUrls);
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { reviewId }
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search, status, rating, productId, userId } = req.query;

    const { reviews, total } = await Review.getAll(limit, offset, search, status, rating, productId, userId);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!['active', 'hidden'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const success = await Review.updateStatus(reviewId, status);
    
    if (success) {
      res.json({
        success: true,
        message: 'Review status updated'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status'
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const success = await Review.delete(reviewId);

    if (success) {
      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
};

module.exports = {
  addReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview
};
