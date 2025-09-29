import React, { useState, useEffect } from "react";
import {
  Phone,
  Shield,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "../../../api/axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function SellerMobileVerify() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { emailOrMobile } = location.state || {};

  if (!location.state?.from || location.state.from !== "seller-login") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    let interval = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/send-otp", {
        mobile: phoneNumber,
        email: emailOrMobile,
      });

      if (res.data.success) {
        setStep(2);
        setCountdown(60);
        setSuccess("Verification code sent successfully!");
      } else {
        setError(res.data.message || "Failed to send verification code");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", {
        mobile: phoneNumber,
        email: emailOrMobile,
        verificationCode: verificationCode,
      });

      if (res.data.success) {
        setSuccess("Mobile number verified successfully!");
        // Handle successful verification here
        setTimeout(() => {
          navigate("/"); // if you want redirect
        }, 2000);
      } else {
        setError(res.data.message || "Invalid verification code");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/send-otp", { mobile: phoneNumber });

      if (res.data.success) {
        setCountdown(60);
        setSuccess("Verification code resent successfully!");
      } else {
        setError(res.data.message || "Failed to resend verification code");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (step === 1) {
      navigate("/seller-login");
    } else {
      setStep(1);
      setError("");
      setSuccess("");
      setVerificationCode("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-green-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full bg-secondary-50 bg-opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#f59e0b" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>'
            )}")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{step === 1 ? "Back to Login" : "Change Phone Number"}</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="Nayagara.lk"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold text-secondary-700">
                Nayagara.lk
              </h1>
            </div>

            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 1 ? (
                <Phone className="w-8 h-8 text-primary-600" />
              ) : (
                <Shield className="w-8 h-8 text-primary-600" />
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {step === 1 ? "Verify Your Mobile" : "Enter Verification Code"}
            </h2>
            <p className="text-gray-600">
              {step === 1
                ? "We need to verify your mobile number to secure your seller account"
                : `We sent a 6-digit code to ${phoneNumber}`}
            </p>
          </div>

          {/* Step 1: Phone Number Input */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex">
                    {/* Country Code Dropdown */}
                    <div className="relative">
                      <select
                        disabled
                        className="h-full px-3 py-3 border border-gray-300 border-r-0 rounded-l-lg bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none pr-8"
                      >
                        <option value="+94">🇱🇰 +94</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          
                        </svg>
                      </div>
                    </div>
                    <input
                      type="tel"
                      placeholder="77 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 border-l-0 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your mobile number without the country code
                  </p>
              </div>

              {error && (
                <div className="bg-orange-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                onClick={handleSendCode}
                disabled={loading || !phoneNumber}
                className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-4 rounded-lg font-bold hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Verification Code Input */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors text-center text-lg font-mono tracking-widest"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-primary-50 border border-primary-200 text-primary-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-4 rounded-lg font-bold hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>

              {/* Resend Code Button */}
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={countdown > 0 || loading}
                  className="text-secondary-600 hover:text-secondary-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-1 mx-auto"
                >
                  {countdown > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Resend in {countdown}s</span>
                    </>
                  ) : (
                    <span>Resend Code</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Having trouble?</p>
            <button className="text-sm text-secondary-600 hover:text-secondary-700 font-bold">
              Contact Support →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          By verifying your mobile number, you agree to our{" "}
          <button className="text-secondary-600 hover:underline">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="text-secondary-600 hover:underline">
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerMobileVerify;
