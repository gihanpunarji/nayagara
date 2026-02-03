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

        // Migration 005
        const sql005 = fs.readFileSync(path.join(__dirname, '../migrations/005_add_performance_indexes.sql'), 'utf8');
        console.log('Running 005 (Adding indexes)...');
        // Split by semicolon to run individually, catching errors if index already exists
        const statements = sql005.split(';').filter(stmt => stmt.trim());

        for (const stmt of statements) {
            try {
                await connection.query(stmt);
                console.log('  -> Executed index creation.');
            } catch (e) {
                if (e.code === 'ER_DUP_KEYNAME') {
                    console.log('  -> Index already exists, skipping.');
                } else {
                    console.warn('  -> Error creating index:', e.message);
                }
            }
        }

        console.log('005 Done.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

runMigrations();
