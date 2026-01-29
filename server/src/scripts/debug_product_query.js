const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nayagara_db'
};

async function debugQuery() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        const productId = 10; // The ID failing in the user request

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
        COALESCE(r.review_count, 0) as review_count,
        COALESCE(r.avg_rating, 0) as average_rating,
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
        LEFT JOIN (
          SELECT product_id, COUNT(*) as review_count, AVG(rating) as avg_rating
          FROM product_reviews 
          WHERE status = 'active'
          GROUP BY product_id
        ) r ON p.product_id = r.product_id
      WHERE
        p.product_id = ?
        AND p.product_status = 'active'
      GROUP BY p.product_id
    `;

        console.log("Executing query...");
        const [results] = await connection.execute(query, [productId]);
        console.log("Success!", results);

    } catch (error) {
        console.error('Query Failed:', error.message);
        console.error('Code:', error.code);
        console.error('SQL State:', error.sqlState);
    } finally {
        if (connection) await connection.end();
    }
}

debugQuery();
