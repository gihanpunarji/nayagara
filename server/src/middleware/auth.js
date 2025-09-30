const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const redis = require("redis");

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

// let redisClient;
// (async () => {
//   try {
//     redisClient = redis.createClient({
//       url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
//     });
//     redisClient.on("error", (e) => console.error("Redis error", e));
//     await redisClient.connect();
//     console.log("Redis connected (auth middleware)");
//   } catch (e) {
//     console.error("Failed to connect Redis in auth middleware:", e);
//   }
// })();

// New middleware: validate one-time nonce for admin login
// const authenticateAdminLogin = async (req, res, next) => {
//   try {
//     // Accept the nonce in a header 'x-admin-nonce'
//     const nonce = req.headers["x-admin-nonce"];
//     if (!nonce) {
//       return res.status(403).json({
//         success: false,
//         message: "Missing admin init token",
//       });
//     }

//     // Check Redis for the nonce
//     const key = `admin_nonce:${nonce}`;
//     const exists = await redisClient.get(key);
//     if (!exists) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid or expired admin init token",
//       });
//     }

//     // Consume (delete) the nonce immediately to prevent replay
//     await redisClient.del(key);

//     // nonce valid → continue (login credentials will be validated in controller)
//     next();
//   } catch (err) {
//     console.error("authenticateAdminLogin error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };


module.exports = { authenticateToken, authenticateAdmin };
