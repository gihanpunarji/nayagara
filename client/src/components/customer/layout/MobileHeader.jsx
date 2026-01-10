import React, { useState } from 'react';
import { Search, Bell, Menu, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MobileHeader = ({
  searchQuery,
  setSearchQuery,
  wishlistCount = 0,
  onMenuToggle,
  user = null
}) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Mobile/Tablet Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 xl:hidden">
        {/* Top Bar */}
        <div className="bg-gradient-primary text-white text-xs md:text-sm py-1 md:py-1.5">
          <div className="px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              <span>Deliver to All Island</span>
            </div>
            <div className="flex items-center space-x-1">
              <Link to="/seller/register" className="flex items-center space-x-1 hover:underline">
               <span>Start Selling</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Nayagara.lk"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <div>
                <h1 className="text-lg md:text-xl font-heading font-bold text-primary-700">
                  Nayagara.lk
                </h1>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Notifications */}
              {user && (
                <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
                </button>
              )}

              {/* Menu Toggle */}
              <button
                onClick={onMenuToggle}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-10 md:h-11 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              className="absolute right-0 top-0 h-10 md:h-11 w-10 md:w-11 flex items-center justify-center text-gray-500 hover:text-primary-600"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default MobileHeader;