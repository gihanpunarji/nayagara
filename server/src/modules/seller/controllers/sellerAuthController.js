const jwt = require("jsonwebtoken");
const User = require("../../shared/models/User");
const { validateSellerInputs } = require("../../shared/utils/inputValidation");
const { createAddressForSeller } = require("../../shared/models/Address");
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
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      nic,
      address1,
      address2,
      city,
      postalCode,
    } = req.body;

    const errorMessage = validateSellerInputs({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      nic,
      address1,
      address2,
      city,
      postalCode,
    });

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const existingUser = await User.findByEmailandRoleAndNIC(email, "seller", nic);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Seller with the same email or NIC already exists",
      });
    }

    const user = await User.createSeller({
      email,
      password,
      firstName,
      lastName,
      role: "seller",
      nic,
    });
    const token = generateToken(user.id);
    const userId = user.user_id;

    createAddressForSeller({
      userId,
      addressType: "seller_business",
      line1: address1,
      line2: address2,
      postalCode,
      cityId: city,
      isDefault: true,
      isActive: true,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "Seller Registration Successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Seller registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/mobile and password are required",
      });
    }

    const user = await User.findByEmailOrMobile(emailOrMobile);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await User.comparePassword(
      password,
      user.user_password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMobileVerified = await User.isMobileVerified(emailOrMobile);
    if (!isMobileVerified) {
      return res.status(403).json({ success: false, message: "Mobile not verified" });
    }

    const checkRole = await User.checkRole(emailOrMobile, "seller");
    if (!checkRole) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized role" });
    }

    const token = generateToken(user.id);
    const { user_password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Seller login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Seller login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    if (!user || user.role !== 'seller') {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
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

    const resetLink = `${process.env.FRONT_END_API}/seller/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const transporter = nodeMailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Nayagara Seller Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Seller Password Reset Request - Nayagara",
      html: `<!DOCTYPE html>
<html>
<head><title>Reset Your Seller Password</title></head>
<body>
  <h2>Seller Password Reset Request</h2>
  <p>Click the link below to reset your seller account password:</p>
  <a href="${resetLink}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Seller Password</a>
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
    console.error("Seller forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword
};