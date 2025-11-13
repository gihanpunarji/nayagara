import React, { useState, useEffect } from 'react';
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
  MoreVertical
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import { getAdminCustomers } from '../../../api/admin';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const [filterOptions, setFilterOptions] = useState([
    { key: 'all', label: 'All Customers', count: 0, color: 'gray' },
    { key: 'active', label: 'Active', count: 0, color: 'green' },
    { key: 'new', label: 'New Customers', count: 0, color: 'blue' },
    { key: 'vip', label: 'VIP Customers', count: 0, color: 'purple' },
    { key: 'suspended', label: 'Suspended', count: 0, color: 'red' }
  ]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await getAdminCustomers();
        if (response.success) {
          const processedCustomers = response.customers.map(customer => ({
            ...customer,
            // Assuming 'status' and 'verified' come directly from the backend
            // If not, you'd add logic here to derive them
            status: customer.status || 'active', // Default to active if not provided
            verified: customer.email_verified === 1 && customer.mobile_verified === 1,
            avgRating: customer.avgRating ? parseFloat(customer.avgRating).toFixed(1) : 0,
            totalSpent: customer.totalSpent || 0,
            totalOrders: customer.totalOrders || 0,
          }));
          setCustomers(processedCustomers);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const newFilterOptions = [...filterOptions];
    newFilterOptions.forEach(filter => {
      if (filter.key === 'all') {
        filter.count = customers.length;
      } else {
        filter.count = customers.filter(customer => customer.status === filter.key).length;
      }
    });
    setFilterOptions(newFilterOptions);

    let filtered = [...customers];

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchQuery)) ||
        (customer.location && customer.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by total spent (highest first)
    filtered.sort((a, b) => b.totalSpent - a.totalSpent);

    setFilteredCustomers(filtered);
  }, [customers, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'vip': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount ? amount.toLocaleString() : '0'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCustomerAction = (action, customerId) => {
    console.log(`${action} customer:`, customerId);
    // Handle customer actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} customers:`, selectedCustomers);
    // Handle bulk actions here
  };

  const CustomerRow = ({ customer }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedCustomers.includes(customer.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCustomers([...selectedCustomers, customer.id]);
            } else {
              setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-medium">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-gray-900">{customer.name}</div>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{customer.email}</span>
              {customer.verified && (
                <UserCheck className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{customer.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{customer.location || 'N/A'}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Joined: {formatDate(customer.joinDate)}</div>
          <div className="text-xs">Last order: {formatDate(customer.lastOrderDate)}</div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{customer.totalOrders} orders</div>
          <div className="text-green-600 font-semibold">{formatPrice(customer.totalSpent)}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">{customer.avgRating}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCustomerAction('view', customer.id)}
            className="text-gray-600 hover:text-green-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative group">
            <button className="text-gray-600 hover:text-green-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
              <div className="py-1">
                <button
                  onClick={() => handleCustomerAction('contact', customer.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Customer</span>
                </button>
                <button
                  onClick={() => handleCustomerAction('orders', customer.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Orders</span>
                </button>
                {customer.status !== 'suspended' ? (
                  <button
                    onClick={() => handleCustomerAction('suspend', customer.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Suspend Account</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleCustomerAction('activate', customer.id)}
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
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    newCustomers: customers.filter(c => c.status === 'new').length,
    vipCustomers: customers.filter(c => c.status === 'vip').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.length > 0 ? customers.reduce((sum, c) => sum + (c.totalSpent / c.totalOrders), 0) / customers.length : 0
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
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor customer accounts across the platform
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
                <p className="text-xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-green-600">{stats.activeCustomers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-xl font-bold text-blue-600">{stats.newCustomers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP</p>
                <p className="text-xl font-bold text-purple-600">{stats.vipCustomers}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order</p>
                <p className="text-xl font-bold text-orange-600">{formatPrice(Math.round(stats.avgOrderValue))}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
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
              placeholder="Search customers by name, email, phone, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedCustomers.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-700">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
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

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No customers found
              </h3>
              <p className="text-gray-600">
                {customers.length === 0
                  ? "No customers have registered yet."
                  : "No customers match your current filters."}
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
                          checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomers(filteredCustomers.map(c => c.id));
                            } else {
                              setSelectedCustomers([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders & Spending
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
                    {filteredCustomers.map(customer => (
                      <CustomerRow key={customer.id} customer={customer} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination would go here */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredCustomers.length} of {customers.length} customers
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

export default Customers;