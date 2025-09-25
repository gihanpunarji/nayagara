import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  RefreshCw,
  ArrowLeft,
  WifiOff,
  Signal,
  Router,
  Smartphone,
} from "lucide-react";

const NetworkError = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const checkConnection = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      alert("Please check your internet connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-3 h-3 bg-blue-300 rounded-full animate-bounce-gentle opacity-60"></div>
        <div
          className="absolute top-40 right-32 w-2 h-2 bg-indigo-400 rounded-full animate-bounce-gentle opacity-40"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-40 w-4 h-4 bg-blue-200 rounded-full animate-bounce-gentle opacity-50"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-3 h-3 bg-indigo-300 rounded-full animate-bounce-gentle opacity-30"
          style={{ animationDelay: "1.5s" }}
        ></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full opacity-15 blur-3xl"></div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(#grid)"/></svg>'
            )}")`,
          }}
        ></div>
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
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse">
                  <WifiOff className="w-12 h-12 text-white" />
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
              </div>

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
                No Internet Connection
              </h2>
              <p className="text-lg text-gray-600 mb-2 leading-relaxed">
                It looks like you're not connected to the internet right now.
              </p>
              <p className="text-gray-500 mb-8">
                Please check your connection and try again.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center space-x-2">
                  <Signal className="w-5 h-5 text-blue-600" />
                  <span>Connection Troubleshooting</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Router className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">WiFi Router</span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>• Check if router is powered on</li>
                      <li>• Restart your router</li>
                      <li>• Move closer to the router</li>
                    </ul>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Mobile Data</span>
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>• Check mobile data is enabled</li>
                      <li>• Verify data plan status</li>
                      <li>• Try airplane mode toggle</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-2">
                  Quick Solutions:
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">1.</span>
                    <span>
                      Turn WiFi off and on again in your device settings
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">2.</span>
                    <span>Restart your device</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">3.</span>
                    <span>Check if other websites work</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">4.</span>
                    <span>Contact your internet service provider</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={checkConnection}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Signal className="w-5 h-5" />
                <span>Check Connection</span>
              </button>

              <button
                onClick={handleRefresh}
                className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Retry</span>
              </button>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Having persistent connection issues? Contact{" "}
            <a
              href="mailto:support@nayagara.lk"
              className="text-primary-600 hover:underline font-medium"
            >
              support@nayagara.lk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
