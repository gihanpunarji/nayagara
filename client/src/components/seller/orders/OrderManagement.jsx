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
  Send,
  X,
  RotateCcw,
  Check
} from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';

const OrderManagement = () => {
  const { user, isAuthenticated, userRole } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({}); // New state for items
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setError('Please log in to view orders');
      setLoading(false);
      return;
    }

    if (userRole !== 'seller') {
      setError('Access denied. Seller account required.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/orders/seller');
    
      if (response.data.success) {
        const fetchedOrders = response.data.data.map(order => ({
          id: order.order_number,
          order_id: order.order_id,
          customer: {
            name: `${order.customer_first_name} ${order.customer_last_name}`,
            mobile: order.customer_mobile,
            email: order.customer_email,
            address: {
              line1: order.shipping_line1,
              line2: order.shipping_line2,
              city: order.shipping_city,
              district: order.shipping_district,
              province: order.shipping_province,
              postalCode: order.shipping_postal_code,
              country: order.shipping_country
            }
          },
          total: order.total_amount,
          status: order.order_status,
          orderDate: order.order_datetime,
          paymentStatus: order.payment_status,
        }));
        
        setOrders(fetchedOrders);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId, forceRefetch = false) => {
    if (orderItems[orderId] && !forceRefetch) return; // Already fetched

    try {
      const response = await api.get(`/orders/seller/${orderId}`);
      if (response.data.success) {
        setOrderItems(prev => ({ ...prev, [orderId]: response.data.data }));
      } else {
        console.error(response.data.message || 'Failed to fetch order items');
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, trackingNumber = null) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      // Simple update - just send order_id, status, tracking_number
      const response = await api.put('/orders/seller/status', {
        order_id: order.order_id,
        status: newStatus,
        tracking_number: trackingNumber
      });

      if (response.data.success) {
        // Update orders list
        setOrders(prev => prev.map(o =>
          o.id === orderId
            ? { ...o, status: newStatus, trackingNumber: trackingNumber || o.trackingNumber }
            : o
        ));

        return { success: true, message: 'Order status updated successfully' };
      } else {
        return { success: false, message: response.data.message || 'Failed to update order status' };
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update order status' };
    }
  };


  const statusFilters = [
    { key: 'all', label: 'All Orders', count: 0, color: 'bg-gray-100 text-gray-600' },
    { key: 'pending', label: 'Pending', count: 0, color: 'bg-orange-100 text-orange-600' },
    { key: 'confirmed', label: 'Confirmed', count: 0, color: 'bg-teal-100 text-teal-600' },
    { key: 'processing', label: 'Processing', count: 0, color: 'bg-blue-100 text-blue-600' },
    { key: 'shipped', label: 'Shipped', count: 0, color: 'bg-purple-100 text-purple-600' },
    { key: 'delivered', label: 'Delivered', count: 0, color: 'bg-green-100 text-green-600' },
    { key: 'cancelled', label: 'Canceled', count: 0, color: 'bg-red-100 text-red-600' },
    { key: 'refunded', label: 'Refunded', count: 0, color: 'bg-yellow-100 text-yellow-600' }
  ];

  // Initialize orders and update counts
  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  // Update status filter counts when orders change
  useEffect(() => {
    statusFilters.forEach(filter => {
      if (filter.key === 'all') {
        filter.count = orders.length;
      } else {
        filter.count = orders.filter(order => order.status === filter.key).length;
      }
    });
  }, [orders]);

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
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by order date (newest first)
    filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    setFilteredOrders(filtered);
  }, [orders, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'confirmed': return 'bg-teal-100 text-teal-600 border-teal-200';
      case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      case 'refunded': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <Check className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'refunded': return <RotateCcw className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
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
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold text-lg text-primary-600">{formatPrice(order.total)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Order Date:</span>
          <span className="text-gray-900">{formatDate(order.orderDate)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={async () => {
            setSelectedOrder(order);
            await fetchOrderItems(order.order_id);
            setShowOrderDetails(true);
          }}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>

        {order.status === 'pending' && (
          <button
            onClick={async () => {
              setSelectedOrder(order);
              await fetchOrderItems(order.order_id);
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

  const OrderDetailsModal = ({ order, items, onClose, onUpdateStatus }) => {
    const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
    const [newStatus, setNewStatus] = useState(order?.status || '');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');

    if (!order) return null;

    const handleStatusUpdate = async () => {
      setUpdateLoading(true);
      setUpdateError('');
      setUpdateSuccess('');

      const result = await onUpdateStatus(order.id, newStatus, trackingNumber || null);

      setUpdateLoading(false);

      if (result.success) {
        setUpdateSuccess(result.message);
        // Close modal after 1.5 seconds to show success message
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setUpdateError(result.message);
      }
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
            {/* Success/Error Messages */}
            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{updateSuccess}</p>
              </div>
            )}
            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{updateError}</p>
              </div>
            )}

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
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-gray-900 font-medium">{order.customer.name}</p>
                </div>
                {order.customer.mobile && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="text-gray-900">{order.customer.mobile}</p>
                    </div>
                  </div>
                )}
                {order.customer.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{order.customer.email}</p>
                  </div>
                )}
                {order.customer.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                      <p className="text-gray-900">{order.customer.address.line1}</p>
                      {order.customer.address.line2 && (
                        <p className="text-gray-900">{order.customer.address.line2}</p>
                      )}
                      <p className="text-gray-900">
                        {order.customer.address.city}, {order.customer.address.district}
                      </p>
                      <p className="text-gray-900">
                        {order.customer.address.province} {order.customer.address.postalCode}
                      </p>
                      <p className="text-gray-900">{order.customer.address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package2 className="w-4 h-4 mr-2" />
                Order Items ({items ? items.length : 0})
              </h3>
              <div className="space-y-3">
                {items && items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 bg-white rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product_image_url}
                        alt={item.product_title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{item.product_title}</h4>
                      <p className="text-sm text-gray-600 mb-2">Product ID: {item.product_id}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Qty: {item.quantity} × Rs. {item.unit_price}</span>
                        <span className="font-semibold text-primary-600">Rs. {item.total_price}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
          </div>

          <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={updateLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updateLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {updateLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Order</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 mb-2">{error}</div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          items={orderItems[selectedOrder.order_id]}
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