const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nayagara_db',
    multipleStatements: true
};

async function run() {
    let connection;
    try {
        console.log("Connecting to DB...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected.");

        // Create variants table
        console.log("Creating product_variants table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS product_variants (
                variant_id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                stock_quantity INT DEFAULT 0,
                sku VARCHAR(100),
                attributes JSON,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
            );
        `);
        console.log("product_variants table created.");

        // Alter shopping cart table
        console.log("Checking if shopping_cart needs variant_id...");
        const [columns] = await connection.query("SHOW COLUMNS FROM shopping_cart LIKE 'variant_id'");
        if (columns.length === 0) {
            console.log("Adding variant_id column to shopping_cart...");
            await connection.query("ALTER TABLE shopping_cart ADD COLUMN variant_id INT NULL DEFAULT NULL");
            console.log("Column added.");
            try {
                await connection.query("ALTER TABLE shopping_cart ADD CONSTRAINT fk_cart_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL");
                console.log("FK constraint added.");
            } catch (fkError) {
                console.warn("Could not add FK constraint (maybe index missing or mismatch):", fkError.message);
            }
        } else {
            console.log("shopping_cart already has variant_id column.");
        }

    } catch (error) {
        console.error("Migration Error:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Done.");
    }
}

run();
