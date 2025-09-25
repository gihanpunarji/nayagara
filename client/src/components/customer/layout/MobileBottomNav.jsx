import React from 'react';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = ({ cartCount = 0 }) => {
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      active: location.pathname === '/'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      path: '/search',
      active: location.pathname === '/search' || location.pathname.includes('/shop')
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      path: '/cart',
      active: location.pathname === '/cart',
      badge: cartCount
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      path: '/account',
      active: location.pathname.includes('/account') || location.pathname.includes('/login')
    }
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center transition-all duration-200 relative ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-primary-600'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-b-full"></div>
                )}

                <div className="relative flex flex-col items-center">
                  <div className="relative">
                    <IconComponent className={`w-6 h-6 ${isActive ? 'text-primary-600' : ''}`} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary-600' : ''}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom spacing to prevent content from being hidden behind nav */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default MobileBottomNav;