import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Plus,
  List,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

const SellerSidebar = ({ showMobileMenu, onMenuToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/seller/dashboard',
      badge: null
    },
    {
      icon: Package,
      label: 'Products',
      path: '/seller/products',
      badge: null,
      subItems: [
        {
          icon: Plus,
          label: 'Add Product',
          path: '/seller/products/add'
        },
        {
          icon: List,
          label: 'All Products',
          path: '/seller/products'
        }
      ]
    },
    {
      icon: ShoppingCart,
      label: 'Orders',
      path: '/seller/orders',
      badge: '23'
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/seller/customers',
      badge: null
    },
    {
      icon: Wallet,
      label: 'Payments',
      path: '/seller/payments',
      badge: null
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/seller/analytics',
      badge: null
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      path: '/seller/messages',
      badge: '5'
    }
  ];

  const bottomMenuItems = [
    {
      icon: Settings,
      label: 'Settings',
      path: '/seller/settings'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      path: '/seller/help'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/seller/dashboard') {
      return location.pathname === '/seller/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const MenuLink = ({ item, isSubItem = false, onClick }) => {
    const isActive = isActivePath(item.path);

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isSubItem ? 'ml-6 text-sm' : ''
        } ${
          isActive
            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon
            className={`w-5 h-5 ${
              isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
            }`}
          />
          <span className="font-medium">{item.label}</span>
        </div>
        {item.badge && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isActive
              ? 'bg-white bg-opacity-20 text-white'
              : 'bg-red-100 text-red-600'
          }`}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar content */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            {/* Main Menu */}
            <nav className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <MenuLink
                    item={item}
                    onClick={showMobileMenu ? onMenuToggle : undefined}
                  />
                  {item.subItems && isActivePath(item.path) && (
                    <div className="mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <MenuLink
                          key={subIndex}
                          item={subItem}
                          isSubItem={true}
                          onClick={showMobileMenu ? onMenuToggle : undefined}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Quick Stats Card */}
            <div className="mt-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-primary-800">This Month</h3>
                <TrendingUp className="w-4 h-4 text-primary-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Sales</span>
                  <span className="font-semibold text-primary-800">Rs. 245K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Orders</span>
                  <span className="font-semibold text-primary-800">156</span>
                </div>
                <div className="w-full bg-primary-200 rounded-full h-2 mt-3">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="text-xs text-primary-600 mt-1">68% of monthly target</p>
              </div>
            </div>
          </div>

          {/* Bottom Menu */}
          <div className="border-t border-gray-200 px-4 py-4">
            <nav className="space-y-1">
              {bottomMenuItems.map((item, index) => (
                <MenuLink
                  key={index}
                  item={item}
                  onClick={showMobileMenu ? onMenuToggle : undefined}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;