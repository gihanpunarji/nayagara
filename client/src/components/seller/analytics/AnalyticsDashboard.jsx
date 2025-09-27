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

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data
  const mockAnalytics = {
    overview: {
      totalViews: 15420,
      totalOrders: 234,
      conversionRate: 1.52,
      totalRevenue: 2450000,
      averageOrderValue: 10470,
      newCustomers: 89,
      returningCustomers: 145,
      rating: 4.6,
      ratingCount: 178
    },
    trends: {
      views: { current: 15420, previous: 13200, change: 16.8 },
      orders: { current: 234, previous: 198, change: 18.2 },
      revenue: { current: 2450000, previous: 2100000, change: 16.7 },
      customers: { current: 234, previous: 201, change: 16.4 }
    },
    topProducts: [
      {
        id: 1,
        title: 'iPhone 14 Pro Max 256GB',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        views: 2340,
        orders: 45,
        revenue: 2025000,
        conversionRate: 1.92
      },
      {
        id: 2,
        title: 'MacBook Pro 16" M2 512GB',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        views: 1876,
        orders: 28,
        revenue: 1820000,
        conversionRate: 1.49
      },
      {
        id: 3,
        title: 'Toyota Prius 2020 Hybrid',
        image: 'https://images.unsplash.com/photo-1549399163-1ba32edc4c84?w=400',
        views: 1456,
        orders: 3,
        revenue: 255000,
        conversionRate: 0.21
      },
      {
        id: 4,
        title: 'Samsung 65" 4K Smart TV',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        views: 987,
        orders: 12,
        revenue: 222000,
        conversionRate: 1.22
      },
      {
        id: 5,
        title: 'Nike Air Max 270 Black White',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        views: 756,
        orders: 24,
        revenue: 36000,
        conversionRate: 3.17
      }
    ],
    categoryPerformance: [
      { category: 'Electronics', views: 8420, orders: 89, revenue: 1890000 },
      { category: 'Vehicles', views: 3210, orders: 12, revenue: 4800000 },
      { category: 'Fashion', views: 2456, orders: 78, revenue: 234000 },
      { category: 'Home & Living', views: 1334, orders: 55, revenue: 445000 }
    ],
    chartData: {
      daily: [
        { date: '2024-01-08', views: 456, orders: 8, revenue: 89000 },
        { date: '2024-01-09', views: 523, orders: 12, revenue: 156000 },
        { date: '2024-01-10', views: 487, orders: 9, revenue: 134000 },
        { date: '2024-01-11', views: 612, orders: 15, revenue: 234000 },
        { date: '2024-01-12', views: 678, orders: 18, revenue: 278000 },
        { date: '2024-01-13', views: 543, orders: 11, revenue: 187000 },
        { date: '2024-01-14', views: 598, orders: 14, revenue: 205000 },
        { date: '2024-01-15', views: 634, orders: 16, revenue: 289000 }
      ]
    }
  };

  const periodOptions = [
    { key: '7', label: 'Last 7 days' },
    { key: '30', label: 'Last 30 days' },
    { key: '90', label: 'Last 3 months' },
    { key: '365', label: 'Last year' }
  ];

  // Initialize analytics data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Ensure all values have defaults
      const safeAnalytics = {
        ...mockAnalytics,
        overview: {
          totalViews: mockAnalytics.overview?.totalViews || 0,
          totalOrders: mockAnalytics.overview?.totalOrders || 0,
          conversionRate: mockAnalytics.overview?.conversionRate || 0,
          totalRevenue: mockAnalytics.overview?.totalRevenue || 0,
          averageOrderValue: mockAnalytics.overview?.averageOrderValue || 0,
          newCustomers: mockAnalytics.overview?.newCustomers || 0,
          returningCustomers: mockAnalytics.overview?.returningCustomers || 0,
          rating: mockAnalytics.overview?.rating || 0,
          ratingCount: mockAnalytics.overview?.ratingCount || 0
        },
        trends: {
          views: { current: mockAnalytics.trends?.views?.current || 0, previous: mockAnalytics.trends?.views?.previous || 0, change: mockAnalytics.trends?.views?.change || 0 },
          orders: { current: mockAnalytics.trends?.orders?.current || 0, previous: mockAnalytics.trends?.orders?.previous || 0, change: mockAnalytics.trends?.orders?.change || 0 },
          revenue: { current: mockAnalytics.trends?.revenue?.current || 0, previous: mockAnalytics.trends?.revenue?.previous || 0, change: mockAnalytics.trends?.revenue?.change || 0 },
          customers: { current: mockAnalytics.trends?.customers?.current || 0, previous: mockAnalytics.trends?.customers?.previous || 0, change: mockAnalytics.trends?.customers?.change || 0 }
        }
      };
      setAnalytics(safeAnalytics);
      setIsLoading(false);
    }, 1000);
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

      {/* Performance Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Goals</h3>
        <div className="space-y-4">
          {/* Revenue Goal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Revenue Target</span>
              <span className="text-sm text-gray-600">Rs. 2.45M / Rs. 3.00M</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                style={{ width: '82%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">82% of monthly target achieved</p>
          </div>

          {/* Orders Goal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Orders Target</span>
              <span className="text-sm text-gray-600">234 / 300</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                style={{ width: '78%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">78% of monthly target achieved</p>
          </div>

          {/* Views Goal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Views Target</span>
              <span className="text-sm text-gray-600">15.4K / 20K</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: '77%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">77% of monthly target achieved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;