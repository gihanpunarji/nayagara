import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Percent,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  ShoppingCart,
  RefreshCw,
  Download,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Gift,
  Zap
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const PromotionsDiscounts = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedPromotions, setSelectedPromotions] = useState([]);

  // Mock promotion data
  const mockPromotions = [
    {
      id: 1,
      name: 'Summer Sale 2024',
      code: 'SUMMER2024',
      type: 'percentage',
      value: 25,
      description: 'Get 25% off on all electronics during summer',
      category: 'Electronics',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      usageLimit: 1000,
      usageCount: 234,
      minOrderValue: 50000,
      maxDiscount: 50000,
      status: 'scheduled',
      featured: true,
      createdDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'New Customer Welcome',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      description: 'First order discount for new customers',
      category: 'All Categories',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 5000,
      usageCount: 842,
      minOrderValue: 5000,
      maxDiscount: 10000,
      status: 'active',
      featured: false,
      createdDate: '2024-01-01'
    },
    {
      id: 3,
      name: 'Flash Sale - Electronics',
      code: 'FLASH50',
      type: 'fixed',
      value: 5000,
      description: 'Rs. 5000 off on electronics - 24 hours only',
      category: 'Electronics',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      usageLimit: 500,
      usageCount: 456,
      minOrderValue: 30000,
      maxDiscount: 5000,
      status: 'active',
      featured: true,
      createdDate: '2024-01-14'
    },
    {
      id: 4,
      name: 'Fashion Week Special',
      code: 'FASHION30',
      type: 'percentage',
      value: 30,
      description: 'Massive discount on all fashion items',
      category: 'Fashion',
      startDate: '2024-01-10',
      endDate: '2024-01-17',
      usageLimit: 2000,
      usageCount: 1567,
      minOrderValue: 10000,
      maxDiscount: 20000,
      status: 'active',
      featured: true,
      createdDate: '2024-01-08'
    },
    {
      id: 5,
      name: 'Christmas Mega Sale',
      code: 'XMAS2023',
      type: 'percentage',
      value: 40,
      description: 'Holiday season special discount',
      category: 'All Categories',
      startDate: '2023-12-20',
      endDate: '2023-12-31',
      usageLimit: 3000,
      usageCount: 2987,
      minOrderValue: 15000,
      maxDiscount: 30000,
      status: 'expired',
      featured: false,
      createdDate: '2023-12-15'
    },
    {
      id: 6,
      name: 'VIP Customer Exclusive',
      code: 'VIP100',
      type: 'fixed',
      value: 10000,
      description: 'Exclusive discount for VIP customers',
      category: 'All Categories',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 100,
      usageCount: 23,
      minOrderValue: 100000,
      maxDiscount: 10000,
      status: 'active',
      featured: false,
      createdDate: '2024-01-01'
    },
    {
      id: 7,
      name: 'Weekend Deal',
      code: 'WEEKEND15',
      type: 'percentage',
      value: 15,
      description: 'Weekend special - 15% off everything',
      category: 'All Categories',
      startDate: '2024-01-13',
      endDate: '2024-01-14',
      usageLimit: 1000,
      usageCount: 234,
      minOrderValue: 10000,
      maxDiscount: 15000,
      status: 'expired',
      featured: false,
      createdDate: '2024-01-12'
    },
    {
      id: 8,
      name: 'Mobile Mania',
      code: 'MOBILE20',
      type: 'percentage',
      value: 20,
      description: 'Special discount on all mobile phones',
      category: 'Electronics',
      startDate: '2024-01-20',
      endDate: '2024-01-31',
      usageLimit: 500,
      usageCount: 0,
      minOrderValue: 20000,
      maxDiscount: 40000,
      status: 'paused',
      featured: false,
      createdDate: '2024-01-15'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Promotions', count: 0, color: 'gray' },
    { key: 'active', label: 'Active', count: 0, color: 'green' },
    { key: 'scheduled', label: 'Scheduled', count: 0, color: 'blue' },
    { key: 'paused', label: 'Paused', count: 0, color: 'yellow' },
    { key: 'expired', label: 'Expired', count: 0, color: 'red' },
    { key: 'featured', label: 'Featured', count: 0, color: 'purple' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPromotions(mockPromotions);

      // Update filter counts
      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockPromotions.length;
        } else if (filter.key === 'featured') {
          filter.count = mockPromotions.filter(promo => promo.featured).length;
        } else {
          filter.count = mockPromotions.filter(promo => promo.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...promotions];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'featured') {
        filtered = filtered.filter(promo => promo.featured);
      } else {
        filtered = filtered.filter(promo => promo.status === selectedFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(promo =>
        promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    setFilteredPromotions(filtered);
  }, [promotions, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUsagePercentage = (used, total) => {
    return (used / total) * 100;
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handlePromotionAction = (action, promotionId) => {
    console.log(`${action} promotion:`, promotionId);
    // Handle promotion actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} promotions:`, selectedPromotions);
    // Handle bulk actions here
  };

  const PromotionRow = ({ promotion }) => {
    const usagePercentage = getUsagePercentage(promotion.usageCount, promotion.usageLimit);

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selectedPromotions.includes(promotion.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPromotions([...selectedPromotions, promotion.id]);
              } else {
                setSelectedPromotions(selectedPromotions.filter(id => id !== promotion.id));
              }
            }}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
        </td>

        <td className="px-6 py-4">
          <div className="space-y-2">
            <div className="font-medium text-gray-900 flex items-center space-x-2">
              <span>{promotion.name}</span>
              {promotion.featured && (
                <Zap className="w-4 h-4 text-purple-500 fill-current" />
              )}
            </div>

            <div className="flex items-center space-x-2">
              <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                {promotion.code}
              </code>
              <button
                onClick={() => handlePromotionAction('copy', promotion.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm text-gray-500">{promotion.description}</div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {promotion.type === 'percentage' ? (
                <>
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-600">{promotion.value}% OFF</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-600">{formatPrice(promotion.value)} OFF</span>
                </>
              )}
            </div>

            <div className="text-gray-500 text-xs">
              Min Order: {formatPrice(promotion.minOrderValue)}
            </div>
            <div className="text-gray-500 text-xs">
              Max Discount: {formatPrice(promotion.maxDiscount)}
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{promotion.category}</div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{promotion.usageCount}</span>
              <span className="text-gray-500">/ {promotion.usageLimit}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  usagePercentage >= 90 ? 'bg-red-500' :
                  usagePercentage >= 70 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>

            <div className="text-xs text-gray-500">
              {usagePercentage.toFixed(0)}% used
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(promotion.startDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(promotion.endDate)}</span>
            </div>
            {promotion.status === 'active' && (
              <div className="text-xs text-green-600 flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Running</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(promotion.status)}`}>
              {promotion.status.toUpperCase()}
            </span>

            {promotion.featured && (
              <div className="flex items-center space-x-1 text-purple-600">
                <Gift className="w-3 h-3" />
                <span className="text-xs">Featured</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePromotionAction('view', promotion.id)}
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <div className="relative group">
              <button className="text-gray-600 hover:text-red-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
                <div className="py-1">
                  <button
                    onClick={() => handlePromotionAction('edit', promotion.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Promotion</span>
                  </button>

                  <button
                    onClick={() => handlePromotionAction('duplicate', promotion.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>

                  {promotion.status === 'active' && (
                    <button
                      onClick={() => handlePromotionAction('pause', promotion.id)}
                      className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Pause Promotion</span>
                    </button>
                  )}

                  {promotion.status === 'paused' && (
                    <button
                      onClick={() => handlePromotionAction('activate', promotion.id)}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Activate Promotion</span>
                    </button>
                  )}

                  <button
                    onClick={() => handlePromotionAction(promotion.featured ? 'unfeature' : 'feature', promotion.id)}
                    className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{promotion.featured ? 'Remove from Featured' : 'Add to Featured'}</span>
                  </button>

                  <button
                    onClick={() => handlePromotionAction('analytics', promotion.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>

                  <button
                    onClick={() => handlePromotionAction('delete', promotion.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Promotion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const stats = {
    totalPromotions: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    scheduled: promotions.filter(p => p.status === 'scheduled').length,
    paused: promotions.filter(p => p.status === 'paused').length,
    expired: promotions.filter(p => p.status === 'expired').length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
    totalRevenue: promotions.reduce((sum, p) => sum + (p.usageCount * 5000), 0) // Mock calculation
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
            <h1 className="text-2xl font-bold text-gray-900">Promotions & Discounts</h1>
            <p className="text-gray-600 mt-1">
              Create and manage promotional campaigns and discount codes
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => handlePromotionAction('create', null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Promotion</span>
            </button>

            <button
              onClick={() => handleBulkAction('export')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalPromotions}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Paused</p>
              <p className="text-xl font-bold text-yellow-600">{stats.paused}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-xl font-bold text-red-600">{stats.expired}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-xl font-bold text-purple-600">{stats.totalUsage}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-lg font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedFilter === filter.key
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, code, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedPromotions.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm text-red-700">
                {selectedPromotions.length} promotion{selectedPromotions.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('pause')}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                >
                  Pause
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredPromotions.length === 0 ? (
            <div className="p-12 text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No promotions found
              </h3>
              <p className="text-gray-600">
                {promotions.length === 0
                  ? "No promotions have been created yet."
                  : "No promotions match your current filters."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPromotions.length === filteredPromotions.length && filteredPromotions.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPromotions(filteredPromotions.map(p => p.id));
                            } else {
                              setSelectedPromotions([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promotion Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPromotions.map(promotion => (
                      <PromotionRow key={promotion.id} promotion={promotion} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredPromotions.length} of {promotions.length} promotions
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PromotionsDiscounts;
