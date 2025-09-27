import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Star,
  TrendingUp,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  MoreVertical,
  FileText,
  UserCheck
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedSellers, setSelectedSellers] = useState([]);

  // Mock seller data
  const mockSellers = [
    {
      id: 1,
      businessName: 'TechZone Electronics',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@techzone.lk',
      phone: '+94 77 123 4567',
      businessType: 'Electronics',
      location: 'Colombo 03, Western Province',
      joinDate: '2023-08-15',
      totalProducts: 145,
      totalSales: 2850000,
      commission: 142500,
      avgRating: 4.8,
      totalOrders: 234,
      status: 'active',
      verified: true,
      documents: {
        businessRegistration: true,
        taxId: true,
        bankDetails: true
      },
      lastActive: '2024-01-15'
    },
    {
      id: 2,
      businessName: 'Fashion Hub',
      ownerName: 'Priya Perera',
      email: 'priya@fashionhub.lk',
      phone: '+94 71 987 6543',
      businessType: 'Fashion & Clothing',
      location: 'Kandy, Central Province',
      joinDate: '2023-09-20',
      totalProducts: 89,
      totalSales: 1200000,
      commission: 60000,
      avgRating: 4.6,
      totalOrders: 156,
      status: 'active',
      verified: true,
      documents: {
        businessRegistration: true,
        taxId: true,
        bankDetails: true
      },
      lastActive: '2024-01-14'
    },
    {
      id: 3,
      businessName: 'Green Gardens',
      ownerName: 'Sunil Fernando',
      email: 'sunil@greengardens.lk',
      phone: '+94 75 555 1234',
      businessType: 'Home & Garden',
      location: 'Galle, Southern Province',
      joinDate: '2024-01-05',
      totalProducts: 23,
      totalSales: 145000,
      commission: 7250,
      avgRating: 5.0,
      totalOrders: 12,
      status: 'pending',
      verified: false,
      documents: {
        businessRegistration: true,
        taxId: false,
        bankDetails: true
      },
      lastActive: '2024-01-12'
    },
    {
      id: 4,
      businessName: 'AutoParts Pro',
      ownerName: 'Kamal Silva',
      email: 'kamal@autoparts.lk',
      phone: '+94 72 444 8888',
      businessType: 'Automotive',
      location: 'Negombo, Western Province',
      joinDate: '2023-07-10',
      totalProducts: 278,
      totalSales: 4200000,
      commission: 210000,
      avgRating: 4.9,
      totalOrders: 445,
      status: 'active',
      verified: true,
      documents: {
        businessRegistration: true,
        taxId: true,
        bankDetails: true
      },
      lastActive: '2024-01-13'
    },
    {
      id: 5,
      businessName: 'Book World',
      ownerName: 'Nimali Jayawardena',
      email: 'nimali@bookworld.lk',
      phone: '+94 76 777 9999',
      businessType: 'Books & Education',
      location: 'Matara, Southern Province',
      joinDate: '2023-11-25',
      totalProducts: 67,
      totalSales: 320000,
      commission: 16000,
      avgRating: 4.7,
      totalOrders: 89,
      status: 'suspended',
      verified: true,
      documents: {
        businessRegistration: true,
        taxId: true,
        bankDetails: true
      },
      lastActive: '2023-12-20'
    },
    {
      id: 6,
      businessName: 'Health Plus Pharmacy',
      ownerName: 'Dr. Anura Bandara',
      email: 'anura@healthplus.lk',
      phone: '+94 71 222 3333',
      businessType: 'Health & Wellness',
      location: 'Anuradhapura, North Central',
      joinDate: '2023-06-15',
      totalProducts: 234,
      totalSales: 1850000,
      commission: 92500,
      avgRating: 4.8,
      totalOrders: 267,
      status: 'active',
      verified: true,
      documents: {
        businessRegistration: true,
        taxId: true,
        bankDetails: true
      },
      lastActive: '2024-01-10'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Sellers', count: 0, color: 'gray' },
    { key: 'active', label: 'Active', count: 0, color: 'green' },
    { key: 'pending', label: 'Pending Approval', count: 0, color: 'yellow' },
    { key: 'suspended', label: 'Suspended', count: 0, color: 'red' },
    { key: 'unverified', label: 'Unverified', count: 0, color: 'orange' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSellers(mockSellers);

      // Update filter counts
      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockSellers.length;
        } else if (filter.key === 'unverified') {
          filter.count = mockSellers.filter(seller => !seller.verified).length;
        } else {
          filter.count = mockSellers.filter(seller => seller.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...sellers];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unverified') {
        filtered = filtered.filter(seller => !seller.verified);
      } else {
        filtered = filtered.filter(seller => seller.status === selectedFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(seller =>
        seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.phone.includes(searchQuery) ||
        seller.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by total sales (highest first)
    filtered.sort((a, b) => b.totalSales - a.totalSales);

    setFilteredSellers(filtered);
  }, [sellers, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-green-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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

  const handleSellerAction = (action, sellerId) => {
    console.log(`${action} seller:`, sellerId);
    // Handle seller actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} sellers:`, selectedSellers);
    // Handle bulk actions here
  };

  const getDocumentStatus = (documents) => {
    const total = Object.keys(documents).length;
    const completed = Object.values(documents).filter(Boolean).length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const SellerRow = ({ seller }) => {
    const docStatus = getDocumentStatus(seller.documents);

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selectedSellers.includes(seller.id)}
            onChange={(e) => {
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-medium">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900 flex items-center space-x-2">
                <span>{seller.businessName}</span>
                {seller.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="text-sm text-gray-500">{seller.ownerName}</div>
              <div className="text-xs text-gray-400">{seller.businessType}</div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{seller.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{seller.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-xs">{seller.location}</span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-1">
            <div className="text-gray-500">Joined: {formatDate(seller.joinDate)}</div>
            <div className="text-gray-500">Last active: {formatDate(seller.lastActive)}</div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span>{seller.totalProducts} products</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span>{seller.totalOrders} orders</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{seller.avgRating}</span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{formatPrice(seller.totalSales)}</div>
            <div className="text-green-600 font-semibold">{formatPrice(seller.commission)}</div>
            <div className="text-xs text-gray-500">Commission</div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(seller.status)}`}>
              {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
            </span>

            <div className="flex items-center space-x-1">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${docStatus.percentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${docStatus.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{docStatus.completed}/{docStatus.total}</span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSellerAction('view', seller.id)}
              className="text-gray-600 hover:text-green-600 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <div className="relative group">
              <button className="text-gray-600 hover:text-green-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleSellerAction('contact', seller.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Seller</span>
                  </button>
                  <button
                    onClick={() => handleSellerAction('products', seller.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>View Products</span>
                  </button>
                  <button
                    onClick={() => handleSellerAction('orders', seller.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Orders</span>
                  </button>

                  {seller.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleSellerAction('approve', seller.id)}
                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Seller</span>
                      </button>
                      <button
                        onClick={() => handleSellerAction('reject', seller.id)}
                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Application</span>
                      </button>
                    </>
                  )}

                  {seller.status === 'active' && (
                    <button
                      onClick={() => handleSellerAction('suspend', seller.id)}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Suspend Account</span>
                    </button>
                  )}

                  {seller.status === 'suspended' && (
                    <button
                      onClick={() => handleSellerAction('activate', seller.id)}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Reactivate Account</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const stats = {
    totalSellers: sellers.length,
    activeSellers: sellers.filter(s => s.status === 'active').length,
    pendingSellers: sellers.filter(s => s.status === 'pending').length,
    suspendedSellers: sellers.filter(s => s.status === 'suspended').length,
    totalRevenue: sellers.reduce((sum, s) => sum + s.totalSales, 0),
    totalCommission: sellers.reduce((sum, s) => sum + s.commission, 0)
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
            <p className="text-gray-600 mt-1">
              Manage seller accounts, approvals, and business operations
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
              <Store className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-green-600">{stats.activeSellers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{stats.pendingSellers}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-xl font-bold text-green-600">{stats.suspendedSellers}</p>
              </div>
              <Ban className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-lg font-bold text-blue-600">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Commission</p>
                <p className="text-lg font-bold text-green-600">{formatPrice(stats.totalCommission)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-500" />
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
              placeholder="Search sellers by business name, owner, email, type, or location..."
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
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Bulk Approve
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
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                        Business
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales & Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status & Docs
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

              {/* Pagination */}
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