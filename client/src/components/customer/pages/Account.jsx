import React, { useState } from 'react';
import {
  User, Package, Heart, CreditCard, MapPin, Settings, HelpCircle,
  LogOut, ChevronRight, Star, Truck, Clock, Gift, Shield, Eye,
  Download, MessageCircle, Bell, Edit, Copy, Share2
} from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const CustomerAccount = () => {
  const storedUsser = localStorage.getItem('user');
  if(storedUsser == null) {
    return <Navigate to={'/'} replace />
  
  }

  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  // Mock user data
  const user = {
    name: 'Kasun Perera',
    email: 'kasun.perera@gmail.com',
    mobile: '+94 77 123 4567',
    joinDate: 'January 2023',
    profileImage: null,
    verified: true,
    walletBalance: 15750,
    referralCode: 'KP2023',
    totalReferrals: 12,
    referralEarnings: 8500
  };

  // Mock order data
  const recentOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-20',
      status: 'delivered',
      total: 385000,
      items: [
        {
          name: 'iPhone 15 Pro Max 256GB',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          price: 385000,
          quantity: 1
        }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-18',
      status: 'shipping',
      total: 425000,
      items: [
        {
          name: 'Gaming Laptop RTX 4070',
          image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          price: 425000,
          quantity: 1
        }
      ]
    }
  ];

  const wishlistItems = [
    {
      id: 1,
      name: 'Sony WH-1000XM4 Headphones',
      price: 65000,
      originalPrice: 75000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      inStock: true
    },
    {
      id: 2,
      name: 'Apple Watch Series 9',
      price: 125000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      inStock: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'wallet', label: 'My Wallet', icon: CreditCard },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'support', label: 'Help & Support', icon: HelpCircle }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-primary text-white rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
            <p className="text-primary-100">Member since {user.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
              <p className="text-sm text-gray-500">Wishlist Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Rs. {user.walletBalance.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Wallet Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user.totalReferrals}</p>
              <p className="text-sm text-gray-500">Referrals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.items[0].name}</p>
                  <p className="text-sm text-gray-500">{order.date} • Rs. {order.total.toLocaleString()}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

      {/* Order Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex space-x-1">
          {['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">Order placed on {order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-primary-600">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-lg font-bold text-gray-900">
                  Total: Rs. {order.total.toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                    Track Order
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full text-red-500 hover:bg-white transition-colors">
                <Heart className="w-4 h-4 fill-current" />
              </button>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary-600">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      Rs. {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  disabled={!item.inStock}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Wallet</h2>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-2xl p-6">
        <h3 className="text-lg font-medium mb-2">Current Balance</h3>
        <p className="text-3xl font-bold mb-4">Rs. {user.walletBalance.toLocaleString()}</p>
        <div className="flex space-x-3">
          <button className="px-6 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Add Money
          </button>
          <button className="px-6 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
            Withdraw
          </button>
        </div>
      </div>

      {/* Referral Program */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Referral Program</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-8 h-8 text-primary-600" />
            </div>
            <p className="font-medium text-gray-900">Your Referral Code</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="font-mono text-lg font-bold text-primary-600">{user.referralCode}</span>
              <button className="p-1 text-gray-500 hover:text-primary-600 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <p className="font-medium text-gray-900">Total Referrals</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{user.totalReferrals}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-medium text-gray-900">Earnings</p>
            <p className="text-2xl font-bold text-green-600 mt-2">Rs. {user.referralEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { type: 'credit', amount: 5000, description: 'Referral bonus', date: '2024-01-20' },
              { type: 'debit', amount: 2500, description: 'Payment for Order #ORD-2024-001', date: '2024-01-18' },
              { type: 'credit', amount: 1000, description: 'Cashback reward', date: '2024-01-15' }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <span className={`font-bold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}Rs. {transaction.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'orders': return renderOrders();
      case 'wishlist': return renderWishlist();
      case 'wallet': return renderWallet();
      case 'addresses':
        return (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Address Management</h3>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'profile':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Settings</h3>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'support':
        return (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Help & Support</h3>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="p-6 bg-gradient-primary text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-primary-100">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;