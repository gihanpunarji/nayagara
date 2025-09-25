import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, ShoppingBag, Compass, RotateCcw } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-3 h-3 bg-primary-300 rounded-full animate-bounce-gentle opacity-60"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-secondary-400 rounded-full animate-bounce-gentle opacity-40" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-primary-200 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-secondary-300 rounded-full animate-bounce-gentle opacity-30" style={{ animationDelay: '1.5s' }}></div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-secondary-200 to-primary-200 rounded-full opacity-15 blur-3xl"></div>

        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22c55e" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(#grid)"/></svg>')}")`,
        }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 text-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-green-lg p-8 md:p-12 border border-white/20 relative overflow-hidden">
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
                <div className="text-8xl md:text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 leading-none">
                  404
                </div>
                <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto mb-6"></div>
              </div>

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-2 leading-relaxed">
                The page you're looking for seems to have wandered off into the digital wilderness.
              </p>
              <p className="text-gray-500 mb-8">
                Don't worry, even the best explorers sometimes take a wrong turn!
              </p>

              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-4">What you can do:</h3>
                <ul className="text-sm text-gray-700 space-y-2 text-left max-w-md mx-auto">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Check if the URL is typed correctly</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Go back to the previous page</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Visit our homepage to start fresh</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Use the search to find what you need</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

              <Link
                to="/shop"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop Now</span>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/search"
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors hover:underline decoration-2 underline-offset-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Products</span>
              </Link>
              <Link
                to="/account"
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium transition-colors hover:underline decoration-2 underline-offset-2"
              >
                <Compass className="w-4 h-4" />
                <span>My Account</span>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 font-medium transition-colors hover:underline decoration-2 underline-offset-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
            </div>
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
};

export default NotFound;