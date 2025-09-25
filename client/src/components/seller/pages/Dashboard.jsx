import React, { useState } from 'react';
import {
  TrendingUp, Package, ShoppingCart, DollarSign, Eye,
  Users, Star, AlertCircle, Plus, BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 124,
    totalOrders: 856,
    totalRevenue: 2450000,
    totalCustomers: 342,
    avgRating: 4.6,
    pendingOrders: 23,
    lowStockProducts: 8,
    monthlyGrowth: 12.5
  });

  // Verification status - always verified for enabled dashboard
  const [verificationStatus] = useState({
    emailVerified: true,
    phoneVerified: true
  });

  const [recentOrders] = useState([
    { id: 'ORD-001', customer: 'John Doe', amount: 15000, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 32000, status: 'shipped', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: 8500, status: 'delivered', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Sarah Wilson', amount: 22000, status: 'processing', date: '2024-01-14' },
  ]);


  // Check if seller is verified to enable dashboard functionality
  const isFullyVerified = verificationStatus.emailVerified && verificationStatus.phoneVerified;

  const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 sm:mt-2 text-xs sm:text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{change}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-2 sm:space-y-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.id}</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{order.customer}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end sm:text-right space-x-3">
        <p className="font-bold text-gray-900 text-sm sm:text-base">Rs. {order.amount.toLocaleString()}</p>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
          order.status === 'delivered' ? 'bg-green-100 text-green-600' :
          order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
          order.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
          'bg-orange-100 text-orange-600'
        }`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Dashboard Content - with overlay if not verified */}
        <div className="relative">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Seller Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Link
                to="/seller/products/add"
                className="bg-gradient-primary text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium hover:shadow-green transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Add Product</span>
              </Link>
              <Link
                to="/seller/analytics"
                className="bg-white text-gray-700 border border-gray-300 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Analytics</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={Package}
              title="Total Products"
              value={stats.totalProducts}
              color="from-primary-500 to-primary-600"
            />
            <StatCard
              icon={ShoppingCart}
              title="Total Orders"
              value={stats.totalOrders}
              change={stats.monthlyGrowth}
              changeType="positive"
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon={DollarSign}
              title="Revenue"
              value={`Rs. ${(stats.totalRevenue / 1000)}K`}
              change={15.2}
              changeType="positive"
              color="from-secondary-500 to-secondary-600"
            />
            <StatCard
              icon={Users}
              title="Customers"
              value={stats.totalCustomers}
              change={8.1}
              changeType="positive"
              color="from-orange-500 to-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Performance</h3>
                </div>
                <Link
                  to="/seller/analytics"
                  className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">{stats.avgRating}</span>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Profile Views</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="font-bold text-gray-900 text-sm sm:text-base">1,234</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Monthly Growth</span>
                  <span className="font-bold text-green-600 text-sm sm:text-base">+{stats.monthlyGrowth}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Quick Actions</h3>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-orange-50 rounded-lg space-y-2 sm:space-y-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-orange-900 text-sm sm:text-base">Pending Orders</p>
                    <p className="text-xs sm:text-sm text-orange-600">{stats.pendingOrders} orders need attention</p>
                  </div>
                  <Link
                    to="/seller/orders?status=pending"
                    className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors w-full sm:w-auto text-center"
                  >
                    Review
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-red-50 rounded-lg space-y-2 sm:space-y-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-red-900 text-sm sm:text-base">Low Stock</p>
                    <p className="text-xs sm:text-sm text-red-600">{stats.lowStockProducts} products running low</p>
                  </div>
                  <Link
                    to="/seller/products?filter=low-stock"
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-600 transition-colors w-full sm:w-auto text-center"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Recent Orders</h3>
              <Link
                to="/seller/orders"
                className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
              >
                View All Orders
              </Link>
            </div>
            <div className="space-y-2 sm:space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;