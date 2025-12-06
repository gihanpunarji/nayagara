import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { getAdminSellers } from '../../../api/admin';
import api from '../../../api/axios';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, TrendingUp, User, Home, Briefcase, Info, DollarSign, CreditCard, Loader, CheckSquare, Square, Check } from 'lucide-react';

const SellerDetails = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bankDetails, setBankDetails] = useState(null);
    const [bankLoading, setBankLoading] = useState(false);

    // Orders and payment states
    const [orders, setOrders] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState('');
    const [paymentError, setPaymentError] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                setLoading(true);
                const response = await getAdminSellers();
                if (response.success) {
                    const currentSeller = response.sellers.find(s => s.id.toString() === id);
                    if (currentSeller) {
                        setSeller(currentSeller);
                    } else {
                        setError('Seller not found');
                    }
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch seller details');
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, [id]);

    useEffect(() => {
        if (seller) {
            fetchBankDetails();
            fetchEarnings();
        }
    }, [seller]);

    const fetchBankDetails = async () => {
        try {
            setBankLoading(true);
            const response = await api.get(`/admin/sellers/${id}/bank`);
            if (response.data.success) {
                setBankDetails(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch bank details:', err);
        } finally {
            setBankLoading(false);
        }
    };

    const fetchEarnings = async () => {
        try {
            const response = await api.get(`/admin/sellers/${id}/earnings`);
            if (response.data.success) {
                setOrders(response.data.data.orders);
                setPaymentHistory(response.data.data.paymentHistory);
                setStats(response.data.data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch earnings:', err);
        }
    };

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            'completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
            'failed': { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
            'refunded': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Refunded' }
        };
        const config = statusConfig[status] || statusConfig['pending'];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getOrderStatusBadge = (status) => {
        const statusConfig = {
            'confirmed': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
            'processing': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Processing' },
            'shipped': { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Shipped' },
            'delivered': { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
            'cancelled': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
        };
        const config = statusConfig[status] || statusConfig['confirmed'];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending_verification': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <AdminLayout><div className="flex justify-center items-center h-64">Loading...</div></AdminLayout>;
    }

    if (error) {
        return <AdminLayout><div className="text-red-500 text-center">{error}</div></AdminLayout>;
    }

    if (!seller) {
        return <AdminLayout><div className="text-center">Seller not found.</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Seller Details</h1>
                        <p className="text-gray-500">Detailed information for {seller.name}</p>
                    </div>

                    {/* Seller Profile Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center">
                            {seller.profile_image ? (
                                <img
                                    src={seller.profile_image}
                                    alt={seller.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-green-500 mb-4 md:mb-0 md:mr-6"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div
                                className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl font-bold mb-4 md:mb-0 md:mr-6"
                                style={{ display: seller.profile_image ? 'none' : 'flex' }}
                            >
                                {seller.name.charAt(0)}
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-semibold text-gray-900">{seller.name}</h2>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(seller.status)}`}>
                                        {seller.status}
                                    </span>
                                </div>
                                <p className="text-gray-500 mt-1">{seller.store_name || 'No store name'}</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><User className="mr-2 text-green-600" />Personal Information</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <div className="flex items-center"><Mail className="w-4 h-4 mr-3 text-gray-400" /> {seller.email}</div>
                                        <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-gray-400" /> {seller.phone || 'N/A'}</div>
                                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-gray-400" /> {seller.location || 'N/A'}</div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><Briefcase className="mr-2 text-green-600" />Business Details</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <div className="flex items-center"><Home className="w-4 h-4 mr-3 text-gray-400" /> Store: {seller.store_name || 'N/A'}</div>
                                        <div className="flex items-center"><Info className="w-4 h-4 mr-3 text-gray-400" /> NIC: {seller.nic || 'N/A'}</div>
                                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 text-gray-400" /> Joined: {formatDate(seller.joinDate)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center">
                                <TrendingUp className="w-8 h-8 text-blue-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Earned</p>
                                    <p className="text-2xl font-bold text-gray-800">Rs. {stats ? parseFloat(stats.total_earned).toLocaleString() : '0'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md border border-yellow-200 bg-yellow-50">
                            <div className="flex items-center">
                                <DollarSign className="w-8 h-8 text-yellow-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Pending Orders</p>
                                    <p className="text-2xl font-bold text-yellow-700">Rs. {stats ? parseFloat(stats.unpaid_amount).toLocaleString() : '0'}</p>
                                    <p className="text-xs text-gray-600">{stats ? stats.unpaid_count : 0} orders</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md border border-green-200 bg-green-50">
                            <div className="flex items-center">
                                <Check className="w-8 h-8 text-green-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Completed Orders</p>
                                    <p className="text-2xl font-bold text-green-700">Rs. {stats ? parseFloat(stats.completed_amount).toLocaleString() : '0'}</p>
                                    <p className="text-xs text-gray-600">{stats ? stats.completed_count : 0} orders</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md border border-purple-200 bg-purple-50">
                            <div className="flex items-center">
                                <CreditCard className="w-8 h-8 text-purple-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-600">Available Balance</p>
                                    <p className="text-2xl font-bold text-purple-700">Rs. {seller.availableBalance ? parseFloat(seller.availableBalance).toLocaleString() : '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders List Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <ShoppingBag className="mr-2 text-blue-600" />
                            Seller Orders ({orders.length})
                        </h3>

                        {orders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No orders found for this seller
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {currentOrders.map((order) => (
                                                <tr key={order.order_id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{order.order_number}</td>
                                                    <td className="px-4 py-3 text-gray-600">{order.customer_name}</td>
                                                    <td className="px-4 py-3 font-semibold text-green-600">
                                                        Rs. {parseFloat(order.seller_amount).toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3">{getPaymentStatusBadge(order.payment_status)}</td>
                                                    <td className="px-4 py-3">{getOrderStatusBadge(order.order_status)}</td>
                                                    <td className="px-4 py-3 text-gray-600">{formatDateTime(order.order_datetime)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, orders.length)} of {orders.length} orders
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded border ${
                                                currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                                // Show first page, last page, current page, and pages around current page
                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === totalPages ||
                                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className={`px-3 py-1 rounded border ${
                                                                currentPage === pageNumber
                                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                } else if (
                                                    pageNumber === currentPage - 2 ||
                                                    pageNumber === currentPage + 2
                                                ) {
                                                    return <span key={pageNumber} className="px-2">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded border ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bank Details */}
                    {bankDetails && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <CreditCard className="mr-2 text-blue-600" />
                                Bank Account Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <div>
                                    <p className="text-sm text-gray-500">Bank Name</p>
                                    <p className="font-medium">{bankDetails.bank_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Account Number</p>
                                    <p className="font-medium">{bankDetails.account_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Account Holder</p>
                                    <p className="font-medium">{bankDetails.holder_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Branch</p>
                                    <p className="font-medium">{bankDetails.branch_name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default SellerDetails;
