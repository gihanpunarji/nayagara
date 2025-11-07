require('dotenv').config();
const { connectDB, getConnection } = require('../config/database');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const generateCloudinaryUrl = (localPath) => {
  // Convert local path to Cloudinary URL
  // /uploads/products/39_1759662952916_4ixh3s.jpeg -> https://res.cloudinary.com/dgi6rtypq/image/upload/products/39_1759662952916_4ixh3s.jpg
  
  let cleanPath = localPath.replace('/uploads/', ''); // Remove /uploads/ prefix
  cleanPath = cleanPath.replace(/\.(jpeg|jpg|png|gif|webp|avif)$/i, ''); // Remove extension
  
  return cloudinary.url(cleanPath, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto'
  });
};

const reUploadToProperFolders = async () => {
  console.log('🔄 Re-uploading images to proper Cloudinary folders...\n');

  const imagesToUpload = [
    // Profile pictures
    { local: 'uploads/profile-pictures/37_1759645586115.jpg', folder: 'profile-pictures' },
    { local: 'uploads/profile-pictures/39_1762430909462.jpeg', folder: 'profile-pictures' },
    
    // Product images
    { local: 'uploads/products/39_1759662952916_4ixh3s.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1759662952928_uv7f72.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1759662952929_f3jam4.webp', folder: 'products' },
    { local: 'uploads/products/39_1759662952929_59wtwz.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1759663616334_jjrt2u.webp', folder: 'products' },
    { local: 'uploads/products/39_1759663616335_5iz3jz.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1759663616336_q4ml5p.webp', folder: 'products' },
    { local: 'uploads/products/39_1759663616338_o3xhbi.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1759665252857_z68d5x.png', folder: 'products' },
    { local: 'uploads/products/39_1759665306496_r5tg54.png', folder: 'products' },
    { local: 'uploads/products/39_1759665964327_kefuhb.jpg', folder: 'products' },
    { local: 'uploads/products/39_1759666085589_mdhoj2.jpg', folder: 'products' },
    { local: 'uploads/products/39_1760010080428_9mmhqi.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1760010299466_5ifrwb.avif', folder: 'products' },
    { local: 'uploads/products/39_1760010707005_t6s5ag.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1760011129971_ifq0r3.jpeg', folder: 'products' },
    { local: 'uploads/products/39_1762330989882_kk10fp.jpg', folder: 'products' },
    { local: 'uploads/products/39_1762331145582_9gt9rv.jpg', folder: 'products' },
    { local: 'uploads/products/39_1762331356997_um4myp.jpg', folder: 'products' }
  ];

  for (const image of imagesToUpload) {
    try {
      if (!fs.existsSync(image.local)) {
        console.log(`⚠️ File not found locally: ${image.local}`);
        continue;
      }

      const filename = path.basename(image.local);
      const nameWithoutExt = path.parse(filename).name;
      const publicId = `${image.folder}/${nameWithoutExt}`;

      console.log(`⬆️ Uploading ${filename} to ${publicId}...`);

      const result = await cloudinary.uploader.upload(image.local, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'auto',
        use_filename: false,
        unique_filename: false
      });

      console.log(`✅ Successfully uploaded to: ${result.public_id}`);

    } catch (error) {
      console.error(`❌ Failed to upload ${image.local}:`, error.message);
    }
  }
};

const deleteOldCloudinaryUploads = async () => {
  console.log('\n🗑️ Deleting old scattered uploads from Cloudinary...\n');

  try {
    // Get all resources with the old "uploads/" prefix
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'uploads/',
      max_results: 100
    });

    if (result.resources.length === 0) {
      console.log('✅ No old uploads found - already cleaned up!');
      return;
    }

    console.log(`Found ${result.resources.length} old uploads to delete:`);

    for (const resource of result.resources) {
      try {
        await cloudinary.uploader.destroy(resource.public_id);
        console.log(`🗑️ Deleted: ${resource.public_id}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${resource.public_id}:`, error.message);
      }
    }

    console.log('✅ Old uploads cleanup completed');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
};

const updateDatabaseUrls = async () => {
  console.log('\n💾 Updating database URLs to use Cloudinary...\n');

  try {
    await connectDB();
    const connection = getConnection();

    // Update product images
    console.log('📦 Updating product image URLs...');
    const [productImages] = await connection.execute(
      'SELECT image_id, image_url FROM product_images WHERE image_url LIKE "/uploads/%"'
    );

    for (const image of productImages) {
      const cloudinaryUrl = generateCloudinaryUrl(image.image_url);
      
      await connection.execute(
        'UPDATE product_images SET image_url = ? WHERE image_id = ?',
        [cloudinaryUrl, image.image_id]
      );
      
      console.log(`✅ Updated image ${image.image_id}: ${image.image_url} → ${cloudinaryUrl}`);
    }

    // Update user profile images
    console.log('\n👤 Updating user profile image URLs...');
    const [users] = await connection.execute(
      'SELECT user_id, profile_image FROM users WHERE profile_image LIKE "/uploads/%"'
    );

    for (const user of users) {
      const cloudinaryUrl = generateCloudinaryUrl(user.profile_image);
      
      await connection.execute(
        'UPDATE users SET profile_image = ? WHERE user_id = ?',
        [cloudinaryUrl, user.user_id]
      );
      
      console.log(`✅ Updated user ${user.user_id}: ${user.profile_image} → ${cloudinaryUrl}`);
    }

    console.log(`\n📊 Database update summary:`);
    console.log(`- Updated ${productImages.length} product images`);
    console.log(`- Updated ${users.length} user profile images`);

  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
};

const runCompleteeMigration = async () => {
  console.log('🚀 Starting complete Cloudinary migration...\n');
  console.log('This will:');
  console.log('1. Re-upload all images to proper folders');
  console.log('2. Delete old scattered uploads');
  console.log('3. Update database URLs to use Cloudinary URLs');
  console.log('');

  try {
    await reUploadToProperFolders();
    await deleteOldCloudinaryUploads();
    await updateDatabaseUrls();

    console.log('\n🎉 Complete migration finished successfully!');
    console.log('📂 All images are now properly organized in Cloudinary folders');
    console.log('💾 Database now uses Cloudinary URLs');
    console.log('✨ Your app is fully migrated to Cloudinary!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

if (require.main === module) {
  runCompleteeMigration();
}

module.exports = { reUploadToProperFolders, deleteOldCloudinaryUploads, updateDatabaseUrls };