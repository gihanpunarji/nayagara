const { connectDB, getConnection } = require('../config/database');
const fs = require('fs');
const path = require('path');

const setupDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const connection = getConnection();

    console.log('Reading SQL file...');
    const sqlFile = fs.readFileSync(path.join(__dirname, '../config/createTables.sql'), 'utf8');

    // Split SQL statements by semicolon and execute them one by one
    const statements = sqlFile.split(';').filter(statement => statement.trim().length > 0);

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✓ Executed statement successfully');
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message.includes('already exists')) {
            console.log('✓ Table already exists, skipping...');
          } else {
            console.error('✗ Error executing statement:', error.message);
          }
        }
      }
    }

    console.log('✅ Database setup completed successfully!');

    // Test the setup by checking if tables exist
    console.log('\nVerifying table creation...');

    const tables = ['advertisements', 'ad_payments', 'cities'];

    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          console.log(`✓ Table '${table}' exists`);
        } else {
          console.log(`✗ Table '${table}' not found`);
        }
      } catch (error) {
        console.log(`✗ Error checking table '${table}':`, error.message);
      }
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run the setup
setupDatabase();