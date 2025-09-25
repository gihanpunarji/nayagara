import React, { useState, useEffect } from 'react';
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

  const [recentOrders] = useState([
    { id: 'ORD-001', customer: 'John Doe', amount: 15000, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 32000, status: 'shipped', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: 8500, status: 'delivered', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Sarah Wilson', amount: 22000, status: 'processing', date: '2024-01-14' },
  ]);

  const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{change}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div>
            <p className="font-semibold text-gray-900">{order.id}</p>
            <p className="text-sm text-gray-600">{order.customer}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">Rs. {order.amount.toLocaleString()}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/seller/products/add"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/seller/analytics"
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Package}
            title="Total Products"
            value={stats.totalProducts}
            color="from-blue-500 to-blue-600"
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
            color="from-purple-500 to-purple-600"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900">Performance</h3>
              </div>
              <Link
                to="/seller/analytics"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Details
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-900">{stats.avgRating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profile Views</span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-gray-900">1,234</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Growth</span>
                <span className="font-bold text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">Pending Orders</p>
                  <p className="text-sm text-orange-600">{stats.pendingOrders} orders need attention</p>
                </div>
                <Link
                  to="/seller/orders?status=pending"
                  className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Review
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Low Stock</p>
                  <p className="text-sm text-red-600">{stats.lowStockProducts} products running low</p>
                </div>
                <Link
                  to="/seller/products?filter=low-stock"
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Restock
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Link
              to="/seller/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All Orders
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;