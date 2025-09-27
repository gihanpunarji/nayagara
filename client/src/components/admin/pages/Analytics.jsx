import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  const timeRanges = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 3 Months' },
    { key: '1y', label: 'Last Year' }
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: 'Rs. 12.4M',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '24,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Orders',
      value: '8,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      title: 'Active Sellers',
      value: '1,234',
      change: '+15.3%',
      trend: 'up',
      icon: Store,
      color: 'orange'
    },
    {
      title: 'Products Listed',
      value: '89.2K',
      change: '+22.1%',
      trend: 'up',
      icon: Package,
      color: 'indigo'
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'red'
    }
  ];

  const topCategories = [
    { name: 'Electronics', sales: 'Rs. 4.2M', percentage: 34, orders: 2847 },
    { name: 'Fashion', sales: 'Rs. 2.8M', percentage: 23, orders: 1923 },
    { name: 'Home & Garden', sales: 'Rs. 1.9M', percentage: 15, orders: 1234 },
    { name: 'Automotive', sales: 'Rs. 1.5M', percentage: 12, orders: 892 },
    { name: 'Books', sales: 'Rs. 1.0M', percentage: 8, orders: 567 },
    { name: 'Health & Beauty', sales: 'Rs. 1.0M', percentage: 8, orders: 489 }
  ];

  const topSellers = [
    { name: 'TechZone Electronics', revenue: 'Rs. 850K', orders: 445, rating: 4.8 },
    { name: 'Fashion Hub', revenue: 'Rs. 620K', orders: 312, rating: 4.6 },
    { name: 'AutoParts Pro', revenue: 'Rs. 580K', orders: 289, rating: 4.9 },
    { name: 'Green Gardens', revenue: 'Rs. 420K', orders: 234, rating: 5.0 },
    { name: 'Health Plus Pharmacy', revenue: 'Rs. 380K', orders: 198, rating: 4.7 }
  ];

  const recentTrends = [
    { metric: 'Mobile Users', current: '68%', previous: '62%', trend: 'up' },
    { metric: 'Avg Order Value', current: 'Rs. 15,420', previous: 'Rs. 14,200', trend: 'up' },
    { metric: 'Cart Abandonment', current: '23%', previous: '28%', trend: 'down' },
    { metric: 'Return Rate', current: '4.2%', previous: '5.1%', trend: 'down' },
    { metric: 'Customer Satisfaction', current: '4.6/5', previous: '4.4/5', trend: 'up' }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      indigo: 'from-indigo-500 to-indigo-600',
      red: 'from-red-500 to-red-600'
    };
    return colorMap[color] || 'from-gray-500 to-gray-600';
  };

  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights into platform performance and trends
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {timeRanges.map(range => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className={`flex items-center space-x-1 mt-2 text-sm ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{kpi.change}</span>
                    <span className="text-gray-500">vs previous period</span>
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(kpi.color)} flex items-center justify-center`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{category.sales}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{category.orders} orders</span>
                      <span>{category.percentage}%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Sellers</h2>
              <Store className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{seller.name}</div>
                      <div className="text-sm text-gray-500">{seller.orders} orders • ⭐ {seller.rating}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{seller.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Key Metrics Trends</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {recentTrends.map((trend, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{trend.metric}</div>
                <div className="text-xl font-bold text-gray-900 mb-1">{trend.current}</div>
                <div className={`flex items-center justify-center space-x-1 text-sm ${
                  trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>from {trend.previous}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Over Time</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will be displayed here</p>
                <p className="text-gray-400 text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">User Activity</h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">User activity chart will be displayed here</p>
                <p className="text-gray-400 text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;