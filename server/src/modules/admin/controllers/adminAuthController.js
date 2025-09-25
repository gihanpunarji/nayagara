const jwt = require("jsonwebtoken");
const User = require("../../shared/models/User");

const JWT_SECRET = process.env.JWT_SECRET || "nayagara_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findByEmailOrMobile(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const checkRole = await User.checkRole(email, "admin");
    if (!checkRole) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const isPasswordValid = await User.comparePassword(
      password,
      user.user_password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);
    const { user_password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Admin login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  login
};