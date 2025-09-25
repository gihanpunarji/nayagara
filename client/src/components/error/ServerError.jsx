import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, RefreshCw, ArrowLeft, AlertTriangle, Mail, Clock } from 'lucide-react';

const ServerError = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-3 h-3 bg-red-300 rounded-full animate-bounce-gentle opacity-60"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-orange-400 rounded-full animate-bounce-gentle opacity-40" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-red-200 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-orange-300 rounded-full animate-bounce-gentle opacity-30" style={{ animationDelay: '1.5s' }}></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-red-300 to-orange-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-15 blur-3xl"></div>

        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ef4444" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(#grid)"/></svg>')}")`,
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
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse">
                  <AlertTriangle className="w-12 h-12 text-white" />
                </div>
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4 leading-none">
                  500
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-6"></div>
              </div>

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
                Internal Server Error
              </h2>
              <p className="text-lg text-gray-600 mb-2 leading-relaxed">
                Oops! Something went wrong on our end. Our servers are having a little hiccup.
              </p>
              <p className="text-gray-500 mb-8">
                Don't worry, our technical team has been notified and is working to fix this issue.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800 mb-2">What's happening?</h3>
                    <p className="text-sm text-gray-700">
                      We're experiencing temporary technical difficulties. This usually resolves itself within a few minutes.
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold">You can try:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Refreshing the page in a few moments</li>
                    <li>• Checking your internet connection</li>
                    <li>• Going back to the homepage</li>
                    <li>• Trying again in a few minutes</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-primary-600" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800 mb-1">Still having issues?</h3>
                    <p className="text-sm text-gray-700">
                      Contact our support team at{' '}
                      <a href="mailto:support@nayagara.lk" className="text-primary-600 font-medium hover:underline">
                        support@nayagara.lk
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>

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
              <p>Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p className="mt-1">Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            We apologize for the inconvenience. Our team is working hard to resolve this issue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;