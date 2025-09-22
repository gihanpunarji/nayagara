const e = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "nayagara_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (!mobile) {
      return res.json({
        success: false,
        message: "Mobile number is required",
      });
    } else if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    } else if (validEmailRegex.test(email) === false) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    } else if (!password) {
      return res.json({
        success: false,
        message: "Password is required",
      });
    } else if (!firstName) {
      return res.json({
        success: false,
        message: "First name is required",
      });
    } else if (!lastName) {
      return res.json({
        success: false,
        message: "Last name is required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (strongPasswordRegex.test(password) === false) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }


    const existingUser = await User.findByEmailOrMobile(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or mobile",
      });
    }

    

    const user = await User.create({
      mobile,
      email,
      password,
      firstName,
      lastName,
      role
    });
    const token = generateToken(user.id);

    console.log(user);

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
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
      mobile,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    } = req.body;

    if (!mobile) {
      return res.json({
        success: false,
        message: "Mobile number is required",
      });
    } else if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    } else if (validEmailRegex.test(email) === false) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    } else if (!password) {
      return res.json({
        success: false,
        message: "Password is required",
      });
    } else if (!firstName) {
      return res.json({
        success: false,
        message: "First name is required",
      });
    } else if (!lastName) {
      return res.json({
        success: false,
        message: "Last name is required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (strongPasswordRegex.test(password) === false) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }


    const existingUser = await User.findByEmailOrMobile(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or mobile",
      });
    }

    

    const user = await User.create({
      mobile,
      email,
      password,
      firstName,
      lastName,
      role
    });
    const token = generateToken(user.id);

    console.log(user);

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
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
};

module.exports = { register, login };
