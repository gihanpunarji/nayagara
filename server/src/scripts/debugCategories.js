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

async function debugCategories() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check categories
    console.log('\n📁 Categories in database:');
    const [categories] = await connection.execute('SELECT * FROM categories ORDER BY category_id');
    categories.forEach(cat => {
      console.log(`  ${cat.category_id}: ${cat.category_name} (slug: ${cat.category_slug})`);
    });

    // Check subcategories
    console.log('\n📂 Subcategories in database:');
    const [subcategories] = await connection.execute(`
      SELECT sc.*, c.category_name 
      FROM sub_categories sc 
      JOIN categories c ON sc.categories_category_id = c.category_id 
      ORDER BY sc.sub_category_id
    `);
    subcategories.forEach(sub => {
      console.log(`  ${sub.sub_category_id}: ${sub.sub_category_name} → Category: ${sub.category_name} (${sub.categories_category_id})`);
    });

    // Check products and their categories
    console.log('\n📦 Products in database:');
    const [products] = await connection.execute(`
      SELECT 
        p.product_id, 
        p.product_title, 
        p.category_id,
        p.subcategory_id,
        c.category_name,
        c.category_slug,
        sc.sub_category_name
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.category_id 
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      ORDER BY p.product_id
    `);

    if (products.length === 0) {
      console.log('  ⚠️  No products found in database!');
    } else {
      products.forEach(product => {
        console.log(`  ${product.product_id}: "${product.product_title}"`);
        console.log(`    Category: ${product.category_name || 'NULL'} (ID: ${product.category_id || 'NULL'})`);
        console.log(`    Subcategory: ${product.sub_category_name || 'NULL'} (ID: ${product.subcategory_id || 'NULL'})`);
        console.log('');
      });
    }

    // Test category filtering
    console.log('\n🔍 Testing category filtering:');
    
    // Test with category_id = 1 (Electronics)
    const [electronicsProducts] = await connection.execute(`
      SELECT p.product_title, c.category_name, sc.sub_category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.category_id = 1
    `);
    console.log(`Electronics category (ID=1): ${electronicsProducts.length} products`);
    electronicsProducts.forEach(p => console.log(`  - ${p.product_title}`));

    // Test with category slug
    const [electronicsProductsBySlug] = await connection.execute(`
      SELECT p.product_title, c.category_name, c.category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE c.category_slug = 'electronics'
    `);
    console.log(`\nElectronics by slug: ${electronicsProductsBySlug.length} products`);
    electronicsProductsBySlug.forEach(p => console.log(`  - ${p.product_title}`));

    // Test subcategory filtering
    const [mobileProducts] = await connection.execute(`
      SELECT p.product_title, sc.sub_category_name
      FROM products p
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.subcategory_id = 1
    `);
    console.log(`\nMobile Phones subcategory (ID=1): ${mobileProducts.length} products`);
    mobileProducts.forEach(p => console.log(`  - ${p.product_title}`));

    // Check for mismatched data
    console.log('\n🚨 Checking for data inconsistencies:');
    
    // Products with invalid category_id
    const [invalidCategories] = await connection.execute(`
      SELECT p.product_id, p.product_title, p.category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id IS NOT NULL AND c.category_id IS NULL
    `);
    if (invalidCategories.length > 0) {
      console.log(`❌ Products with invalid category_id:`);
      invalidCategories.forEach(p => console.log(`  Product ${p.product_id}: "${p.product_title}" has category_id ${p.category_id} which doesn't exist`));
    } else {
      console.log(`✅ All products have valid category_id`);
    }

    // Products with invalid subcategory_id
    const [invalidSubcategories] = await connection.execute(`
      SELECT p.product_id, p.product_title, p.subcategory_id
      FROM products p
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.subcategory_id IS NOT NULL AND sc.sub_category_id IS NULL
    `);
    if (invalidSubcategories.length > 0) {
      console.log(`❌ Products with invalid subcategory_id:`);
      invalidSubcategories.forEach(p => console.log(`  Product ${p.product_id}: "${p.product_title}" has subcategory_id ${p.subcategory_id} which doesn't exist`));
    } else {
      console.log(`✅ All products have valid subcategory_id`);
    }

    // Check category-subcategory relationship consistency
    const [inconsistentProducts] = await connection.execute(`
      SELECT p.product_id, p.product_title, p.category_id, p.subcategory_id, 
             c.category_name, sc.sub_category_name, sc.categories_category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sub_categories sc ON p.subcategory_id = sc.sub_category_id
      WHERE p.category_id IS NOT NULL 
        AND p.subcategory_id IS NOT NULL 
        AND p.category_id != sc.categories_category_id
    `);
    if (inconsistentProducts.length > 0) {
      console.log(`❌ Products with inconsistent category-subcategory relationships:`);
      inconsistentProducts.forEach(p => {
        console.log(`  Product ${p.product_id}: "${p.product_title}"`);
        console.log(`    Has category_id: ${p.category_id} (${p.category_name})`);
        console.log(`    Has subcategory_id: ${p.subcategory_id} (${p.sub_category_name})`);
        console.log(`    But subcategory belongs to category: ${p.categories_category_id}`);
      });
    } else {
      console.log(`✅ All category-subcategory relationships are consistent`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the debug script
if (require.main === module) {
  debugCategories()
    .then(() => {
      console.log('\n🎉 Debug completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Debug failed:', error.message);
      process.exit(1);
    });
}

module.exports = { debugCategories };