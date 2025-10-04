import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  User,
  FileText,
  TrendingUp
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const ReturnsRefunds = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);

  const mockRequests = [
    {
      id: 'RET-2024-001',
      orderId: 'ORD-2024-5432',
      customer: 'John Doe',
      email: 'john@example.com',
      product: 'iPhone 15 Pro',
      reason: 'Defective product',
      type: 'return',
      status: 'pending',
      requestDate: '2024-01-15T10:30:00',
      amount: 125000,
      refundMethod: 'Original Payment Method',
      images: 2
    },
    {
      id: 'REF-2024-001',
      orderId: 'ORD-2024-5433',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      product: 'Samsung Galaxy S24',
      reason: 'Changed mind',
      type: 'refund',
      status: 'approved',
      requestDate: '2024-01-14T14:20:00',
      amount: 98000,
      refundMethod: 'Bank Transfer',
      images: 0
    },
    {
      id: 'RET-2024-002',
      orderId: 'ORD-2024-5434',
      customer: 'Bob Wilson',
      email: 'bob@example.com',
      product: 'MacBook Pro 14"',
      reason: 'Wrong item received',
      type: 'return',
      status: 'processing',
      requestDate: '2024-01-15T09:15:00',
      amount: 234000,
      refundMethod: 'Store Credit',
      images: 3
    },
    {
      id: 'REF-2024-002',
      orderId: 'ORD-2024-5435',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      product: 'Sony WH-1000XM5',
      reason: 'Damaged during shipping',
      type: 'refund',
      status: 'completed',
      requestDate: '2024-01-13T11:45:00',
      amount: 45000,
      refundMethod: 'Original Payment Method',
      images: 4
    },
    {
      id: 'RET-2024-003',
      orderId: 'ORD-2024-5436',
      customer: 'Charlie Davis',
      email: 'charlie@example.com',
      product: 'Dell XPS 15',
      reason: 'Does not match description',
      type: 'return',
      status: 'rejected',
      requestDate: '2024-01-12T16:30:00',
      amount: 178000,
      refundMethod: null,
      images: 1
    },
    {
      id: 'REF-2024-003',
      orderId: 'ORD-2024-5437',
      customer: 'Diana Evans',
      email: 'diana@example.com',
      product: 'Apple Watch Series 9',
      reason: 'Quality issues',
      type: 'refund',
      status: 'pending',
      requestDate: '2024-01-15T13:00:00',
      amount: 56000,
      refundMethod: 'Original Payment Method',
      images: 2
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Requests', count: 0 },
    { key: 'pending', label: 'Pending', count: 0 },
    { key: 'approved', label: 'Approved', count: 0 },
    { key: 'processing', label: 'Processing', count: 0 },
    { key: 'completed', label: 'Completed', count: 0 },
    { key: 'rejected', label: 'Rejected', count: 0 }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRequests(mockRequests);

      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockRequests.length;
        } else {
          filter.count = mockRequests.filter(r => r.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...requests];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(r => r.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

    setFilteredRequests(filtered);
  }, [requests, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <RotateCcw className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRequestAction = (action, requestId) => {
    console.log(`${action} request:`, requestId);
  };

  const RequestRow = ({ request }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedRequests.includes(request.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRequests([...selectedRequests, request.id]);
            } else {
              setSelectedRequests(selectedRequests.filter(id => id !== request.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{request.id}</div>
          <div className="text-xs text-gray-500">Order: {request.orderId}</div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            request.type === 'return' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {request.type.toUpperCase()}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{request.customer}</div>
          <div className="text-xs text-gray-500">{request.email}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{request.product}</div>
          <div className="text-xs text-gray-500">{request.reason}</div>
          {request.images > 0 && (
            <div className="text-xs text-blue-600">{request.images} image{request.images > 1 ? 's' : ''} attached</div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{formatPrice(request.amount)}</div>
        {request.refundMethod && (
          <div className="text-xs text-gray-500 mt-1">{request.refundMethod}</div>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">{formatDate(request.requestDate)}</div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleRequestAction('view', request.id)}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative group">
            <button className="text-gray-600 hover:text-red-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
              <div className="py-1">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleRequestAction('approve', request.id)}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleRequestAction('reject', request.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {request.status === 'approved' && (
                  <button
                    onClick={() => handleRequestAction('process', request.id)}
                    className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Process Refund</span>
                  </button>
                )}

                {request.status === 'processing' && (
                  <button
                    onClick={() => handleRequestAction('complete', request.id)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                )}

                <button
                  onClick={() => handleRequestAction('download', request.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length,
    completedRequests: requests.filter(r => r.status === 'completed').length,
    rejectedRequests: requests.filter(r => r.status === 'rejected').length,
    totalRefundAmount: requests.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0)
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
            <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
            <p className="text-gray-600 mt-1">Manage return and refund requests from customers</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-bold text-blue-600">{stats.approvedRequests}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-green-600">{stats.completedRequests}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-red-600">{stats.rejectedRequests}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Refunded</p>
              <p className="text-lg font-bold text-purple-600">{formatPrice(stats.totalRefundAmount)}</p>
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
              placeholder="Search by request ID, order ID, customer, product, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">No return or refund requests match your current filters.</p>
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
                          checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRequests(filteredRequests.map(r => r.id));
                            } else {
                              setSelectedRequests([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product & Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
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
                    {filteredRequests.map(request => (
                      <RequestRow key={request.id} request={request} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredRequests.length} of {requests.length} requests
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

export default ReturnsRefunds;
