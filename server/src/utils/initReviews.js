const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require("mysql2/promise");

const initReviews = async () => {
  let connection;
  try {
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306, // Add port fallback
    };
    
    console.log("Connecting to database...");
    connection = await mysql.createConnection(config);
    console.log("Connected.");

    // Create product_reviews table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        review_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating FLOAT NOT NULL,
        review_title VARCHAR(255),
        review_comment TEXT,
        is_verified_purchase BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        helpful_count INT DEFAULT 0,
        not_helpful_count INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("product_reviews table created or verified.");

    // Create review_images table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS review_images (
        image_id INT AUTO_INCREMENT PRIMARY KEY,
        review_id INT NOT NULL,
        image_url VARCHAR(255),
        FOREIGN KEY (review_id) REFERENCES product_reviews(review_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("review_images table created or verified.");

    console.log("Review tables initialization completed successfully.");
  } catch (error) {
    console.error("Failed to initialize review tables:", error);
  } finally {
    if (connection) await connection.end();
  }
};

initReviews();
