const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { getConnection } = require('../config/database');

async function migrate() {
  console.log('Starting migration...');
  const pool = getConnection(); // This might expect env vars to be loaded
  
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connected to database.');

    // Check if column exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'nayagara'}' 
      AND TABLE_NAME = 'product_reviews' 
      AND COLUMN_NAME = 'order_id'
    `);

    if (columns.length > 0) {
      console.log('Column order_id already exists. Skipping add.');
    } else {
      console.log('Adding order_id column...');
      await connection.execute('ALTER TABLE product_reviews ADD COLUMN order_id INT NULL');
      console.log('Column added.');
      
      console.log('Adding foreign key constraint...');
      try {
        await connection.execute('ALTER TABLE product_reviews ADD CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(order_id)');
        console.log('Constraint added.');
      } catch (e) {
         console.warn('Constraint might already exist or failed:', e.message);
      }
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) connection.release();
    // pool.end() might be needed if script hangs
    process.exit(0);
  }
}

migrate();
