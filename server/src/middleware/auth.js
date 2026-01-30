const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "nayagara_secret_key";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Fetch full admin object
    const Admin = require("../models/Admin"); // Ensure Admin model is available
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Map admin to req.user for controller compatibility
    // Controllers expect req.user.user_id and req.user.role
    req.user = {
      ...admin,
      user_id: admin.admin_id, // Map admin_id to user_id
      role: 'admin',
      user_email: admin.admin_email
    };
    
    req.admin = decoded; 
    next();

  } catch (error) {
    console.error("Admin Auth middleware error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { authenticateToken, authenticateAdmin };
