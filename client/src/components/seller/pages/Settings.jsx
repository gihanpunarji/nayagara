import { useState, useEffect } from 'react';
import {
  User,
  CreditCard,
  Save,
  Camera
} from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import api from '../../../api/axios';

// 🟢 FIX: Move components outside to prevent recreation
const TabButton = ({ tab, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab.key)}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
      activeTab === tab.key
        ? 'bg-primary-100 text-primary-700 border-primary-200'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <tab.icon className="w-5 h-5" />
    <span className="font-medium">{tab.label}</span>
  </button>
);

const ProfileSettings = ({ 
  loading, 
  error, 
  profileData, 
  formData, 
  handleInputChange, 
  handleSaveChanges, 
  handleProfilePictureUpload,
  saving,
  businessAddress,
  adminMobile,
  bankFormData,
  handleBankInputChange
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

        {/* Profile Picture */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            {profileData.profile_image ? (
              <img
                src={`http://localhost:5001${profileData.profile_image}`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData.first_name ? profileData.first_name.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 bg-white border-2 border-gray-300 rounded-full p-1 hover:bg-gray-50 transition-colors cursor-pointer">
              <Camera className="w-4 h-4 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-600">Click the camera icon to update your profile picture</p>
            <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed as it's your unique identifier</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleInputChange}
              placeholder="Enter your store name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
            <textarea
              rows={6}
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleInputChange}
              placeholder="Describe your store and products"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
            <input
              type="text"
              value={businessAddress ? `${businessAddress.line1 || ''}${businessAddress.line2 ? ', ' + businessAddress.line2 : ''}${businessAddress.postal_code ? ', ' + businessAddress.postal_code : ''}${businessAddress.city_name ? ', ' + businessAddress.city_name : ''}${businessAddress.district_name ? ', ' + businessAddress.district_name : ''}${businessAddress.province_name ? ', ' + businessAddress.province_name : ''}${businessAddress.country_name ? ', ' + businessAddress.country_name : ''}` : 'No address provided'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
            <div className="mt-2">
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                onClick={() => adminMobile && window.open(`tel:${adminMobile}`, '_self')}
              >
                Request Address Change {adminMobile && `(${adminMobile})`}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bank Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={bankFormData.bankName}
              onChange={handleBankInputChange}
              placeholder="Enter bank name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={bankFormData.accountNumber}
              onChange={handleBankInputChange}
              placeholder="Enter account number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <input
              type="text"
              name="holderName"
              value={bankFormData.holderName}
              onChange={handleBankInputChange}
              placeholder="Enter account holder name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Code</label>
            <input
              type="text"
              name="bankCode"
              value={bankFormData.bankCode}
              onChange={handleBankInputChange}
              placeholder="Enter bank code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
            <input
              type="text"
              name="branchName"
              value={bankFormData.branchName}
              onChange={handleBankInputChange}
              placeholder="Enter branch name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button 
          onClick={handleSaveChanges}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
};

// 🟢 FIX: Move PaymentSettings outside to prevent recreation
const PaymentSettings = ({ loading, error, bankFormData, handleBankInputChange, handleSaveBankDetails, saving }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bank details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Settings</h2>

        <div className="space-y-6">
          {/* Bank Account */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Bank Account Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={bankFormData.bankName}
                  onChange={handleBankInputChange}
                  placeholder="Enter bank name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankFormData.accountNumber}
                  onChange={handleBankInputChange}
                  placeholder="Enter account number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  name="holderName"
                  value={bankFormData.holderName}
                  onChange={handleBankInputChange}
                  placeholder="Enter account holder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Code</label>
                <input
                  type="text"
                  name="bankCode"
                  value={bankFormData.bankCode}
                  onChange={handleBankInputChange}
                  placeholder="Enter bank code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  value={bankFormData.branchName}
                  onChange={handleBankInputChange}
                  placeholder="Enter branch name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button 
          onClick={handleSaveBankDetails}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Bank Details'}</span>
        </button>
      </div>
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [businessAddress, setBusinessAddress] = useState(null);
  const [adminMobile, setAdminMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    nic: '',
    storeName: '',
    storeDescription: ''
  });

  const [bankFormData, setBankFormData] = useState({
    bankName: '',
    accountNumber: '',
    holderName: '',
    bankCode: '',
    branchName: ''
  });

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  const fetchSellerProfile = async () => {
    try {
      const response = await api.get('/seller/profile');
      
      if (response.data.success) {
        setProfileData(response.data.user);
        
        // Set form data with fetched values
        setFormData({
          firstName: response.data.user.first_name || '',
          lastName: response.data.user.last_name || '',
          email: response.data.user.user_email || '',
          mobile: response.data.user.user_mobile || '',
          nic: response.data.user.nic || '',
          storeName: response.data.store?.store_name || '',
          storeDescription: response.data.store?.store_description || ''
        });
        
        // Set business address and admin mobile
        setBusinessAddress(response.data.businessAddress);
        setAdminMobile(response.data.adminMobile);
        
        // Bank details are included in the profile response
        if (response.data.bankDetails) {
          setBankFormData({
            bankName: response.data.bankDetails.bank_name || '',
            accountNumber: response.data.bankDetails.account_number || '',
            holderName: response.data.bankDetails.holder_name || '',
            bankCode: response.data.bankDetails.bank_code || '',
            branchName: response.data.bankDetails.branch_name || ''
          });
        }
        
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to connect to server');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    
    setBankFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await api.put('/seller/profile', formData);

      if (response.data.success) {
        setProfileData(response.data.user);
        console.log('Profile updated successfully');
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBankDetails = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await api.put('/seller/payment', bankFormData);

      if (response.data.success) {
        // Update bank form data if bank details are returned
        if (response.data.bankDetails) {
          setBankFormData({
            bankName: response.data.bankDetails.bank_name || '',
            accountNumber: response.data.bankDetails.account_number || '',
            holderName: response.data.bankDetails.holder_name || '',
            bankCode: response.data.bankDetails.bank_code || '',
            branchName: response.data.bankDetails.branch_name || ''
          });
        }
        console.log('Bank details updated successfully');
      } else {
        setError(response.data.message || 'Failed to update bank details');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update bank details');
      console.error('Bank details update error:', error);
    } finally {
      setSaving(false);
    }
  };


  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post('/seller/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setProfileData(response.data.user);
        console.log('Profile picture updated successfully');
      } else {
        setError(response.data.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload profile picture');
      console.error('Profile picture upload error:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'payment', label: 'Payment', icon: CreditCard }
  ];






  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings 
        loading={loading} 
        error={error} 
        profileData={profileData} 
        formData={formData} 
        handleInputChange={handleInputChange} 
        handleSaveChanges={handleSaveChanges} 
        handleProfilePictureUpload={handleProfilePictureUpload}
        saving={saving}
        businessAddress={businessAddress}
        adminMobile={adminMobile}
        bankFormData={bankFormData}
        handleBankInputChange={handleBankInputChange}
      />;
      case 'payment': return <PaymentSettings 
        loading={loading} 
        error={error} 
        bankFormData={bankFormData} 
        handleBankInputChange={handleBankInputChange} 
        handleSaveBankDetails={handleSaveBankDetails} 
        saving={saving} 
      />;
      default: return <ProfileSettings 
        loading={loading} 
        error={error} 
        profileData={profileData} 
        formData={formData} 
        handleInputChange={handleInputChange} 
        handleSaveChanges={handleSaveChanges} 
        handleProfilePictureUpload={handleProfilePictureUpload}
        saving={saving}
        businessAddress={businessAddress}
        adminMobile={adminMobile}
        bankFormData={bankFormData}
        handleBankInputChange={handleBankInputChange}
      />;
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <TabButton key={tab.key} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Settings;