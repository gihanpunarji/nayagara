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
  User,
  Store,
  Phone,
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import { getAdminOrders } from '../../../api/admin';
import Pagination from '../../ui/Pagination';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const dateRangeOptions = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getAdminOrders({ page: currentPage, limit: 25 });
        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  useEffect(() => {
    let filtered = [...orders];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === selectedFilter);
    }

    if (selectedDateRange !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        switch (selectedDateRange) {
            case 'today': filterDate.setDate(now.getDate() - 1); break;
            case '7d': filterDate.setDate(now.getDate() - 7); break;
            case '30d': filterDate.setDate(now.getDate() - 30); break;
            default: break;
        }
        if (selectedDateRange !== 'all') {
            filtered = filtered.filter(order => new Date(order.order_datetime) >= filterDate);
        }
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        (order.order_number && order.order_number.toLowerCase().includes(lowercasedQuery)) ||
        (order.customer_first_name && order.customer_first_name.toLowerCase().includes(lowercasedQuery)) ||
        (order.customer_last_name && order.customer_last_name.toLowerCase().includes(lowercasedQuery)) ||
        (order.items && order.items.some(item => item.seller_store_name && item.seller_store_name.toLowerCase().includes(lowercasedQuery)))
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedFilter, selectedDateRange, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed':
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return 'N/A';
    return `Rs. ${num.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const OrderRow = ({ order }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4"><input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" /></td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{order.order_number}</div>
          <div className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{`${order.customer_first_name || ''} ${order.customer_last_name || ''}`}</div>
          <div className="text-sm text-gray-500">{order.customer_email}</div>
          <div className="text-xs text-gray-400 flex items-center space-x-1"><Phone className="w-3 h-3" /><span>{order.customer_phone}</span></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{order.items[0]?.seller_store_name || 'Multiple Sellers'}</span>
          </div>
          <div className="text-xs text-gray-500 truncate" style={{maxWidth: '200px'}}>
            {order.items.map(item => item.product_title).join(', ')}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{formatPrice(order.total_amount)}</div>
          <div className="text-xs text-gray-500">
            {order.payment_method}
          </div>
          <div className={`text-xs font-medium ${order.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
            {order.payment_status?.toUpperCase() || 'PENDING'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.order_status)}`}>
          {order.order_status?.replace('_', ' ').toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Ordered: {formatDate(order.order_datetime)}</div>
          {order.shipped_at && <div>Shipped: {formatDate(order.shipped_at)}</div>}
          {order.delivered_at && <div>Delivered: {formatDate(order.delivered_at)}</div>}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button title="View Details" className="text-gray-600 hover:text-red-600 transition-colors"><Eye className="w-4 h-4" /></button>
          <div className="relative group">
            <button className="text-gray-600 hover:text-red-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10"></div>
          </div>
        </div>
      </td>
    </tr>
  );
  
  const stats = {
    total: pagination ? pagination.total : 0,
    pending: orders.filter(o => o.order_status === 'pending').length,
    processing: orders.filter(o => o.order_status === 'confirmed').length,
    shipped: orders.filter(o => o.order_status === 'shipped').length,
    delivered: orders.filter(o => o.order_status === 'delivered').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length,
    revenue: orders.filter(o => o.payment_status === 'completed').reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
  };

  if (loading && currentPage === 1) {
    return <AdminLayout><div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all orders across the platform</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"><Download className="w-4 h-4" /><span>Export</span></button>
            <button onClick={() => setCurrentPage(1)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><RefreshCw className="w-4 h-4" /><span>Refresh</span></button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Total</p><p className="text-xl font-bold text-gray-900">{stats.total}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Pending</p><p className="text-xl font-bold text-yellow-600">{stats.pending}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Processing</p><p className="text-xl font-bold text-blue-600">{stats.processing}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Shipped</p><p className="text-xl font-bold text-orange-600">{stats.shipped}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Delivered</p><p className="text-xl font-bold text-green-600">{stats.delivered}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Cancelled</p><p className="text-xl font-bold text-red-600">{stats.cancelled}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Revenue</p><p className="text-lg font-bold text-green-600">{formatPrice(stats.revenue)}</p></div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => (
              <button key={filter.key} onClick={() => setSelectedFilter(filter.key)} className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilter === filter.key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <span>{filter.label}</span><span className={`text-xs px-2 py-0.5 rounded-full ${selectedFilter === filter.key ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-200 text-gray-600'}`}>{stats[filter.key] || 0}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4 mb-4"> {/* Added space-x-4 for spacing */}
            <select value={selectedDateRange} onChange={(e) => setSelectedDateRange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              {dateRangeOptions.map(option => <option key={option.key} value={option.key}>{option.label}</option>)}
            </select>
            <div className="relative flex-grow"> {/* Changed to flex-grow to take available space */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search by Order ID, Customer, Seller..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">{orders.length === 0 ? "No orders have been placed yet." : "No orders match your current filters."}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left"><input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" /></th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller & Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount & Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map(order => <OrderRow key={order.order_id} order={order} />)}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;