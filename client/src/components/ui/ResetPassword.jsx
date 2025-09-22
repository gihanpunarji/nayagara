import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Key, ArrowLeft, Loader2 } from 'lucide-react';
import api from "../../api/axios";

function ResetPassword() {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [step, setStep] = useState("reset");
  const [validating, setValidating] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setStep("expired");
        setValidating(false);
        return;
      }

      try {
        await api.post("/auth/validate-reset-token", { token });
        setTokenValid(true);
        setValidating(false);
      } catch (err) {
        setTokenValid(false);
        setStep("expired");
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!passwords.password || passwords.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return false;
    }

    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", {
        token,
        password: passwords.password,
        confirmPassword: passwords.confirmPassword
      });

      setStep("success");
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes("token")) {
        setStep("expired");
      } else {
        setError(err.response?.data?.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = passwords.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return {
      score: strength,
      label: strength === 0 ? "" :
             strength <= 2 ? "Weak" :
             strength <= 3 ? "Fair" :
             strength <= 4 ? "Good" : "Strong",
      color: strength <= 2 ? "bg-red-500" :
             strength <= 3 ? "bg-yellow-500" :
             strength <= 4 ? "bg-blue-500" : "bg-green-500"
    };
  };

  const passwordStrength = getPasswordStrength();

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary-300 rounded-full animate-bounce-gentle opacity-60"></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce-gentle opacity-40" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-primary-200 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-2.5 h-2.5 bg-secondary-300 rounded-full animate-bounce-gentle opacity-30" style={{ animationDelay: '1.5s' }}></div>

        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full opacity-15 blur-3xl"></div>

        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22c55e" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(#grid)"/></svg>')}")`,
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-green-lg p-8 border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <img
                  src="/logo.png"
                  alt="Nayagara.lk"
                  className="w-12 h-12 object-contain"
                />
                <h1 className="text-2xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Nayagara.lk
                </h1>
              </div>

              {step === "reset" && tokenValid && (
                <>
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-green">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Create a new secure password for your Nayagara account
                  </p>
                </>
              )}

              {step === "success" && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successfully!</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                </>
              )}

              {step === "expired" && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Expired</h2>
                  <p className="text-gray-600 leading-relaxed">
                    This password reset link has expired or is invalid. Please request a new one.
                  </p>
                </>
              )}
            </div>

            {step === "reset" && tokenValid && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={passwords.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-primary-300 text-gray-800 placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>

                  {passwords.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.score <= 2 ? 'text-red-600' :
                          passwordStrength.score <= 3 ? 'text-yellow-600' :
                          passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Password should contain:</p>
                        <ul className="grid grid-cols-1 gap-1 ml-2">
                          <li className={`flex items-center space-x-1 ${passwords.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>At least 8 characters</span>
                          </li>
                          <li className={`flex items-center space-x-1 ${/[A-Z]/.test(passwords.password) ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>Uppercase letter</span>
                          </li>
                          <li className={`flex items-center space-x-1 ${/[a-z]/.test(passwords.password) ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>Lowercase letter</span>
                          </li>
                          <li className={`flex items-center space-x-1 ${/\d/.test(passwords.password) ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>Number</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-primary-300 text-gray-800 placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>

                  {passwords.confirmPassword && (
                    <div className="mt-2">
                      {passwords.password === passwords.confirmPassword ? (
                        <p className="text-xs text-green-600 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Passwords match</span>
                        </p>
                      ) : (
                        <p className="text-xs text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Passwords don't match</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2 animate-slide-up">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || passwordStrength.score < 3}
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-bold hover:shadow-green-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {step === "success" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Password Updated Successfully!</p>
                      <p>You can now sign in to your account with your new password.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-bold hover:shadow-green-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Continue to Login</span>
                </button>
              </div>
            )}

            {step === "expired" && (
              <div className="space-y-6">
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <p>This password reset link has expired or is invalid. Please request a new password reset email.</p>
                </div>

                <button
                  onClick={() => navigate('/forgot-password')}
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-bold hover:shadow-green-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
                >
                  <Shield className="w-5 h-5" />
                  <span>Request New Reset Link</span>
                </button>
              </div>
            )}

            {step !== "success" && (
              <>
                <div className="my-8 flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500 font-medium">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div className="text-center">
                  <span className="text-gray-600">Remember your password? </span>
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-bold transition-colors duration-300 hover:underline decoration-2 underline-offset-2"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? Contact{' '}
            <a href="mailto:support@nayagara.lk" className="text-primary-600 hover:underline font-medium">
              support@nayagara.lk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;