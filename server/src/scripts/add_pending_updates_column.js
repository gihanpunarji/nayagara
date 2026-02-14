const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nayagara_db'
};

async function addColumn() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // Check if column exists
        const [cols] = await connection.execute(
            "SHOW COLUMNS FROM products LIKE 'pending_updates'"
        );

        if (cols.length > 0) {
            console.log("Column 'pending_updates' already exists.");
        } else {
            console.log("Adding 'pending_updates' column...");
            await connection.execute(
                "ALTER TABLE products ADD COLUMN pending_updates JSON DEFAULT NULL"
            );
            console.log("Column added successfully.");
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addColumn();
