import React, { useState, useEffect } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  Eye,
  CreditCard,
  Banknote,
  AlertCircle
} from 'lucide-react';

const PaymentDashboard = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TXN-001',
      type: 'order_completed',
      orderId: 'ORD-001',
      amount: 450000,
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      description: 'Payment for iPhone 14 Pro Max 256GB',
      customer: 'John Doe',
      paymentMethod: 'card'
    },
    {
      id: 'TXN-002',
      type: 'order_pending',
      orderId: 'ORD-002',
      amount: 650000,
      status: 'pending',
      date: '2024-01-14T15:20:00Z',
      description: 'Pending payment for MacBook Pro 16"',
      customer: 'Jane Smith',
      paymentMethod: 'card'
    },
    {
      id: 'TXN-003',
      type: 'withdrawal',
      amount: -200000,
      status: 'completed',
      date: '2024-01-13T09:15:00Z',
      description: 'Withdrawal to bank account',
      bankAccount: '****1234',
      paymentMethod: 'bank_transfer'
    },
    {
      id: 'TXN-004',
      type: 'order_completed',
      orderId: 'ORD-003',
      amount: 30000,
      status: 'completed',
      date: '2024-01-12T14:45:00Z',
      description: 'Payment for Nike Air Max 270',
      customer: 'Mike Johnson',
      paymentMethod: 'card'
    },
    {
      id: 'TXN-005',
      type: 'order_pending',
      orderId: 'ORD-004',
      amount: 185000,
      status: 'pending',
      date: '2024-01-11T16:30:00Z',
      description: 'Pending payment for Samsung 65" TV',
      customer: 'Sarah Wilson',
      paymentMethod: 'card'
    },
    {
      id: 'TXN-006',
      type: 'order_completed',
      orderId: 'ORD-005',
      amount: 75000,
      status: 'completed',
      date: '2024-01-10T11:20:00Z',
      description: 'Payment for Wireless Headphones',
      customer: 'David Brown',
      paymentMethod: 'wallet'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Transactions' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
    { key: 'withdrawals', label: 'Withdrawals' }
  ];

  const periodOptions = [
    { key: '7', label: 'Last 7 days' },
    { key: '30', label: 'Last 30 days' },
    { key: '90', label: 'Last 3 months' },
    { key: '365', label: 'Last year' }
  ];

  // Initialize data
  useEffect(() => {
    setTransactions(mockTransactions);

    // Calculate wallet balance and stats
    const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
    const pendingTransactions = mockTransactions.filter(t => t.status === 'pending');

    const balance = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const pending = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);
    const total = completedTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);

    setWalletBalance(balance);
    setPendingPayments(pending);
    setTotalEarnings(total);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'withdrawals') {
        filtered = filtered.filter(t => t.type === 'withdrawal');
      } else {
        filtered = filtered.filter(t => t.status === selectedFilter);
      }
    }

    // Apply period filter
    const periodDays = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);
    filtered = filtered.filter(t => new Date(t.date) >= cutoffDate);

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTransactions(filtered);
  }, [transactions, selectedFilter, selectedPeriod]);

  const getTransactionIcon = (transaction) => {
    switch (transaction.type) {
      case 'order_completed':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'order_pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (transaction) => {
    if (transaction.amount < 0) return 'text-red-600';
    switch (transaction.status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer': return <Banknote className="w-4 h-4" />;
      case 'wallet': return <Wallet className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatPrice = (amount) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    return `${isNegative ? '-' : ''}Rs. ${absAmount.toLocaleString()}`;
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

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{Math.abs(trend)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const TransactionCard = ({ transaction }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          {getTransactionIcon(transaction)}
        </div>

        {/* Transaction Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-gray-900 truncate">
                {transaction.description}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                {transaction.orderId && (
                  <span className="text-sm text-gray-500">
                    {transaction.orderId}
                  </span>
                )}
                {transaction.customer && (
                  <span className="text-sm text-gray-500">
                    {transaction.customer}
                  </span>
                )}
                {transaction.bankAccount && (
                  <span className="text-sm text-gray-500">
                    Bank: {transaction.bankAccount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-500">
                  {formatDate(transaction.date)}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  {getPaymentMethodIcon(transaction.paymentMethod)}
                  <span className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Amount and Status */}
            <div className="text-right ml-4">
              <p className={`font-semibold ${getTransactionColor(transaction)}`}>
                {formatPrice(transaction.amount)}
              </p>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                transaction.status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : transaction.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {transaction.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                {transaction.status === 'pending' && <Clock className="w-3 h-3" />}
                <span className="capitalize">{transaction.status}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Dashboard</h1>
          <p className="text-gray-600">
            Track your earnings, pending payments, and transaction history
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Wallet className="w-4 h-4" />
            <span>Withdraw Funds</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Wallet}
          title="Wallet Balance"
          value={formatPrice(walletBalance)}
          subtitle="Available for withdrawal"
          color="from-primary-500 to-primary-600"
          trend={12.5}
        />
        <StatCard
          icon={Clock}
          title="Pending Payments"
          value={formatPrice(pendingPayments)}
          subtitle="Awaiting order completion"
          color="from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Earnings"
          value={formatPrice(totalEarnings)}
          subtitle="Last 30 days"
          color="from-green-500 to-green-600"
          trend={8.3}
        />
      </div>

      {/* Pending Payments Alert */}
      {pendingPayments > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-yellow-800">
                You have {formatPrice(pendingPayments)} in pending payments
              </h3>
              <p className="text-yellow-700 text-sm mt-1">
                These payments will be released to your wallet once customers confirm order delivery and satisfaction.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>

            <div className="flex items-center space-x-3">
              {/* Period Filter */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {periodOptions.map(option => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {filterOptions.map(option => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                No transactions match your current filters.
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredTransactions.length} transactions
                </p>
              </div>

              {/* Transactions */}
              <div className="space-y-3">
                {filteredTransactions.map(transaction => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;