const cloudinary = require('../config/cloudinary');
require('dotenv').config();

const testCloudinaryConnection = async () => {
  console.log('🔧 Testing Cloudinary connection...\n');
  
  console.log('Configuration:');
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`API Key: ${process.env.CLOUDINARY_API_KEY}`);
  console.log(`API Secret: ${process.env.CLOUDINARY_API_SECRET ? '***SET***' : 'NOT SET'}\n`);

  try {
    // Test simple upload first
    console.log('🧪 Testing basic upload...');
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload('data:text/plain;base64,SGVsbG8gV29ybGQ=', {
        public_id: 'test_upload',
        resource_type: 'raw'
      }, (error, result) => {
        if (error) {
          console.error('Upload error details:', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    
    console.log('✅ Upload test successful!');
    console.log('Upload result:', uploadResult.public_id);
    console.log('Secure URL:', uploadResult.secure_url);
    
    // Clean up test file
    await cloudinary.uploader.destroy('test_upload', { resource_type: 'raw' });
    console.log('✅ Test cleanup completed');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:');
    console.error('Full error object:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
};

if (require.main === module) {
  testCloudinaryConnection();
}

module.exports = { testCloudinaryConnection };