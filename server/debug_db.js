const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function debug() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to DB');

        // Search for product
        const [rows] = await connection.execute(
            "SELECT product_id, product_title, price, pending_updates, product_slug FROM products WHERE product_title LIKE '%Premium Mosquito Net%' OR product_slug LIKE '%premium-mosquito-net%'"
        );

        if (rows.length === 0) {
            console.log('No product found');
        } else {
            console.log('Product Found:', rows[0].product_title, 'ID:', rows[0].product_id);
            console.log('Main Price:', rows[0].price);
            console.log('Pending Updates:', rows[0].pending_updates);

            const productId = rows[0].product_id;
            const [variants] = await connection.execute(
                "SELECT * FROM product_variants WHERE product_id = ?",
                [productId]
            );

            console.log('Variants in DB:', variants);
        }

        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

debug();
