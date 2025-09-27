import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  MoreVertical,
  Package,
  DollarSign,
  Calendar,
  User,
  Store,
  MapPin,
  Phone
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Mock order data
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        address: '123 Main Street, Colombo 03'
      },
      seller: {
        name: 'TechZone Electronics',
        id: 1
      },
      items: [
        {
          name: 'iPhone 15 Pro Max 256GB',
          quantity: 1,
          price: 325000,
          sku: 'TZ-IP15PM-256'
        }
      ],
      totalAmount: 325000,
      shippingFee: 1500,
      tax: 32500,
      finalAmount: 359000,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'Card',
      orderDate: '2024-01-10',
      shippedDate: '2024-01-11',
      deliveredDate: '2024-01-13',
      trackingNumber: 'TRK123456789',
      priority: 'normal',
      disputed: false,
      refundRequested: false
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94 71 987 6543',
        address: '456 Park Avenue, Kandy'
      },
      seller: {
        name: 'Fashion Hub',
        id: 2
      },
      items: [
        {
          name: 'Designer Silk Saree',
          quantity: 2,
          price: 15000,
          sku: 'FH-SILK-001'
        },
        {
          name: 'Matching Blouse',
          quantity: 2,
          price: 5000,
          sku: 'FH-BLOUSE-001'
        }
      ],
      totalAmount: 40000,
      shippingFee: 800,
      tax: 4000,
      finalAmount: 44800,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'Bank Transfer',
      orderDate: '2024-01-12',
      shippedDate: null,
      deliveredDate: null,
      trackingNumber: null,
      priority: 'high',
      disputed: false,
      refundRequested: false
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+94 75 555 1234',
        address: '789 Beach Road, Negombo'
      },
      seller: {
        name: 'AutoParts Pro',
        id: 4
      },
      items: [
        {
          name: 'Car Engine Oil 5W-30',
          quantity: 4,
          price: 3500,
          sku: 'APP-EO-5W30'
        }
      ],
      totalAmount: 14000,
      shippingFee: 1200,
      tax: 1400,
      finalAmount: 16600,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Cash on Delivery',
      orderDate: '2024-01-15',
      shippedDate: null,
      deliveredDate: null,
      trackingNumber: null,
      priority: 'normal',
      disputed: false,
      refundRequested: false
    },
    {
      id: 'ORD-2024-004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+94 72 444 8888',
        address: '321 Hill Street, Galle'
      },
      seller: {
        name: 'Green Gardens',
        id: 3
      },
      items: [
        {
          name: 'Organic Rose Plants Set',
          quantity: 5,
          price: 2500,
          sku: 'GG-ROSE-SET'
        }
      ],
      totalAmount: 12500,
      shippingFee: 2000,
      tax: 1250,
      finalAmount: 15750,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'Card',
      orderDate: '2024-01-08',
      shippedDate: null,
      deliveredDate: null,
      trackingNumber: null,
      priority: 'normal',
      disputed: true,
      refundRequested: true
    },
    {
      id: 'ORD-2024-005',
      customer: {
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+94 76 777 9999',
        address: '654 Market Square, Matara'
      },
      seller: {
        name: 'Health Plus Pharmacy',
        id: 6
      },
      items: [
        {
          name: 'Vitamin C Tablets',
          quantity: 3,
          price: 1500,
          sku: 'HP-VIT-C'
        },
        {
          name: 'Fish Oil Capsules',
          quantity: 2,
          price: 2500,
          sku: 'HP-FISH-OIL'
        }
      ],
      totalAmount: 9500,
      shippingFee: 500,
      tax: 950,
      finalAmount: 10950,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'Digital Wallet',
      orderDate: '2024-01-14',
      shippedDate: '2024-01-15',
      deliveredDate: null,
      trackingNumber: 'TRK987654321',
      priority: 'high',
      disputed: false,
      refundRequested: false
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Orders', count: 0, color: 'gray' },
    { key: 'pending', label: 'Pending', count: 0, color: 'yellow' },
    { key: 'processing', label: 'Processing', count: 0, color: 'blue' },
    { key: 'shipped', label: 'Shipped', count: 0, color: 'orange' },
    { key: 'delivered', label: 'Delivered', count: 0, color: 'green' },
    { key: 'cancelled', label: 'Cancelled', count: 0, color: 'red' },
    { key: 'disputed', label: 'Disputed', count: 0, color: 'red' },
    { key: 'refund_requested', label: 'Refund Requested', count: 0, color: 'purple' }
  ];

  const dateRangeOptions = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);

      // Update filter counts
      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockOrders.length;
        } else if (filter.key === 'disputed') {
          filter.count = mockOrders.filter(order => order.disputed).length;
        } else if (filter.key === 'refund_requested') {
          filter.count = mockOrders.filter(order => order.refundRequested).length;
        } else {
          filter.count = mockOrders.filter(order => order.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'disputed') {
        filtered = filtered.filter(order => order.disputed);
      } else if (selectedFilter === 'refund_requested') {
        filtered = filtered.filter(order => order.refundRequested);
      } else {
        filtered = filtered.filter(order => order.status === selectedFilter);
      }
    }

    // Apply date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (selectedDateRange) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          filterDate.setDate(now.getDate() - 90);
          break;
      }

      filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort by order date (newest first)
    filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    setFilteredOrders(filtered);
  }, [orders, selectedFilter, selectedDateRange, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-gray-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleOrderAction = (action, orderId) => {
    console.log(`${action} order:`, orderId);
    // Handle order actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} orders:`, selectedOrders);
    // Handle bulk actions here
  };

  const OrderRow = ({ order }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedOrders.includes(order.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedOrders([...selectedOrders, order.id]);
            } else {
              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900 flex items-center space-x-2">
            <span>{order.id}</span>
            {order.disputed && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            {order.refundRequested && (
              <Clock className="w-4 h-4 text-purple-500" />
            )}
          </div>
          <div className="text-sm text-gray-500">
            {order.items.length} item{order.items.length > 1 ? 's' : ''}
          </div>
          <div className={`text-xs font-medium ${getPriorityColor(order.priority)}`}>
            {order.priority.toUpperCase()} PRIORITY
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{order.customer.name}</div>
          <div className="text-sm text-gray-500">{order.customer.email}</div>
          <div className="text-xs text-gray-400 flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>{order.customer.phone}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{order.seller.name}</span>
          </div>
          <div className="text-xs text-gray-500">
            {order.items.map(item => item.name).join(', ')}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{formatPrice(order.finalAmount)}</div>
          <div className="text-xs text-gray-500">
            <div>Items: {formatPrice(order.totalAmount)}</div>
            <div>Shipping: {formatPrice(order.shippingFee)}</div>
            <div>Tax: {formatPrice(order.tax)}</div>
          </div>
          <div className={`text-xs font-medium ${
            order.paymentStatus === 'paid' ? 'text-green-600' :
            order.paymentStatus === 'pending' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {order.paymentStatus.toUpperCase()}
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </span>

          {order.trackingNumber && (
            <div className="text-xs text-gray-500">
              Track: {order.trackingNumber}
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Ordered: {formatDate(order.orderDate)}</div>
          {order.shippedDate && (
            <div>Shipped: {formatDate(order.shippedDate)}</div>
          )}
          {order.deliveredDate && (
            <div>Delivered: {formatDate(order.deliveredDate)}</div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOrderAction('view', order.id)}
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
                  onClick={() => handleOrderAction('contact_customer', order.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Contact Customer</span>
                </button>

                <button
                  onClick={() => handleOrderAction('contact_seller', order.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Contact Seller</span>
                </button>

                {order.status === 'pending' && (
                  <button
                    onClick={() => handleOrderAction('process', order.id)}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Mark as Processing</span>
                  </button>
                )}

                {order.status === 'processing' && (
                  <button
                    onClick={() => handleOrderAction('ship', order.id)}
                    className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Mark as Shipped</span>
                  </button>
                )}

                {order.status === 'shipped' && (
                  <button
                    onClick={() => handleOrderAction('deliver', order.id)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Delivered</span>
                  </button>
                )}

                {['pending', 'processing'].includes(order.status) && (
                  <button
                    onClick={() => handleOrderAction('cancel', order.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Order</span>
                  </button>
                )}

                {order.disputed && (
                  <button
                    onClick={() => handleOrderAction('resolve_dispute', order.id)}
                    className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Resolve Dispute</span>
                  </button>
                )}

                {order.refundRequested && (
                  <button
                    onClick={() => handleOrderAction('process_refund', order.id)}
                    className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Process Refund</span>
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
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    shippedOrders: orders.filter(o => o.status === 'shipped').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    disputedOrders: orders.filter(o => o.disputed).length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.finalAmount, 0)
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
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all orders across the platform
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-xl font-bold text-blue-600">{stats.processingOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-xl font-bold text-orange-600">{stats.shippedOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-xl font-bold text-green-600">{stats.deliveredOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-xl font-bold text-red-600">{stats.cancelledOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Disputed</p>
              <p className="text-xl font-bold text-red-600">{stats.disputedOrders}</p>
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

          {/* Date Range Filter */}
          <div className="mb-4">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {dateRangeOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, seller, product, or tracking number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm text-red-700">
                {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('process')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Bulk Process
                </button>
                <button
                  onClick={() => handleBulkAction('ship')}
                  className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  Bulk Ship
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

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                {orders.length === 0
                  ? "No orders have been placed yet."
                  : "No orders match your current filters."}
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
                          checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders(filteredOrders.map(o => o.id));
                            } else {
                              setSelectedOrders([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller & Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount & Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map(order => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredOrders.length} of {orders.length} orders
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

export default Orders;