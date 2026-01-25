
const { getConnection } = require('./server/src/config/database');
const fs = require('fs');
const path = require('path');

// Mock env if needed or assume it picks up from .env in server/
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

async function checkSchema() {
  try {
    const connection = getConnection();
    const [columns] = await connection.execute("SHOW COLUMNS FROM products LIKE 'product_status'");
    console.log("Column Info:", JSON.stringify(columns, null, 2));

    const [rows] = await connection.execute("SELECT product_id, product_status FROM products LIMIT 5");
    console.log("Sample Data:", JSON.stringify(rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkSchema();
