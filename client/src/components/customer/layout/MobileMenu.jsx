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
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdvancedFilters from '../../customer/layout/AdvancedFilters';

const MobileMenu = ({ isOpen, onClose, user = null, navItems = null, activeNavItem = null, handleNavClick = null, scrollToContact = null }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Sample categories for filter
  const mainCategories = [
    { name: 'Electronics' }, { name: 'Vehicles' }, { name: 'Fashion' },
    { name: 'Home & Living' }, { name: 'Beauty & Health' }, { name: 'Sports' },
    { name: 'Books & Media' }, { name: 'Services' }
  ];

  const menuItems = [
    {
      category: 'Quick Access',
      items: [
        { label: 'Advanced Filters', icon: Filter, action: 'openFilters', highlight: true },
        { label: 'Flash Sale', icon: Zap, path: '/flash-sale', color: 'text-red-600' },
        { label: 'New Arrivals', icon: TrendingUp, path: '/new-arrivals', color: 'text-blue-600' },
        { label: 'Top Rated', icon: Star, path: '/top-rated', color: 'text-yellow-600' },
        { label: 'Daily Deals', icon: Gift, path: '/deals', color: 'text-green-600' },
      ]
    },
    {
      category: 'Account',
      items: user ? [
        { label: 'My Profile', icon: User, path: '/account/profile' },
        { label: 'Messages', icon: MessageSquare, path: '/messages' },
        { label: 'My Orders', icon: Clock, path: '/account/orders' },
        { label: 'My Wallet', icon: CreditCard, path: '/account/wallet' },
        { label: 'Notifications', icon: Bell, path: '/account/notifications' },
      ] : [
        { label: 'Sign In', icon: User, path: '/login' },
        { label: 'Register', icon: User, path: '/register' },
      ]
    },
    {
      category: 'Company',
      items: [
        { label: 'About Us', icon: Info, path: '/about-us' },
        { label: 'Our Business', icon: Building, path: '/our-business' },
        { label: 'Buyer Protection', icon: Shield, path: '/buyer-protection' },
        { label: 'Help Center', icon: HelpCircle, path: '/help' },
      ]
    }
  ];

  const handleFiltersApply = (filters) => {
    console.log('Applied filters:', filters);
    setShowAdvancedFilters(false);
  };

  if (user) {
    menuItems[0].items.push({ label: 'Sign Out', icon: LogOut, action: 'logout' });
  }

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
        className={`fixed top-0 right-0 ${navItems ? 'bottom-0' : 'bottom-16'} w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-100 text-white flex-shrink-0 ${
          navItems ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-primary-500 to-secondary-500'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              {navItems ? <Droplets className="w-5 h-5 text-white" /> : <Store className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="font-bold text-lg">{navItems ? 'Nayagara Water' : 'Nayagara'}</h3>
              {navItems ? (
                <p className="text-xs text-white/80">Pure Water Solutions</p>
              ) : user ? (
                <p className="text-xs text-white/80">Welcome, {user.name}!</p>
              ) : (
                <p className="text-xs text-white/80">Explore & Shop</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
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
                      <IconComponent className={`w-4 h-4 ${
                        activeNavItem === item.id ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-600'
                      }`} />
                      <span className={`font-medium ${
                        activeNavItem === item.id ? 'text-emerald-600' : 'group-hover:text-emerald-600'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Default Marketplace Menu
            menuItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="py-4">
                <h4 className="px-6 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  {category.category}
                </h4>
                <div className="mx-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {category.items.map((item, itemIndex) => {
                    const IconComponent = item.icon;

                    if (item.action === 'logout') {
                      return (
                        <button
                          key={itemIndex}
                          onClick={() => {
                            // Handle logout
                            onClose();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors group border-t border-gray-100 first:border-t-0"
                        >
                          <IconComponent className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-600">{item.label}</span>
                        </button>
                      );
                    }

                    if (item.action === 'openFilters') {
                      return (
                        <button
                          key={itemIndex}
                          onClick={() => {
                            setShowAdvancedFilters(true);
                            onClose();
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors group border-t border-gray-100 first:border-t-0 ${
                            item.highlight ? 'bg-primary-50 hover:bg-primary-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 ${item.highlight ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'}`} />
                          <span className={`font-medium ${item.highlight ? 'text-primary-600' : 'text-gray-700 group-hover:text-primary-600'}`}>
                            {item.label}
                          </span>
                          {item.highlight && (
                            <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={itemIndex}
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-t border-gray-100 first:border-t-0"
                      >
                        <IconComponent className={`w-4 h-4 ${item.color || 'text-gray-500 group-hover:text-primary-600'}`} />
                        <span className="font-medium text-gray-700 group-hover:text-primary-600">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-white flex-shrink-0">
          {scrollToContact ? (
            // Nayagara Water Footer
            <>
              <button
                onClick={() => {
                  scrollToContact();
                  onClose();
                }}
                className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Order Now</span>
              </button>
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">Pure Water for a Healthier Life</p>
              </div>
            </>
          ) : (
            // Default Footer
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">Join 10,000+ sellers nationwide</p>
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