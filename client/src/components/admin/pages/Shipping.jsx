import React, { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  RefreshCw,
  MapPin,
  Package,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Shipping = () => {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [filteredMethods, setFilteredMethods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const mockShippingMethods = [
    {
      id: 1,
      name: 'Standard Shipping',
      description: 'Regular delivery within 5-7 business days',
      zones: ['Colombo', 'Gampaha', 'Kalutara'],
      basePrice: 350,
      pricePerKg: 50,
      minWeight: 0,
      maxWeight: 30,
      estimatedDays: '5-7',
      status: 'active',
      totalOrders: 1250,
      carrier: 'Local Post'
    },
    {
      id: 2,
      name: 'Express Shipping',
      description: 'Fast delivery within 1-2 business days',
      zones: ['Colombo', 'Gampaha'],
      basePrice: 750,
      pricePerKg: 100,
      minWeight: 0,
      maxWeight: 15,
      estimatedDays: '1-2',
      status: 'active',
      totalOrders: 890,
      carrier: 'DHL Express'
    },
    {
      id: 3,
      name: 'Overnight Delivery',
      description: 'Next day delivery for urgent orders',
      zones: ['Colombo'],
      basePrice: 1200,
      pricePerKg: 150,
      minWeight: 0,
      maxWeight: 10,
      estimatedDays: '1',
      status: 'active',
      totalOrders: 345,
      carrier: 'FedEx'
    },
    {
      id: 4,
      name: 'Economy Shipping',
      description: 'Affordable delivery within 7-10 business days',
      zones: ['All Sri Lanka'],
      basePrice: 250,
      pricePerKg: 30,
      minWeight: 0,
      maxWeight: 50,
      estimatedDays: '7-10',
      status: 'active',
      totalOrders: 2100,
      carrier: 'Local Post'
    },
    {
      id: 5,
      name: 'Free Shipping',
      description: 'Free delivery for orders above Rs. 5000',
      zones: ['Colombo', 'Gampaha'],
      basePrice: 0,
      pricePerKg: 0,
      minWeight: 0,
      maxWeight: 20,
      estimatedDays: '5-7',
      status: 'active',
      totalOrders: 567,
      carrier: 'Local Post',
      minOrderValue: 5000
    },
    {
      id: 6,
      name: 'International Shipping',
      description: 'Worldwide delivery within 10-15 business days',
      zones: ['International'],
      basePrice: 3500,
      pricePerKg: 500,
      minWeight: 0,
      maxWeight: 30,
      estimatedDays: '10-15',
      status: 'inactive',
      totalOrders: 78,
      carrier: 'DHL International'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Methods', count: 0 },
    { key: 'active', label: 'Active', count: 0 },
    { key: 'inactive', label: 'Inactive', count: 0 }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setShippingMethods(mockShippingMethods);

      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockShippingMethods.length;
        } else {
          filter.count = mockShippingMethods.filter(m => m.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...shippingMethods];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(m => m.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.carrier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => b.totalOrders - a.totalOrders);

    setFilteredMethods(filtered);
  }, [shippingMethods, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const handleMethodAction = (action, methodId) => {
    console.log(`${action} shipping method:`, methodId);
  };

  const ShippingMethodCard = ({ method }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{method.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{method.description}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(method.status)}`}>
          {method.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
          {method.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Base:</span>
            <span className="font-semibold text-gray-900">{formatPrice(method.basePrice)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Per kg:</span>
            <span className="font-semibold text-gray-900">{formatPrice(method.pricePerKg)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Delivery:</span>
            <span className="font-semibold text-gray-900">{method.estimatedDays} days</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-600">Zones:</span>
              <div className="font-medium text-gray-900">
                {method.zones.slice(0, 2).join(', ')}
                {method.zones.length > 2 && ` +${method.zones.length - 2}`}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Truck className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Carrier:</span>
            <span className="font-medium text-gray-900">{method.carrier}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Orders:</span>
            <span className="font-semibold text-green-600">{method.totalOrders.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Weight Range:</span>
          <span className="font-medium text-gray-900">{method.minWeight} - {method.maxWeight} kg</span>
        </div>
        {method.minOrderValue && (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Min Order Value:</span>
            <span className="font-medium text-gray-900">{formatPrice(method.minOrderValue)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleMethodAction('edit', method.id)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => handleMethodAction('view', method.id)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>

        <div className="relative group">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
            <div className="py-1">
              {method.status === 'active' ? (
                <button
                  onClick={() => handleMethodAction('deactivate', method.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Deactivate</span>
                </button>
              ) : (
                <button
                  onClick={() => handleMethodAction('activate', method.id)}
                  className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Activate</span>
                </button>
              )}

              <button
                onClick={() => handleMethodAction('delete', method.id)}
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
  );

  const stats = {
    totalMethods: shippingMethods.length,
    activeMethods: shippingMethods.filter(m => m.status === 'active').length,
    totalOrders: shippingMethods.reduce((sum, m) => sum + m.totalOrders, 0),
    avgDeliveryTime: (shippingMethods.reduce((sum, m) => sum + parseInt(m.estimatedDays.split('-')[0]), 0) / shippingMethods.length).toFixed(1)
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
            <h1 className="text-2xl font-bold text-gray-900">Shipping Management</h1>
            <p className="text-gray-600 mt-1">Manage shipping methods, zones, and pricing</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => handleMethodAction('add', null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Method</span>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Methods</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalMethods}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.activeMethods}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Delivery</p>
              <p className="text-xl font-bold text-purple-600">{stats.avgDeliveryTime} days</p>
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
              placeholder="Search shipping methods by name, description, or carrier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {filteredMethods.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipping methods found</h3>
            <p className="text-gray-600">No shipping methods match your current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMethods.map(method => (
              <ShippingMethodCard key={method.id} method={method} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Shipping;
