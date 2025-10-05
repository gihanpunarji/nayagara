const User = require("../models/User");
const Store = require("../models/Store");
const Address = require("../models/Address");
const Admin = require("../models/Admin");
const Bank = require("../models/Bank");

const getSellerProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const user = await User.findById(userId);
    console.log(user);
    
    
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

    // Get store data
    const store = await Store.findByUserId(userId);
    
    // Get complete business address data with location details
    const businessAddress = await Address.getCompleteBusinessAddressByUserId(userId);
    
    // Get admin contact mobile
    const adminMobile = await Admin.getAdminContactMobile();
    
    // Get bank details
    const bankDetails = await Bank.findByUserId(userId);

    // Return seller profile data (excluding password)
    const { user_password, reset_token, reset_token_expires, ...sellerProfile } = user;
    
    res.json({
      success: true,
      user: sellerProfile,
      store: store || null,
      businessAddress: businessAddress || null,
      adminMobile: adminMobile,
      bankDetails: bankDetails || null
    });
  } catch (error) {
    console.error("Get seller profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { firstName, lastName, mobile, nic, storeName, storeDescription, businessAddress } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required"
      });
    }

    // Check if user is a seller
    const user = await User.findById(userId);
    if (!user || user.user_type !== 'seller') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not a seller account."
      });
    }

    // Update user profile (excluding email as it's unique and shouldn't be changed)
    const connection = require("../config/database").getConnection();
    await connection.execute(
      "UPDATE users SET first_name = ?, last_name = ?, user_mobile = ?, nic = ?, updated_at = ? WHERE user_id = ?",
      [firstName, lastName, mobile, nic, new Date(), userId]
    );
      console.log("Updating store 1:", storeName, storeDescription);

    // Update or create store data if provided
    if (storeName || storeDescription) {
      console.log("Updating store 2:", storeName, storeDescription);
      await Store.createOrUpdate({
        userId,
        storeName: storeName || '',
        storeDescription: storeDescription || ''
      });
    }

    // Update or create business address if provided
    if (businessAddress && (businessAddress.line1 || businessAddress.line2 || businessAddress.postalCode)) {
      await Address.createOrUpdateBusinessAddress({
        userId,
        line1: businessAddress.line1 || '',
        line2: businessAddress.line2 || '',
        postalCode: businessAddress.postalCode || '',
        cityId: businessAddress.cityId || null
      });
    }

    // Get updated data
    const updatedUser = await User.findById(userId);
    const store = await Store.findByUserId(userId);
    const updatedBusinessAddress = await Address.getBusinessAddressByUserId(userId);
    const { user_password, reset_token, reset_token_expires, ...sellerProfile } = updatedUser;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: sellerProfile,
      store: store || null,
      businessAddress: updatedBusinessAddress || null
    });

  } catch (error) {
    console.error("Update seller profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }

    // Check if user is a seller
    const user = await User.findById(userId);
    if (!user || user.user_type !== 'seller') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not a seller account."
      });
    }

    // Generate image URL
    const imageUrl = `/uploads/profile-pictures/${req.file.filename}`;

    // Update user's profile_image in database
    const connection = require("../config/database").getConnection();
    await connection.execute(
      "UPDATE users SET profile_image = ?, updated_at = ? WHERE user_id = ?",
      [imageUrl, new Date(), userId]
    );

    // Get updated user data
    const updatedUser = await User.findById(userId);
    const { user_password, reset_token, reset_token_expires, ...userProfile } = updatedUser;

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      user: userProfile,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error("Upload profile picture error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getSellerPaymentDetails = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const user = await User.findById(userId);
    
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

    // Get bank details
    const bankDetails = await Bank.findByUserId(userId);

    res.json({
      success: true,
      bankDetails: bankDetails || null
    });
  } catch (error) {
    console.error("Get seller payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateSellerPaymentDetails = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { bankName, accountNumber, holderName, bankCode, branchName } = req.body;
    
    // Check if user is a seller
    const user = await User.findById(userId);
    if (!user || user.user_type !== 'seller') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not a seller account."
      });
    }

    // Validate at least one bank field is provided
    if (!bankName && !accountNumber && !holderName && !bankCode && !branchName) {
      return res.status(400).json({
        success: false,
        message: "At least one bank detail field is required"
      });
    }

    // Update or create bank details
    await Bank.createOrUpdate({
      userId,
      bankName: bankName || '',
      accountNumber: accountNumber || '',
      holderName: holderName || '',
      bankCode: bankCode || '',
      branchName: branchName || ''
    });

    // Get updated bank details
    const updatedBankDetails = await Bank.findByUserId(userId);

    res.json({
      success: true,
      message: "Payment details updated successfully",
      bankDetails: updatedBankDetails || null
    });

  } catch (error) {
    console.error("Update seller payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getSellerProfile,
  updateSellerProfile,
  uploadProfilePicture,
  getSellerPaymentDetails,
  updateSellerPaymentDetails,
};