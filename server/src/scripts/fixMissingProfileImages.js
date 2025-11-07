require('dotenv').config();
const { connectDB, getConnection } = require('../config/database');
const cloudinary = require('../config/cloudinary');

const handleMissingProfileImages = async () => {
  console.log('🔧 Handling missing profile images...\n');
  
  try {
    await connectDB();
    const connection = getConnection();

    // Get users with profile images that should be uploaded
    const [users] = await connection.execute(
      'SELECT user_id, first_name, last_name, profile_image FROM users WHERE profile_image LIKE "https://res.cloudinary.com%"'
    );

    console.log(`Found ${users.length} users with Cloudinary URLs already set`);

    // Check if the profile images exist in Cloudinary
    for (const user of users) {
      const publicId = user.profile_image
        .replace('https://res.cloudinary.com/dgi6rtypq/image/upload/f_auto,q_auto/v1/', '')
        .replace(/\?.*$/, ''); // Remove any query parameters

      try {
        const resource = await cloudinary.api.resource(publicId);
        console.log(`✅ ${user.first_name} ${user.last_name}: Image exists in Cloudinary`);
      } catch (error) {
        if (error.http_code === 404) {
          console.log(`❌ ${user.first_name} ${user.last_name}: Image missing from Cloudinary`);
          
          // Try to find if the image exists with the old naming pattern
          const oldPublicId = `uploads/profile-pictures/${publicId.replace('profile-pictures/', '')}`;
          try {
            const oldResource = await cloudinary.api.resource(oldPublicId);
            console.log(`  🔄 Found old version, moving to proper folder...`);
            
            await cloudinary.uploader.rename(oldPublicId, publicId);
            console.log(`  ✅ Moved to: ${publicId}`);
          } catch (moveError) {
            console.log(`  ⚠️ Could not find or move old version`);
          }
        } else {
          console.error(`  ❌ Error checking image:`, error.message);
        }
      }
    }

    // Handle the local profile picture that exists
    console.log('\n📁 Uploading local profile picture to proper folder...');
    const localFile = 'uploads/profile-pictures/39_1759599951515.jpeg';
    const publicId = 'profile-pictures/39_1759599951515';
    
    try {
      const result = await cloudinary.uploader.upload(localFile, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'auto',
        use_filename: false,
        unique_filename: false
      });

      console.log(`✅ Uploaded local file to: ${result.public_id}`);
      
      // Update database if needed
      const cloudinaryUrl = cloudinary.url(publicId, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto'
      });
      
      await connection.execute(
        'UPDATE users SET profile_image = ? WHERE user_id = 39',
        [cloudinaryUrl]
      );
      
      console.log(`✅ Updated user 39 profile image in database`);

    } catch (error) {
      console.error('❌ Error uploading local profile picture:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

if (require.main === module) {
  handleMissingProfileImages();
}

module.exports = { handleMissingProfileImages };