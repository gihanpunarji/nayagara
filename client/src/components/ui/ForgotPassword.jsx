import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle, Shield, Clock } from 'lucide-react';
import api from "../../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("request");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (step === "sent" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, step]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setStep("sent");
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setTimeLeft(60);
      setCanResend(false);
      setStep("sent");
    } catch (err) {
      setError("Failed to resend email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <button
          onClick={() => navigate('/login')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Login</span>
        </button>

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

              {step === "request" && (
                <>
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-green">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                  <p className="text-gray-600 leading-relaxed">
                    No worries! Enter your email address and we'll send you a secure link to reset your password.
                  </p>
                </>
              )}

              {step === "sent" && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We've sent a password reset link to <span className="font-semibold text-primary-600">{email}</span>
                  </p>
                </>
              )}

              {step === "error" && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We encountered an issue sending the reset email. Please try again.
                  </p>
                </>
              )}
            </div>

            {step === "request" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-primary-300 text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2 animate-slide-up">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-bold hover:shadow-green-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {step === "sent" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700 space-y-2">
                      <p className="font-semibold">Next Steps:</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Check your email inbox and spam folder</li>
                        <li>• Click the reset link in the email</li>
                        <li>• Create a new secure password</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">Didn't receive the email?</p>

                  {!canResend ? (
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Resend in {timeLeft} seconds
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      className="text-primary-600 hover:text-primary-700 font-semibold text-sm underline decoration-2 underline-offset-2 hover:decoration-primary-700 transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Resend Email"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === "error" && (
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={() => setStep("request")}
                  className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-bold hover:shadow-green-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
                >
                  <Shield className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="space-y-4 text-center">
              <div>
                <span className="text-gray-600">Remember your password? </span>
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-bold transition-colors duration-300 hover:underline decoration-2 underline-offset-2"
                >
                  Sign In
                </Link>
              </div>

              <div>
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-secondary-600 hover:text-secondary-700 font-bold transition-colors duration-300 hover:underline decoration-2 underline-offset-2"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <p>
            This link will expire in 15 minutes for security reasons
          </p>
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

export default ForgotPassword;