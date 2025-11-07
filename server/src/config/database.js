const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log("MySQL pool created successfully");
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();

  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

const getConnection = () => pool;

module.exports = { connectDB, getConnection };
