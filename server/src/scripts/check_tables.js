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

async function checkTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const [rows] = await connection.execute("SHOW TABLES LIKE 'product_variants'");
        if (rows.length > 0) {
            console.log("Table 'product_variants' exists.");
        } else {
            console.log("Table 'product_variants' DOES NOT EXIST.");
        }

        // Also check cart column
        const [cols] = await connection.execute("SHOW COLUMNS FROM shopping_cart LIKE 'variant_id'");
        if (cols.length > 0) {
            console.log("Column 'variant_id' in shopping_cart exists.");
        } else {
            console.log("Column 'variant_id' in shopping_cart DOES NOT EXIST.");
        }

    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkTables();
