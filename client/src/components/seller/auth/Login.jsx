import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, Store } from 'lucide-react';
import api from "../../../api/axios";

function SellerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/seller/auth/login", formData);
      localStorage.setItem("seller_token", res.data.token);
      localStorage.setItem("user_role", "seller");
      navigate("/seller/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-300 rounded-full animate-bounce-gentle opacity-60"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-purple-400 rounded-full animate-bounce-gentle opacity-40" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-blue-200 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-300 rounded-full animate-bounce-gentle opacity-30" style={{ animationDelay: '1.5s' }}></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-15 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <img
                  src="/logo.png"
                  alt="Nayagara.lk"
                  className="w-12 h-12 object-contain"
                />
                <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nayagara.lk
                </h1>
              </div>

              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Seller Portal</h2>
              <p className="text-gray-600 leading-relaxed">
                Access your seller dashboard and manage your store
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-blue-300 text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-blue-300 text-gray-800 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors duration-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Store className="w-5 h-5" />
                    <span>Access Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="space-y-4 text-center">
              <div>
                <span className="text-gray-600">Don't have a seller account? </span>
                <Link
                  to="/seller/register"
                  className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-300 hover:underline decoration-2 underline-offset-2"
                >
                  Start Selling
                </Link>
              </div>

              <div>
                <Link
                  to="/seller/forgot-password"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-300 hover:underline decoration-2 underline-offset-2"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerLogin;