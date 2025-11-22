const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Script to apply the enhanced referral system database changes
 */
async function applyReferralSystem() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('🚀 Applying Enhanced Referral System Database Changes...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'sql', 'referral_system_enhancements.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL statements (simple split by ;)
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length === 0) continue;
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
        await connection.execute(statement);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME' || 
            error.code === 'ER_TABLE_EXISTS_ERROR' ||
            error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Skipping duplicate: ${error.message}`);
          continue;
        }
        throw error;
      }
    }
    
    // Verify the installation
    console.log('🔍 Verifying installation...');
    
    // Check if new tables exist
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('referral_chain', 'referral_commissions', 'user_purchase_tiers')
    `, [process.env.DB_NAME]);
    
    console.log(`✅ Created ${tables.length}/3 new tables:`, tables.map(t => t.TABLE_NAME));
    
    // Check if new columns exist in users table
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('total_purchase_amount', 'referral_link_unlocked', 'referral_code', 'referred_by_user_id')
    `, [process.env.DB_NAME]);
    
    console.log(`✅ Added ${columns.length}/4 new columns to users table:`, columns.map(c => c.COLUMN_NAME));
    
    // Check system settings
    const [settings] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM system_settings 
      WHERE setting_key LIKE 'referral_%'
    `);
    
    console.log(`✅ Added ${settings[0].count} referral system settings`);
    
    // Show summary
    console.log('\n🎉 Enhanced Referral System Installation Complete!');
    console.log('\n📊 System Features:');
    console.log('   ✓ 8-level referral chain tracking');
    console.log('   ✓ Profit-based commission calculation');
    console.log('   ✓ Dynamic discount system (15-30%)');
    console.log('   ✓ 5000 rupee referral unlock threshold');
    console.log('   ✓ Automatic wallet commission distribution');
    console.log('   ✓ Payment gateway fee deduction (3%)');
    
    console.log('\n🔗 API Endpoints Available:');
    console.log('   • /api/referral/* - User referral management');
    console.log('   • /api/admin/referrals/* - Admin referral management');
    
    console.log('\n⚙️  Next Steps:');
    console.log('   1. Configure referral settings via admin panel');
    console.log('   2. Test referral registration with sample users');
    console.log('   3. Process test orders to verify commission distribution');
    console.log('   4. Monitor system performance and adjust as needed');
    
  } catch (error) {
    console.error('❌ Error applying referral system:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the migration
if (require.main === module) {
  applyReferralSystem()
    .then(() => {
      console.log('\n✅ Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration failed:', error.message);
      process.exit(1);
    });
}

module.exports = { applyReferralSystem };