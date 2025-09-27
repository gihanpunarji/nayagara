import React, { useState, useEffect } from 'react';
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  BarChart3,
  PieChart,
  Calendar,
  Globe
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 2847,
    serverLoad: 45,
    responseTime: 125,
    errorRate: 0.02
  });

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        serverLoad: Math.max(20, Math.min(80, prev.serverLoad + Math.floor(Math.random() * 10) - 5)),
        responseTime: Math.max(80, Math.min(200, prev.responseTime + Math.floor(Math.random() * 20) - 10)),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() * 0.02) - 0.01))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: '24,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Sellers',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Store,
      color: 'green'
    },
    {
      title: 'Total Products',
      value: '89.2K',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'purple'
    },
    {
      title: 'Orders Today',
      value: '2,847',
      change: '-2.1%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'orange'
    },
    {
      title: 'Revenue',
      value: 'Rs. 2.4M',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'red'
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      change: '+0.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'indigo'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      title: 'New seller registration',
      description: 'Tech Electronics Store joined as verified seller',
      time: '5 minutes ago',
      icon: Store,
      urgent: false
    },
    {
      id: 2,
      type: 'security',
      title: 'Multiple failed login attempts',
      description: 'Blocked IP 192.168.1.100 after 5 failed attempts',
      time: '12 minutes ago',
      icon: AlertTriangle,
      urgent: true
    },
    {
      id: 3,
      type: 'order',
      title: 'Large order processed',
      description: 'Order #ORD-2024-5678 worth Rs. 125,000 completed',
      time: '18 minutes ago',
      icon: CheckCircle,
      urgent: false
    },
    {
      id: 4,
      type: 'system',
      title: 'Database backup completed',
      description: 'Daily backup completed successfully (2.3GB)',
      time: '1 hour ago',
      icon: CheckCircle,
      urgent: false
    },
    {
      id: 5,
      type: 'dispute',
      title: 'New dispute filed',
      description: 'Customer dispute for order #ORD-2024-5432',
      time: '2 hours ago',
      icon: AlertTriangle,
      urgent: true
    }
  ];

  const systemHealth = [
    {
      name: 'Database',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '12ms'
    },
    {
      name: 'API Gateway',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '45ms'
    },
    {
      name: 'Payment Service',
      status: 'warning',
      uptime: '98.2%',
      responseTime: '180ms'
    },
    {
      name: 'Search Engine',
      status: 'healthy',
      uptime: '99.5%',
      responseTime: '67ms'
    },
    {
      name: 'File Storage',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '23ms'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-green-500 to-green-600',
      indigo: 'from-indigo-500 to-indigo-600'
    };
    return colorMap[color] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user':
        return Store;
      case 'security':
        return AlertTriangle;
      case 'order':
        return CheckCircle;
      case 'system':
        return CheckCircle;
      case 'dispute':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>

            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Live View</span>
            </button>
          </div>
        </div>

        {/* Real-time System Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Real-time System Status</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{realTimeData.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{realTimeData.serverLoad}%</div>
              <div className="text-sm text-gray-600">Server Load</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{realTimeData.responseTime}ms</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(realTimeData.errorRate * 100).toFixed(2)}%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className={`flex items-center space-x-1 mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{stat.change}</span>
                    <span className="text-gray-500">vs last period</span>
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(stat.color)} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">View All</button>
            </div>

            <div className="space-y-4">
              {recentActivities.map(activity => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
                    activity.urgent
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.urgent ? 'bg-red-100' : 'bg-gray-200'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        activity.urgent ? 'text-red-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">All Systems Operational</span>
              </div>
            </div>

            <div className="space-y-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-600">Uptime: {service.uptime}</span>
                      <span className="text-xs text-gray-600">Response: {service.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">User Distribution</h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">User distribution chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;