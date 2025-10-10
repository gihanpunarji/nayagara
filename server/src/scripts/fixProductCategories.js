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

async function fixProductCategories() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    console.log('\n🔧 Fixing product category assignments...');

    // Fix specific products based on their names and content
    const productFixes = [
      // Electronics products
      {
        productId: 1006, // "Iphone 17 pro max"
        categoryId: 1,   // Electronics
        subcategoryId: 1, // Mobile Phones
        reason: "iPhone is a mobile phone"
      },
      {
        productId: 1007, // "Samsung galaxy S25 Ultra"
        categoryId: 1,   // Electronics
        subcategoryId: 1, // Mobile Phones
        reason: "Samsung Galaxy is a mobile phone"
      },
      {
        productId: 1012, // "Dell XPS 15 9530"
        categoryId: 1,   // Electronics
        subcategoryId: 2, // Laptops
        reason: "Dell XPS is a laptop"
      },
      
      // Fashion products
      {
        productId: 1013, // "Elegant Summer Maxi Dress"
        categoryId: 2,   // Fashion
        subcategoryId: 6, // Women Clothing
        reason: "Maxi dress is women's clothing"
      },
      
      // Books & Media products
      {
        productId: 1011, // "Love Hypothesis | A Romance Novel that Gets All the Stars"
        categoryId: 7,   // Books & Media
        subcategoryId: 21, // Books
        reason: "Romance novel is a book"
      }
    ];

    // Apply fixes
    for (const fix of productFixes) {
      try {
        console.log(`\n📝 Fixing Product ${fix.productId}: ${fix.reason}`);
        
        const [result] = await connection.execute(
          'UPDATE products SET category_id = ?, subcategory_id = ? WHERE product_id = ?',
          [fix.categoryId, fix.subcategoryId, fix.productId]
        );
        
        if (result.affectedRows > 0) {
          console.log(`✅ Updated Product ${fix.productId} successfully`);
          console.log(`   Category: ${fix.categoryId}, Subcategory: ${fix.subcategoryId}`);
        } else {
          console.log(`⚠️  Product ${fix.productId} not found or no changes made`);
        }
      } catch (error) {
        console.error(`❌ Error updating Product ${fix.productId}:`, error.message);
      }
    }

    // Handle the undefined product (ID 1015)
    console.log('\n🗑️  Checking product 1015...');
    const [product1015] = await connection.execute(
      'SELECT product_title, product_description FROM products WHERE product_id = 1015'
    );
    
    if (product1015.length > 0) {
      const title = product1015[0].product_title;
      console.log(`Product 1015 title: "${title}"`);
      
      if (!title || title.trim() === 'fdsf' || title.trim().length < 3) {
        console.log('🗑️  Product appears to be a test/invalid entry. Consider removing it.');
        // Uncomment the line below if you want to delete it
        // await connection.execute('DELETE FROM products WHERE product_id = 1015');
        // console.log('✅ Deleted invalid product');
      } else {
        console.log('⚠️  Product title is unclear, manual review needed');
      }
    }

    // Verify the fixes
    console.log('\n🔍 Verifying fixes...');
    const [updatedProducts] = await connection.execute(`
      SELECT 
        p.product_id, 
        p.product_title, 
        p.category_id,
        p.subcategory_id,
        c.category_name,
        sc.sub_category_name
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.category_id 
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      ORDER BY p.product_id
    `);

    console.log('\n📋 Updated product assignments:');
    updatedProducts.forEach(product => {
      console.log(`${product.product_id}: "${product.product_title}"`);
      console.log(`  → ${product.category_name} > ${product.sub_category_name || 'No subcategory'}`);
    });

    // Test category filtering
    console.log('\n🧪 Testing category filtering:');
    
    // Test Electronics
    const [electronicsTest] = await connection.execute(`
      SELECT p.product_title, c.category_name, sc.sub_category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.category_id = 1
    `);
    console.log(`Electronics: ${electronicsTest.length} products`);
    electronicsTest.forEach(p => console.log(`  ✓ ${p.product_title} (${p.sub_category_name || 'No subcategory'})`));

    // Test Fashion
    const [fashionTest] = await connection.execute(`
      SELECT p.product_title, c.category_name, sc.sub_category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.category_id = 2
    `);
    console.log(`\nFashion: ${fashionTest.length} products`);
    fashionTest.forEach(p => console.log(`  ✓ ${p.product_title} (${p.sub_category_name || 'No subcategory'})`));

    // Test Books & Media
    const [booksTest] = await connection.execute(`
      SELECT p.product_title, c.category_name, sc.sub_category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.category_id = 7
    `);
    console.log(`\nBooks & Media: ${booksTest.length} products`);
    booksTest.forEach(p => console.log(`  ✓ ${p.product_title} (${p.sub_category_name || 'No subcategory'})`));

    // Test subcategory filtering
    console.log('\n📱 Testing subcategory filtering:');
    const [mobileTest] = await connection.execute(`
      SELECT p.product_title, sc.sub_category_name
      FROM products p
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.subcategory_id = 1
    `);
    console.log(`Mobile Phones: ${mobileTest.length} products`);
    mobileTest.forEach(p => console.log(`  ✓ ${p.product_title}`));

    const [laptopTest] = await connection.execute(`
      SELECT p.product_title, sc.sub_category_name
      FROM products p
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.subcategory_id = 2
    `);
    console.log(`\nLaptops: ${laptopTest.length} products`);
    laptopTest.forEach(p => console.log(`  ✓ ${p.product_title}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the fix script
if (require.main === module) {
  fixProductCategories()
    .then(() => {
      console.log('\n🎉 Product category fixes completed!');
      console.log('\n📝 Next steps:');
      console.log('1. Test your category navigation in the frontend');
      console.log('2. Check that products appear in correct categories');
      console.log('3. Verify subcategory filtering works');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Fix failed:', error.message);
      process.exit(1);
    });
}

module.exports = { fixProductCategories };