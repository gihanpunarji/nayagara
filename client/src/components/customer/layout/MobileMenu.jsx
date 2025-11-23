import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Settings,
  Heart,
  Clock,
  CreditCard,
  HelpCircle,
  Bell,
  LogOut,
  Store,
  Gift,
  Shield,
  Filter,
  Info,
  Building,
  Zap,
  TrendingUp,
  Star,
  Droplets,
  Phone,
  MessageSquare,
  Package,
  Car,
  MapPin,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdvancedFilters from '../../customer/layout/AdvancedFilters';
import { useAuth } from '../../../context/AuthContext';

const MobileMenu = ({
  isOpen,
  onClose,
  navItems = null,
  activeNavItem = null,
  handleNavClick = null,
  scrollToContact = null,
  setActiveTab = null,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { user, logout } = useAuth();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const mainCategories = [
    { name: 'Electronics' },
    { name: 'Vehicles' },
    { name: 'Fashion' },
    { name: 'Home & Living' },
    { name: 'Beauty & Health' },
    { name: 'Sports' },
    { name: 'Books & Media' },
    { name: 'Services' },
  ];

  const companyMenuItems = [
    { label: 'About Us', icon: Info, path: '/about-us' },
    { label: 'Our Business', icon: Building, path: '/our-business' },
    { label: 'Buyer Protection', icon: Shield, path: '/buyer-protection' },
    { label: 'Help Center', icon: HelpCircle, path: '/help-center' },
  ];

  const handleFiltersApply = (filters) => {
    console.log('Applied filters:', filters);
    setShowAdvancedFilters(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 ${
          navItems ? 'bottom-0' : 'bottom-16'
        } w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b border-gray-100 text-white flex-shrink-0 ${
            navItems
              ? 'bg-gradient-to-r from-emerald-500 to-green-600'
              : 'bg-gradient-to-r from-primary-500 to-secondary-500'
          }`}
        >
          <div className="flex items-center space-x-3">
            {user ? (
              <img
                src={user.profile_picture}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {navItems ? (
                  <Droplets className="w-5 h-5 text-white" />
                ) : (
                  <Store className="w-5 h-5 text-white" />
                )}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg">{navItems ? 'Nayagara Water' : 'Nayagara'}</h3>
              {navItems ? (
                <p className="text-xs text-white/80">Pure Water Solutions</p>
              ) : user ? (
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-white/80">{user.email}</p>
                </div>
              ) : (
                <p className="text-xs text-white/80">Explore & Shop</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
          {navItems ? (
            // Nayagara Water Navigation
            <div className="py-4">
              <h4 className="px-6 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h4>
              <div className="mx-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors group border-t border-gray-100 first:border-t-0 ${
                        activeNavItem === item.id
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 ${
                          activeNavItem === item.id
                            ? 'text-emerald-600'
                            : 'text-gray-500 group-hover:text-emerald-600'
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          activeNavItem === item.id
                            ? 'text-emerald-600'
                            : 'group-hover:text-emerald-600'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-4">
              <h4 className="px-6 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Account
              </h4>
              <div className="mx-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => {
                        navigate('/account?tab=dashboard');
                        onClose();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100 first:border-t-0"
                    >
                      <User className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        Dashboard
                      </span>
                    </Link>
                    <Link
                      to="/account?tab=orders"
                      onClick={() => {
                        navigate('/account?tab=orders');
                        onClose();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100"
                    >
                      <Package className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        My Orders
                      </span>
                    </Link>
                    <Link
                      to="/account?tab=my-ads"
                      onClick={() => {
                        navigate('/account?tab=my-ads');
                        onClose();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100"
                    >
                      <Car className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        My Ads
                      </span>
                    </Link>
                    <Link
                      to="/account?tab=wallet"
                      onClick={() => {
                        navigate('/account?tab=wallet');
                        onClose();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100"
                    >
                      <CreditCard className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        My Wallet
                      </span>
                    </Link>
                    <Link
                      to="/account?tab=addresses"
                      onClick={() => {
                        navigate('/account?tab=addresses');
                        onClose();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100"
                    >
                      <MapPin className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        Addresses
                      </span>
                    </Link>
                    <Link
                      to="/account?tab=support"
                      onClick={() => {
                        navigate('/account?tab=support');
                        onClose();
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        Help & Support
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors group border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-600">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100 first:border-t-0"
                    >
                      <User className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        Sign In
                      </span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100"
                    >
                      <User className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        Register
                      </span>
                    </Link>
                  </>
                )}
              </div>

              {/* Company Section */}
              <h4 className="px-6 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">
                Company
              </h4>
              <div className="mx-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {companyMenuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100 first:border-t-0"
                    >
                      <IconComponent className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-white flex-shrink-0">
          {scrollToContact ? (
            <>
              <button
                onClick={() => {
                  scrollToContact && scrollToContact();
                  onClose();
                }}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Order Now</span>
              </button>
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  Pure Water for a Healthier Life
                </p>
              </div>
            </>
          ) : (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Join 10,000+ sellers nationwide
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onFiltersApply={handleFiltersApply}
        selectedCategory="All Categories"
        mainCategories={mainCategories}
      />
    </>
  );
};

export default MobileMenu;
