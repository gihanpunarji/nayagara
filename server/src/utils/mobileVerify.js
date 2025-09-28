const User = require("../models/User");

const validMobileRegex = /^947[0-9]{8}$/;

const mobile = async (req, res) => {
  console.log("Mobile verification request received");
  try {
    const { mobile, email } = req.body;
    let newMobile;
    if(mobile.startsWith("0")) {
      newMobile = mobile.slice(1);
      newMobile = "94" + newMobile;
    } else {
      newMobile = mobile;
      newMobile = "94" + newMobile;
    }

    console.log(newMobile);
    
    if (!newMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });

    } else if (!validMobileRegex.test(newMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number",
      });
    }
    
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
        console.log(data);
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
      });
      console.log(newMobile, email, verificationCode);
      

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
    const newMobile = mobile.substring(1);

    if (!newMobile || !email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Mobile number, email and verification code are required",
      });
    } else if (!validMobileRegex.test(newMobile)) {
      return res.status(400).json({
        success: false,
        message: "Not a valid mobile number",
      });
    }

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
    
    await User.verifyOtp({newMobile, email, verificationCode});

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
