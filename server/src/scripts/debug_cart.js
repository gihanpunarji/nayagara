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

/* Paste Cart Model Logic Here adapted for script */
async function getCart(userId) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log(`Fetching cart for user ${userId}...`);
        const [rows] = await connection.execute(`
        SELECT
          sc.cart_id,
          sc.user_id,
          sc.product_id,
          sci.quantity,
          sci.cart_item_id,
          sci.updated_at,
          sc.created_at,
          p.product_title,
          p.price,
          p.cost,
          p.stock_quantity,
          p.seller_id,
          p.shipping_cost,
          COALESCE(p.weight_kg, 1.0) as weight_kg,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = 1 LIMIT 1) as image_url,
          u.first_name as seller_first_name,
          u.last_name as seller_last_name,
          s.store_name as seller_business_name,
          sc.variant_id
        FROM shopping_cart sc
        LEFT JOIN shopping_cart_item sci ON sc.cart_id = sci.shopping_cart_cart_id
        LEFT JOIN products p ON sc.product_id = p.product_id
        LEFT JOIN users u ON p.seller_id = u.user_id
        LEFT JOIN store s ON u.user_id = s.user_id
        WHERE sc.user_id = ? AND sci.quantity IS NOT NULL
        GROUP BY sc.cart_id, sci.cart_item_id
        ORDER BY sc.created_at DESC
      `, [userId]);

        console.log(`Found ${rows.length} items.`);
        if (rows.length > 0) {
            console.log("First item:", rows[0]);

            // Mimic controller mapping
            const item = rows[0];
            const mapped = {
                id: item.variant_id ? `${item.product_id}-${item.variant_id}` : item.product_id,
                seller: item.seller_business_name || `${item.seller_first_name || ''} ${item.seller_last_name || ''}`.trim() || 'Unknown Seller'
            };
            console.log("Mapped item:", mapped);
        }

    } catch (error) {
        console.error("Cart fetch error:", error);
    } finally {
        await connection.end();
    }
}

async function run() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Find a user with a cart
        const [users] = await connection.execute("SELECT DISTINCT user_id FROM shopping_cart LIMIT 1");
        if (users.length > 0) {
            await getCart(users[0].user_id);
        } else {
            console.log("No users with a cart found.");
            // Try fetching for any user
            const [anyUser] = await connection.execute("SELECT user_id FROM users LIMIT 1");
            if (anyUser.length > 0) await getCart(anyUser[0].user_id);
        }
    } catch (e) {
        console.error("Setup error:", e);
    } finally {
        await connection.end();
    }
}

run();
