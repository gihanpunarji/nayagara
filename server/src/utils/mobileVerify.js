const User = require("../models/User");

const validMobileRegex = /^94[1-9][0-9]{8}$/;

const mobile = async (req, res) => {
  console.log("Mobile verification request received");
  try {
    const { mobile, email } = req.body;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });

    } else if (!validMobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number",
      });
    }
    
    const exsistingSeller = await User.findByMobile(mobile);
    if(exsistingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller with the same mobile number already exists",
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    console.log(verificationCode);

    fetch("https://app.text.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TEXTLK_API_KEY}`,
      },
      body: JSON.stringify({
        recipient: mobile,
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
        console.log(data);
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
      });

    User.updateSellerMobile({ mobile, email, verificationCode });

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

    const seller = await User.findByMobile(mobile);
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
    
    await User.verifyOtp({mobile, email, verificationCode});

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
