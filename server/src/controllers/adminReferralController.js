const Settings = require('../models/Settings');
const User = require('../models/User');
const Referral = require('../models/Referral');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getAll();
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
    res.json({ success: true, data: users });
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