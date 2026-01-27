
const axios = require('axios');
require('dotenv').config({ path: './server/.env' });

// Need a valid token and product ID to test.
// Since I can't easily get a token without login, I'll rely on server logs for now.
// BUT I can create a script that bypasses auth middleware if I run it LOCALLY against the controller directly if I mock req/res.
// Better: Test the Model directly first to rule out DB issues.

const { getConnection } = require('./server/src/config/database');
const Product = require('./server/src/models/Product');

async function testModelUpdate() {
  try {
    const connection = getConnection();
    
    // 1. Get a product
    const [products] = await connection.execute("SELECT * FROM products LIMIT 1");
    if (products.length === 0) {
      console.log("No products to test");
      return;
    }
    
    const product = products[0];
    console.log("Testing with product:", product.product_id, product.product_title);
    console.log("Current Status:", product.product_status);
    
    // 2. toggle status
    const newStatus = product.product_status === 'active' ? 'inactive' : 'active';
    console.log("Attempting to set to:", newStatus);
    
    const result = await Product.updateStatus(product.product_id, newStatus);
    console.log("Update Result (Rows Affected):", result);
    
    // 3. Verify
    const updated = await Product.findById(product.product_id);
    console.log("New Status:", updated.product_status);
    
    // 4. Revert
    await Product.updateStatus(product.product_id, product.product_status);
    console.log("Reverted to original status.");
    
    process.exit(0);
  } catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
  }
}

testModelUpdate();
