const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Shks5670",
  database: process.env.DB_NAME || "nayagara_db",
};

let connection;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("MySQL connected successfully");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
    );
    await connection.query(`USE ${dbConfig.database}`);

    return connection;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

const getConnection = () => connection;

module.exports = { connectDB, getConnection };
