const User = require("../models/User");

const getAdminProfile = async (req, res) => {
  // Placeholder for admin profile logic
  res.json({ success: true, message: "Admin profile data" });
};

const updateAdminProfile = async (req, res) => {
  // Placeholder for admin profile update logic
  res.json({ success: true, message: "Admin profile updated" });
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.getAllCustomersWithStats();
    res.json({ success: true, customers });
  } catch (error) {
    console.error("Error fetching all customers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  getCustomers,
};