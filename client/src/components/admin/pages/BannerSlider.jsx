import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  RefreshCw,
  Upload,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const mockBanners = [
    {
      id: 1,
      title: 'Summer Sale 2024',
      description: 'Get up to 50% off on all electronics',
      imageUrl: 'https://via.placeholder.com/1200x400/16a34a/ffffff?text=Summer+Sale',
      linkUrl: '/promotions/summer-sale',
      position: 1,
      status: 'active',
      displayOrder: 1,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      clicks: 1250,
      impressions: 15000
    },
    {
      id: 2,
      title: 'New Arrivals',
      description: 'Check out our latest products',
      imageUrl: 'https://via.placeholder.com/1200x400/dc2626/ffffff?text=New+Arrivals',
      linkUrl: '/products/new',
      position: 2,
      status: 'active',
      displayOrder: 2,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      clicks: 890,
      impressions: 12000
    },
    {
      id: 3,
      title: 'Free Shipping',
      description: 'Free shipping on orders above Rs. 5000',
      imageUrl: 'https://via.placeholder.com/1200x400/f59e0b/ffffff?text=Free+Shipping',
      linkUrl: '/shipping-info',
      position: 3,
      status: 'active',
      displayOrder: 3,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      clicks: 650,
      impressions: 10000
    },
    {
      id: 4,
      title: 'Black Friday Deals',
      description: 'Biggest sale of the year',
      imageUrl: 'https://via.placeholder.com/1200x400/7c3aed/ffffff?text=Black+Friday',
      linkUrl: '/promotions/black-friday',
      position: 4,
      status: 'inactive',
      displayOrder: 4,
      startDate: '2023-11-20',
      endDate: '2023-11-30',
      clicks: 3200,
      impressions: 45000
    },
    {
      id: 5,
      title: 'Holiday Special',
      description: 'Special offers for the holiday season',
      imageUrl: 'https://via.placeholder.com/1200x400/06b6d4/ffffff?text=Holiday+Special',
      linkUrl: '/promotions/holiday',
      position: 5,
      status: 'scheduled',
      displayOrder: 5,
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      clicks: 0,
      impressions: 0
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Banners', count: 0 },
    { key: 'active', label: 'Active', count: 0 },
    { key: 'inactive', label: 'Inactive', count: 0 },
    { key: 'scheduled', label: 'Scheduled', count: 0 }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBanners(mockBanners);

      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockBanners.length;
        } else {
          filter.count = mockBanners.filter(b => b.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...banners];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(b => b.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => a.displayOrder - b.displayOrder);

    setFilteredBanners(filtered);
  }, [banners, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-700 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleBannerAction = (action, bannerId) => {
    console.log(`${action} banner:`, bannerId);
  };

  const handleReorder = (bannerId, direction) => {
    console.log(`Reorder banner ${bannerId} ${direction}`);
  };

  const BannerCard = ({ banner }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(banner.status)}`}>
            {getStatusIcon(banner.status)}
            <span>{banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}</span>
          </span>
          <span className="px-2.5 py-1 bg-gray-900 bg-opacity-75 text-white rounded-full text-xs font-medium backdrop-blur-sm">
            #{banner.displayOrder}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{banner.title}</h3>
            <p className="text-sm text-gray-600">{banner.description}</p>
          </div>
        </div>

        {banner.linkUrl && (
          <div className="flex items-center space-x-1 text-sm text-blue-600 mb-3">
            <ExternalLink className="w-4 h-4" />
            <span className="truncate">{banner.linkUrl}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-600">Start Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(banner.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">End Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(banner.endDate)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">Impressions</p>
            <p className="text-lg font-bold text-blue-600">{banner.impressions.toLocaleString()}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600">Clicks</p>
            <p className="text-lg font-bold text-green-600">{banner.clicks.toLocaleString()}</p>
          </div>
        </div>

        {banner.impressions > 0 && (
          <div className="mb-4 p-2 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">Click-through Rate</p>
            <p className="text-lg font-bold text-purple-600 text-center">
              {((banner.clicks / banner.impressions) * 100).toFixed(2)}%
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleReorder(banner.id, 'up')}
              className="p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              title="Move Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleReorder(banner.id, 'down')}
              className="p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              title="Move Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleBannerAction('edit', banner.id)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => handleBannerAction('view', banner.id)}
            className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative group">
            <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
              <div className="py-1">
                {banner.status === 'active' ? (
                  <button
                    onClick={() => handleBannerAction('deactivate', banner.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>Deactivate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleBannerAction('activate', banner.id)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Activate</span>
                  </button>
                )}

                <button
                  onClick={() => handleBannerAction('duplicate', banner.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => handleBannerAction('delete', banner.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const stats = {
    totalBanners: banners.length,
    activeBanners: banners.filter(b => b.status === 'active').length,
    totalClicks: banners.reduce((sum, b) => sum + b.clicks, 0),
    totalImpressions: banners.reduce((sum, b) => sum + b.impressions, 0),
    avgCTR: banners.reduce((sum, b) => sum + b.impressions, 0) > 0
      ? ((banners.reduce((sum, b) => sum + b.clicks, 0) / banners.reduce((sum, b) => sum + b.impressions, 0)) * 100).toFixed(2)
      : 0
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banner & Slider Management</h1>
            <p className="text-gray-600 mt-1">Manage homepage banners and promotional sliders</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => handleBannerAction('add', null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Banners</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalBanners}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.activeBanners}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalClicks.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Impressions</p>
              <p className="text-lg font-bold text-purple-600">{stats.totalImpressions.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg CTR</p>
              <p className="text-xl font-bold text-orange-600">{stats.avgCTR}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search banners by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {filteredBanners.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
            <p className="text-gray-600">No banners match your current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBanners.map(banner => (
              <BannerCard key={banner.id} banner={banner} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BannerSlider;
