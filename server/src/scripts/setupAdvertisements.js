const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function setupAdvertisementTables() {
  let connection;

  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nayagara_db',
      multipleStatements: true
    });

    console.log('🔗 Connected to database successfully');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../admin/sql.txt');
    const sqlScript = await fs.readFile(sqlFilePath, 'utf8');

    // Remove comments and split into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && !stmt.startsWith('/*'));

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await connection.execute(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          // Some statements might fail if tables/indexes already exist - that's okay
          if (error.code === 'ER_TABLE_EXISTS_ERROR' ||
              error.code === 'ER_DUP_KEYNAME' ||
              error.code === 'ER_DUP_ENTRY') {
            console.log(`⚠️  Statement ${i + 1} - already exists (skipping): ${error.message}`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.error('Statement:', statement.substring(0, 100) + '...');
          }
        }
      }
    }

    // Verify setup
    console.log('\n🔍 Verifying advertisement system setup...');

    // Check if tables were created
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('advertisements', 'ad_payments', 'ad_subcategories', 'admin_users')
    `);

    console.log('📋 Advertisement tables created:');
    tables.forEach(table => {
      console.log(`   ✅ ${table.TABLE_NAME}`);
    });

    // Check subcategories
    const [subcategories] = await connection.execute(`
      SELECT category_name, subcategory_name, ad_type
      FROM ad_subcategories
      ORDER BY category_name, sort_order
    `);

    console.log('\n📂 Subcategories inserted:');
    subcategories.forEach(sub => {
      console.log(`   📁 ${sub.category_name} -> ${sub.subcategory_name} (${sub.ad_type})`);
    });

    // Check admin user
    const [admins] = await connection.execute(`
      SELECT admin_email, first_name, last_name, is_super_admin
      FROM admin_users
    `);

    console.log('\n👤 Admin users created:');
    admins.forEach(admin => {
      console.log(`   👨‍💼 ${admin.first_name} ${admin.last_name} (${admin.admin_email}) - Super Admin: ${admin.is_super_admin ? 'Yes' : 'No'}`);
    });

    console.log('\n🎉 Advertisement system setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Test advertisement posting at: http://localhost:5001');
    console.log('   3. Admin login: admin@nayagara.lk / admin123');
    console.log('   4. Admin panel: http://localhost:3000/admin/advertisements');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup
setupAdvertisementTables();