import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  MapPin,
  Phone,
  User,
  Calendar,
  Hash,
  DollarSign,
  ChevronRight,
  Package2,
  Send
} from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Mock order data
  const mockOrders = [
    {
      id: 'ORD-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        address: '123 Galle Road, Colombo 03, Western Province, 00300'
      },
      product: {
        title: 'iPhone 14 Pro Max 256GB Space Black',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        sku: 'IPH14PM256-BLK'
      },
      quantity: 1,
      price: 450000,
      total: 450000,
      status: 'pending',
      orderDate: '2024-01-15T10:30:00Z',
      paymentStatus: 'paid',
      shippingAddress: '123 Galle Road, Colombo 03, Western Province, 00300',
      trackingNumber: null,
      notes: 'Customer requested express delivery'
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94 71 987 6543',
        address: '456 Kandy Road, Peradeniya, Central Province, 20400'
      },
      product: {
        title: 'MacBook Pro 16" M2 512GB',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        sku: 'MBP16M2512-SLV'
      },
      quantity: 1,
      price: 650000,
      total: 650000,
      status: 'shipped',
      orderDate: '2024-01-14T15:20:00Z',
      paymentStatus: 'paid',
      shippingAddress: '456 Kandy Road, Peradeniya, Central Province, 20400',
      trackingNumber: 'TN123456789LK',
      shippedDate: '2024-01-15T09:00:00Z',
      notes: null
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+94 75 555 1234',
        address: '789 Main Street, Negombo, Western Province, 11500'
      },
      product: {
        title: 'Nike Air Max 270 Black White',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        sku: 'NAM270-BLKWHT-42'
      },
      quantity: 2,
      price: 15000,
      total: 30000,
      status: 'delivered',
      orderDate: '2024-01-12T09:15:00Z',
      paymentStatus: 'paid',
      shippingAddress: '789 Main Street, Negombo, Western Province, 11500',
      trackingNumber: 'TN987654321LK',
      shippedDate: '2024-01-13T14:30:00Z',
      deliveredDate: '2024-01-14T16:45:00Z',
      notes: null
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+94 72 444 8888',
        address: '321 Beach Road, Galle, Southern Province, 80000'
      },
      product: {
        title: 'Samsung 65" 4K Smart TV',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        sku: 'SAM65-4KTV-2023'
      },
      quantity: 1,
      price: 185000,
      total: 185000,
      status: 'processing',
      orderDate: '2024-01-13T11:20:00Z',
      paymentStatus: 'paid',
      shippingAddress: '321 Beach Road, Galle, Southern Province, 80000',
      trackingNumber: null,
      notes: 'Large item - special delivery required'
    }
  ];

  const statusFilters = [
    { key: 'pending', label: 'Pending Orders', count: 0, color: 'bg-orange-100 text-orange-600' },
    { key: 'all', label: 'All Orders', count: 0, color: 'bg-gray-100 text-gray-600' },
    { key: 'processing', label: 'Processing', count: 0, color: 'bg-blue-100 text-blue-600' },
    { key: 'shipped', label: 'Shipped Orders', count: 0, color: 'bg-purple-100 text-purple-600' },
    { key: 'delivered', label: 'Delivered', count: 0, color: 'bg-green-100 text-green-600' }
  ];

  // Initialize orders and update counts
  useEffect(() => {
    setOrders(mockOrders);

    // Update status filter counts
    statusFilters.forEach(filter => {
      if (filter.key === 'all') {
        filter.count = mockOrders.length;
      } else {
        filter.count = mockOrders.filter(order => order.status === filter.key).length;
      }
    });
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by order date (newest first)
    filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    setFilteredOrders(filtered);
  }, [orders, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId, newStatus, trackingNumber = null) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
            ...(trackingNumber && { trackingNumber }),
            ...(newStatus === 'shipped' && { shippedDate: new Date().toISOString() }),
            ...(newStatus === 'delivered' && { deliveredDate: new Date().toISOString() })
          }
        : order
    ));
  };

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={order.product.image}
              alt={order.product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{order.id}</h3>
            <p className="text-sm text-gray-600">{order.customer.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <h4 className="font-medium text-gray-900 line-clamp-1">{order.product.title}</h4>
          <p className="text-sm text-gray-600">Qty: {order.quantity} × {formatPrice(order.price)}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold text-lg text-primary-600">{formatPrice(order.total)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Order Date:</span>
          <span className="text-gray-900">{formatDate(order.orderDate)}</span>
        </div>

        {order.trackingNumber && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tracking:</span>
            <span className="font-mono text-primary-600">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setSelectedOrder(order);
            setShowOrderDetails(true);
          }}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>

        {order.status === 'pending' && (
          <button
            onClick={() => {
              setSelectedOrder(order);
              setShowOrderDetails(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
          >
            Process Order
          </button>
        )}
      </div>
    </div>
  );

  const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
    const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
    const [newStatus, setNewStatus] = useState(order?.status || '');

    if (!order) return null;

    const handleStatusUpdate = () => {
      onUpdateStatus(order.id, newStatus, trackingNumber || null);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <p className="text-lg font-semibold text-gray-900">{order.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                <p className="text-gray-900">{formatDate(order.orderDate)}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{order.customer.name}</p>
                <p className="text-gray-600 text-sm">{order.customer.email}</p>
                <div className="flex items-center text-gray-600 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  {order.customer.phone}
                </div>
                <div className="flex items-start text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{order.shippingAddress}</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package2 className="w-4 h-4 mr-2" />
                Product Details
              </h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={order.product.image}
                    alt={order.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{order.product.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">SKU: {order.product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Qty: {order.quantity}</span>
                    <span className="font-semibold text-primary-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Update */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Update Order Status
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                {(newStatus === 'shipped' || order.status === 'shipped') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {order.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-1">Notes</h3>
                <p className="text-yellow-700 text-sm">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Update Order
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600">
          Manage customer orders and track their status
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter.key
                  ? 'bg-primary-600 text-white'
                  : `${filter.color} hover:bg-opacity-80`
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedFilter === filter.key
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-white bg-opacity-60'
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
            placeholder="Search orders by ID, customer name, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Orders */}
      <div>
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {orders.length === 0
                ? "You haven't received any orders yet."
                : "No orders match your current filters."
              }
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
};

export default OrderManagement;