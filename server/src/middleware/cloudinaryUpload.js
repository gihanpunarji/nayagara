const multer = require('multer');
const { 
  uploadProfilePicture, 
  uploadProductImage 
} = require('../utils/cloudinaryUpload');

// Configure multer to use memory storage (files will be in req.files as buffers)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Base multer configuration
const multerConfig = {
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
};

// Profile picture upload middleware
const uploadProfile = multer({
  ...multerConfig,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Single file
  }
});

// Product images upload middleware  
const uploadProducts = multer({
  ...multerConfig,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  }
});

// Middleware to handle profile picture upload to Cloudinary
const handleProfileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const userId = req.user.user_id;
    const filePath = await uploadProfilePicture(
      req.file.buffer, 
      req.file.originalname, 
      userId
    );

    // Add the Cloudinary URL to req object
    req.file.path = filePath; // Now contains the full Cloudinary URL
    req.file.filename = filePath.split('/').pop(); // Extract filename from URL
    req.file.cloudinaryUrl = filePath; // Explicit Cloudinary URL property

    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

// Middleware to handle product images upload to Cloudinary
const handleProductImagesUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const sellerId = req.user.user_id;
    const uploadPromises = req.files.map(async (file) => {
      const filePath = await uploadProductImage(
        file.buffer,
        file.originalname,
        sellerId
      );

      // Add the Cloudinary URL to each file object
      file.path = filePath; // Now contains the full Cloudinary URL
      file.filename = filePath.split('/').pop(); // Extract filename from URL
      file.cloudinaryUrl = filePath; // Explicit Cloudinary URL property
      
      return file;
    });

    // Wait for all uploads to complete
    req.files = await Promise.all(uploadPromises);

    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
};

// Export middleware combinations that match the original interface
const upload = {
  single: (fieldName) => [
    uploadProfile.single(fieldName),
    handleProfileUpload
  ]
};

const productImageUpload = {
  array: (fieldName, maxCount) => [
    uploadProducts.array(fieldName, maxCount),
    handleProductImagesUpload
  ]
};

module.exports = { 
  upload, 
  productImageUpload 
};