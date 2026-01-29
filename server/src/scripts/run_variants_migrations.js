const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nayagara_db',
    multipleStatements: true
};

async function runMigrations() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // Migration 003
        const sql003 = fs.readFileSync(path.join(__dirname, '../migrations/003_add_product_variants.sql'), 'utf8');
        console.log('Running 003...');
        await connection.query(sql003);
        console.log('003 Done.');

        // Migration 004
        const sql004 = fs.readFileSync(path.join(__dirname, '../migrations/004_add_variant_to_shopping_cart.sql'), 'utf8');
        console.log('Running 004...');
        try {
            await connection.query(sql004);
            console.log('004 Done.');
        } catch (e) {
            console.log('004 Error (might define existing col?):', e.message);
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

runMigrations();
