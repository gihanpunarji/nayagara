import React, { useState, useEffect } from 'react';
import {
  User, Package, CreditCard, MapPin, HelpCircle,
  LogOut, ChevronRight, Star, Truck, Clock, Shield, Eye,
  Edit, Copy, X, Check, AlertCircle, Phone, Mail, Calendar,
  Download, MessageCircle, FileText, Headphones, Plus, Minus,
  Car, Home, Settings, Trash2
} from 'lucide-react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AccountSidebar from '../layout/AccountSidebar';
import MobileMenu from '../layout/MobileMenu';
import { useAuth } from '../../../context/AuthContext';

const CustomerAccount = () => {
  const { logout, user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div></div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={'/'} replace />
  }
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'dashboard';
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [myAds, setMyAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [selectedAdStatus, setSelectedAdStatus] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  // User data from context with defaults
  const userData = {
    firstName: user.first_name || 'User',
    lastName: user.last_name || '',
    email: user.email || '',
    mobile: user.mobile || '',
    joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    profileImage: null,
    verified: user.email_verified || true,
    walletBalance: user.wallet_balance || 0,
    referralCode: `USER${user.user_id}`,
    totalReferrals: 0,
    referralEarnings: 0
  };

  // Mock order data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-20',
      status: 'delivered',
      total: 385000,
      items: [
        {
          name: 'iPhone 15 Pro Max 256GB',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          price: 385000,
          quantity: 1,
          seller: 'TechZone Lanka'
        }
      ],
      shippingAddress: 'No. 123, Main Street, Colombo 07',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-18',
      status: 'shipped',
      total: 429750,
      items: [
        {
          name: 'Gaming Laptop RTX 4070',
          image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          price: 425000,
          quantity: 1,
          seller: 'Gamer Hub'
        },
        {
          name: 'Premium Basmati Rice 25kg',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          price: 4750,
          quantity: 1,
          seller: 'Fresh Mart'
        }
      ],
      shippingAddress: 'No. 456, Lake Road, Nugegoda',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-15',
      status: 'processed',
      total: 75000,
      items: [
        {
          name: 'Wireless Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          price: 75000,
          quantity: 1,
          seller: 'Audio Zone'
        }
      ],
      shippingAddress: 'No. 789, Temple Road, Kandy',
      trackingNumber: 'TRK456789123'
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-12',
      status: 'paid',
      total: 125000,
      items: [
        {
          name: 'Smart Watch',
          image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          price: 125000,
          quantity: 1,
          seller: 'Tech Hub'
        }
      ],
      shippingAddress: 'No. 321, Park Street, Galle',
      trackingNumber: 'TRK789123456'
    }
  ];

  // Address data
  const [addresses, setAddresses] = useState({
    billing: {
      line1: '123 Main Street',
      line2: 'Apartment 4B',
      country: 'Sri Lanka',
      province: 'western',
      district: 'colombo',
      city: 'Colombo 07',
      postal: '00700'
    },
    shipping: {
      line1: '456 Lake Road',
      line2: '',
      country: 'Sri Lanka',
      province: 'western',
      district: 'gampaha',
      city: 'Nugegoda',
      postal: '10250'
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders based on status
  const filteredOrders = orderStatusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === orderStatusFilter);

  // Order status filter options
  const orderStatusFilters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'paid', label: 'Paid', count: orders.filter(o => o.status === 'paid').length },
    { id: 'processed', label: 'Processed', count: orders.filter(o => o.status === 'processed').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  // Save phone number function
  const handleSavePhone = async () => {
    if (!phoneNumber) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      // In real app, this would make an API call to update the phone number
      // await api.put('/customer/profile', { mobile: phoneNumber });

      // For now, update localStorage
      const updatedUser = { ...userData, mobile: phoneNumber };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setEditingPhone(false);
      alert('Phone number updated successfully!');
    } catch (error) {
      alert('Failed to update phone number. Please try again.');
    }
  };

 

  // Fetch user's advertisements
  useEffect(() => {
    if (activeTab === 'my-ads') {
      fetchMyAds();
    }
  }, [activeTab]);

  const fetchMyAds = async () => {
    setAdsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/advertisements/user/my-ads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setMyAds(data.data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setAdsLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/advertisements/${adId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setMyAds(myAds.filter(ad => ad.ad_id !== adId));
        } else {
          alert('Failed to delete advertisement');
        }
      } catch (error) {
        alert('Error deleting advertisement');
      }
    }
  };

  const getAdStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

 

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (parseFloat(withdrawAmount) > userData.walletBalance) {
      alert('Insufficient balance');
      return;
    }
    // Process withdrawal logic here
    alert(`Withdrawal request of Rs. ${parseFloat(withdrawAmount).toLocaleString()} submitted successfully!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-primary text-white rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, {userData.firstName} {userData.lastName}!
            </h2>
            <p className="text-primary-100">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Rs. {userData.walletBalance.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Wallet Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Verified</p>
              <p className="text-sm text-gray-500">Account Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">Rs. {order.total.toLocaleString()}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
      </div>

      {selectedOrder ? (
        // Order Details View
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <p className="text-gray-500">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Order Date:</span> {selectedOrder.date}</p>
                  <p><span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber}</p>
                  <p><span className="font-medium">Total:</span> Rs. {selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-500">Sold by: {item.seller}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Orders List View
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-500">{order.date}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 mb-2">Rs. {order.total.toLocaleString()}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} mb-2 inline-block`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Wallet</h2>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 mb-1">Available Balance</p>
            <h3 className="text-3xl font-bold">Rs. {userData.walletBalance.toLocaleString()}</h3>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8" />
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Refund - ORD-2024-003</p>
                <p className="text-sm text-gray-500">Jan 15, 2024</p>
              </div>
            </div>
            <p className="font-bold text-green-600">+Rs. 12,500</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Minus className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Purchase - ORD-2024-002</p>
                <p className="text-sm text-gray-500">Jan 10, 2024</p>
              </div>
            </div>
            <p className="font-bold text-red-600">-Rs. 429,750</p>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Withdraw Funds</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Available Balance: Rs. {userData.walletBalance.toLocaleString()}</p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Address */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Billing Address</h3>
            <button
              onClick={() => setEditingAddress('billing')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>{addresses.billing.line1}</p>
            {addresses.billing.line2 && <p>{addresses.billing.line2}</p>}
            <p>{addresses.billing.city}, {addresses.billing.postal}</p>
            <p>{addresses.billing.country}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
            <button
              onClick={() => setEditingAddress('shipping')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>{addresses.shipping.line1}</p>
            {addresses.shipping.line2 && <p>{addresses.shipping.line2}</p>}
            <p>{addresses.shipping.city}, {addresses.shipping.postal}</p>
            <p>{addresses.shipping.country}</p>
          </div>
        </div>
      </div>

      {/* Edit Address Modal */}
      {editingAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Edit {editingAddress === 'billing' ? 'Billing' : 'Shipping'} Address
              </h3>
              <button
                onClick={() => setEditingAddress(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  value={addresses[editingAddress].line1}
                  onChange={(e) => setAddresses(prev => ({
                    ...prev,
                    [editingAddress]: { ...prev[editingAddress], line1: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={addresses[editingAddress].line2}
                  onChange={(e) => setAddresses(prev => ({
                    ...prev,
                    [editingAddress]: { ...prev[editingAddress], line2: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={addresses[editingAddress].city}
                    onChange={(e) => setAddresses(prev => ({
                      ...prev,
                      [editingAddress]: { ...prev[editingAddress], city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    value={addresses[editingAddress].postal}
                    onChange={(e) => setAddresses(prev => ({
                      ...prev,
                      [editingAddress]: { ...prev[editingAddress], postal: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditingAddress(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save address logic here
                  setEditingAddress(null);
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMyAds = () => {
    const filteredAds = selectedAdStatus === 'all'
      ? myAds
      : myAds.filter(ad => ad.status === selectedAdStatus);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Advertisements</h2>
            <p className="text-gray-600">Manage your posted advertisements</p>
          </div>
          <Link
            to="/post-ad"
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Ad</span>
          </Link>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Ads' },
                { value: 'pending_approval', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedAdStatus(filter.value)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedAdStatus === filter.value
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ads List */}
        {adsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading your ads...</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            {selectedAdStatus === 'all' ? (
              <>
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements yet</h3>
                <p className="text-gray-600 mb-4">Start selling by posting your first advertisement</p>
                <Link
                  to="/post-ad"
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Your First Ad</span>
                </Link>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedAdStatus.replace('_', ' ')} ads</h3>
                <p className="text-gray-600">No advertisements match the selected status filter.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAds.map(ad => (
              <div key={ad.ad_id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    {/* Ad Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {ad.ad_type === 'vehicle' ? (
                            <Car className="w-8 h-8 text-gray-400" />
                          ) : (
                            <Home className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Ad Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{ad.title}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ad.description}</p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatPrice(ad.price)}</span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{ad.location_city}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{ad.views} views</span>
                            </span>
                            <span>•</span>
                            <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                          </div>

                          {/* Package Type */}
                          {ad.package_type !== 'standard' && (
                            <div className="mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                                ad.package_type === 'urgent' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {ad.package_type.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          {/* Status Badge */}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAdStatusColor(ad.status)}`}>
                            {ad.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/ad/${ad.ad_id}`}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Ad"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/post-ad?edit=${ad.ad_id}`}
                              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                              title="Edit Ad"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteAd(ad.ad_id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete Ad"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes for Rejected Ads */}
                      {ad.status === 'rejected' && ad.admin_notes && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-sm text-red-700 mt-1">{ad.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Call Us</h3>
              <p className="text-sm text-gray-500">Get instant help over the phone</p>
            </div>
          </div>
          <p className="text-blue-600 font-semibold mb-4">+94 11 123 4567</p>
          <p className="text-sm text-gray-600">Available 24/7 for customer support</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500">Chat with our support team</p>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
            Start Chat
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Email Support</h3>
              <p className="text-sm text-gray-500">Send us your queries</p>
            </div>
          </div>
          <p className="text-purple-600 font-semibold mb-4">support@nayagara.lk</p>
          <p className="text-sm text-gray-600">Response within 24 hours</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">FAQ & Guides</h3>
              <p className="text-sm text-gray-500">Find answers to common questions</p>
            </div>
          </div>
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Browse FAQ
          </button>
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Common Issues</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <h4 className="font-medium text-gray-900">How to track my order?</h4>
            <p className="text-sm text-gray-500 mt-1">Learn how to track your orders and get delivery updates</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <h4 className="font-medium text-gray-900">Return & Refund Policy</h4>
            <p className="text-sm text-gray-500 mt-1">Understand our return and refund procedures</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <h4 className="font-medium text-gray-900">Payment Methods</h4>
            <p className="text-sm text-gray-500 mt-1">View available payment options and troubleshoot payment issues</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <h4 className="font-medium text-gray-900">Account Security</h4>
            <p className="text-sm text-gray-500 mt-1">Tips to keep your account safe and secure</p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">Customer Support</p>
            <p className="text-gray-600">Monday - Sunday: 9:00 AM - 10:00 PM</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Live Chat</p>
            <p className="text-gray-600">24/7 Available</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'orders': return renderOrders();
      case 'my-ads': return renderMyAds();
      case 'wallet': return renderWallet();
      case 'addresses': return renderAddresses();
      case 'support': return renderSupport();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 lg:block hidden">
            <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="bg-primary-600 text-white rounded-full p-4 shadow-lg"
            >
              <User className="w-6 h-6" />
            </button>
          </div>

          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
            setActiveTab={setActiveTab} 
          />

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;