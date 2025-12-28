const User = require("../models/User");

// Validate Sri Lankan mobile numbers (07X XXXXXXX format)
const validSriLankanMobileRegex = /^0(7[0-9])[0-9]{7}$/;

// Helper function to convert Sri Lankan mobile to international format (947XXXXXXXX)
const formatMobileForSMS = (mobile) => {
  // If starts with 0, remove it and add 94
  if (mobile.startsWith("0")) {
    return "94" + mobile.slice(1);
  }
  // If already starts with 94, return as is
  if (mobile.startsWith("94")) {
    return mobile;
  }
  // Otherwise, add 94 prefix
  return "94" + mobile;
};

const mobile = async (req, res) => {
  try {
    const { mobile, email } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Validate Sri Lankan mobile number format
    if (!validSriLankanMobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Sri Lankan mobile number (07X XXXXXXX)",
      });
    }

    // Convert to international format for SMS gateway (947XXXXXXXX)
    const newMobile = formatMobileForSMS(mobile);
    
    const exsistingSeller = await User.findByMobile(newMobile);
    if(exsistingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller with the same mobile number already exists",
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    fetch("https://app.text.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TEXTLK_API_KEY}`,
      },
      body: JSON.stringify({
        recipient: newMobile,
        sender_id: process.env.TEXTLK_SENDER_ID,
        type: "plain",
        message: `Your Verification code for seller registration is ${verificationCode} , Do not share it with anyone.`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
      });
      

    User.updateSellerMobile({ newMobile, email, verificationCode });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Mobile verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobile, email, verificationCode } = req.body;

    if (!mobile || !email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Mobile number, email and verification code are required",
      });
    }

    // Validate Sri Lankan mobile number format
    if (!validSriLankanMobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Sri Lankan mobile number (07X XXXXXXX)",
      });
    }

    // Convert to international format for database lookup (947XXXXXXXX)
    const newMobile = formatMobileForSMS(mobile);

    const seller = await User.findByMobile(newMobile);
    if (!seller || seller.user_email !== email) {
      return res.status(400).json({
        success: false,
        message: "Verification failed",
      });
    }
    if (seller.mobile_verification_code != verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }
    
    await User.verifyOtp({mobile: newMobile, email, verificationCode});

    res.status(200).json({
      success: true,
      message: "Mobile number verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { mobile, verifyOtp };
