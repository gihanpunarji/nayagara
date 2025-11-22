import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import api from '../../../api/axios'; // Assuming you have this configured
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/referrals/settings');
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/referrals/settings', { settings });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings.');
    }
  };

  if (loading) {
    return <Loader className="w-6 h-6 text-gray-400 animate-spin mx-auto" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">System Settings</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Gateway Fee (%)</label>
            <input
              type="number"
              name="payment_gateway_fee_percent"
              value={settings.payment_gateway_fee_percent || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Distributable Payout (%)</label>
            <input
              type="number"
              name="referral_total_payout_percent"
              value={settings.referral_total_payout_percent || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Referral Unlock Purchase Threshold</label>
            <input
              type="number"
              name="referral_unlock_purchase_threshold"
              value={settings.referral_unlock_purchase_threshold || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commission Model</label>
            <select
              name="referral_commission_model"
              value={settings.referral_commission_model || 'option1'}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

const UserReferralData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/referrals/users');
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <Loader className="w-6 h-6 text-gray-400 animate-spin mx-auto" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">User Referral Data</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchase</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Unlocked</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred By</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Link</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                  <div className="text-sm text-gray-500">ID: {user.user_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {parseFloat(user.total_purchase_amount).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.referral_link_unlocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.referral_link_unlocked ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.referred_by || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.referral_link_unlocked ? `nayagara.lk/register?ref=${user.user_id}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommissionTiers = () => {
  const [tiers, setTiers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await api.get('/admin/referrals/tiers');
        if (response.data.success) {
          setTiers(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch tiers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  const handleChange = (e) => {
    setTiers({ ...tiers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/referrals/tiers', { tiers });
      alert('Tiers updated successfully!');
    } catch (error) {
      console.error('Failed to update tiers:', error);
      alert('Failed to update tiers.');
    }
  };

  if (loading) {
    return <Loader className="w-6 h-6 text-gray-400 animate-spin mx-auto" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">Commission & Discount Tiers</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Scenario A (First Purchase)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">L1 Commission (%)</label>
            <input
              type="number"
              name="referral_l1_commission_percent"
              value={tiers.referral_l1_commission_percent || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">L2-8 Commission (%)</label>
            <input
              type="number"
              name="referral_l2_to_8_commission_percent"
              value={tiers.referral_l2_to_8_commission_percent || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">Scenario B (Subsequent Purchases)</h3>
        <h4 className="text-md font-semibold text-gray-600 mb-2">Buyer Discounts</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tier 1 (0-5000) (%)</label>
            <input
              type="number"
              name="referral_tier1_discount_percent"
              value={tiers.referral_tier1_discount_percent || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tier 2 (5001-10000) (max %)</label>
            <input
              type="number"
              name="referral_tier2_max_discount_percent"
              value={tiers.referral_tier2_max_discount_percent || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tier 3 (10000 +) (%)</label>
            <input
              type="number"
              name="referral_tier3_discount_percent"
              value={tiers.referral_tier3_discount_percent || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <h4 className="text-md font-semibold text-gray-600 mb-2">Referrer Commissions (Option 2)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tier 1: L1/L2-8 (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="referral_option2_tier1_l1_percent"
                value={tiers.referral_option2_tier1_l1_percent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <input
                type="number"
                name="referral_option2_tier1_l2_to_8_percent"
                value={tiers.referral_option2_tier1_l2_to_8_percent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tier 2 (max): L1/L2-8 (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="referral_option2_tier2_l1_max_percent"
                value={tiers.referral_option2_tier2_l1_max_percent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <input
                type="number"
                name="referral_option2_tier2_l2_to_8_max_percent"
                value={tiers.referral_option2_tier2_l2_to_8_max_percent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tier 3: L1/L2-8 (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="referral_option2_tier3_l1_percent"
                value={tiers.referral_option2_tier3_l1_percent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <input
                type="number"
                name="referral_option2_tier3_l2_to_8_percent"
                value={tiers.referral_option2_tier3_l2_to_8_percent || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Tiers
          </button>
        </div>
      </form>
    </div>
  );
};

const Referral = () => {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const fetchCommissionHistory = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/referrals/history?page=${page}&limit=${pagination.limit}`);
      if (response.data.success) {
        setHistory(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch commission history:", error);
      // You might want to add some error state to display to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionHistory(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCommissionHistory(newPage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Referral Management</h1>
        
        <SystemSettings />
        <UserReferralData />
        <CommissionTiers />

        {/* Commission History Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Commission Payout History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10">
                      <Loader className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">Loading history...</p>
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10">
                      <p className="text-sm text-gray-500">No commission history found.</p>
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.rewards_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.first_name} {item.last_name}</div>
                        <div className="text-sm text-gray-500">{item.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.order_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">L{item.level}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                        Rs. {parseFloat(item.reward_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && pagination.total > 0 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Referral;
