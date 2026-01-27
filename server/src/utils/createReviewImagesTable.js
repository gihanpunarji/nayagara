const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../../.env') });
const { connectDB, getConnection } = require('../config/database');

const createTable = async () => {
  try {
    await connectDB();
    const connection = getConnection();
    
    console.log('Creating review_images table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS review_images (
        image_id INT PRIMARY KEY AUTO_INCREMENT,
        review_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES product_reviews(review_id) ON DELETE CASCADE
      )
    `);
    
    console.log('Table created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
};

createTable();
