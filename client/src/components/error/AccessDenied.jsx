import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Shield, Lock, User, LogIn, UserPlus } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-3 h-3 bg-amber-300 rounded-full animate-bounce-gentle opacity-60"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-yellow-400 rounded-full animate-bounce-gentle opacity-40" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-amber-200 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-yellow-300 rounded-full animate-bounce-gentle opacity-30" style={{ animationDelay: '1.5s' }}></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full opacity-15 blur-3xl"></div>

        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f59e0b" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(#grid)"/></svg>')}")`,
        }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 text-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-8">
                <img
                  src="/logo.png"
                  alt="Nayagara.lk"
                  className="w-12 h-12 object-contain"
                />
                <h1 className="text-2xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Nayagara.lk
                </h1>
              </div>

              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent mb-4 leading-none">
                  403
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mx-auto mb-6"></div>
              </div>

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
                Access Denied
              </h2>
              <p className="text-lg text-gray-600 mb-2 leading-relaxed">
                Sorry, you don't have permission to access this page or resource.
              </p>
              <p className="text-gray-500 mb-8">
                This area requires special authorization or you may need to log in.
              </p>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800 mb-2">Why am I seeing this?</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>You're not logged into your account</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Your account doesn't have the required permissions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>This is a restricted area for administrators only</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>Your session may have expired</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="w-6 h-6 text-primary-600" />
                  <h3 className="font-bold text-gray-800">What can you do?</h3>
                </div>
                <ul className="text-sm text-gray-700 space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">1.</span>
                    <span>Log in to your account if you haven't already</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">2.</span>
                    <span>Create a new account if you don't have one</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">3.</span>
                    <span>Contact support if you believe this is an error</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">4.</span>
                    <span>Check if you're accessing the correct page</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>

              <Link
                to="/"
                className="flex items-center justify-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-green-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Need different access levels? Contact your administrator.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Having access issues? Contact{' '}
            <a href="mailto:support@nayagara.lk" className="text-primary-600 hover:underline font-medium">
              support@nayagara.lk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;