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
  saving 
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
              rows={3}
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleInputChange}
              placeholder="Describe your store and products"
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

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
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

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await api.put('/seller/profile', formData);

      if (response.data.success) {
        setProfileData(response.data.user);
        // Show success message or notification here
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





  const PaymentSettings = () => (
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
                  defaultValue="Bank of Ceylon"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  defaultValue="****1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  defaultValue="Supun Perera"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                <input
                  type="text"
                  defaultValue="001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Preferences */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Withdrawal Amount
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Rs. 10,000</option>
                  <option>Rs. 25,000</option>
                  <option>Rs. 50,000</option>
                  <option>Rs. 100,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto Withdrawal
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="autoWithdrawal"
                      value="weekly"
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">Weekly</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="autoWithdrawal"
                      value="monthly"
                      className="text-primary-600 focus:ring-primary-500"
                      defaultChecked
                    />
                    <span className="text-sm">Monthly</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="autoWithdrawal"
                      value="manual"
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">Manual</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Save className="w-4 h-4" />
          <span>Save Payment Settings</span>
        </button>
      </div>
    </div>
  );

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
      />;
      case 'payment': return <PaymentSettings />;
      default: return <ProfileSettings 
        loading={loading} 
        error={error} 
        profileData={profileData} 
        formData={formData} 
        handleInputChange={handleInputChange} 
        handleSaveChanges={handleSaveChanges} 
        handleProfilePictureUpload={handleProfilePictureUpload}
        saving={saving} 
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