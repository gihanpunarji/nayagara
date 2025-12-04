import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Star,
  TrendingUp,
  Eye,
  Ban,
  UserCheck,
  AlertTriangle,
  Download,
  RefreshCw,
  MoreVertical,
  Package,
  DollarSign,
  Clock,
  Award,

} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import { getAdminSellers } from '../../../api/admin';

const Sellers = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSellers, setSelectedSellers] = useState([]);

  const [filterOptions, setFilterOptions] = useState([
    { key: 'all', label: 'All Sellers', count: 0, color: 'gray' },
    { key: 'active', label: 'Active', count: 0, color: 'green' },
    { key: 'pending_verification', label: 'Pending', count: 0, color: 'orange' },
    { key: 'suspended', label: 'Suspended', count: 0, color: 'red' }
  ]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await getAdminSellers();
        if (response.success) {
          const processedSellers = response.sellers.map(seller => ({
            ...seller,
            status: seller.status || 'active', // Default to active if not provided
            verified: seller.email_verified === 1 && seller.mobile_verified === 1,
            avgProductRating: seller.avgProductRating ? parseFloat(seller.avgProductRating).toFixed(1) : '0.0',
            totalProducts: seller.totalProducts || 0,
            totalSales: seller.totalSales || 0,
            profile_image: seller.profile_image || null,
            store_name: seller.store_name || null
          }));
          setSellers(processedSellers);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch sellers');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  useEffect(() => {
    const newFilterOptions = [...filterOptions];
    newFilterOptions.forEach(filter => {
      if (filter.key === 'all') {
        filter.count = sellers.length;
      } else {
        filter.count = sellers.filter(seller => seller.status === filter.key).length;
      }
    });
    setFilterOptions(newFilterOptions);

    let filtered = [...sellers];

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(seller => seller.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seller.phone && seller.phone.includes(searchQuery)) ||
        (seller.location && seller.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (seller.nic && seller.nic.includes(searchQuery))
      );
    }

    // Sort by total sales (highest first)
    filtered.sort((a, b) => b.totalSales - a.totalSales);

    setFilteredSellers(filtered);
  }, [sellers, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending_verification': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount ? parseFloat(amount).toLocaleString() : '0'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSellerAction = (action, sellerId) => {
    console.log(`${action} seller:`, sellerId);
    // Handle seller actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} sellers:`, selectedSellers);
    // Handle bulk actions here
  };

  const SellerRow = ({ seller }) => (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/admin/seller/${seller.id}`)}
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedSellers.includes(seller.id)}
          onChange={(e) => {
            e.stopPropagation(); // Prevent row click event
            if (e.target.checked) {
              setSelectedSellers([...selectedSellers, seller.id]);
            } else {
              setSelectedSellers(selectedSellers.filter(id => id !== seller.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          {seller.profile_image ? (
            <img
              src={seller.profile_image}
              alt={seller.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-medium"
            style={{ display: seller.profile_image ? 'none' : 'flex' }}
          >
            {seller.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-gray-900">{seller.name}</div>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{seller.email}</span>
              {seller.verified && (
                <UserCheck className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Joined: {formatDate(seller.joinDate)}</div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{seller.totalProducts} products</div>
          <div className="text-green-600 font-semibold">{formatPrice(seller.totalSales)} sales</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">{seller.avgProductRating}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(seller.status)}`}>
          {seller.status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSellerAction('view', seller.id);
            }}
            className="text-gray-600 hover:text-green-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative group">
            <button className="text-gray-600 hover:text-green-600 transition-colors" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSellerAction('contact', seller.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Seller</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSellerAction('products', seller.id);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>View Products</span>
                </button>
                {seller.status !== 'suspended' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSellerAction('suspend', seller.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Suspend Account</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSellerAction('activate', seller.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Activate Account</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    totalSellers: sellers.length,
    activeSellers: sellers.filter(c => c.status === 'active').length,
    pendingSellers: sellers.filter(c => c.status === 'pending_verification').length,
    suspendedSellers: sellers.filter(c => c.status === 'suspended').length,
    totalProducts: sellers.reduce((sum, s) => sum + parseFloat(s.totalProducts || 0), 0),
    totalSalesRevenue: sellers.reduce((sum, s) => sum + parseFloat(s.totalSales || 0), 0)
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor seller accounts across the platform
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalSellers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-green-600">{stats.activeSellers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-orange-600">{stats.pendingSellers}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-xl font-bold text-purple-600">{stats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-bold text-green-600">{formatPrice(stats.totalSalesRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-xl font-bold text-yellow-600">{sellers.length > 0 ? (sellers.reduce((sum, s) => sum + parseFloat(s.avgProductRating || 0), 0) / sellers.length).toFixed(1) : '0.0'}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
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
              placeholder="Search sellers by name, email, phone, NIC, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedSellers.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-700">
                {selectedSellers.length} seller{selectedSellers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('email')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Send Email
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Export Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredSellers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sellers found
              </h3>
              <p className="text-gray-600">
                {sellers.length === 0
                  ? "No sellers have registered yet."
                  : "No sellers match your current filters."}
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
                          checked={selectedSellers.length === filteredSellers.length && filteredSellers.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSellers(filteredSellers.map(s => s.id));
                            } else {
                              setSelectedSellers([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products & Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
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
                    {filteredSellers.map(seller => (
                      <SellerRow key={seller.id} seller={seller} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination would go here */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredSellers.length} of {sellers.length} sellers
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

export default Sellers;