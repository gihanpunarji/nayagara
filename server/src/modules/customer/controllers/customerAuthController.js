const jwt = require("jsonwebtoken");
const User = require("../../shared/models/User");
const { validateUserInputs } = require("../../shared/utils/inputValidation");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { getConnection } = require("../../shared/config/database");

const JWT_SECRET = process.env.JWT_SECRET || "nayagara_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const register = async (req, res) => {
  try {
    const {
      mobile,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    } = req.body;

    const errorMessage = validateUserInputs({
      email,
      mobile,
      password,
      confirmPassword,
      firstName,
      lastName,
    });
    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const existingUser2 = await User.findByMobile(mobile);
    if (existingUser2) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this mobile",
      });
    }

    const existingUser = await User.findByEmailOrMobile(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      mobile,
      email,
      password,
      firstName,
      lastName,
      role: "customer",
    });
    const token = generateToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Customer registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    } else if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await User.findByEmailOrMobile(emailOrMobile);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const checkRole = await User.checkRole(emailOrMobile, "customer");
    if (!checkRole) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
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
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Customer login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes;

    const updateResult = await User.updateToken(
      resetToken,
      resetTokenExpires,
      email
    );
    if (updateResult.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to update token",
      });
    }
    const resetLink = `${process.env.FRONT_END_API}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    const transporter = nodeMailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Nayagara Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - Nayagara",
      html: `<!DOCTYPE html>
<html>
<head><title>Reset Your Nayagara Password</title></head>
<body>
  <h2>Password Reset Request</h2>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
  <p>This link will expire in 15 minutes.</p>
  <p>If you didn't request this, please ignore this email.</p>
</body>
</html>`,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Customer forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { urlToken, password } = req.body;

    if (!urlToken || !password) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    const connection = getConnection();
    const [rows] = await connection.execute(
      "SELECT user_email, reset_token_expires FROM users WHERE reset_token = ?",
      [urlToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const user = rows[0];

    if (user.reset_token_expire < Date.now()) {
      return res.status(400).json({ success: false, message: "Token has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "UPDATE users SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_email = ?",
      [hashedPassword, user.user_email]
    );

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Customer reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};