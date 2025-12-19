const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 25, search, status, rating } = req.query;
    const offset = (page - 1) * limit;

    const { reviews, total } = await Review.getAll(limit, offset, search, status, rating);
    
    res.json({ 
      success: true, 
      reviews, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const result = await Review.updateStatus(reviewId, status);
    
    if (result) {
      res.json({ success: true, message: "Review status updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Review not found" });
    }
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: "Failed to update review status" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const result = await Review.delete(reviewId);
    
    if (result) {
      res.json({ success: true, message: "Review deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Review not found" });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};

module.exports = {
  getAllReviews,
  updateReviewStatus,
  deleteReview
};
