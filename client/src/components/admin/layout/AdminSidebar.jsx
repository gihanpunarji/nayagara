import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  MessageSquare,
  Settings,
  Shield,
  AlertCircle,
  FileText,
  TrendingUp,
  Globe,
  HelpCircle,
  Database,
  Activity,
  Car
} from 'lucide-react';

const AdminSidebar = ({ showMobileMenu, onMenuToggle }) => {
  const location = useLocation();

  const menuSections = [
    {
      title: 'Overview',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          path: '/admin/dashboard',
          badge: null
        },
        {
          icon: Activity,
          label: 'System Monitor',
          path: '/admin/system',
          badge: null
        }
      ]
    },
    {
      title: 'User Management',
      items: [
        {
          icon: Users,
          label: 'Customers',
          path: '/admin/customers',
          badge: '1,234'
        },
        {
          icon: Store,
          label: 'Sellers',
          path: '/admin/sellers',
          badge: '89'
        },
        {
          icon: Shield,
          label: 'Admin Users',
          path: '/admin/admins',
          badge: null
        }
      ]
    },
    {
      title: 'Commerce',
      items: [
        {
          icon: Package,
          label: 'Products',
          path: '/admin/products',
          badge: '12.5K'
        },
        {
          icon: Car,
          label: 'Advertisements',
          path: '/admin/advertisements',
          badge: '8'
        },
        {
          icon: ShoppingCart,
          label: 'Orders',
          path: '/admin/orders',
          badge: '45'
        },
        {
          icon: CreditCard,
          label: 'Payments',
          path: '/admin/payments',
          badge: null
        },
        {
          icon: MessageSquare,
          label: 'Disputes',
          path: '/admin/disputes',
          badge: '12'
        }
      ]
    },
    {
      title: 'Analytics & Reports',
      items: [
        {
          icon: BarChart3,
          label: 'Analytics',
          path: '/admin/analytics',
          badge: null
        },
        {
          icon: TrendingUp,
          label: 'Reports',
          path: '/admin/reports',
          badge: null
        },
        {
          icon: FileText,
          label: 'Audit Logs',
          path: '/admin/audit-logs',
          badge: null
        }
      ]
    },
    {
      title: 'System',
      items: [
        {
          icon: Globe,
          label: 'Platform Settings',
          path: '/admin/platform-settings',
          badge: null
        },
        {
          icon: Database,
          label: 'Database',
          path: '/admin/database',
          badge: null
        },
        {
          icon: AlertCircle,
          label: 'Security Center',
          path: '/admin/security',
          badge: '3'
        }
      ]
    }
  ];

  const bottomMenuItems = [
    {
      icon: Settings,
      label: 'Settings',
      path: '/admin/settings'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      path: '/admin/help'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const MenuLink = ({ item, onClick }) => {
    const isActive = isActivePath(item.path);

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
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
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isActive
              ? 'bg-white bg-opacity-20 text-white'
              : 'bg-green-100 text-green-600'
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          {/* Sidebar content */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            {/* Menu Sections */}
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <nav className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <MenuLink
                      key={itemIndex}
                      item={item}
                      onClick={showMobileMenu ? onMenuToggle : undefined}
                    />
                  ))}
                </nav>
              </div>
            ))}

            {/* System Status Card */}
            <div className="mt-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-green-800">System Status</h3>
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Active Users</span>
                  <span className="font-semibold text-green-800">2,847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Server Load</span>
                  <span className="font-semibold text-green-800">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Response Time</span>
                  <span className="font-semibold text-green-800">125ms</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs text-green-600 mt-1">System performing well</p>
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

export default AdminSidebar;