require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { connectDB, getConnection } = require('../config/database');
const fs = require('fs');
const path = require('path');

const runMigration = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    const connection = getConnection();
    console.log('Database connected.');

    const migrationFile = path.join(__dirname, '../migrations/001_referral_system_setup.sql');
    console.log(`Reading migration file: ${migrationFile}`);
    const sql = fs.readFileSync(migrationFile, 'utf8');

    const statements = sql.split(';').filter(statement => statement.trim().length > 0);

    console.log(`Executing ${statements.length} SQL statements from migration...`);

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✓ Statement executed successfully.');
      }
    }

    console.log('✅ Migration applied successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
