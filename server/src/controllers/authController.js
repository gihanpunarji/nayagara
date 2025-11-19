const e = require("express");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Referral = require("../models/Referral");
const jwt = require("jsonwebtoken");
const {
  validateUserInputs,
  validateSellerInputs,
} = require("../utils/inputValidation");
const { createAddressForSeller } = require("../models/Address");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { getConnection } = require("../config/database");
const { log } = require("console");

const JWT_SECRET = process.env.JWT_SECRET || "nayagara_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const generateToken = (userId, userType) => {
  return jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
      refCode,
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

    if (refCode) {
      await Referral.create({ userId: user.user_id, referrerId: refCode });
    }

    const token = generateToken(user.user_id, user.user_type);

    const { first_name, last_name, user_role } = user;

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: { first_name, last_name, user_role },
      token,
    });

    // User.createReferralUser;
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
      // district,
      // province,
      // country,
      postalCode,
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
        message: "Seller with the same email or NIC already exists",
      });
    }

    const user = await User.createSeller({
      email,
      password,
      firstName,
      lastName,
      role,
      nic,
    });
    const token = generateToken(user.user_id, user.user_type);
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

    const { first_name, last_name, user_role } = user;

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: { first_name, last_name, user_role },
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

    const checkRole = await User.checkRole(emailOrMobile, role);
    if (!checkRole) {
      return res.status(403).json({
        success: false,
        message: "This account is not registered as a customer. Please use seller login if you have a seller account.",
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

    const token = generateToken(user.user_id, user.user_type);
    const { first_name, last_name, user_role } = user;

    res.json({
      success: true,
      message: "Login successful",
      user: {first_name, last_name, user_role},
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
  console.log("Seller Login");

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
      console.log("Invalid credentials 1");

      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await User.comparePassword(
      password,
      user.user_password
    );
    if (!isPasswordValid) {
      console.log("Invalid credentials 2");

      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check role first before mobile verification
    const checkRole = await User.checkRole(emailOrMobile, role);
    if (!checkRole) {
      return res
        .status(403)
        .json({ success: false, message: "This account is not registered as a seller. Please use customer login or register as a seller." });
    }

    const isMobileVerified = await User.isMobileVerified(emailOrMobile);
    if (!isMobileVerified) {
      return res.status(403).json({ success: false, message: "mnv" });
    }

    const token = generateToken(user.user_id, user.user_type);
    const { first_name, last_name, user_role } = user;

    res.json({
      success: true,
      message: "Login successful",
      user: {first_name, last_name, user_role},
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
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
    const resetLink = `${
      process.env.FRONT_END_API
    }/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    console.log("Password reset link:", resetLink);

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Nayagara Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fffe;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(34, 197, 94, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .icon-section {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .lock-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #fef3c7, #fed7aa);
            border: 3px solid #f59e0b;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        
        .lock-icon::before {
            content: "🔒";
            font-size: 32px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 25px;
            line-height: 1.7;
        }
        
        .reset-button-container {
            text-align: center;
            margin: 35px 0;
            padding: 30px;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-radius: 16px;
            border: 2px solid #bbf7d0;
            position: relative;
            overflow: hidden;
        }
        
        .reset-button-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #22c55e, #16a34a, #10b981);
        }
        
        .reset-button-label {
            font-size: 14px;
            font-weight: 600;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(34, 197, 94, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .expiry-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .expiry-notice .icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background-color: #f59e0b;
            border-radius: 50%;
            text-align: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            line-height: 24px;
            margin-right: 12px;
            vertical-align: middle;
        }
        
        .expiry-notice .icon::before {
            content: "⏰";
            font-size: 12px;
        }
        
        .expiry-notice p {
            display: inline-block;
            margin: 0;
            font-size: 15px;
            color: #92400e;
            font-weight: 600;
            vertical-align: middle;
            line-height: 1.5;
        }
        
        .security-tips {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .security-tips h3 {
            color: #1e293b;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        
        .security-tips h3::before {
            content: "🛡️";
            margin-right: 10px;
            font-size: 20px;
        }
        
        .security-tips ul {
            padding-left: 20px;
            color: #475569;
            font-size: 15px;
        }
        
        .security-tips li {
            margin-bottom: 8px;
        }
        
        .no-request-section {
            text-align: center;
            margin: 35px 0;
            padding: 25px;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-radius: 12px;
            border: 2px solid #fecaca;
        }
        
        .no-request-section h3 {
            color: #991b1b;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .no-request-section p {
            color: #7f1d1d;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .support-link {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .support-link:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 15px rgba(220, 38, 38, 0.3);
        }
        
        .footer {
            background-color: #1f2937;
            color: #d1d5db;
            padding: 30px;
            text-align: center;
        }
        
        .footer-content {
            margin-bottom: 20px;
        }
        
        .footer h4 {
            color: #f9fafb;
            font-size: 18px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .footer p {
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: #374151;
            color: #d1d5db;
            text-decoration: none;
            border-radius: 50%;
            margin: 0 8px;
            line-height: 40px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .social-links a:hover {
            background-color: #22c55e;
            color: white;
            transform: translateY(-2px);
        }
        
        .copyright {
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #374151;
            padding-top: 20px;
        }
        
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #22c55e, transparent);
            margin: 30px 0;
            border-radius: 1px;
        }
        
        /* Alternative link styling for email clients that don't support buttons */
        .fallback-link {
            color: #22c55e;
            font-weight: 600;
            text-decoration: underline;
            word-break: break-all;
            font-size: 14px;
            margin-top: 15px;
            display: block;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 30px 20px;
            }
            
            .reset-button {
                padding: 16px 30px;
                font-size: 14px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .lock-icon {
                width: 60px;
                height: 60px;
            }
            
            .lock-icon::before {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Password Reset Request</h1>
            <p>Secure your Nayagara account</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Lock Icon -->
            <div class="icon-section">
                <div class="lock-icon"></div>
            </div>
            
            <div class="greeting">Hello there!</div>
            
            <div class="message">
                We received a request to reset the password for your <strong>Nayagara.lk</strong> account. If you made this request, click the button below to create a new password.
            </div>
            
            <!-- Reset Button -->
            <div class="reset-button-container">
                <div class="reset-button-label">Reset Your Password</div>
                <a href="${resetLink}" class="reset-button">Reset Password</a>
                
                <!-- Fallback link for email clients that don't support buttons -->
                <div class="fallback-link">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    ${resetLink}
                </div>
            </div>
            
            <!-- Expiry Notice -->
            <div class="expiry-notice">
                <span class="icon"></span>
                <p><strong>Important:</strong> This password reset link will expire in 15 minutes for your security.</p>
            </div>
            
            <div class="divider"></div>
            
            <!-- Security Tips -->
            <div class="security-tips">
                <h3>Security Tips</h3>
                <ul>
                    <li>Create a strong password with at least 8 characters</li>
                    <li>Use a combination of letters, numbers, and special characters</li>
                    <li>Don't reuse passwords from other accounts</li>
                    <li>Consider using a password manager</li>
                </ul>
            </div>
            
            
        </div>
        
        
    </div>
</body>
</html>`,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { urlToken, password } = req.body;
    console.log("token " + urlToken, "Password " + password);

    if (!urlToken || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const connection = getConnection();
    const [
      rows,
    ] = await connection.execute(
      "SELECT user_email, reset_token_expires FROM users WHERE reset_token = ?",
      [urlToken]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid urlToken" });
    }

    const user = rows[0];

    if (user.reset_token_expire < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Token has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "UPDATE users SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_email = ?",
      [hashedPassword, user.user_email]
    );

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
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

    const admin = await Admin.checkAdmin(email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const validPassword = await Admin.comparePassword(
      password,
      admin.admin_password
    );
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
  }
};

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save hashed code & expiry (10 mins)
    const connection = getConnection();
    await connection.execute(
      `UPDATE admins 
       SET email_code = ?
       WHERE admin_email = ?`,
      [verificationCode, email]
    );

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Zipzipy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Admin Verification Code",
      html: `
        <h2>Email Verification</h2>
        <p>Use the following code to verify your email:</p>
        <h3>${verificationCode}</h3>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.json({ success: true, message: "Verification code sent to email" });
  } catch (error) {
    console.error("Send verification email error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { code, email } = req.body;
    if (!code || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Email and code are required" });
    }

    const validCode = await Admin.checkCode(code, email);
    if (!validCode) {
      return res
      .status(400)
      .json({ success: false, message: "Invalid email verification code" });
    }

    await Admin.deleteCode(email);
    
    // If email OTP is correct, proceed to send SMS OTP
    await sendAdminSmsOtp(req, res);

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const sendAdminSmsOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.checkAdmin(email);
    if (!admin || !admin.mobile) {
      return res.status(404).json({ success: false, message: "Admin mobile number not found." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Admin.updateMobileCode(email, verificationCode);

    const response = await fetch("https://app.text.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TEXTLK_API_KEY}`,
      },
      body: JSON.stringify({
        recipient: admin.mobile,
        sender_id: process.env.TEXTLK_SENDER_ID,
        type: "plain",
        message: `Your Nayagara Admin verification code is ${verificationCode}. Do not share it.`,
      }),
    });

    if (!response.ok) {
      throw new Error('SMS gateway response was not ok');
    }

    const maskedPhone = admin.mobile.slice(0, 3) + '***' + admin.mobile.slice(-4);

    res.json({ 
      success: true, 
      message: "SMS verification code sent successfully.",
      maskedPhone
    });

  } catch (error) {
    console.error("Send admin SMS OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send SMS verification code." });
  }
};

const verifyAdminSmsOtp = async (req, res) => {
  try {
    const { code, email } = req.body;
    if (!code || !email) {
      return res.status(400).json({ success: false, message: "Email and code are required" });
    }

    const admin = await Admin.checkMobileCode(code, email);
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid SMS verification code" });
    }

    // SMS code is valid, complete the login by generating tokens
    const adminData = await Admin.checkAdmin(email);
    const accessToken = jwt.sign({ adminId: adminData.admin_id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
    const refreshToken = jwt.sign({ adminId: adminData.admin_id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });

    // Store refresh token in the database
    await Admin.updateRefreshToken(adminData.admin_id, refreshToken);

    // Clear the mobile code after successful verification
    await Admin.updateMobileCode(email, null);
    console.log("Admin SMS verification successful for:", email);

    res.json({ 
      success: true, 
      message: "Admin login successful",
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error("Admin SMS verification error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const refreshAdminToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET, { algorithms: ['HS256'] });
    const admin = await Admin.checkAdmin(decoded.email);

    if (!admin || admin.refresh_token !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ adminId: admin.admin_id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });

    res.json({
      success: true,
      accessToken
    });
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};


module.exports = {
  register,
  login,
  sellerRegister,
  sellerLogin,
  forgotPassword,
  resetPassword,
  loginAdmin,
  verifyEmailOtp,
  sendEmail,
  verifyAdminSmsOtp,
  refreshAdminToken
};
