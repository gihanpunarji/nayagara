const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nayagara_water',
  port: process.env.DB_PORT || 3306
};

async function createTestSeller() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('📱 Connected to database');

    // Check if test seller already exists
    const [existingUsers] = await connection.execute(
      'SELECT user_id FROM users WHERE email = ?',
      ['test@seller.com']
    );

    if (existingUsers.length > 0) {
      console.log('✅ Test seller already exists with ID:', existingUsers[0].user_id);
      return existingUsers[0].user_id;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('testpassword', 10);

    // Insert test user
    const [userResult] = await connection.execute(
      `INSERT INTO users (
        first_name, last_name, email, password, mobile, 
        user_type, email_verified, mobile_verified, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Test', 
        'Seller', 
        'test@seller.com', 
        hashedPassword, 
        '0771234567',
        'seller', 
        1, 
        1, 
        1
      ]
    );

    const userId = userResult.insertId;
    console.log('👤 Created test user with ID:', userId);

    // Insert seller profile
    const [sellerResult] = await connection.execute(
      `INSERT INTO seller_profiles (
        user_id, business_name, business_type, tax_id, 
        business_description, is_verified, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'Test Seller Business',
        'retail',
        'TAX123456',
        'Test seller for sample products',
        1,
        'verified'
      ]
    );

    console.log('🏪 Created seller profile');

    // Insert business address
    await connection.execute(
      `INSERT INTO addresses (
        user_id, address_type, line1, line2, postal_code, city_id
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'seller_business',
        '123 Test Street',
        'Test Area',
        '10000',
        1 // Assuming Colombo city_id is 1
      ]
    );

    console.log('📍 Created business address');
    console.log('✅ Test seller setup completed!');
    console.log('📧 Email: test@seller.com');
    console.log('🔑 Password: testpassword');
    
    return userId;

  } catch (error) {
    console.error('❌ Error creating test seller:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Export function
module.exports = { createTestSeller };

// Run if called directly
if (require.main === module) {
  createTestSeller()
    .then(userId => {
      console.log(`\n🎉 Test seller created successfully with user ID: ${userId}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Failed to create test seller:', error.message);
      process.exit(1);
    });
}