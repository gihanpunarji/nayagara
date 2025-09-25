const e = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validateUserInputs, validateSellerInputs } = require("../utils/inputValidation");
const { createAddressForSeller } = require("../models/Address");

const JWT_SECRET = process.env.JWT_SECRET || "nayagara_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const register = async (req, res, role = "customer") => {
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
      role,
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
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sellerRegister = async (req, res, role = "seller") => {
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
      postalCode
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
      // district,
      // province,
      // country,
      postalCode
    });
    console.log(errorMessage);
    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    const existingUser = await User.findByEmailandRoleAndNIC(email, role, nic);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Seller with the same email or NIC already exists",
      });
    }

    const user = await User.createSeller({
      email,
      password,
      firstName,
      lastName,
      role,
      nic
    });
    const token = generateToken(user.id);
    const userId = user.user_id;
    
    createAddressForSeller({
      userId,
      addressType : "seller_business",
      line1 : address1,
      line2 : address2,
      postalCode,
      cityId : city,
      isDefault: true,
      isActive: true
    })

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res, role = "customer") => {
  try {
    const { emailOrMobile, password } = req.body;
    console.log(emailOrMobile, password);

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
    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const checkRole = await User.checkRole(emailOrMobile, role);
    if (!checkRole) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized as a seller",
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
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sellerLogin = async (req, res, role = "seller") => {
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

    const checkRole = await User.checkRole(emailOrMobile, role);
    if (!checkRole) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized as a seller",
      });
    }

    const user = await User.findByEmailOrMobile(emailOrMobile);
    console.log(user);

    if (!user) {
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
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { register, login, sellerRegister, sellerLogin };
