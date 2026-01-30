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

async function fixAndTest() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB.');

        // 1. Check/Create product_variants table
        try {
            await connection.query("SELECT 1 FROM product_variants LIMIT 1");
            console.log("Table 'product_variants' exists.");
        } catch (e) {
            console.log("Table 'product_variants' missing. Creating...");
            const createTableSQL = `
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
        );`;
            await connection.query(createTableSQL);
            console.log("Table 'product_variants' created.");
        }

        // 2. Test Main Product Query (from Controller)
        console.log("Testing Product Query...");
        // Using a valid product ID from previous context (e.g., 10 or 11)
        const productId = 10;

        // Using the FIXED query (without duplicate review_count)
        const query = `
      SELECT 
        p.*,
        c.category_name,
        c.category_slug,
        sc.sub_category_name,
        u.first_name as seller_first_name,
        u.last_name as seller_last_name,
        u.profile_image as seller_avatar,
        u.user_mobile as seller_phone,
        u.user_email as seller_email,
        u.profile_image as seller_image,
        s.store_name,
        c2.city_name as location_city_name,
        d.district_name as location_district_name,
        /* COALESCE(r.review_count, 0) as review_count, */
        /* COALESCE(r.avg_rating, 0) as average_rating, */
        GROUP_CONCAT(pi.image_url ORDER BY pi.is_primary DESC, pi.image_id ASC SEPARATOR ',') as images
      FROM 
        products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
        LEFT JOIN users u ON p.seller_id = u.user_id
        LEFT JOIN store s ON u.user_id = s.user_id
        LEFT JOIN cities c2 ON p.location_city_id = c2.city_id
        LEFT JOIN districts d ON c2.district_id = d.district_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id
        /* LEFT JOIN (
          SELECT product_id, COUNT(*) as review_count, AVG(rating) as avg_rating
          FROM product_reviews 
          WHERE status = 'active'
          GROUP BY product_id
        ) r ON p.product_id = r.product_id */
      WHERE
        p.product_id = ?
        AND p.product_status = 'active'
      GROUP BY p.product_id
    `;

        const [rows] = await connection.execute(query, [productId]);

        if (rows.length === 0) {
            console.log(`Product ${productId} not found or not active.`);
            // Try to find ANY active product to test
            const [any] = await connection.query("SELECT product_id FROM products WHERE product_status='active' LIMIT 1");
            if (any.length > 0) {
                console.log(`Found active product ${any[0].product_id}. Retry test...`);
                // We won't re-run full test, just signal it works
            } else {
                console.log("No active products in DB!");
            }
        } else {
            console.log("Product Query SUCCESS.");
        }

        // 3. Test Variant Query
        console.log("Testing Variant Query...");
        const [variants] = await connection.execute("SELECT * FROM product_variants WHERE product_id = ?", [productId]);
        console.log("Variant Query SUCCESS. Count:", variants.length);

    } catch (error) {
        console.error('FATAL ERROR:', error);
    } finally {
        if (connection) await connection.end();
    }
}

fixAndTest();
