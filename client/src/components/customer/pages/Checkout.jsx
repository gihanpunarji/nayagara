import React, { useState } from 'react';
import {
  MapPin, CreditCard, Truck, Shield, Check, ChevronLeft,
  Plus, Edit, Trash2, Lock, AlertCircle, Gift, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(false);

  // Location data (in future, this will come from database)
  const locationData = {
    provinces: [
      {
        id: 'western',
        name: 'Western Province',
        districts: [
          {
            id: 'colombo',
            name: 'Colombo',
            cities: ['Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 04', 'Colombo 05', 'Colombo 06', 'Colombo 07', 'Colombo 08', 'Kelaniya', 'Maharagama', 'Nugegoda', 'Battaramulla', 'Mount Lavinia']
          },
          {
            id: 'gampaha',
            name: 'Gampaha',
            cities: ['Gampaha', 'Negombo', 'Ja-Ela', 'Wattala', 'Minuwangoda', 'Kiribathgoda', 'Kadawatha']
          },
          {
            id: 'kalutara',
            name: 'Kalutara',
            cities: ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Aluthgama']
          }
        ]
      },
      {
        id: 'central',
        name: 'Central Province',
        districts: [
          {
            id: 'kandy',
            name: 'Kandy',
            cities: ['Kandy', 'Peradeniya', 'Gampola', 'Nawalapitiya']
          },
          {
            id: 'matale',
            name: 'Matale',
            cities: ['Matale', 'Dambulla', 'Sigiriya']
          },
          {
            id: 'nuwara-eliya',
            name: 'Nuwara Eliya',
            cities: ['Nuwara Eliya', 'Hatton', 'Talawakelle']
          }
        ]
      },
      {
        id: 'southern',
        name: 'Southern Province',
        districts: [
          {
            id: 'galle',
            name: 'Galle',
            cities: ['Galle', 'Hikkaduwa', 'Unawatuna', 'Bentota']
          },
          {
            id: 'matara',
            name: 'Matara',
            cities: ['Matara', 'Weligama', 'Mirissa']
          },
          {
            id: 'hambantota',
            name: 'Hambantota',
            cities: ['Hambantota', 'Tangalle', 'Tissamaharama']
          }
        ]
      }
    ]
  };

  // Address form states
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    district: '',
    postalCode: '',
    province: '',
    country: 'Sri Lanka'
  });

  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    district: '',
    postalCode: '',
    province: '',
    country: 'Sri Lanka'
  });

  // Mock data
  const cartItems = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      price: 385000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      seller: 'TechZone Lanka'
    },
    {
      id: 2,
      name: 'Gaming Laptop RTX 4070',
      price: 425000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      seller: 'Gamer Hub'
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex, Local Bank Cards',
      icon: CreditCard,
      processing_fee: 0
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 500;
  const processingFee = selectedPayment ? paymentMethods.find(p => p.id === selectedPayment)?.processing_fee || 0 : 0;
  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === 'percentage' ? (subtotal * appliedPromo.value / 100) : appliedPromo.value;
  }
  const total = subtotal + shippingCost + processingFee - discount;

  const steps = [
    { id: 1, title: 'Addresses', completed: currentStep > 1 },
    { id: 2, title: 'Payment Method', completed: currentStep > 2 },
    { id: 3, title: 'Review Order', completed: false }
  ];

  // Handle address form updates
  const handleBillingAddressChange = (field, value) => {
    let newBillingAddress = { ...billingAddress, [field]: value };

    // Reset dependent fields when parent changes
    if (field === 'province') {
      newBillingAddress = { ...newBillingAddress, district: '', city: '' };
    } else if (field === 'district') {
      newBillingAddress = { ...newBillingAddress, city: '' };
    }

    setBillingAddress(newBillingAddress);

    // If "same as billing" is checked, update shipping address too
    if (sameAsBilling) {
      setShippingAddress(newBillingAddress);
    }
  };

  const handleShippingAddressChange = (field, value) => {
    let newShippingAddress = { ...shippingAddress, [field]: value };

    // Reset dependent fields when parent changes
    if (field === 'province') {
      newShippingAddress = { ...newShippingAddress, district: '', city: '' };
    } else if (field === 'district') {
      newShippingAddress = { ...newShippingAddress, city: '' };
    }

    setShippingAddress(newShippingAddress);
  };

  const handleSameAsBillingChange = (checked) => {
    setSameAsBilling(checked);
    if (checked) {
      setShippingAddress({ ...billingAddress });
    }
  };

  // Helper functions for cascading dropdowns
  const getDistrictsForProvince = (provinceId) => {
    const province = locationData.provinces.find(p => p.id === provinceId);
    return province ? province.districts : [];
  };

  const getCitiesForDistrict = (provinceId, districtId) => {
    const province = locationData.provinces.find(p => p.id === provinceId);
    if (!province) return [];
    const district = province.districts.find(d => d.id === districtId);
    return district ? district.cities : [];
  };

  const isAddressValid = (address) => {
    return address.line1 && address.city && address.district && address.postalCode && address.province;
  };

  const canProceedFromAddresses = () => {
    return isAddressValid(billingAddress) && (sameAsBilling || isAddressValid(shippingAddress));
  };

  const applyPromoCode = () => {
    const promoCodes = {
      'SAVE10': { type: 'percentage', value: 10, description: '10% off on orders above Rs. 50,000' },
      'NEWUSER': { type: 'fixed', value: 5000, description: 'Rs. 5,000 off for new users' }
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(promoCodes[promoCode.toUpperCase()]);
    }
  };

  const StepIndicator = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed
                  ? 'bg-primary-500 text-white'
                  : currentStep === step.id
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step.completed ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === step.id ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 ${
                step.completed ? 'bg-primary-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const AddressStep = () => (
    <div className="space-y-6">
      {/* Billing Address */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
            <input
              type="text"
              value={billingAddress.line1}
              onChange={(e) => handleBillingAddressChange('line1', e.target.value)}
              placeholder="House/Building number, Street name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input
              type="text"
              value={billingAddress.line2}
              onChange={(e) => handleBillingAddressChange('line2', e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value="Sri Lanka"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
            <select
              value={billingAddress.province}
              onChange={(e) => handleBillingAddressChange('province', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Province</option>
              {locationData.provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
            <select
              value={billingAddress.district}
              onChange={(e) => handleBillingAddressChange('district', e.target.value)}
              disabled={!billingAddress.province}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select District</option>
              {getDistrictsForProvince(billingAddress.province).map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <select
              value={billingAddress.city}
              onChange={(e) => handleBillingAddressChange('city', e.target.value)}
              disabled={!billingAddress.district}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select City</option>
              {getCitiesForDistrict(billingAddress.province, billingAddress.district).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <input
              type="text"
              value={billingAddress.postalCode}
              onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
              placeholder="Enter postal code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => handleSameAsBillingChange(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Same as billing address</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
            <input
              type="text"
              value={shippingAddress.line1}
              onChange={(e) => handleShippingAddressChange('line1', e.target.value)}
              placeholder="House/Building number, Street name"
              disabled={sameAsBilling}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input
              type="text"
              value={shippingAddress.line2}
              onChange={(e) => handleShippingAddressChange('line2', e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
              disabled={sameAsBilling}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value="Sri Lanka"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
            <select
              value={shippingAddress.province}
              onChange={(e) => handleShippingAddressChange('province', e.target.value)}
              disabled={sameAsBilling}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Province</option>
              {locationData.provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
            <select
              value={shippingAddress.district}
              onChange={(e) => handleShippingAddressChange('district', e.target.value)}
              disabled={sameAsBilling || !shippingAddress.province}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select District</option>
              {getDistrictsForProvince(shippingAddress.province).map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <select
              value={shippingAddress.city}
              onChange={(e) => handleShippingAddressChange('city', e.target.value)}
              disabled={sameAsBilling || !shippingAddress.district}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select City</option>
              {getCitiesForDistrict(shippingAddress.province, shippingAddress.district).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <input
              type="text"
              value={shippingAddress.postalCode}
              onChange={(e) => handleShippingAddressChange('postalCode', e.target.value)}
              placeholder="Enter postal code"
              disabled={sameAsBilling}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>

      <div className="space-y-4 mb-6">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedPayment === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{method.name}</p>
                  <p className="text-gray-600">{method.description}</p>
                  {method.processing_fee > 0 && (
                    <p className="text-sm text-amber-600">
                      Processing fee: Rs. {method.processing_fee}
                    </p>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedPayment === method.id
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPayment === method.id && (
                    <Check className="w-3 h-3 text-white mx-auto mt-0.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Address
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          disabled={!selectedPayment}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Review Order
        </button>
      </div>
    </div>
  );

  const ReviewStep = () => {
    const selectedPay = paymentMethods.find(pay => pay.id === selectedPayment);

    const formatAddress = (address) => {
      // Get readable names from IDs
      const province = locationData.provinces.find(p => p.id === address.province);
      const district = province?.districts.find(d => d.id === address.district);

      const parts = [
        address.line1,
        address.line2,
        address.city,
        district?.name,
        province?.name,
        address.postalCode,
        address.country
      ].filter(Boolean);
      return parts.join(', ');
    };

    return (
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Sold by {item.seller}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-primary-600">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing & Shipping Addresses */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Addresses</h3>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Change
            </button>
          </div>

          <div className="space-y-4">
            {/* Billing Address */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Billing Address</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{formatAddress(billingAddress)}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Shipping Address
                {sameAsBilling && (
                  <span className="text-sm text-gray-500 font-normal"> (Same as billing)</span>
                )}
              </h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{formatAddress(shippingAddress)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Change
            </button>
          </div>

          {selectedPay && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedPay.name}</p>
              <p className="text-gray-600">{selectedPay.description}</p>
            </div>
          )}
        </div>

        {/* Place Order */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Payment
          </button>
          <button
            onClick={() => navigate('/order-success')}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Place Order</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <StepIndicator />

            {currentStep === 1 && <AddressStep />}
            {currentStep === 2 && <PaymentStep />}
            {currentStep === 3 && <ReviewStep />}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Price Details</h3>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        {appliedPromo.description}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rs. {shippingCost.toLocaleString()}</span>
                </div>
                {processingFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Processing Fee</span>
                    <span>Rs. {processingFee.toLocaleString()}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              {currentStep < 3 && (
                <div className="mb-6">
                  {currentStep === 1 && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!canProceedFromAddresses()}
                      className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Continue to Payment
                    </button>
                  )}
                  {currentStep === 2 && (
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={!selectedPayment}
                      className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Review Order
                    </button>
                  )}
                </div>
              )}

              {/* Place Order Button for Final Step */}
              {currentStep === 3 && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      // Handle order placement
                      alert('Order placed successfully!');
                    }}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Secure Checkout</p>
                    <p className="text-xs text-green-600">Your payment information is protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;