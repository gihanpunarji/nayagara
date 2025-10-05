const User = require("../models/User");

const getSellerProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const user = await User.findById(userId);
    console.log("user " + user);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is a seller
    if (user.user_type !== 'seller') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not a seller account."
      });
    }

    // Return seller profile data (excluding password)
    const { user_password, reset_token, reset_token_expires, ...sellerProfile } = user;
    
    res.json({
      success: true,
      user: sellerProfile
    });
  } catch (error) {
    console.error("Get seller profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getSellerProfile,
};