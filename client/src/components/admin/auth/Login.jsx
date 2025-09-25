import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, Shield } from 'lucide-react';
import api from "../../../api/axios";

function AdminLogin() {
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
      const res = await api.post("/admin/auth/login", formData);
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("user_role", "admin");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-3 h-3 bg-red-500/30 rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-orange-500/30 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-red-400/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-orange-400/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-600/15 to-red-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/40 to-gray-900/40 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <img
                  src="/logo.png"
                  alt="Nayagara.lk"
                  className="w-12 h-12 object-contain"
                />
                <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Nayagara.lk
                </h1>
              </div>

              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
              <p className="text-gray-300 leading-relaxed">
                Secure access to system administration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter admin email"
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 backdrop-blur-sm hover:border-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-red-400 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    required
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 backdrop-blur-sm hover:border-red-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-red-400 transition-colors duration-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-red-400 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border-2 border-red-500 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Access Admin Panel</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Authorized personnel only. All activities are logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;