import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';

const SellerHeader = ({ onMenuToggle, showMobileMenu }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [sellerInfo, setSellerInfo] = useState({
    name: 'Loading...',
    firstName: '',
    profileImage: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fetch seller info from existing profile endpoint
  const fetchSellerInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seller/profile');
      
      if (response.data.success) {
        const userData = response.data.user;
        setSellerInfo({
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          firstName: userData.first_name || 'Seller',
          lastName: userData.last_name || '',
          email: userData.email,
          profileImage: userData.profile_image || null
        });
      }
    } catch (error) {
      console.error('Error fetching seller info:', error);
      setSellerInfo({
        name: 'Seller',
        firstName: 'Seller',
        profileImage: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Load seller info on component mount
  useEffect(() => {
    fetchSellerInfo();
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // Clear all localStorage and authentication state
    logout();
    // Navigate to home page
    navigate('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={onMenuToggle}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Logo */}
              <Link to="/seller/dashboard" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-2">
                  <span className="text-lg font-bold">N</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">Nayagara</h1>
                  <p className="text-xs text-gray-500">Seller Portal</p>
                </div>
              </Link>
            </div>

            {/* Center - Welcome message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-medium text-gray-800">
                Hello, <span className="text-primary-600 font-semibold">
                  {loading ? 'Loading...' : sellerInfo.firstName || sellerInfo.name}
                </span>
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Seller Name */}
              <div className="flex items-center space-x-3">
                {/* Profile Image or Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {sellerInfo.profileImage ? (
                    <img 
                      src={sellerInfo.profileImage} 
                      alt={sellerInfo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to avatar if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center ${sellerInfo.profileImage ? 'hidden' : 'flex'}`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {sellerInfo.firstName ? sellerInfo.firstName.charAt(0).toUpperCase() : 
                         sellerInfo.name ? sellerInfo.name.charAt(0).toUpperCase() : 'S'}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-medium text-gray-900 hidden sm:block">
                  {loading ? 'Loading...' : sellerInfo.name}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your seller account?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default SellerHeader;