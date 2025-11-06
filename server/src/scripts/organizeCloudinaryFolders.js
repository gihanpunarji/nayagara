require('dotenv').config();
const cloudinary = require('../config/cloudinary');

/**
 * Script to organize uploaded images into proper Cloudinary folders
 */

const organizeIntoFolders = async () => {
  console.log('📁 Organizing Cloudinary images into proper folders...\n');

  try {
    // Get all uploaded resources
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'uploads/',
      max_results: 100
    });

    console.log(`Found ${result.resources.length} images to organize\n`);

    // Organize profile pictures
    const profilePictures = result.resources.filter(resource => 
      resource.public_id.includes('profile-pictures')
    );

    // Organize product images  
    const productImages = result.resources.filter(resource => 
      resource.public_id.includes('products')
    );

    console.log('📸 Profile Pictures:');
    for (const image of profilePictures) {
      console.log(`✓ ${image.public_id}`);
      
      // Move to proper folder if not already organized
      if (!image.public_id.startsWith('profile-pictures/')) {
        const newPublicId = image.public_id.replace('uploads/profile-pictures/', 'profile-pictures/');
        try {
          await cloudinary.uploader.rename(image.public_id, newPublicId);
          console.log(`  → Moved to: ${newPublicId}`);
        } catch (error) {
          console.log(`  → Already organized: ${image.public_id}`);
        }
      }
    }

    console.log('\n🛍️ Product Images:');
    for (const image of productImages) {
      console.log(`✓ ${image.public_id}`);
      
      // Move to proper folder if not already organized
      if (!image.public_id.startsWith('products/')) {
        const newPublicId = image.public_id.replace('uploads/products/', 'products/');
        try {
          await cloudinary.uploader.rename(image.public_id, newPublicId);
          console.log(`  → Moved to: ${newPublicId}`);
        } catch (error) {
          console.log(`  → Already organized: ${image.public_id}`);
        }
      }
    }

    console.log('\n✅ Folder organization completed!');
    console.log('📂 Your images are now organized in:');
    console.log('  - profile-pictures/ folder');
    console.log('  - products/ folder');

  } catch (error) {
    console.error('❌ Error organizing folders:', error);
  }
};

const createFolderStructure = async () => {
  console.log('📁 Creating proper folder structure in Cloudinary...\n');

  try {
    // Create folders by uploading placeholder files and then deleting them
    console.log('Creating profile-pictures folder...');
    const profileResult = await cloudinary.uploader.upload('data:text/plain;base64,cGxhY2Vob2xkZXI=', {
      public_id: 'profile-pictures/.placeholder',
      resource_type: 'raw'
    });
    console.log('✓ Profile pictures folder created');

    console.log('Creating products folder...');
    const productsResult = await cloudinary.uploader.upload('data:text/plain;base64,cGxhY2Vob2xkZXI=', {
      public_id: 'products/.placeholder', 
      resource_type: 'raw'
    });
    console.log('✓ Products folder created');

    // Delete placeholder files
    await cloudinary.uploader.destroy('profile-pictures/.placeholder', { resource_type: 'raw' });
    await cloudinary.uploader.destroy('products/.placeholder', { resource_type: 'raw' });
    console.log('✓ Placeholder files cleaned up');

  } catch (error) {
    console.error('Error creating folder structure:', error);
  }
};

const runOrganization = async () => {
  await createFolderStructure();
  await organizeIntoFolders();
};

if (require.main === module) {
  runOrganization();
}

module.exports = { organizeIntoFolders, createFolderStructure };