import React, { useState } from 'react';
import { Search, Bell, Menu, Heart, MapPin, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileHeader = ({
  searchQuery,
  setSearchQuery,
  wishlistCount = 0,
  onMenuToggle,
  user = null
}) => {
  

  // Placeholder functions for the new search bar
  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', searchQuery);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleOpenAdvancedFilters = () => {
    // Implement filter logic here
    console.log('Opening advanced filters');
  };

  const getActiveFilterCount = () => {
    // Return the number of active filters
    return 0; 
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 md:hidden">
        {/* Top Bar */}
        <div className="bg-gradient-primary text-white text-xs py-1">
          <div className="px-4 flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Deliver to All Island</span>
            </div>
            <span>Get 30% OFF your first order!</span>
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
          

              {/* Notifications */}
              {user && (
                <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
                </button>
              )}

             

              {/* Menu Toggle */}
              <button
                onClick={onMenuToggle}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          
        </div>
      </header>
    </>
  );
};

export default MobileHeader;