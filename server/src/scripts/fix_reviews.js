const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { getConnection } = require('../config/database');

async function debugReviews() {
  console.log('Debugging Reviews...');
  const pool = getConnection();
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 1. Check all reviews
    const [reviews] = await connection.execute('SELECT review_id, user_id, product_id, order_id FROM product_reviews');
    console.log('Current Reviews in DB:', reviews);

    // 2. Check for reviews with NULL order_id and try to fix them
    // (Heuristic: Find the most recent delivered order for this user/product)
    console.log('Attempting to backfill NULL order_ids...');
    
    for (const r of reviews) {
      if (!r.order_id) {
        console.log(`Fixing Review ${r.review_id} (User: ${r.user_id}, Product: ${r.product_id})...`);
        
        const [orders] = await connection.execute(`
          SELECT o.order_id 
          FROM orders o
          JOIN order_items oi ON o.order_id = oi.order_id
          WHERE o.customer_id = ? 
          AND oi.product_id = ? 
          AND o.order_status = 'delivered'
          ORDER BY o.order_datetime DESC
          LIMIT 1
        `, [r.user_id, r.product_id]);

        if (orders.length > 0) {
            const matchedOrderId = orders[0].order_id;
            await connection.execute('UPDATE product_reviews SET order_id = ? WHERE review_id = ?', [matchedOrderId, r.review_id]);
            console.log(`-> Updated Review ${r.review_id} with Order ID ${matchedOrderId}`);
        } else {
            console.log(`-> No matching delivered order found for Review ${r.review_id}`);
        }
      }
    }
    
    console.log('Debug/Fix complete.');

  } catch (error) {
    console.error('Debug failed:', error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

debugReviews();
