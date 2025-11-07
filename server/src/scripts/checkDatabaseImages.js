require('dotenv').config();
const { connectDB, getConnection } = require('../config/database');

const checkDatabaseImages = async () => {
  console.log('🔍 Checking current database image URLs...\n');
  
  try {
    await connectDB();
    const connection = getConnection();

    // Check product images
    console.log('📦 Product Images:');
    const [productImages] = await connection.execute(
      'SELECT image_id, product_id, image_url FROM product_images LIMIT 10'
    );
    
    productImages.forEach((img, index) => {
      console.log(`${index + 1}. Product ${img.product_id}: ${img.image_url}`);
    });

    console.log(`\nTotal product images: ${productImages.length}`);

    // Check user profile images
    console.log('\n👤 User Profile Images:');
    const [users] = await connection.execute(
      'SELECT user_id, first_name, last_name, profile_image FROM users WHERE profile_image IS NOT NULL LIMIT 10'
    );
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User ${user.first_name} ${user.last_name}: ${user.profile_image}`);
    });

    console.log(`\nTotal users with profile images: ${users.length}`);

    // Get all unique image URLs for migration
    const [allProductImages] = await connection.execute(
      'SELECT DISTINCT image_url FROM product_images WHERE image_url IS NOT NULL'
    );

    const [allProfileImages] = await connection.execute(
      'SELECT DISTINCT profile_image FROM users WHERE profile_image IS NOT NULL'
    );

    console.log('\n📊 Summary:');
    console.log(`- Product images to migrate: ${allProductImages.length}`);
    console.log(`- Profile images to migrate: ${allProfileImages.length}`);

    return {
      productImages: allProductImages.map(img => img.image_url),
      profileImages: allProfileImages.map(user => user.profile_image)
    };

  } catch (error) {
    console.error('❌ Error checking database:', error);
    return null;
  }
};

if (require.main === module) {
  checkDatabaseImages().then(result => {
    if (result) {
      console.log('\n✅ Database check completed');
    }
  });
}

module.exports = { checkDatabaseImages };