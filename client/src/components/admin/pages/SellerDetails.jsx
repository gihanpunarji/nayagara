import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { getAdminSellers } from '../../../api/admin';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, Star, TrendingUp, User, Home, Briefcase, Info } from 'lucide-react';

const SellerDetails = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Seller Details</h1>
                        <p className="text-gray-500">Detailed information for {seller.name}</p>
                    </div>

                    {/* Seller Profile Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
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
                                {/* Contact Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><User className="mr-2 text-green-600" />Personal Information</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <div className="flex items-center"><Mail className="w-4 h-4 mr-3 text-gray-400" /> {seller.email}</div>
                                        <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-gray-400" /> {seller.phone || 'N/A'}</div>
                                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-gray-400" /> {seller.location || 'N/A'}</div>
                                    </div>
                                </div>

                                {/* Business Info */}
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

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center">
                                <ShoppingBag className="w-8 h-8 text-blue-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-800">{seller.totalProducts}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center">
                                <TrendingUp className="w-8 h-8 text-green-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Sales</p>
                                    <p className="text-2xl font-bold text-gray-800">Rs. {seller.totalSales ? parseFloat(seller.totalSales).toLocaleString() : '0'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center">
                                <TrendingUp className="w-8 h-8 text-purple-500 mr-4" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Earned</p>
                                    <p className="text-2xl font-bold text-gray-800">Rs. {seller.totalEarnings ? parseFloat(seller.totalEarnings).toLocaleString() : '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity (Placeholder) */}
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="text-gray-500">
                            <p>Recent activity feed is not yet implemented.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SellerDetails;
