import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

function SellerLogin() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginSeller } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const res = await loginSeller(emailOrMobile, password);

      if (res.success) {
        navigate("/seller/dashboard");
      } else {
        // Handle specific error messages
        if (res.error === "mnv") {
          navigate("/seller/verify-mobile", { state: { emailOrMobile, from: "seller-login" } });
          return;
        }
        
        // Handle unauthorized role error
        if (res.error?.includes("not registered as a seller")) {
          setError("This email is not registered as a seller account. Please use customer login or register as a seller.");
          return;
        }

        setError(res.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full bg-primary-50 bg-opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#22c55e" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>'
            )}")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-green-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="Nayagara.lk"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-heading font-bold text-primary-700">
                Nayagara.lk
              </h1>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Sign in to your seller account to continue selling
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {emailOrMobile.includes("@") ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="Enter email or mobile number"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please follow this format for mobile eg: 94711234567
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                state={{ from: "login" }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-primary text-white py-3 px-4 rounded-lg font-bold hover:shadow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/seller/register"
                className="text-primary-600 hover:text-primary-700 font-bold"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Want to sell on Nayagara?
            </p>
            <Link
              to="/seller/register"
              className="text-sm text-secondary-600 hover:text-secondary-700 font-bold"
            >
              Start Selling →
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SellerLogin;
