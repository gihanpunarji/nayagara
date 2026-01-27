const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require("mysql2/promise");

const resetReviews = async () => {
  let connection;
  try {
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    };
    
    console.log("Connecting to database...");
    connection = await mysql.createConnection(config);
    console.log("Connected.");

    // Drop tables if they exist (images first due to FK constraint)
    console.log("Dropping existing review tables...");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    await connection.execute("DROP TABLE IF EXISTS review_images");
    await connection.execute("DROP TABLE IF EXISTS product_reviews");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Tables dropped.");

    // Create product_reviews table
    console.log("Creating product_reviews table...");
    await connection.execute(`
      CREATE TABLE product_reviews (
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

    // Create review_images table
    console.log("Creating review_images table...");
    await connection.execute(`
      CREATE TABLE review_images (
        image_id INT AUTO_INCREMENT PRIMARY KEY,
        review_id INT NOT NULL,
        image_url VARCHAR(255),
        FOREIGN KEY (review_id) REFERENCES product_reviews(review_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("Review tables reset successfully with correct schema.");
  } catch (error) {
    console.error("Failed to reset review tables:", error);
  } finally {
    if (connection) await connection.end();
  }
};

resetReviews();
