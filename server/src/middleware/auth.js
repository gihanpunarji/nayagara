const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const redis = require("redis");

const JWT_SECRET = process.env.JWT_SECRET || "nayagara_secret_key";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("Auth header:", authHeader);
    console.log("Extracted token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    console.log("JWT_SECRET exists:", !!JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    
    const user = await User.findById(decoded.userId);
    console.log("Found user:", !!user);

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
      return res.json({
        success: false,
        message: "Access token required",
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Invalid or expired token",
        });
      }
      if (decoded.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }
      req.admin = decoded;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { authenticateToken, authenticateAdmin };
