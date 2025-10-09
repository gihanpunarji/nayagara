const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'u331468302_nayagara_water',
  port: process.env.DB_PORT || 3306
};

async function testDatabaseSetup() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check existing categories
    console.log('\n📁 Checking categories...');
    const [categories] = await connection.execute('SELECT * FROM categories');
    console.log('Categories found:', categories.length);
    categories.forEach(cat => {
      console.log(`  ${cat.category_id}: ${cat.category_name}`);
    });

    // Check subcategories
    console.log('\n📂 Checking subcategories...');
    const [subcategories] = await connection.execute('SELECT * FROM sub_categories LIMIT 10');
    console.log('Subcategories found:', subcategories.length);
    subcategories.forEach(sub => {
      console.log(`  ${sub.sub_category_id}: ${sub.sub_category_name} (category: ${sub.categories_category_id})`);
    });

    // Check if subcategory_id column exists in products table
    console.log('\n🏗️  Checking products table structure...');
    const [tableInfo] = await connection.execute('DESCRIBE products');
    const hasSubcategoryField = tableInfo.some(field => field.Field === 'subcategory_id');
    console.log('Has subcategory_id field:', hasSubcategoryField);

    if (!hasSubcategoryField) {
      console.log('\n⚠️  Adding subcategory_id field to products table...');
      try {
        await connection.execute('ALTER TABLE products ADD COLUMN subcategory_id INT(11) DEFAULT NULL');
        await connection.execute('ALTER TABLE products ADD CONSTRAINT products_ibfk_2 FOREIGN KEY (subcategory_id) REFERENCES sub_categories (sub_category_id)');
        await connection.execute('CREATE INDEX idx_products_subcategory ON products(subcategory_id)');
        console.log('✅ Subcategory field added successfully');
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log('ℹ️  Subcategory field already exists');
        } else {
          console.error('❌ Error adding subcategory field:', error.message);
        }
      }
    }

    // Check for test seller
    console.log('\n👤 Checking for test seller...');
    const [users] = await connection.execute('SELECT user_id, user_email, user_type FROM users WHERE user_email = ?', ['test@seller.com']);
    if (users.length > 0) {
      console.log('✅ Test seller found:', users[0]);
    } else {
      console.log('⚠️  Test seller not found. Run createTestSeller.js first');
    }

    // Test creating a simple product
    console.log('\n🧪 Testing product creation...');
    
    if (users.length > 0) {
      const testProduct = {
        productTitle: 'Test Product',
        productSlug: 'test-product-' + Date.now(),
        productDescription: 'This is a test product to verify database setup',
        categoryId: 1, // Electronics
        subcategoryId: 1, // Mobile Phones
        sellerId: users[0].user_id,
        price: 1000.00,
        currencyCode: 'LKR',
        stockQuantity: 10,
        productStatus: 'draft',
        productAttributes: JSON.stringify({ test: 'value' })
      };

      try {
        const [result] = await connection.execute(
          `INSERT INTO products (
            product_title, product_slug, product_description, category_id, 
            ${hasSubcategoryField ? 'subcategory_id,' : ''} seller_id, 
            price, currency_code, stock_quantity, product_status, 
            product_attributes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ${hasSubcategoryField ? '?, ' : ''}?, ?, ?, ?, ?, ?, ?, ?)`,
          hasSubcategoryField ? [
            testProduct.productTitle, testProduct.productSlug, testProduct.productDescription,
            testProduct.categoryId, testProduct.subcategoryId, testProduct.sellerId,
            testProduct.price, testProduct.currencyCode, testProduct.stockQuantity,
            testProduct.productStatus, testProduct.productAttributes, new Date(), new Date()
          ] : [
            testProduct.productTitle, testProduct.productSlug, testProduct.productDescription,
            testProduct.categoryId, testProduct.sellerId, testProduct.price,
            testProduct.currencyCode, testProduct.stockQuantity, testProduct.productStatus,
            testProduct.productAttributes, new Date(), new Date()
          ]
        );

        console.log('✅ Test product created successfully! Product ID:', result.insertId);

        // Clean up test product
        await connection.execute('DELETE FROM products WHERE product_id = ?', [result.insertId]);
        console.log('🧹 Test product cleaned up');

      } catch (error) {
        console.error('❌ Error creating test product:', error.message);
        console.log('Error code:', error.code);
      }
    }

    console.log('\n🎉 Database test completed!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the test
if (require.main === module) {
  testDatabaseSetup()
    .then(() => {
      console.log('\n✅ All tests completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testDatabaseSetup };