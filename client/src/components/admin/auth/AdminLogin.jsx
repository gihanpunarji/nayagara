import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Phone,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Login, 2: Email OTP, 3: Phone OTP, 4: TOTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  // Step 1 - Primary Login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Step 2 - Email OTP
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [emailOtpTimer, setEmailOtpTimer] = useState(300); // 5 minutes
  const [canResendEmail, setCanResendEmail] = useState(false);

  // Step 3 - Phone OTP
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(300);
  const [canResendPhone, setCanResendPhone] = useState(false);

  // Step 4 - TOTP
  const [totpCode, setTotpCode] = useState(["", "", "", "", "", ""]);

  // Security tracking
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);

  // Timer effects
  useEffect(() => {
    let interval;
    if (emailOtpTimer > 0 && currentStep === 2) {
      interval = setInterval(() => {
        setEmailOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendEmail(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpTimer, currentStep]);

  useEffect(() => {
    let interval;
    if (phoneOtpTimer > 0 && currentStep === 3) {
      interval = setInterval(() => {
        setPhoneOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendPhone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneOtpTimer, currentStep]);

  useEffect(() => {
    let interval;
    if (blockTimer > 0) {
      interval = setInterval(() => {
        setBlockTimer((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttemptCount(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [blockTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (field, value) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  const handleOtpChange = (index, value, setter, currentOtp) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...currentOtp];
    newOtp[index] = value;
    setter(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`
      );
      if (nextInput) nextInput.focus();
    }

    if (error) setError("");
  };

  const handleKeyDown = (e, index, setter, currentOtp) => {
    if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="otp-${index - 1}"]`
      );
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...currentOtp];
        newOtp[index - 1] = "";
        setter(newOtp);
      }
    }
  };

  const handlePrimaryLogin = async (e) => {
    e.preventDefault();
    if (isBlocked) return;

    setLoading(true);
    setError("");

    try {
      // Simulate API call for primary authentication
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock authentication logic
      if (
        loginData.email === "supun9402@gmail.com" &&
        loginData.password === "Admin@123"
      ) {
        // Store session data
        const session = {
          adminId: "admin_001",
          email: loginData.email,
          phone: "+94772010915", // This would come from API
          timestamp: Date.now(),
        };
        setSessionData(session);

        // Send email OTP (mock)
        console.log("Sending email OTP to:", loginData.email);

        setCurrentStep(2);
        setEmailOtpTimer(300);
        setCanResendEmail(false);
      } else {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= 3) {
          setIsBlocked(true);
          setBlockTimer(900); // 15 minutes
          setError("Too many failed attempts. Account blocked for 15 minutes.");
        } else {
          setError(
            `Invalid credentials. ${3 - newAttemptCount} attempts remaining.`
          );
        }
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtpVerification = async (e) => {
    e.preventDefault();
    const otpString = emailOtp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock OTP verification (in real app, this would be API call)
      if (otpString === "123456") {
        console.log("Sending phone OTP to:", sessionData.phone);
        setCurrentStep(3);
        setPhoneOtpTimer(300);
        setCanResendPhone(false);
      } else {
        setError("Invalid verification code. Please try again.");
        setEmailOtp(["", "", "", "", "", ""]);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtpVerification = async (e) => {
    e.preventDefault();
    const otpString = phoneOtp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (otpString === "654321") {
        setCurrentStep(4);
      } else {
        setError("Invalid verification code. Please try again.");
        setPhoneOtp(["", "", "", "", "", ""]);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTotpVerification = async (e) => {
    e.preventDefault();
    const totpString = totpCode.join("");

    if (totpString.length !== 6) {
      setError("Please enter the complete 6-digit authenticator code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock TOTP verification
      if (totpString === "789012") {
        // Successful authentication
        localStorage.setItem(
          "adminSession",
          JSON.stringify({
            ...sessionData,
            authenticated: true,
            timestamp: Date.now(),
          })
        );

        navigate("/admin/dashboard");
      } else {
        setError("Invalid authenticator code. Please try again.");
        setTotpCode(["", "", "", "", "", ""]);
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (type) => {
    if (type === "email" && canResendEmail) {
      setEmailOtpTimer(300);
      setCanResendEmail(false);
      console.log("Resending email OTP");
    } else if (type === "phone" && canResendPhone) {
      setPhoneOtpTimer(300);
      setCanResendPhone(false);
      console.log("Resending phone OTP");
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                step < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : step === currentStep
                  ? "bg-green-600 border-green-600 text-white"
                  : "bg-gray-200 border-gray-300 text-gray-500"
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </div>
            {step < 4 && (
              <div
                className={`w-8 h-0.5 ${
                  step < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderPrimaryLogin = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        <p className="text-gray-600">Secure administrative access</p>
      </div>

      <form onSubmit={handlePrimaryLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="admin@nayagara.lk"
              required
              disabled={isBlocked}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={loginData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your secure password"
              required
              disabled={isBlocked}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isBlocked}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {isBlocked && (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-600">
              Account temporarily blocked. Try again in {formatTime(blockTimer)}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || isBlocked}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            loading || isBlocked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Proceed to Verification</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          This is a secure admin portal with multi-factor authentication
        </p>
      </div>
    </div>
  );

  const renderEmailOtp = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Email Verification
        </h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to
          <br />
          <span className="font-medium">{sessionData?.email}</span>
        </p>
      </div>

      <form onSubmit={handleEmailOtpVerification} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {emailOtp.map((digit, index) => (
            <input
              key={index}
              name={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleOtpChange(index, e.target.value, setEmailOtp, emailOtp)
              }
              onKeyDown={(e) => handleKeyDown(e, index, setEmailOtp, emailOtp)}
              className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="text-center">
          {emailOtpTimer > 0 ? (
            <p className="text-sm text-gray-600">
              Code expires in{" "}
              <span className="font-medium text-green-600">
                {formatTime(emailOtpTimer)}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => handleResendOtp("email")}
              disabled={!canResendEmail}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Resend verification code
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={loading || emailOtp.join("").length !== 6}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
              loading || emailOtp.join("").length !== 6
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderPhoneOtp = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Phone Verification
        </h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to
          <br />
          <span className="font-medium">{sessionData?.phone}</span>
        </p>
      </div>

      <form onSubmit={handlePhoneOtpVerification} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {phoneOtp.map((digit, index) => (
            <input
              key={index}
              name={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleOtpChange(index, e.target.value, setPhoneOtp, phoneOtp)
              }
              onKeyDown={(e) => handleKeyDown(e, index, setPhoneOtp, phoneOtp)}
              className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="text-center">
          {phoneOtpTimer > 0 ? (
            <p className="text-sm text-gray-600">
              Code expires in{" "}
              <span className="font-medium text-green-600">
                {formatTime(phoneOtpTimer)}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => handleResendOtp("phone")}
              disabled={!canResendPhone}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Resend verification code
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={loading || phoneOtp.join("").length !== 6}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
              loading || phoneOtp.join("").length !== 6
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderTotpVerification = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authenticator Code
        </h2>
        <p className="text-gray-600">
          Enter the 6-digit code from your
          <br />
          <span className="font-medium">Google Authenticator app</span>
        </p>
      </div>

      <form onSubmit={handleTotpVerification} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {totpCode.map((digit, index) => (
            <input
              key={index}
              name={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleOtpChange(index, e.target.value, setTotpCode, totpCode)
              }
              onKeyDown={(e) => handleKeyDown(e, index, setTotpCode, totpCode)}
              className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Code refreshes every 30 seconds
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={loading || totpCode.join("").length !== 6}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
              loading || totpCode.join("").length !== 6
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStepIndicator()}

          {currentStep === 1 && renderPrimaryLogin()}
          {currentStep === 2 && renderEmailOtp()}
          {currentStep === 3 && renderPhoneOtp()}
          {currentStep === 4 && renderTotpVerification()}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by 256-bit SSL encryption and multi-factor authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
