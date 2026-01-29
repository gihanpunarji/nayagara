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

async function listTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SHOW TABLES");
        console.log("Tables:", rows.map(r => Object.values(r)[0]));
    } catch (error) {
        console.error('Failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

listTables();
