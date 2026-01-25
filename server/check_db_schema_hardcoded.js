
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '193.203.184.9',
  user: 'u331468302_nayagara_water',
  password: 'Po~MJs$kh$1j',
  database: 'u331468302_nayagara_water',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkSchema() {
  try {
    const connection = await pool.getConnection();
    const [columns] = await connection.execute("SHOW COLUMNS FROM products LIKE 'product_status'");
    console.log("Column Info:", JSON.stringify(columns, null, 2));

    const [rows] = await connection.execute("SELECT product_id, product_status FROM products ORDER BY product_id DESC LIMIT 5");
    console.log("Sample Data:", JSON.stringify(rows, null, 2));
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkSchema();
