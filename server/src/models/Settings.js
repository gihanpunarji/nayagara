const { getConnection } = require("../config/database");

class Settings {
  /**
   * Fetches a map of all system settings.
   * @returns {Promise<Map<string, string>>} A map of setting_key to setting_value.
   */
  static async getAll() {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute("SELECT setting_key, setting_value FROM system_settings");
      
      const settingsMap = new Map();
      for (const row of rows) {
        settingsMap.set(row.setting_key, row.setting_value);
      }
      return settingsMap;

    } finally {
      if (connection) connection.release();
    }
  }

  static async updateAll(settings) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      for (const key in settings) {
        await connection.execute(
          "UPDATE system_settings SET setting_value = ? WHERE setting_key = ?",
          [settings[key], key]
        );
      }
    } finally {
      if (connection) connection.release();
    }
  }

  static async getTiers() {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        "SELECT setting_key, setting_value FROM system_settings WHERE setting_category = 'referral_tiers'"
      );
      const tiers = {};
      for (const row of rows) {
        tiers[row.setting_key] = row.setting_value;
      }
      return tiers;
    } finally {
      if (connection) connection.release();
    }
  }

  static async updateTiers(tiers) {
    const pool = getConnection();
    let connection;
    try {
      connection = await pool.getConnection();
      for (const key in tiers) {
        await connection.execute(
          "UPDATE system_settings SET setting_value = ? WHERE setting_key = ? AND setting_category = 'referral_tiers'",
          [tiers[key], key]
        );
      }
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = Settings;
