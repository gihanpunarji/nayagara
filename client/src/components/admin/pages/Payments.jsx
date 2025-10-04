import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MoreVertical,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);

  const mockPayments = [
    {
      id: 'PAY-2024-001',
      orderId: 'ORD-2024-5432',
      customer: 'John Doe',
      email: 'john@example.com',
      amount: 125000,
      paymentMethod: 'Credit Card',
      cardLastFour: '4242',
      status: 'completed',
      transactionId: 'TXN-ABC123XYZ',
      date: '2024-01-15T10:30:00',
      gateway: 'Stripe'
    },
    {
      id: 'PAY-2024-002',
      orderId: 'ORD-2024-5433',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      amount: 87500,
      paymentMethod: 'PayPal',
      cardLastFour: null,
      status: 'completed',
      transactionId: 'TXN-DEF456ABC',
      date: '2024-01-15T11:45:00',
      gateway: 'PayPal'
    },
    {
      id: 'PAY-2024-003',
      orderId: 'ORD-2024-5434',
      customer: 'Bob Wilson',
      email: 'bob@example.com',
      amount: 56000,
      paymentMethod: 'Debit Card',
      cardLastFour: '5678',
      status: 'pending',
      transactionId: 'TXN-GHI789DEF',
      date: '2024-01-15T14:20:00',
      gateway: 'Stripe'
    },
    {
      id: 'PAY-2024-004',
      orderId: 'ORD-2024-5435',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      amount: 234000,
      paymentMethod: 'Credit Card',
      cardLastFour: '9012',
      status: 'failed',
      transactionId: 'TXN-JKL012GHI',
      date: '2024-01-15T16:30:00',
      gateway: 'Stripe'
    },
    {
      id: 'PAY-2024-005',
      orderId: 'ORD-2024-5436',
      customer: 'Charlie Davis',
      email: 'charlie@example.com',
      amount: 145000,
      paymentMethod: 'Bank Transfer',
      cardLastFour: null,
      status: 'completed',
      transactionId: 'TXN-MNO345JKL',
      date: '2024-01-14T09:15:00',
      gateway: 'Bank'
    },
    {
      id: 'PAY-2024-006',
      orderId: 'ORD-2024-5437',
      customer: 'Diana Evans',
      email: 'diana@example.com',
      amount: 98000,
      paymentMethod: 'Credit Card',
      cardLastFour: '3456',
      status: 'refunded',
      transactionId: 'TXN-PQR678MNO',
      date: '2024-01-14T13:40:00',
      gateway: 'Stripe'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Payments', count: 0, color: 'gray' },
    { key: 'completed', label: 'Completed', count: 0, color: 'green' },
    { key: 'pending', label: 'Pending', count: 0, color: 'yellow' },
    { key: 'failed', label: 'Failed', count: 0, color: 'red' },
    { key: 'refunded', label: 'Refunded', count: 0, color: 'orange' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPayments(mockPayments);

      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockPayments.length;
        } else {
          filter.count = mockPayments.filter(p => p.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...payments];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(p => p.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredPayments(filtered);
  }, [payments, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'refunded': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <TrendingUp className="w-4 h-4 rotate-180" />;
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

  const handlePaymentAction = (action, paymentId) => {
    console.log(`${action} payment:`, paymentId);
  };

  const PaymentRow = ({ payment }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedPayments.includes(payment.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedPayments([...selectedPayments, payment.id]);
            } else {
              setSelectedPayments(selectedPayments.filter(id => id !== payment.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{payment.id}</div>
          <div className="text-xs text-gray-500">Order: {payment.orderId}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{payment.customer}</div>
          <div className="text-xs text-gray-500">{payment.email}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{formatPrice(payment.amount)}</div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">{payment.paymentMethod}</div>
          {payment.cardLastFour && (
            <div className="text-xs text-gray-500">•••• {payment.cardLastFour}</div>
          )}
          <div className="text-xs text-gray-500">{payment.gateway}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">{formatDate(payment.date)}</div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
          {getStatusIcon(payment.status)}
          <span>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handlePaymentAction('view', payment.id)}
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
                <button
                  onClick={() => handlePaymentAction('receipt', payment.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Receipt</span>
                </button>

                {payment.status === 'completed' && (
                  <button
                    onClick={() => handlePaymentAction('refund', payment.id)}
                    className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    <span>Refund Payment</span>
                  </button>
                )}

                <button
                  onClick={() => handlePaymentAction('download', payment.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    totalPayments: payments.length,
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter(p => p.status === 'completed').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
    refundedAmount: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0)
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
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
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
              <p className="text-xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-lg font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-green-600">{stats.completedPayments}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingPayments}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-xl font-bold text-red-600">{stats.failedPayments}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Refunded</p>
              <p className="text-lg font-bold text-orange-600">{formatPrice(stats.refundedAmount)}</p>
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
              placeholder="Search by payment ID, order ID, customer, email, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">No payments match your current filters.</p>
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
                          checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPayments(filteredPayments.map(p => p.id));
                            } else {
                              setSelectedPayments([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
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
                    {filteredPayments.map(payment => (
                      <PaymentRow key={payment.id} payment={payment} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredPayments.length} of {payments.length} payments
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

export default Payments;
