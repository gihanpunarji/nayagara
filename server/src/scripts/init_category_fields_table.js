const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('Database Config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database
});

const setup = async () => {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully.');

        // Check if sub_categories table exists first
        const [tables] = await connection.query("SHOW TABLES LIKE 'sub_categories'");
        if (tables.length === 0) {
            console.error('Error: sub_categories table does not exist! Cannot create foreign key constraint.');
            process.exit(1);
        }

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS category_fields (
                field_id INT AUTO_INCREMENT PRIMARY KEY,
                field_name VARCHAR(255) NOT NULL,
                field_label VARCHAR(255) NOT NULL,
                field_type VARCHAR(50) DEFAULT 'select',
                field_options JSON,
                is_required BOOLEAN DEFAULT FALSE,
                validation_rules JSON,
                sub_categories_sub_category_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (sub_categories_sub_category_id) REFERENCES sub_categories(sub_category_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;

        console.log('Creating category_fields table...');
        await connection.execute(createTableQuery);
        console.log('Table category_fields created/ensured successfully.');

    } catch (error) {
        console.error('Setup failed:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
        process.exit(0);
    }
};

setup();
