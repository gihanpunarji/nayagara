
const { getConnection } = require('./src/config/database');
const path = require('path');
require('dotenv').config();

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
