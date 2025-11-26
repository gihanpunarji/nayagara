const { getConnection } = require('../src/config/database');

async function initReferralSettings() {
  const pool = getConnection();
  let connection;

  try {
    connection = await pool.getConnection();
    console.log('Initializing referral system settings...');

    // Default settings to insert
    const defaultSettings = [
      { key: 'payment_gateway_fee_percent', value: '3.5', category: 'payment' },
      { key: 'referral_total_payout_percent', value: '70', category: 'referral' },
      { key: 'referral_unlock_purchase_threshold', value: '5000', category: 'referral' },
      { key: 'referral_commission_model', value: 'option1', category: 'referral' },
      { key: 'referral_l1_commission_percent', value: '30', category: 'referral_tiers' },
      { key: 'referral_l2_to_8_commission_percent', value: '5', category: 'referral_tiers' },
      { key: 'referral_tier1_discount_percent', value: '0', category: 'referral_tiers' },
      { key: 'referral_tier2_max_discount_percent', value: '15', category: 'referral_tiers' },
      { key: 'referral_tier3_discount_percent', value: '30', category: 'referral_tiers' },
      { key: 'referral_option2_tier1_l1_percent', value: '30', category: 'referral_tiers' },
      { key: 'referral_option2_tier1_l2_to_8_percent', value: '5', category: 'referral_tiers' },
      { key: 'referral_option2_tier2_l1_max_percent', value: '20', category: 'referral_tiers' },
      { key: 'referral_option2_tier2_l2_to_8_max_percent', value: '3', category: 'referral_tiers' },
      { key: 'referral_option2_tier3_l1_percent', value: '10', category: 'referral_tiers' },
      { key: 'referral_option2_tier3_l2_to_8_percent', value: '2', category: 'referral_tiers' }
    ];

    for (const setting of defaultSettings) {
      // Check if setting exists
      const [existing] = await connection.execute(
        'SELECT setting_key FROM system_settings WHERE setting_key = ?',
        [setting.key]
      );

      if (existing.length === 0) {
        // Insert new setting
        await connection.execute(
          'INSERT INTO system_settings (setting_key, setting_value, setting_category) VALUES (?, ?, ?)',
          [setting.key, setting.value, setting.category]
        );
        console.log(`✓ Inserted: ${setting.key} = ${setting.value}`);
      } else {
        console.log(`  Exists: ${setting.key}`);
      }
    }

    console.log('\n✅ Referral settings initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing settings:', error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

initReferralSettings();
