const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, // Reduced for serverless to avoid exhausting connections
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Serverless optimizations
  connectTimeout: 10000, // 10 seconds
  maxIdle: 2, // Close idle connections faster in serverless
  idleTimeout: 60000 // 1 minute idle timeout
};

let pool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool(dbConfig);
      console.log("MySQL pool created successfully");
    }

    // Test the connection only if pool is new
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();

  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error; // Don't exit in serverless environment
  }
};

// Lazy pool initialization for serverless
const getConnection = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

module.exports = { connectDB, getConnection };
