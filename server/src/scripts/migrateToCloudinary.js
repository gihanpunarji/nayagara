require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

/**
 * Script to migrate existing local files to Cloudinary
 * Maintains the same folder structure and filenames
 */

const uploadFileToCloudinary = (filePath, publicId) => {
  return new Promise((resolve, reject) => {
    console.log(`  Uploading ${filePath} with public_id: ${publicId}`);
    
    cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'auto',
      use_filename: false,
      unique_filename: false
    })
    .then(result => {
      resolve(result);
    })
    .catch(error => {
      console.error(`  Cloudinary error details:`, error);
      reject(error);
    });
  });
};

const migrateFolder = async (folderPath, cloudinaryFolder) => {
  try {
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder ${folderPath} does not exist. Skipping...`);
      return;
    }

    const files = fs.readdirSync(folderPath);
    console.log(`Found ${files.length} files in ${folderPath}`);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file)) {
        try {
          const nameWithoutExt = path.parse(file).name;
          const publicId = `uploads/${cloudinaryFolder}/${nameWithoutExt}`;

          console.log(`Uploading ${file} to Cloudinary...`);
          const result = await uploadFileToCloudinary(filePath, publicId);
          console.log(`✅ Successfully uploaded ${file} to ${result.public_id}`);
        } catch (error) {
          console.error(`❌ Failed to upload ${file}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error(`Error migrating folder ${folderPath}:`, error);
  }
};

const runMigration = async () => {
  console.log('🚀 Starting migration to Cloudinary...');
  console.log('This will upload all existing files to Cloudinary while maintaining the same structure.');
  
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.');
    return;
  }

  try {
    // Migrate profile pictures
    console.log('\n📸 Migrating profile pictures...');
    await migrateFolder('uploads/profile-pictures', 'profile-pictures');

    // Migrate product images
    console.log('\n🛍️ Migrating product images...');
    await migrateFolder('uploads/products', 'products');

    console.log('\n✅ Migration completed successfully!');
    console.log('📝 Note: Original files are kept locally for backup. You can delete them after verifying the migration.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration, migrateFolder };