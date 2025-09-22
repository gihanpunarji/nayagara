import React from 'react';
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
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, user = null }) => {
  const menuItems = [
    {
      category: 'Account',
      items: user ? [
        { label: 'My Profile', icon: User, path: '/account/profile' },
        { label: 'My Orders', icon: Clock, path: '/account/orders' },
        { label: 'My Wallet', icon: CreditCard, path: '/account/wallet' },
        { label: 'Wishlist', icon: Heart, path: '/account/wishlist' },
        { label: 'Notifications', icon: Bell, path: '/account/notifications' },
      ] : [
        { label: 'Sign In', icon: User, path: '/login' },
        { label: 'Register', icon: User, path: '/register' },
      ]
    },
    {
      category: 'Shopping',
      items: [
        { label: 'Daily Deals', icon: Gift, path: '/deals' },
        { label: 'New Arrivals', icon: Store, path: '/new-arrivals' },
        { label: 'Best Sellers', icon: Store, path: '/best-sellers' },
        { label: 'Categories', icon: Store, path: '/categories' },
      ]
    },
    {
      category: 'Support',
      items: [
        { label: 'Help Center', icon: HelpCircle, path: '/help' },
        { label: 'Buyer Protection', icon: Shield, path: '/buyer-protection' },
        { label: 'Settings', icon: Settings, path: '/settings' },
      ]
    }
  ];

  if (user) {
    menuItems[0].items.push({ label: 'Sign Out', icon: LogOut, action: 'logout' });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-primary text-white">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Nayagara.lk"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h3 className="font-heading font-bold">Menu</h3>
              {user && <p className="text-xs text-primary-100">Welcome, {user.name}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto">
          {menuItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="py-4">
              <h4 className="px-4 text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                {category.category}
              </h4>
              <div className="space-y-1">
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
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-error hover:text-white transition-colors group"
                      >
                        <IconComponent className="w-5 h-5 text-error group-hover:text-white" />
                        <span className="font-medium text-error group-hover:text-white">{item.label}</span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-primary-50 hover:text-primary-600 transition-colors group"
                    >
                      <IconComponent className="w-5 h-5 text-gray-500 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/sell"
            onClick={onClose}
            className="w-full bg-gradient-secondary text-white py-3 px-4 rounded-lg font-bold text-center hover:shadow-green transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Store className="w-5 h-5" />
            <span>Start Selling</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;