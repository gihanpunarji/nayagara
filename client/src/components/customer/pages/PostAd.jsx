import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Home, MapPin, Phone, Camera, CreditCard, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import VehicleAdForm from '../ads/VehicleAdForm';
import PropertyAdForm from '../ads/PropertyAdForm';

const PostAd = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    is_negotiable: false,
    contact_number: '',
    location_city: '',
    location_district: '',
    images: [],
    ad_type: '',
    package_type: 'standard',
    vehicle_data: {},
    property_data: {}
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/post-ad');
      return;
    }

    // Load districts
    fetchDistricts();
  }, [isAuthenticated, navigate]);

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/address/districts');
      const data = await response.json();
      if (data.success) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchCities = async (districtId) => {
    try {
      const response = await fetch(`/api/address/cities/${districtId}`);
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const adCategories = {
    'Vehicles': {
      subcategories: ['Cars', 'Motorcycles', 'Three Wheelers', 'Commercial Vehicles', 'Boats'],
      ad_type: 'vehicle'
    },
    'Property': {
      subcategories: ['Houses', 'Land', 'Apartments', 'Commercial Property', 'Rooms'],
      ad_type: 'property'
    }
  };

  const packageOptions = [
    {
      type: 'standard',
      name: 'Standard',
      price: 0,
      duration: '30 days',
      features: ['Basic listing', 'Standard placement'],
      badge: null
    },
    {
      type: 'urgent',
      name: 'Urgent',
      price: 500,
      duration: '30 days',
      features: ['Priority placement', 'Urgent badge', 'Higher visibility'],
      badge: 'URGENT'
    },
    {
      type: 'featured',
      name: 'Featured',
      price: 1000,
      duration: '45 days',
      features: ['Top placement', 'Featured badge', 'Maximum visibility', 'Homepage featuring'],
      badge: 'FEATURED'
    }
  ];

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: '',
      ad_type: adCategories[category]?.ad_type || ''
    }));
  };

  const handleDistrictChange = (districtId) => {
    setFormData(prev => ({
      ...prev,
      location_district: districtId,
      location_city: ''
    }));

    if (districtId) {
      fetchCities(districtId);
    } else {
      setCities([]);
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.description) newErrors.description = 'Description is required';
    }

    if (stepNumber === 2) {
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.contact_number) newErrors.contact_number = 'Contact number is required';
      if (!formData.location_district) newErrors.location_district = 'District is required';
      if (!formData.location_city) newErrors.location_city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/advertisements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        navigate('/account?tab=my-ads');
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to post advertisement' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">What are you advertising?</h2>
        <p className="text-gray-600 mt-2">Choose a category and provide basic details</p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(adCategories).map(category => (
          <div
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.category === category
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4">
              {category === 'Vehicles' ? (
                <Car className="w-8 h-8 text-blue-600" />
              ) : (
                <Home className="w-8 h-8 text-green-600" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{category}</h3>
                <p className="text-sm text-gray-600">
                  {adCategories[category].subcategories.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

      {/* Subcategory */}
      {formData.category && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Subcategory <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.subcategory}
            onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.subcategory ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Subcategory</option>
            {adCategories[formData.category]?.subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory}</p>}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter a descriptive title"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your item in detail"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Price & Contact Details</h2>
        <p className="text-gray-600 mt-2">Set your price and contact information</p>
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Price (Rs.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            min="0"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input
            type="checkbox"
            id="negotiable"
            checked={formData.is_negotiable}
            onChange={(e) => setFormData(prev => ({ ...prev, is_negotiable: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="negotiable" className="text-sm text-gray-700">
            Price is negotiable
          </label>
        </div>
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.contact_number}
          onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.contact_number ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="077xxxxxxx"
        />
        {errors.contact_number && <p className="text-red-500 text-sm">{errors.contact_number}</p>}
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            District <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.location_district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.location_district ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
          {errors.location_district && <p className="text-red-500 text-sm">{errors.location_district}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.location_city}
            onChange={(e) => setFormData(prev => ({ ...prev, location_city: e.target.value }))}
            disabled={!formData.location_district}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.location_city ? 'border-red-500' : 'border-gray-300'
            } ${!formData.location_district ? 'bg-gray-100' : ''}`}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.city_id} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
          {errors.location_city && <p className="text-red-500 text-sm">{errors.location_city}</p>}
        </div>
      </div>

      {/* Category Specific Fields */}
      {formData.ad_type === 'vehicle' && formData.subcategory && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <VehicleAdForm
            subcategory={formData.subcategory}
            vehicleData={formData.vehicle_data}
            onChange={(data) => setFormData(prev => ({ ...prev, vehicle_data: data }))}
            errors={errors}
          />
        </div>
      )}

      {formData.ad_type === 'property' && formData.subcategory && (
        <div className="mt-6 pt-6 border-gray-200">
          <PropertyAdForm
            subcategory={formData.subcategory}
            propertyData={formData.property_data}
            onChange={(data) => setFormData(prev => ({ ...prev, property_data: data }))}
            errors={errors}
          />
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Package</h2>
        <p className="text-gray-600 mt-2">Select how you want your ad to be displayed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packageOptions.map(pkg => (
          <div
            key={pkg.type}
            onClick={() => setFormData(prev => ({ ...prev, package_type: pkg.type }))}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all relative ${
              formData.package_type === pkg.type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {pkg.badge && (
              <span className={`absolute -top-2 left-4 px-2 py-1 text-xs font-bold rounded ${
                pkg.type === 'urgent' ? 'bg-orange-500 text-white' : 'bg-purple-500 text-white'
              }`}>
                {pkg.badge}
              </span>
            )}

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
              <div className="my-4">
                <span className="text-3xl font-bold text-blue-600">Rs. {pkg.price}</span>
                <p className="text-sm text-gray-600">{pkg.duration}</p>
              </div>

              <ul className="space-y-2 text-sm text-gray-600">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Important Notice</p>
            <p className="text-yellow-700 mt-1">
              We do not take any responsibility for payments done online. Don't share any OTPs.
              Always verify the item and person before making any payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post Your Advertisement</h1>
          <p className="text-gray-600 mt-2">Reach thousands of potential buyers</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map(num => (
              <React.Fragment key={num}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-0.5 ${
                    step > num ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isSubmitting ? 'Posting...' : 'Post Advertisement'}</span>
              </button>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm mt-4 text-center">{errors.submit}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAd;