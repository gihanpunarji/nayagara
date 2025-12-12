import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import AdminLayout from '../layout/AdminLayout';
import api from '../../../api/axios';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
      if (response.data.success) {
        setAnalyticsData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 3 Months' },
    { key: '1y', label: 'Last Year' }
  ];

  const formatValue = (kpi) => {
    if (kpi.title === 'Total Revenue') {
      return `Rs. ${(kpi.value).toFixed(2)}`;
    }
    if (kpi.value >= 1000000) {
      return `${(kpi.value / 1000000).toFixed(1)}M`;
    }
    if (kpi.value >= 1000) {
      return `${(kpi.value / 1000).toFixed(1)}K`;
    }
    return kpi.value.toString();
  };

  const getIconForKPI = (title) => {
    switch (title) {
      case 'Total Revenue': return DollarSign;
      case 'Active Users': return Users;
      case 'Total Orders': return ShoppingCart;
      case 'Active Sellers': return Store;
      case 'Products Listed': return Package;
      default: return BarChart3;
    }
  };

  const kpiData = analyticsData?.kpiData.map(kpi => ({
    ...kpi,
    icon: getIconForKPI(kpi.title),
    displayValue: formatValue(kpi)
  })) || [];

  const topCategories = analyticsData?.topCategories || [];
  const topSellers = analyticsData?.topSellers || [];
  const revenueOverTime = analyticsData?.revenueOverTime || [];
  const userActivityOverTime = analyticsData?.userActivityOverTime || [];

  // Simple line chart component
  const SimpleLineChart = ({ data, dataKey, color = '#10b981', height = 200 }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      );
    }

    const maxValue = Math.max(...data.map(d => d[dataKey]));
    const width = 100;
    const chartHeight = height;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = chartHeight - (item[dataKey] / maxValue) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full h-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percentage, i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight * percentage}
              x2={width}
              y2={chartHeight * percentage}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}

          {/* Area under the line */}
          <polygon
            points={`0,${chartHeight} ${points} ${width},${chartHeight}`}
            fill={color}
            opacity="0.1"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = chartHeight - (item[dataKey] / maxValue) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
              />
            );
          })}
        </svg>
      </div>
    );
  };

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
    // TODO: Implement export functionality
  };

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const formatPrice = (amount) => {
    return `Rs. ${parseFloat(amount).toLocaleString()}`;
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

            {/* <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button> */}

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
                  <p className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.displayValue}</p>
                </div>

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getColorClasses(kpi.color)} flex items-center justify-center shadow-lg`}>
                  <kpi.icon className="w-7 h-7 text-white" />
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
              {topCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No category data available</div>
              ) : (
                topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(category.sales)}</span>
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
                ))
              )}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Sellers</h2>
              <Store className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {topSellers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No seller data available</div>
              ) : (
                topSellers.map((seller, index) => (
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
                      <div className="font-semibold text-gray-900">{formatPrice(seller.revenue)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Over Time</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `Rs.${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`Rs. ${parseFloat(value).toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">User Activity</h2>
              <div className="flex items-center space-x-2">
                 <div className="flex items-center text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                    Customers
                 </div>
                 <div className="flex items-center text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                    Sellers
                 </div>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivityOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="New Customers"
                  />
                   <Line 
                    type="monotone" 
                    dataKey="sellers" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="New Sellers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;