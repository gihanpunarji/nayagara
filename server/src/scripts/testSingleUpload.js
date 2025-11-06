require('dotenv').config();
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const testSingleUpload = async () => {
  console.log('🧪 Testing single image upload...\n');
  
  const testFile = 'uploads/profile-pictures/39_1759599951515.jpeg';
  
  if (!fs.existsSync(testFile)) {
    console.error(`❌ Test file ${testFile} does not exist`);
    return;
  }
  
  console.log(`📁 File exists: ${testFile}`);
  console.log(`📏 File size: ${fs.statSync(testFile).size} bytes`);
  
  try {
    console.log('⬆️ Uploading to Cloudinary...');
    
    const result = await cloudinary.uploader.upload(testFile, {
      public_id: 'uploads/profile-pictures/39_1759599951515',
      overwrite: true,
      resource_type: 'auto',
      use_filename: false,
      unique_filename: false
    });
    
    console.log('✅ Upload successful!');
    console.log('Public ID:', result.public_id);
    console.log('Secure URL:', result.secure_url);
    console.log('Format:', result.format);
    console.log('Resource type:', result.resource_type);
    
  } catch (error) {
    console.error('❌ Upload failed:');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
  }
};

if (require.main === module) {
  testSingleUpload();
}

module.exports = { testSingleUpload };