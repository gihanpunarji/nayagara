import React, { useState, useEffect } from 'react';
import {
  User, Package, CreditCard, MapPin, HelpCircle,
  LogOut, ChevronRight, Star, Truck, Clock, Shield, Eye,
  Edit, Copy, X, Check, AlertCircle, Phone, Mail, Calendar,
  Download, MessageCircle, FileText, Headphones, Plus, Minus,
  Car, Home, Settings, Trash2, Save, Share2, Users, Gift, TrendingUp
} from 'lucide-react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AccountSidebar from '../layout/AccountSidebar';
import MobileMenu from '../layout/MobileMenu';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';

const CustomerAccount = () => {
  const { logout, user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div></div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={'/'} replace />
  }
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [myAds, setMyAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [selectedAdStatus, setSelectedAdStatus] = useState('all');
  
  // Address management states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address_type: 'billing',
    line1: '',
    line2: '',
    postal_code: '',
    province_id: '',
    district_id: '',
    city_id: '',
    is_default: false
  });

  // Order management states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Wallet states
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Referral states
  const [referralData, setReferralData] = useState(null);
  const [loadingReferral, setLoadingReferral] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [referralNetwork, setReferralNetwork] = useState(null);
  const [loadingNetwork, setLoadingNetwork] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  // User data from context with defaults
  const userData = {
    firstName: user.first_name || 'User',
    lastName: user.last_name || '',
    email: user.email || '',
    mobile: user.mobile || '',
    joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', 'year': 'numeric' }) : 'Recently',
    profileImage: null,
    verified: user.email_verified || true,
    referralCode: `USER${user.user_id}`,
    totalReferrals: 0,
    referralEarnings: 0
  };

  const fetchWalletData = async () => {
    if (!isAuthenticated) return;

    setLoadingWallet(true);
    try {
      const response = await api.get('/wallet');
      if (response.data.success) {
        setWalletBalance(response.data.data.balance);
        setWalletTransactions(response.data.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoadingWallet(false);
    }
  };

  const fetchReferralData = async () => {
    if (!isAuthenticated) return;

    setLoadingReferral(true);
    try {
      const response = await api.get('/referral/my-code');
      if (response.data.success) {
        setReferralData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoadingReferral(false);
    }
  };

  const fetchReferralNetwork = async () => {
    if (!isAuthenticated) return;

    setLoadingNetwork(true);
    try {
      const response = await api.get('/referral/my-network');
      if (response.data.success) {
        setReferralNetwork(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching referral network:', error);
    } finally {
      setLoadingNetwork(false);
    }
  };

  const copyReferralLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };


  // Fetch functions for address data
  const fetchProvinces = async () => {
    try {
      const response = await api.get('/address/provinces');
      if (response.data.success) {
        setProvinces(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await api.get(`/address/districts/${provinceId}`);
      if (response.data.success) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
    }
  };

  const fetchCities = async (districtId) => {
    try {
      const response = await api.get(`/address/cities/${districtId}`);
      if (response.data.success) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };

  const fetchUserAddresses = async () => {
    if (!isAuthenticated) return;
    
    setLoadingAddresses(true);
    try {
      const response = await api.get('/address/user');
      if (response.data.success) {
        setUserAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const createAddress = async (addressData) => {
    setSavingAddress(true);
    try {
      const response = await api.post('/address/user', addressData);
      if (response.data.success) {
        await fetchUserAddresses(); // Refresh the addresses list
        return true;
      }
    } catch (error) {
      console.error('Error creating address:', error);
      alert('Failed to create address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
    return false;
  };

  const updateAddress = async (addressId, addressData) => {
    setSavingAddress(true);
    try {
      const response = await api.put(`/address/user/${addressId}`, addressData);
      if (response.data.success) {
        await fetchUserAddresses(); // Refresh the addresses list
        return true;
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
    return false;
  };

  const deleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await api.delete(`/address/user/${addressId}`);
      if (response.data.success) {
        await fetchUserAddresses(); // Refresh the addresses list
        alert('Address deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  // Fetch user orders
  const fetchUserOrders = async () => {
    if (!isAuthenticated) return;
    
    setLoadingOrders(true);
    try {
      const response = await api.get('/orders/user');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders based on status
  const filteredOrders = orderStatusFilter === 'all'
    ? orders
    : orders.filter(order => order.order_status === orderStatusFilter);

  // Order status filter options
  const orderStatusFilters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.order_status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.order_status === 'confirmed').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.order_status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.order_status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.order_status === 'delivered').length },
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

 

  // Fetch initial data on component mount
  useEffect(() => {
    fetchProvinces();
    if (isAuthenticated) {
      fetchUserOrders();
      fetchWalletData();
      fetchReferralData();
      fetchReferralNetwork();
    }
  }, [isAuthenticated]);

  // Fetch user's advertisements
  useEffect(() => {
    if (activeTab === 'my-ads') {
      fetchMyAds();
    }
  }, [activeTab]);

  // Fetch user addresses when addresses tab is active
  useEffect(() => {
    if (activeTab === 'addresses' && isAuthenticated) {
      fetchUserAddresses();
    }
  }, [activeTab, isAuthenticated]);

  // Fetch user orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      fetchUserOrders();
    }
  }, [activeTab, isAuthenticated]);

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
              <p className="text-2xl font-bold text-gray-900">Rs. {walletBalance.toLocaleString()}</p>
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
          {loadingOrders ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            orders.slice(0, 3).map((order) => (
              <div key={order.order_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.order_datetime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">Rs. {parseFloat(order.total_amount).toLocaleString()}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
      </div>

      {/* Order Status Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {orderStatusFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setOrderStatusFilter(filter.id)}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                orderStatusFilter === filter.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loadingOrders ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {orderStatusFilter === 'all' 
              ? "You haven't placed any orders yet" 
              : `No ${orderStatusFilter} orders found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.order_id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrderExpansion(order.order_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{order.order_number}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.order_datetime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items ? order.items.length : 0} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 mb-2">
                      Rs. {parseFloat(order.total_amount).toLocaleString()}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)} mb-2 inline-block`}>
                      {order.order_status}
                    </span>
                    <div className="flex items-center justify-end space-x-2">
                      {order.tracking_number && (
                        <div className="text-xs text-gray-500">
                          <Truck className="w-3 h-3 inline mr-1" />
                          {order.tracking_number}
                        </div>
                      )}
                      <ChevronRight 
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedOrders.has(order.order_id) ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrders.has(order.order_id) && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-6">
                    {/* Order Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-medium">
                              {new Date(order.order_datetime).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.payment_status}
                            </span>
                          </div>
                          {order.tracking_number && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tracking Number:</span>
                              <span className="font-medium font-mono text-primary-600">
                                {order.tracking_number}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">Rs. {parseFloat(order.subtotal).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium">Rs. {parseFloat(order.shipping_cost).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                            <span>Total:</span>
                            <span>Rs. {parseFloat(order.total_amount).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                          <p>{order.line1}</p>
                          {order.line2 && <p>{order.line2}</p>}
                          <p>{order.city_name}, {order.district_name}</p>
                          <p>{order.province_name}, {order.postal_code}</p>
                          <p>{order.country_name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  {item.product_image_url ? (
                                    <img
                                      src={item.product_image_url || 'https://via.placeholder.com/64x64?text=No+Image'}
                                      alt={item.product_title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.product_title}</h5>
                                  {item.product_description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">{item.product_description}</p>
                                  )}
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                    <span>Quantity: {item.quantity}</span>
                                    <span>Unit Price: Rs. {parseFloat(item.unit_price).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    Rs. {parseFloat(item.total_price).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
            {loadingWallet ? (
              <div className="h-9 w-32 bg-white bg-opacity-25 rounded-md animate-pulse"></div>
            ) : (
              <h3 className="text-3xl font-bold">Rs. {walletBalance.toLocaleString()}</h3>
            )}
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

      {/* Referral Program Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Referral Program</h3>
            <p className="text-sm text-gray-500">Earn commissions by referring friends</p>
          </div>
        </div>

        {loadingReferral ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 text-sm mt-2">Loading referral info...</p>
          </div>
        ) : referralData ? (
          <div className="space-y-4">
            {/* Unlock Status */}
            {!referralData.referralUnlocked ? (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 mb-1">Unlock Your Referral Link</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Purchase products worth Rs. {referralData.unlockThreshold.toLocaleString()} to unlock your referral link and start earning commissions!
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-800 font-medium">Progress</span>
                        <span className="text-orange-900 font-bold">
                          Rs. {referralData.totalPurchased.toLocaleString()} / Rs. {referralData.unlockThreshold.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((referralData.totalPurchased / referralData.unlockThreshold) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-orange-600">
                        Rs. {Math.max(0, referralData.unlockThreshold - referralData.totalPurchased).toLocaleString()} more to unlock
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Unlocked - Show Referral Link */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Referral Link Unlocked!</h4>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    Share your referral link and earn commissions on every purchase made by your referrals.
                  </p>

                  {/* Referral Code Display */}
                  <div className="bg-white rounded-lg p-3 border border-green-200 mb-3">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Your Referral Code</label>
                    <div className="flex items-center justify-between">
                      <code className="text-lg font-bold text-primary-600 tracking-wider">{referralData.referralCode}</code>
                      <button
                        onClick={copyReferralLink}
                        className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                      >
                        {copiedReferral ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Referral Link */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Shareable Link</label>
                    <p className="text-xs text-gray-600 break-all font-mono">{referralData.referralLink}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-900">Total Purchases</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900">Rs. {referralData.totalPurchased.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900">Status</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">Active</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Unable to load referral information</p>
          </div>
        )}
      </div>

      {/* Referral Network */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">My Referral Network</h3>
            <p className="text-sm text-gray-500">Your referral connections</p>
          </div>
        </div>

        {loadingNetwork ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 text-sm mt-2">Loading network...</p>
          </div>
        ) : referralNetwork ? (
          <div className="space-y-4">
            {/* Top User (Who Referred Me) */}
            {referralNetwork.topUser ? (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-semibold text-indigo-900">Referred By</h4>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {referralNetwork.topUser.first_name} {referralNetwork.topUser.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{referralNetwork.topUser.user_email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Total Purchases: Rs. {parseFloat(referralNetwork.topUser.total_purchase_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                      Level 1
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-500 text-sm text-center">You were not referred by anyone</p>
              </div>
            )}

            {/* Referred Users List */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-emerald-900">My Referrals</h4>
                </div>
                <span className="bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {referralNetwork.totalReferredUsers}
                </span>
              </div>

              {referralNetwork.referredUsers && referralNetwork.referredUsers.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {referralNetwork.referredUsers.map((user) => (
                    <div key={user.user_id} className="bg-white rounded-lg p-3 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-xs text-gray-500">{user.user_email}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-xs">
                            <span className="text-gray-600">
                              Purchases: Rs. {parseFloat(user.total_purchase_amount || 0).toLocaleString()}
                            </span>
                            <span className="text-emerald-600 font-medium">
                              Earned: Rs. {parseFloat(user.total_commissions_earned || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No referrals yet</p>
                  <p className="text-xs text-gray-400 mt-1">Share your referral link to start earning!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Unable to load referral network</p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
        {loadingWallet ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading transactions...</p>
          </div>
        ) : walletTransactions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {walletTransactions.map((tx) => (
              <div key={tx.transaction_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.amount > 0 ? (
                      <Plus className="w-5 h-5 text-green-600" />
                    ) : (
                      <Minus className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.description}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.bebitted_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}Rs. {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
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
              <p className="text-sm text-gray-600 mb-2">Available Balance: Rs. {walletBalance.toLocaleString()}</p>
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

  const renderAddresses = () => {
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      if (!addressForm.line1 || !addressForm.postal_code || !addressForm.city_id) {
        alert('Please fill in all required fields');
        return;
      }

      const success = editingAddress 
        ? await updateAddress(editingAddress, {
            addressType: addressForm.address_type,
            line1: addressForm.line1,
            line2: addressForm.line2,
            postalCode: addressForm.postal_code,
            cityId: addressForm.city_id,
            isDefault: addressForm.is_default
          })
        : await createAddress({
            addressType: addressForm.address_type,
            line1: addressForm.line1,
            line2: addressForm.line2,
            postalCode: addressForm.postal_code,
            cityId: addressForm.city_id,
            isDefault: addressForm.is_default
          });

      if (success) {
        setShowAddAddressModal(false);
        setEditingAddress(null);
        resetAddressForm();
        alert(`Address ${editingAddress ? 'updated' : 'created'} successfully!`);
      }
    };

    const resetAddressForm = () => {
      setAddressForm({
        address_type: 'billing',
        line1: '',
        line2: '',
        postal_code: '',
        province_id: '',
        district_id: '',
        city_id: '',
        is_default: false
      });
      setDistricts([]);
      setCities([]);
    };

    const handleProvinceChange = async (provinceId) => {
      setAddressForm(prev => ({ ...prev, province_id: provinceId, district_id: '', city_id: '' }));
      setCities([]);
      if (provinceId) {
        await fetchDistricts(provinceId);
      } else {
        setDistricts([]);
      }
    };

    const handleDistrictChange = async (districtId) => {
      setAddressForm(prev => ({ ...prev, district_id: districtId, city_id: '' }));
      if (districtId) {
        await fetchCities(districtId);
      } else {
        setCities([]);
      }
    };

    const handleEditAddress = (address) => {
      setAddressForm({
        address_type: address.address_type,
        line1: address.line1,
        line2: address.line2 || '',
        postal_code: address.postal_code,
        province_id: address.province_id || '',
        district_id: address.district_id || '',
        city_id: address.city_id,
        is_default: address.is_default === 1
      });
      
      // Load districts and cities for editing
      if (address.province_id) {
        fetchDistricts(address.province_id);
        if (address.district_id) {
          fetchCities(address.district_id);
        }
      }
      
      setEditingAddress(address.address_id);
      setShowAddAddressModal(true);
    };

    const billingAddresses = userAddresses.filter(addr => addr.address_type === 'billing');
    const shippingAddresses = userAddresses.filter(addr => addr.address_type === 'shipping');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
          <button
            onClick={() => {
              resetAddressForm();
              setShowAddAddressModal(true);
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {loadingAddresses ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading addresses...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Billing Addresses */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Addresses</h3>
              {billingAddresses.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No billing addresses found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {billingAddresses.map((address) => (
                    <div key={address.address_id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {address.is_default === 1 && (
                            <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mb-2">
                              Default
                            </span>
                          )}
                          <p className="font-medium text-gray-900">{address.line1}</p>
                          {address.line2 && <p className="text-gray-600">{address.line2}</p>}
                          <p className="text-gray-600">{address.city_name}, {address.district_name}</p>
                          <p className="text-gray-600">{address.province_name}, {address.postal_code}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit Address"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAddress(address.address_id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Addresses */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Addresses</h3>
              {shippingAddresses.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No shipping addresses found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shippingAddresses.map((address) => (
                    <div key={address.address_id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {address.is_default === 1 && (
                            <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mb-2">
                              Default
                            </span>
                          )}
                          <p className="font-medium text-gray-900">{address.line1}</p>
                          {address.line2 && <p className="text-gray-600">{address.line2}</p>}
                          <p className="text-gray-600">{address.city_name}, {address.district_name}</p>
                          <p className="text-gray-600">{address.province_name}, {address.postal_code}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit Address"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAddress(address.address_id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Address Modal */}
        {showAddAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddAddressModal(false);
                    setEditingAddress(null);
                    resetAddressForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Type *</label>
                  <select
                    value={addressForm.address_type}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, address_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="billing">Billing Address</option>
                    <option value="shipping">Shipping Address</option>
                  </select>
                </div>

                {/* Address Lines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      value={addressForm.line1}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                      placeholder="House/Building number, Street name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={addressForm.line2}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Location Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                    <select
                      value={addressForm.province_id}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province) => (
                        <option key={province.province_id} value={province.province_id}>
                          {province.province_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <select
                      value={addressForm.district_id}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      disabled={!addressForm.province_id}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.district_id} value={district.district_id}>
                          {district.district_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <select
                      value={addressForm.city_id}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, city_id: e.target.value }))}
                      disabled={!addressForm.district_id}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.city_id} value={city.city_id}>
                          {city.city_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="Enter postal code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                {/* Default Address Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, is_default: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAddressModal(false);
                      setEditingAddress(null);
                      resetAddressForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {savingAddress ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingAddress ? 'Update Address' : 'Save Address'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

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
          <p className="text-blue-600 font-semibold mb-4">+94 71 775 0039</p>
          <p className="text-sm text-gray-600">Available 24/7 for customer support</p>
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