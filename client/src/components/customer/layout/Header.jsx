import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, ChevronDown, Phone, Globe, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  showCategories,
  setShowCategories,
  mainCategories,
  quickLinks,
  serverStatus
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const userRole = localStorage.getItem('user_role');

    if (token && userData && userRole === 'customer') {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-primary text-white text-sm py-2">
        <div className="mx-auto px-4 sm:px-8 lg:px-16 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="hidden sm:flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+94 11 234 5678</span>
            </span>
            <span className="text-xs sm:text-sm">Get 50% OFF your first order!</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/seller/register" className="hover:text-primary-200 transition-colors font-medium">Sell on Nayagara</Link>
            <Link to="/help" className="hidden sm:block hover:text-primary-200 transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-green-lg sticky top-0 z-[100]">
        <div className="mx-auto px-4 sm:px-8 lg:px-16">
          {/* Top Header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-green">
                <img
                  src="/logo.png"
                  alt="Nayagara.lk"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-heading font-bold text-primary-700">
                  Nayagara.lk
                </h1>
                <p className="hidden sm:block text-xs text-gray-500">Sri Lanka's #1 Online Shopping</p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-4 sm:mx-8">
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-l-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="h-10 sm:h-12 px-3 sm:px-6 bg-gradient-primary text-white rounded-r-lg hover:shadow-green transition-all duration-300 flex items-center space-x-1 sm:space-x-2">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden md:block font-medium">SEARCH</span>
                </button>
              </div>
              
              {/* Quick Search Tags */}
              <div className="hidden lg:flex space-x-2 mt-2">
                {['iPhone 15', 'Toyota Prius', 'Gaming Laptop', 'Apartments Colombo'].map((tag, idx) => (
                  <button key={idx} className="text-xs bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full text-primary-700 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/account/wishlist" className="relative p-1 sm:p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">5</span>
              </Link>

              <Link to="/cart" className="relative p-1 sm:p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </Link>

              <div
                onClick={handleAccountClick}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">
                    {isAuthenticated ? 'Hello' : 'Hello'}
                  </p>
                  <div className="text-sm font-medium text-gray-800">
                    {isAuthenticated ? user?.firstName || user?.first_name || 'User' : 'Sign In / Register'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="border-t border-gray-200 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-6 overflow-x-auto scrollbar-hide">
                {quickLinks.map((link, idx) => (
                  <a key={idx} href={link.href} target='_blank' className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm whitespace-nowrap">
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Deliver to</span>
                <span className="font-medium text-primary-600">Colombo 07</span>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
};

export default Header;