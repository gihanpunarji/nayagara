const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');


const cloudinaryServeMiddleware = async (req, res, next) => {
  const requestedPath = req.path;
  const localFilePath = path.join(process.cwd(), requestedPath.substring(1)); 

  try {
    if (fs.existsSync(localFilePath)) {
      return next(); 
    }

    let publicId = requestedPath.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, ''); // Remove extension
    publicId = publicId.replace(/^\/uploads\//, ''); // Remove /uploads/ prefix for Cloudinary
    
    const cloudinaryUrl = cloudinary.url(publicId, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto'
    });

    // Redirect to Cloudinary URL
    res.redirect(cloudinaryUrl);
  } catch (error) {
    console.error('Error serving from Cloudinary:', error);
    next(); // Fall back to local static serving
  }
};

module.exports = cloudinaryServeMiddleware;