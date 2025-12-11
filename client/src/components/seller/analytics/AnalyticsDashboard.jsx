import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Users,
  Star,
  Package,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Target
} from 'lucide-react';

import { getSellerAnalytics } from '../../../api/seller';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const periodOptions = [
    { key: '7', label: 'Last 7 days' },
    { key: '30', label: 'Last 30 days' },
    { key: '90', label: 'Last 3 months' },
    { key: '365', label: 'Last year' }
  ];

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await getSellerAnalytics(selectedPeriod);
        
        if (response.success && response.data) {
          const data = response.data;
          // Ensure all necessary fields exist with defaults
          const sanitizedData = {
            overview: {
              totalViews: data.overview?.totalViews || 0,
              totalOrders: data.overview?.totalOrders || 0,
              conversionRate: data.overview?.conversionRate || 0,
              totalRevenue: data.overview?.totalRevenue || 0,
              averageOrderValue: data.overview?.averageOrderValue || 0,
              newCustomers: data.overview?.newCustomers || 0,
              returningCustomers: data.overview?.returningCustomers || 0,
              rating: data.overview?.rating || 0,
              ratingCount: data.overview?.ratingCount || 0
            },
            trends: {
              views: data.trends?.views || { current: 0, previous: 0, change: 0 },
              orders: data.trends?.orders || { current: 0, previous: 0, change: 0 },
              revenue: data.trends?.revenue || { current: 0, previous: 0, change: 0 },
              customers: data.trends?.customers || { current: 0, previous: 0, change: 0 }
            },
            topProducts: data.topProducts || [],
            categoryPerformance: data.categoryPerformance || [],
            chartData: data.chartData || { daily: [] }
          };
          setAnalytics(sanitizedData);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  const formatPrice = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'Rs. 0';
    }
    if (amount >= 1000000) {
      return `Rs. ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    } else {
      return `Rs. ${amount.toLocaleString()}`;
    }
  };

  const formatNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) {
      return '0';
    }
    return number.toLocaleString();
  };

  const formatPercentage = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0%';
    }
    return `${value}%`;
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, change, color, isPercentage = false, isCurrency = false }) => {
    const isPositive = typeof change === 'number' ? change >= 0 : true;
    const formattedValue = isCurrency ? formatPrice(value) : isPercentage ? formatPercentage(value) : formatNumber(value);

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{formattedValue}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            {typeof change === 'number' && !isNaN(change) && (
              <div className={`flex items-center mt-2 text-sm ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{Math.abs(change).toFixed(1)}% vs previous period</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product, index }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
            #{index + 1}
          </span>
        </div>

        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {product.title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-gray-600">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span>{formatNumber(product.views)}</span>
            </div>
            <div className="flex items-center">
              <ShoppingCart className="w-3 h-3 mr-1" />
              <span>{product.orders}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              <span>{formatPrice(product.revenue)}</span>
            </div>
            <div className="flex items-center">
              <Target className="w-3 h-3 mr-1" />
              <span>{product.conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3">{category.category}</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Views</span>
          <span className="font-medium">{formatNumber(category.views)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Orders</span>
          <span className="font-medium">{category.orders}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Revenue</span>
          <span className="font-medium text-primary-600">{formatPrice(category.revenue)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Conversion</span>
          <span className="font-medium">{((category.orders / category.views) * 100).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue));

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div className="flex items-end space-x-2 h-32">
          {data.map((day, index) => {
            const height = (day.revenue / maxRevenue) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary-600 to-primary-500 rounded-t-sm transition-all hover:from-primary-700 hover:to-primary-600"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`${formatPrice(day.revenue)} on ${new Date(day.date).toLocaleDateString()}`}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).getDate()}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Revenue over time</span>
          <span>Peak: {formatPrice(maxRevenue)}</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track your store performance and gain insights
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Period Filter */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {periodOptions.map(option => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>

          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Eye}
          title="Total Views"
          value={analytics.overview?.totalViews}
          change={analytics.trends?.views.change}
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          icon={ShoppingCart}
          title="Total Orders"
          value={analytics.overview?.totalOrders}
          change={analytics.trends?.orders.change}
          color="from-green-500 to-green-600"
        />
        <MetricCard
          icon={DollarSign}
          title="Total Revenue"
          value={analytics.overview?.totalRevenue}
          change={analytics.trends?.revenue.change}
          color="from-primary-500 to-primary-600"
          isCurrency={true}
        />
        <MetricCard
          icon={Target}
          title="Conversion Rate"
          value={analytics.overview?.conversionRate}
          color="from-purple-500 to-purple-600"
          isPercentage={true}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Total Customers"
          value={analytics.overview?.newCustomers + analytics.overview?.returningCustomers}
          subtitle={`${analytics.overview?.newCustomers} new, ${analytics.overview?.returningCustomers} returning`}
          change={analytics.trends?.customers.change}
          color="from-orange-500 to-orange-600"
        />
        <MetricCard
          icon={DollarSign}
          title="Average Order Value"
          value={analytics.overview?.averageOrderValue}
          color="from-teal-500 to-teal-600"
          isCurrency={true}
        />
        <MetricCard
          icon={Star}
          title="Average Rating"
          value={analytics.overview?.rating}
          subtitle={`Based on ${analytics.overview?.ratingCount} reviews`}
          color="from-yellow-500 to-yellow-600"
        />
        <MetricCard
          icon={Package}
          title="Products Listed"
          value={124}
          subtitle="89 active, 35 inactive"
          color="from-gray-500 to-gray-600"
        />
      </div>

      {/* Charts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <SimpleChart data={analytics.chartData?.daily || []} />
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-3">
            {analytics.topProducts?.slice(0, 5).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.categoryPerformance?.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>


    </div>
  );
};

export default AnalyticsDashboard;