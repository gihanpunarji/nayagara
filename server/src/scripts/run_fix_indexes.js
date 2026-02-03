const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Setup logging to file
const logFile = path.join(__dirname, 'migration_output.txt');
const log = (msg) => {
    console.log(msg);
    try { fs.appendFileSync(logFile, msg + '\n'); } catch (e) { }
};

log('Starting migration script at ' + new Date().toISOString());

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
        log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        log('Connected successfully.');

        // Simple index creation queries
        const queries = [
            "CREATE INDEX idx_products_status ON products(product_status)",
            "CREATE INDEX idx_products_seller_id ON products(seller_id)",
            "CREATE INDEX idx_products_category_id ON products(category_id)",
            "CREATE INDEX idx_products_created_at ON products(created_at)",
            "CREATE INDEX idx_products_price ON products(price)",
            "CREATE INDEX idx_product_images_product_id ON product_images(product_id)"
        ];

        for (const q of queries) {
            try {
                log(`Running: ${q}`);
                await connection.query(q);
                log('  -> Success');
            } catch (e) {
                if (e.code === 'ER_DUP_KEYNAME') {
                    log('  -> Index already exists (Skipping)');
                } else {
                    log(`  -> Error: ${e.message}`);
                }
            }
        }

        log('All operations completed.');
    } catch (e) {
        log(`Fatal Error: ${e.message}`);
    } finally {
        if (connection) await connection.end();
        log('Connection closed.');
    }
}

run();
