import React, { useState } from "react";
import { Check, User, Home, Phone, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";

function SellerRegistration() {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  // form states
  const [mobile, setMobile] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nic, setNic] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Sri Lanka");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const steps = [
    { number: 1, title: "Account Details", icon: User },
    { number: 2, title: "Address Information", icon: Home },
    { number: 3, title: "Phone Verification", icon: Phone },
    { number: 4, title: "Verification Code", icon: ShieldCheck },
  ];

  const handleMobileVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/send-otp", { mobile, email });
    } catch (error) {
      setError(error.response?.data?.message);
      console.error(
        "Mobile verification error:",
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }

    setStep(4);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    await api.post("/auth/verify-otp", { mobile, email, verificationCode });
    navigate("/");
  };

  const handleAccountContinue = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setStep(2);
  };

  const handleAddressContinue = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/seller-register", {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        nic,
        address1,
        address2,
        city,
        //   district,
        //   province,
        //   country,
        postalCode,
      });
      if (res.data.success) {
        setSuccess(
          "Registration successful! Please verify your mobile number."
        );
        setStep(3);
      } else {
        setError(res.data.message || "An error occurred during registration");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
      console.error(
        "Seller registration error:",
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((stepItem, index) => {
        const Icon = stepItem.icon;
        const isCompleted = step > stepItem.number;
        const isCurrent = step === stepItem.number;

        return (
          <div key={stepItem.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary-500 border-primary-500 text-white"
                    : isCurrent
                    ? "bg-white border-primary-500 text-primary-500"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent ? "text-primary-600" : "text-gray-500"
                }`}
              >
                {stepItem.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                  isCompleted ? "bg-primary-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const Button = ({
    children,
    type = "button",
    onClick,
    disabled = false,
    variant = "primary",
  }) => {
    const baseClasses =
      "w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
    const variants = {
      primary:
        "bg-gradient-primary text-white hover:shadow-green-lg disabled:opacity-50 disabled:cursor-not-allowed",
      secondary:
        "bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50",
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]}`}
      >
        {loading && variant === "primary" ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          children
        )}
      </button>
    );
  };

  const AlertMessage = ({ type, message }) => {
    const styles = {
      error: "bg-red-50 border border-red-200 text-red-800",
      success: "bg-green-50 border border-green-200 text-green-800",
    };

    return (
      <div className={`p-4 rounded-lg mb-4 ${styles[type]}`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Sell on Nayagara
          </h1>
          <p className="text-lg text-gray-600">
            Register as a seller and start your journey!
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          {/* Error/Success Messages */}
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Create Your Account
              </h2>
              <form onSubmit={handleAccountContinue} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your NIC number"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-error">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-error">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit">Continue to Address Details</Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Address Information */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Address Information
              </h2>
              <form onSubmit={handleAddressContinue} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Street address, building name"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit number (optional)"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Creating Account..."
                      : "Continue to Verification"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Phone Verification */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Verify Your Phone
              </h2>
              <p className="text-gray-600 mb-6">
                We'll send a verification code to your mobile number to secure
                your account.
              </p>
              <form onSubmit={handleMobileVerify} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending Code..." : "Send Verification Code"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Verification Code */}
          {step === 4 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Enter Verification Code
              </h2>
              <p className="text-gray-600 mb-6">
                Please enter the 6-digit code sent to{" "}
                <span className="font-medium text-primary-600">{mobile}</span>
              </p>
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <div className="text-center mb-4">
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    onClick={handleMobileVerify}
                    disabled={loading}
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(3)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Already have an account?{" "}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SellerRegistration;
