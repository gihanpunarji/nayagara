const Settings = require('../models/Settings');
const User = require('../models/User');
const Referral = require('../models/Referral');

exports.getSettings = async (req, res) => {
  try {
    const settingsMap = await Settings.getAll();

    // Convert Map to plain object
    const settings = {};
    if (settingsMap instanceof Map) {
      settingsMap.forEach((value, key) => {
        // Convert string values to numbers for numeric fields
        if (key.includes('percent') || key.includes('threshold')) {
          settings[key] = parseFloat(value) || 0;
        } else {
          settings[key] = value;
        }
      });
    } else {
      // If it's already an object, use it directly
      Object.assign(settings, settingsMap);
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    await Settings.updateAll(settings);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllWithReferralInfo();

    // Add referral_link to each user
    const usersWithLinks = users.map(user => ({
      ...user,
      referred_by: user.referred_by_first_name && user.referred_by_last_name
        ? `${user.referred_by_first_name} ${user.referred_by_last_name}`
        : null,
      referral_link: user.referral_link_unlocked && user.referral_code
        ? `${process.env.FRONT_END_API}/register?ref=${user.referral_code}`
        : null
    }));

    res.json({ success: true, data: usersWithLinks });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getTiers = async (req, res) => {
  try {
    const tiers = await Settings.getTiers();
    res.json({ success: true, data: tiers });
  } catch (error) {
    console.error('Error getting tiers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateTiers = async (req, res) => {
  try {
    const { tiers } = req.body;
    await Settings.updateTiers(tiers);
    res.json({ success: true, message: 'Tiers updated successfully' });
  } catch (error) {
    console.error('Error updating tiers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const history = await Referral.getHistory(page, limit);
    res.json({ success: true, data: history.rows, pagination: history.pagination });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};