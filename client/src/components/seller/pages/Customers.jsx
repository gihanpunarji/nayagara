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
  Eye
} from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import { getSellerCustomers } from '../../../api/seller';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterOptions, setFilterOptions] = useState([
    { key: 'all', label: 'All Customers', count: 0 },
    { key: 'active', label: 'Active', count: 0 },
    { key: 'new', label: 'New Customers', count: 0 },
    { key: 'vip', label: 'VIP Customers', count: 0 },
    { key: 'inactive', label: 'Inactive', count: 0 }
  ]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getSellerCustomers();
        if (data.success) {
          const processedCustomers = data.customers.map(customer => {
            const lastOrderDate = new Date(customer.lastOrderDate);
            const now = new Date();
            const daysSinceLastOrder = (now - lastOrderDate) / (1000 * 60 * 60 * 24);

            let status = 'active';
            if (daysSinceLastOrder > 30) {
              status = 'inactive';
            } else if (daysSinceLastOrder <= 30) {
              status = 'new';
            }
            
            if (customer.totalSpent > 1000000) {
              status = 'vip';
            }

            return { ...customer, status, avgRating: 0 };
          });
          setCustomers(processedCustomers);
        } else {
          setError(data.message);
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
    // Update filter counts
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
        (customer.phone && customer.phone.includes(searchQuery))
      );
    }

    // Sort by total spent (highest first)
    filtered.sort((a, b) => b.totalSpent - a.totalSpent);

    setFilteredCustomers(filtered);
  }, [customers, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'new': return 'bg-blue-100 text-blue-600';
      case 'vip': return 'bg-purple-100 text-purple-600';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
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

  const CustomerCard = ({ customer }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-600">{customer.email}</p>
          </div>
        </div>

        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
          {customer.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {customer.phone}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {customer.location}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="font-semibold text-gray-900">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Spent</p>
            <p className="font-semibold text-primary-600">{formatPrice(customer.totalSpent)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900">{customer.avgRating}</span>
          </div>
          <div className="text-xs text-gray-500">
            Joined {formatDate(customer.joinDate)}
          </div>
        </div>
      </div>
    </div>
  );

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    newCustomers: customers.filter(c => c.status === 'new').length,
    avgOrderValue: customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + (c.totalSpent / c.totalOrders), 0) / customers.length) : 0
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">
            View and manage your customers and their order history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newCustomers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgOrderValue > 0 ? formatPrice(stats.avgOrderValue) : 'Rs. 0'}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedFilter === filter.key
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Customers */}
        <div>
          {filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No customers found
              </h3>
              <p className="text-gray-600">
                {customers.length === 0
                  ? "You don't have any customers yet."
                  : "No customers match your current filters."
                }
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredCustomers.length} of {customers.length} customers
                </p>
              </div>

              {/* Customers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCustomers.map(customer => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default Customers;