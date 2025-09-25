import React, { useState } from 'react';
import { Search, Bell, Menu, ShoppingCart, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileHeader = ({
  searchQuery,
  setSearchQuery,
  cartCount = 0,
  wishlistCount = 0,
  onMenuToggle,
  user = null
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 md:hidden">
        {/* Top Bar */}
        <div className="bg-gradient-primary text-white text-xs py-1">
          <div className="px-4 flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Deliver to Colombo 07</span>
            </div>
            <span>Get 50% OFF your first order!</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Nayagara.lk"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-lg font-heading font-bold text-primary-700">
                  Nayagara
                </h1>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              {user && (
                <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
                </button>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Menu Toggle */}
              <button
                onClick={onMenuToggle}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {showSearch && (
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Quick Categories (Mobile) */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 md:hidden">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[
            { name: 'Electronics', emoji: '📱' },
            { name: 'Vehicles', emoji: '🚗' },
            { name: 'Fashion', emoji: '👔' },
            { name: 'Home', emoji: '🏠' },
            { name: 'Beauty', emoji: '💄' },
            { name: 'Sports', emoji: '⚽' },
            { name: 'Books', emoji: '📚' }
          ].map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name.toLowerCase()}`}
              className="flex-shrink-0 flex flex-col items-center space-y-1 min-w-[60px]"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-lg">
                {category.emoji}
              </div>
              <span className="text-xs text-gray-600 text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileHeader;