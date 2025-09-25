import React, { useState, useEffect } from 'react';
import {
  Users, Store, Package, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle, Clock, BarChart3, Settings, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 15420,
    totalSellers: 1250,
    totalProducts: 8450,
    totalRevenue: 45600000,
    pendingApprovals: 45,
    systemHealth: 98.5,
    activeOrders: 234,
    monthlyGrowth: 23.8
  });

  const [recentActivity] = useState([
    { id: 1, type: 'user_registration', message: 'New user registered: john.doe@email.com', time: '2 minutes ago' },
    { id: 2, type: 'seller_approval', message: 'Seller approved: TechStore Lanka', time: '15 minutes ago' },
    { id: 3, type: 'product_flagged', message: 'Product flagged for review: iPhone 15 Pro', time: '32 minutes ago' },
    { id: 4, type: 'system_alert', message: 'High server load detected - Auto-scaled', time: '1 hour ago' },
  ]);

  const StatCard = ({ icon: Icon, title, value, change, changeType, color, subtitle }) => (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-400' : 'text-red-400'
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

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'user_registration': return <Users className="w-4 h-4 text-blue-400" />;
        case 'seller_approval': return <Store className="w-4 h-4 text-green-400" />;
        case 'product_flagged': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
        case 'system_alert': return <Shield className="w-4 h-4 text-red-400" />;
        default: return <Clock className="w-4 h-4 text-gray-400" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-750 rounded-lg transition-colors">
        <div className="flex-shrink-0 mt-1">
          {getIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-300">{activity.message}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">System overview and management center</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/admin/system-settings"
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <Link
              to="/admin/analytics"
              className="bg-gray-700 text-gray-300 border border-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={12.5}
            changeType="positive"
            color="from-blue-500 to-blue-600"
            subtitle="Active customers"
          />
          <StatCard
            icon={Store}
            title="Sellers"
            value={stats.totalSellers.toLocaleString()}
            change={8.3}
            changeType="positive"
            color="from-green-500 to-green-600"
            subtitle={`${stats.pendingApprovals} pending approval`}
          />
          <StatCard
            icon={Package}
            title="Products"
            value={stats.totalProducts.toLocaleString()}
            change={15.7}
            changeType="positive"
            color="from-purple-500 to-purple-600"
            subtitle="Live products"
          />
          <StatCard
            icon={DollarSign}
            title="Platform Revenue"
            value={`Rs. ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            change={stats.monthlyGrowth}
            changeType="positive"
            color="from-orange-500 to-orange-600"
            subtitle="Commission earned"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">System Health</h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Operational</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Server Uptime</span>
                <span className="font-bold text-white">{stats.systemHealth}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Orders</span>
                <span className="font-bold text-white">{stats.activeOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Response Time</span>
                <span className="font-bold text-green-400">125ms</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Pending Actions</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
                <div>
                  <p className="font-medium text-yellow-300">Seller Approvals</p>
                  <p className="text-sm text-yellow-400">{stats.pendingApprovals} applications waiting</p>
                </div>
                <Link
                  to="/admin/seller-approvals"
                  className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
                >
                  Review
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                <div>
                  <p className="font-medium text-red-300">Flagged Products</p>
                  <p className="text-sm text-red-400">12 products need review</p>
                </div>
                <Link
                  to="/admin/product-moderation"
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Moderate
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <Link
              to="/admin/activity-logs"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              View All Logs
            </Link>
          </div>
          <div className="space-y-1">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;