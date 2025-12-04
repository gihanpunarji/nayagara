const cloudinary = require('../config/cloudinary');
const path = require('path');

/**
 * Upload file to Cloudinary maintaining the same folder structure and filename
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalname - Original filename
 * @param {string} folderPath - Folder path (e.g., 'profile-pictures' or 'products')
 * @param {string} filename - Custom filename to maintain same structure
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadToCloudinary = (fileBuffer, originalname, folderPath, filename) => {
  return new Promise((resolve, reject) => {
    // Remove extension from filename for public_id
    const nameWithoutExt = path.parse(filename).name;
    const publicId = `${folderPath}/${nameWithoutExt}`;

    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: publicId,
        folder: folderPath,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Return the Cloudinary URL directly for database storage
          resolve(result.secure_url);
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Generate profile picture filename (same as current logic)
 * @param {number} userId - User ID
 * @param {string} originalname - Original filename
 * @returns {string} - Generated filename
 */
const generateProfileFilename = (userId, originalname) => {
  const timestamp = Date.now();
  const ext = path.extname(originalname);
  return `${userId}_${timestamp}${ext}`;
};

/**
 * Generate product image filename (same as current logic)
 * @param {number} sellerId - Seller ID
 * @param {string} originalname - Original filename
 * @returns {string} - Generated filename
 */
const generateProductFilename = (sellerId, originalname) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalname);
  return `${sellerId}_${timestamp}_${random}${ext}`;
};

/**
 * Upload profile picture to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalname - Original filename
 * @param {number} userId - User ID
 * @returns {Promise<string>} - File path (same format as before)
 */
const uploadProfilePicture = async (fileBuffer, originalname, userId) => {
  const filename = generateProfileFilename(userId, originalname);
  return await uploadToCloudinary(fileBuffer, originalname, 'profile-pictures', filename);
};

/**
 * Upload product image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalname - Original filename
 * @param {number} sellerId - Seller ID
 * @returns {Promise<string>} - File path (same format as before)
 */
const uploadProductImage = async (fileBuffer, originalname, sellerId) => {
  const filename = generateProductFilename(sellerId, originalname);
  return await uploadToCloudinary(fileBuffer, originalname, 'products', filename);
};

/**
 * Upload category icon to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalname - Original filename
 * @param {string} categorySlug - Category slug for filename
 * @returns {Promise<string>} - Cloudinary URL
 */
const uploadCategoryIcon = async (fileBuffer, originalname, categorySlug) => {
  const timestamp = Date.now();
  const ext = path.extname(originalname);
  const filename = `${categorySlug}_${timestamp}${ext}`;
  return await uploadToCloudinary(fileBuffer, originalname, 'categories', filename);
};

/**
 * Delete file from Cloudinary
 * @param {string} filePath - File path (e.g., 'uploads/products/39_1759662952916_4ixh3s.jpeg')
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (filePath) => {
  try {
    // Extract public_id from file path
    const publicId = filePath.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadProfilePicture,
  uploadProductImage,
  uploadCategoryIcon,
  deleteFromCloudinary,
  generateProfileFilename,
  generateProductFilename
};