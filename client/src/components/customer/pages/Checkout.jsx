import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  MapPin, CreditCard, Truck, Shield, Check, ChevronLeft,
  Plus, Edit, Trash2, Lock, AlertCircle, Gift, Tag
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';

// StepIndicator Component - moved outside to prevent re-renders
const StepIndicator = memo(({ steps, currentStep }) => (
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
));

// AddressStep Component - moved outside to prevent re-renders
const AddressStep = memo(({ 
  billingAddress, 
  shippingAddress, 
  sameAsBilling, 
  provinces, 
  districts, 
  cities, 
  userAddresses, 
  loadingAddress, 
  savingAddress, 
  updateBillingLine1, 
  updateBillingLine2, 
  updateBillingPostalCode, 
  updateShippingLine1, 
  updateShippingLine2, 
  updateShippingPostalCode, 
  handleBillingAddressChange, 
  handleShippingAddressChange, 
  handleSameAsBillingChange, 
  handleProvinceChange, 
  handleDistrictChange, 
  saveCurrentAddress, 
  setAddressAsDefault,
  isAuthenticated, 
  isAddressValid 
}) => (
  <div className="space-y-6">
    {loadingAddress && (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">Loading your saved addresses...</span>
        </div>
      </div>
    )}
    
    {/* Saved Addresses */}
    {userAddresses.length > 0 && !loadingAddress && (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userAddresses.map((address) => (
            <div
              key={address.address_id}
              onClick={async () => {
                const formattedAddress = {
                  line1: address.line1 || '',
                  line2: address.line2 || '',
                  city: address.city_name || '',
                  district: address.district_name || '',
                  postalCode: address.postal_code || '',
                  province: address.province_name || '',
                  country: address.country_name || 'Sri Lanka'
                };
                
                // Load districts and cities first to prevent re-renders
                if (address.province_id) {
                  await handleProvinceChange(address.province_id, 'billing');
                  if (address.district_id) {
                    await handleDistrictChange(address.district_id, 'billing');
                  }
                }
                
                // Set the billing address
                handleBillingAddressChange('line1', formattedAddress.line1);
                handleBillingAddressChange('line2', formattedAddress.line2);
                handleBillingAddressChange('city', formattedAddress.city);
                handleBillingAddressChange('district', formattedAddress.district);
                handleBillingAddressChange('postalCode', formattedAddress.postalCode);
                handleBillingAddressChange('province', formattedAddress.province);
                
                // Set shipping address to same data and enable same as billing checkbox
                handleShippingAddressChange('line1', formattedAddress.line1);
                handleShippingAddressChange('line2', formattedAddress.line2);
                handleShippingAddressChange('city', formattedAddress.city);
                handleShippingAddressChange('district', formattedAddress.district);
                handleShippingAddressChange('postalCode', formattedAddress.postalCode);
                handleShippingAddressChange('province', formattedAddress.province);
                handleSameAsBillingChange(true);
                setAddressSelected(true);
              }}
              className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {address.address_type?.replace('_', ' ').toUpperCase() || 'Address'}
                    {address.is_default === 1 && (
                      <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded">Default</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city_name}, {address.district_name}, {address.province_name}
                  </p>
                  <p className="text-sm text-gray-600">{address.postal_code}</p>
                  
                  {/* Set as Default Checkbox */}
                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      id={`default-${address.address_id}`}
                      checked={address.is_default === 1}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked && address.is_default !== 1) {
                          setAddressAsDefault(address.address_id);
                        }
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`default-${address.address_id}`} className="ml-2 text-sm text-gray-600">
                      Set as default address
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Billing Address */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Billing Address</h3>
        {isAuthenticated && isAddressValid(billingAddress) && (
          <button
            onClick={saveCurrentAddress}
            disabled={savingAddress}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {savingAddress ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Save Address</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
          <input
            type="text"
            value={billingAddress.line1}
            onChange={updateBillingLine1}
            placeholder="House/Building number, Street name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoComplete="address-line1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input
            type="text"
            value={billingAddress.line2}
            onChange={updateBillingLine2}
            placeholder="Apartment, suite, etc. (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoComplete="address-line2"
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
            onChange={(e) => handleProvinceChange(e.target.value, 'billing')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            value={billingAddress.district}
            onChange={(e) => handleDistrictChange(e.target.value, 'billing')}
            disabled={!billingAddress.province}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            value={billingAddress.city}
            onChange={(e) => handleBillingAddressChange('city', e.target.value)}
            disabled={!billingAddress.district}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
          <input
            type="text"
            value={billingAddress.postalCode}
            onChange={updateBillingPostalCode}
            placeholder="Enter postal code"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoComplete="postal-code"
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
            onChange={updateShippingLine1}
            placeholder="House/Building number, Street name"
            disabled={sameAsBilling}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoComplete="shipping address-line1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <input
            type="text"
            value={shippingAddress.line2}
            onChange={updateShippingLine2}
            placeholder="Apartment, suite, etc. (optional)"
            disabled={sameAsBilling}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoComplete="shipping address-line2"
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
            onChange={(e) => handleProvinceChange(e.target.value, 'shipping')}
            disabled={sameAsBilling}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            value={shippingAddress.district}
            onChange={(e) => handleDistrictChange(e.target.value, 'shipping')}
            disabled={sameAsBilling || !shippingAddress.province}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            value={shippingAddress.city}
            onChange={(e) => handleShippingAddressChange('city', e.target.value)}
            disabled={sameAsBilling || !shippingAddress.district}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
          <input
            type="text"
            value={shippingAddress.postalCode}
            onChange={updateShippingPostalCode}
            placeholder="Enter postal code"
            disabled={sameAsBilling}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            autoComplete="shipping postal-code"
          />
        </div>
      </div>
    </div>
  </div>
));

// PaymentStep Component - moved outside to prevent re-renders
const PaymentStep = memo(({ selectedPayment, setSelectedPayment, paymentMethods, setCurrentStep }) => (
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
));

// ReviewStep Component - moved outside to prevent re-renders
const ReviewStep = memo(({ 
  cartItems, 
  billingAddress, 
  shippingAddress, 
  sameAsBilling, 
  selectedPayment, 
  paymentMethods, 
  setCurrentStep,
  navigate,
  handlePlaceOrder,
  processingPayment
}) => {
  const selectedPay = paymentMethods.find(pay => pay.id === selectedPayment);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

        <div className="space-y-4">
          {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
            
            <div key={item.product_id || item.id || Math.random()} className="flex items-center space-x-4">
              
              <img
                src={
                  item.images[0] ||'/placeholder-product.jpg'
                }
                alt={item.product_title || item.name || item.title || 'Product'}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{
                  item.product_title || 
                  item.name || 
                  item.title || 
                  'Product'
                }</p>
                <p className="text-sm text-gray-600">Sold by {
                  item.seller_name || 
                  (typeof item.seller === 'string' ? item.seller : item.seller?.name) || 
                  'Nayagara'
                }</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
              </div>
              <p className="font-bold text-primary-600">
                Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
              </p>
            </div>
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No items in cart</p>
            </div>
          )}
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
              <p className="text-gray-700">
                {[
                  billingAddress.line1,
                  billingAddress.line2,
                  billingAddress.city,
                  billingAddress.district,
                  billingAddress.province,
                  billingAddress.postalCode
                ].filter(Boolean).join(', ')}
              </p>
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
              <p className="text-gray-700">
                {[
                  shippingAddress.line1,
                  shippingAddress.line2,
                  shippingAddress.city,
                  shippingAddress.district,
                  shippingAddress.province,
                  shippingAddress.postalCode
                ].filter(Boolean).join(', ')}
              </p>
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

        {selectedPay ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{selectedPay.name}</p>
            <p className="text-gray-600">{selectedPay.description}</p>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No payment method selected</p>
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
          onClick={handlePlaceOrder}
          disabled={processingPayment}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {processingPayment ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Place Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const { items: cartItems = [], subtotal = 0, total = 0, itemCount = 0, shipping: shippingCost = 0 } = location.state || {};

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const processingFee = 30;
  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === 'percentage' ? (subtotal * appliedPromo.value / 100) : appliedPromo.value;
  }
  const finalTotal = subtotal + shippingCost + processingFee - discount;

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);

  // Load functions inlined into handlers

  const loadUserAddresses = useCallback(async () => {
    setLoadingAddress(true);
    try {
      const response = await api.get('/address/user');
      if (response.data.success && response.data.data.length > 0) {
        setUserAddresses(response.data.data);
        
        // Load the first/default address if available
        const defaultAddress = response.data.data.find(addr => addr.is_default) || response.data.data[0];
        if (defaultAddress) {
          const formattedAddress = {
            line1: defaultAddress.line1 || '',
            line2: defaultAddress.line2 || '',
            city: defaultAddress.city_name || defaultAddress.city_id || '',
            district: defaultAddress.district_id || '',
            postalCode: defaultAddress.postal_code || '',
            province: defaultAddress.province_id || '',
            country: defaultAddress.country || 'Sri Lanka'
          };
          
          setBillingAddress(formattedAddress);
          setShippingAddress(formattedAddress);
          setSameAsBilling(true);
          
          // Load districts and cities for the saved address using direct API calls
          if (defaultAddress.province_id) {
            try {
              const districtResponse = await api.get(`/address/districts/${defaultAddress.province_id}`);
              if (districtResponse.data.success) {
                setDistricts(districtResponse.data.data);
              }
              if (defaultAddress.district_id) {
                const cityResponse = await api.get(`/address/cities/${defaultAddress.district_id}`);
                if (cityResponse.data.success) {
                  setCities(cityResponse.data.data);
                }
              }
            } catch (error) {
              console.error('Error loading location data:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading user addresses:', error);
    } finally {
      setLoadingAddress(false);
    }
  }, []); // No dependencies to prevent re-renders

  // Separate useEffect for provinces - runs only once
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesResponse = await api.get('/address/provinces');
        if (provincesResponse.data.success) {
          setProvinces(provincesResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []); // No dependencies - runs only once

  // Separate useEffect for user addresses - only when auth changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserAddresses();
    }
  }, [isAuthenticated, user]); // Remove loadUserAddresses dependency


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

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex, Local Bank Cards',
      icon: CreditCard,
      processing_fee: 0
    }
  ];

  const steps = [
    { id: 1, title: 'Addresses', completed: currentStep > 1 },
    { id: 2, title: 'Payment Method', completed: currentStep > 2 },
    { id: 3, title: 'Review Order', completed: false }
  ];

  // Ultra-simple handlers - absolutely no complexity
  const updateBillingLine1 = (e) => {
    setAddressSelected(false);
    setBillingAddress(prev => ({ ...prev, line1: e.target.value }));
  };

  const updateBillingLine2 = (e) => {
    setAddressSelected(false);
    setBillingAddress(prev => ({ ...prev, line2: e.target.value }));
  };

  const updateBillingPostalCode = (e) => {
    setAddressSelected(false);
    setBillingAddress(prev => ({ ...prev, postalCode: e.target.value }));
  };

  const updateShippingLine1 = (e) => {
    setAddressSelected(false);
    setShippingAddress(prev => ({ ...prev, line1: e.target.value }));
  };

  const updateShippingLine2 = (e) => {
    setAddressSelected(false);
    setShippingAddress(prev => ({ ...prev, line2: e.target.value }));
  };

  const updateShippingPostalCode = (e) => {
    setAddressSelected(false);
    setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }));
  };

  // Generic handler for selects (province, district, city)
  const handleBillingAddressChange = (field, value) => {
    // Reset address selected flag when manually changing fields
    setAddressSelected(false);
    
    setBillingAddress(prev => {
      const newAddress = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes (only for selects)
      if (field === 'province') {
        newAddress.district = '';
        newAddress.city = '';
      } else if (field === 'district') {
        newAddress.city = '';
      }
      
      return newAddress;
    });

    // If "same as billing" is checked, update shipping address too
    if (sameAsBilling) {
      setShippingAddress(prev => {
        const newAddress = { ...prev, [field]: value };
        
        if (field === 'province') {
          newAddress.district = '';
          newAddress.city = '';
        } else if (field === 'district') {
          newAddress.city = '';
        }
        
        return newAddress;
      });
    }
  };

  // Remove these - replaced by simple functions above

  const handleShippingAddressChange = (field, value) => {
    // Reset address selected flag when manually changing fields
    setAddressSelected(false);
    
    setShippingAddress(prev => {
      const newAddress = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes (only for selects)
      if (field === 'province') {
        newAddress.district = '';
        newAddress.city = '';
      } else if (field === 'district') {
        newAddress.city = '';
      }
      
      return newAddress;
    });
  };

  const handleSameAsBillingChange = useCallback((checked) => {
    setSameAsBilling(checked);
    if (checked) {
      // Use current billing address state
      setShippingAddress(() => ({
        ...billingAddress
      }));
    }
  }, [billingAddress]);

  // Province and district change handlers with direct API calls
  const handleProvinceChange = useCallback(async (provinceId, addressType) => {
    // Update address state using the regular handlers
    if (addressType === 'billing') {
      handleBillingAddressChange('province', provinceId);
    } else {
      handleShippingAddressChange('province', provinceId);
    }

    // Then load related data with direct API calls
    if (provinceId) {
      setCities([]); // Clear cities first
      try {
        const response = await api.get(`/address/districts/${provinceId}`);
        if (response.data.success) {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    } else {
      setDistricts([]);
      setCities([]);
    }
  }, []);

  const handleDistrictChange = useCallback(async (districtId, addressType) => {
    // Update address state using the regular handlers
    if (addressType === 'billing') {
      handleBillingAddressChange('district', districtId);
    } else {
      handleShippingAddressChange('district', districtId);
    }

    // Then load cities with direct API calls
    if (districtId) {
      try {
        const response = await api.get(`/address/cities/${districtId}`);
        if (response.data.success) {
          setCities(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    } else {
      setCities([]);
    }
  }, []);

  const isAddressValid = useCallback((address) => {
    return address.line1 && address.city && address.district && address.postalCode && address.province;
  }, []);

  const canProceedFromAddresses = useCallback(() => {
    // Can proceed if: address is selected from saved addresses OR form is manually filled and valid
    return addressSelected || (isAddressValid(billingAddress) && (sameAsBilling || isAddressValid(shippingAddress)));
  }, [addressSelected, billingAddress, sameAsBilling, shippingAddress, isAddressValid]);

  const saveCurrentAddress = useCallback(async () => {
    // Use current state values directly
    const currentBilling = billingAddress;
    const currentCities = cities;
    const currentUserAddresses = userAddresses;

    if (!isAuthenticated) {
      alert('Please log in to save address');
      return;
    }
    
    if (!isAddressValid(currentBilling)) {
      alert('Please fill in all required address fields');
      console.log('Current billing address:', currentBilling);
      return;
    }

    setSavingAddress(true);
    try {
      // Find the city_id from the selected city name
      const selectedCity = currentCities.find(city => city.city_name === currentBilling.city);
      if (!selectedCity) {
        throw new Error('Please select a valid city');
      }

      const response = await api.post('/address/user', {
        addressType: 'billing',
        line1: currentBilling.line1,
        line2: currentBilling.line2,
        postalCode: currentBilling.postalCode,
        cityId: selectedCity.city_id,
        isDefault: currentUserAddresses.length === 0 // Make it default if it's the first address
      });

      if (response.data.success) {
        // Reload user addresses
        await loadUserAddresses();
        alert('Address saved successfully!');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  }, [isAuthenticated, loadUserAddresses, billingAddress, cities, userAddresses, isAddressValid]);

  const setAddressAsDefault = useCallback(async (addressId) => {
    if (!isAuthenticated) {
      alert('Please log in to set default address');
      return;
    }

    try {
      // Get the current address data first
      const addressToUpdate = userAddresses.find(addr => addr.address_id === addressId);
      if (!addressToUpdate) return;

      const response = await api.put(`/address/user/${addressId}`, {
        line1: addressToUpdate.line1,
        line2: addressToUpdate.line2,
        postalCode: addressToUpdate.postal_code,
        cityId: addressToUpdate.city_id,
        isDefault: true
      });

      if (response.data.success) {
        // Reload user addresses to reflect the change
        await loadUserAddresses();
        alert('Default address updated successfully!');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address. Please try again.');
    }
  }, [isAuthenticated, userAddresses, loadUserAddresses]);

  const applyPromoCode = () => {
    const promoCodes = {
      'SAVE10': { type: 'percentage', value: 10, description: '10% off on orders above Rs. 50,000' },
      'NEWUSER': { type: 'fixed', value: 5000, description: 'Rs. 5,000 off for new users' }
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(promoCodes[promoCode.toUpperCase()]);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert('Please log in to place an order');
      return;
    }

    if (!canProceedFromAddresses()) {
      alert('Please complete the address information');
      return;
    }

    setProcessingPayment(true);

    try {
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      
      const orderAmount = subtotal + shippingCost + processingFee - discount;
      
      const itemsDescription = cartItems.map(item => 
        `${item.product_title || item.name} (Qty: ${item.quantity})`
      ).join(', ');

      const paymentData = {
        amount: orderAmount,
        currency: 'LKR',
        order_id: orderId,
        items: itemsDescription,
        first_name: user?.first_name || 'Customer',
        last_name: user?.last_name || 'User',
        email: user?.email || 'customer@example.com',
        phone: user?.phone || '0771234567',
        address: billingAddress.line1 || 'Address',
        city: billingAddress.city || 'Colombo',
        country: 'Sri Lanka'
      };
      
      // Validate required fields
      if (!paymentData.first_name || !paymentData.email || !orderAmount) {
        throw new Error('Missing required payment information');
      }

      // Debug: Log payment data being sent
      console.log('Sending payment data:', paymentData);
      
      // Get payment data from backend
      const response = await api.post('/payment/payhere/create', paymentData);
      console.log('Payment response:', response.data);
      
      if (response.data.success) {
        const paymentInfo = response.data.data;
        
        // Initialize PayHere payment
        window.payhere.startPayment({
          sandbox: true, // Set to false for production
          merchant_id: paymentInfo.merchant_id,
          return_url: paymentInfo.return_url,
          cancel_url: paymentInfo.cancel_url,
          notify_url: paymentInfo.notify_url,
          order_id: paymentInfo.order_id,
          items: paymentInfo.items,
          amount: paymentInfo.amount,
          currency: paymentInfo.currency,
          hash: paymentInfo.hash,
          first_name: paymentInfo.first_name,
          last_name: paymentInfo.last_name,
          email: paymentInfo.email,
          phone: paymentInfo.phone,
          address: paymentInfo.address,
          city: paymentInfo.city,
          country: paymentInfo.country
        });

        // PayHere event handlers
        window.payhere.onCompleted = async function onCompleted(paymentOrderId) {
          console.log("Payment completed. PayHere OrderID:" + paymentOrderId);
          
          try {
            // Save order to database after successful payment
            const orderData = {
              order_number: orderId, // Our generated order number
              cart_items: cartItems,
              shipping_address: shippingAddress,
              billing_address: billingAddress,
              subtotal: subtotal,
              shipping_cost: shippingCost,
              tax_amount: 0,
              discount_amount: discount,
              total_amount: orderAmount
            };

            console.log('Saving order to database:', orderData);
            
            // Create order in database
            const orderResponse = await api.post('/orders/create', orderData);
            
            if (orderResponse.data.success) {
              console.log('Order saved successfully:', orderResponse.data.data);
              
              // Update payment status
              await api.put('/orders/payment-status', {
                order_number: orderId,
                payment_status: 'completed',
                payment_id: paymentOrderId
              });

              console.log('Payment status updated successfully');
              
              setProcessingPayment(false);
              navigate('/order-success', { 
                state: { 
                  orderId: orderId,
                  paymentId: paymentOrderId,
                  amount: orderAmount,
                  cartItems: cartItems,
                  orderDetails: orderResponse.data.data
                } 
              });
            } else {
              throw new Error('Failed to save order');
            }
            
          } catch (error) {
            console.error('Error saving order:', error);
            setProcessingPayment(false);
            alert('Payment successful but failed to save order. Please contact support with Order ID: ' + paymentOrderId);
          }
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log("Payment dismissed");
          setProcessingPayment(false);
        };

        window.payhere.onError = function onError(error) {
          console.log("Error:" + error);
          setProcessingPayment(false);
          alert('Payment failed. Please try again.');
        };

      } else {
        throw new Error(response.data.message || 'Failed to create payment');
      }

    } catch (error) {
      console.error('Payment creation error:', error);
      console.error('Error details:', error.response?.data || error.message);
      setProcessingPayment(false);
      
      // Show more specific error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
      alert(`Payment Error: ${errorMessage}`);
    }
  };

  // StepIndicator moved outside - removed duplicate

  // Old AddressStep removed - now using external component

  // Old PaymentStep removed - now using external component

  // Old ReviewStep removed - now using external component

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
            <StepIndicator steps={steps} currentStep={currentStep} />

            {currentStep === 1 && (
              <AddressStep 
                billingAddress={billingAddress}
                shippingAddress={shippingAddress}
                sameAsBilling={sameAsBilling}
                provinces={provinces}
                districts={districts}
                cities={cities}
                userAddresses={userAddresses}
                loadingAddress={loadingAddress}
                savingAddress={savingAddress}
                updateBillingLine1={updateBillingLine1}
                updateBillingLine2={updateBillingLine2}
                updateBillingPostalCode={updateBillingPostalCode}
                updateShippingLine1={updateShippingLine1}
                updateShippingLine2={updateShippingLine2}
                updateShippingPostalCode={updateShippingPostalCode}
                handleBillingAddressChange={handleBillingAddressChange}
                handleShippingAddressChange={handleShippingAddressChange}
                handleSameAsBillingChange={handleSameAsBillingChange}
                handleProvinceChange={handleProvinceChange}
                handleDistrictChange={handleDistrictChange}
                saveCurrentAddress={saveCurrentAddress}
                setAddressAsDefault={setAddressAsDefault}
                isAuthenticated={isAuthenticated}
                isAddressValid={isAddressValid}
              />
            )}
            {currentStep === 2 && (
              <PaymentStep 
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                paymentMethods={paymentMethods}
                setCurrentStep={setCurrentStep}
              />
            )}
            {currentStep === 3 && (
              <ReviewStep 
                cartItems={cartItems}
                billingAddress={billingAddress}
                shippingAddress={shippingAddress}
                sameAsBilling={sameAsBilling}
                selectedPayment={selectedPayment}
                paymentMethods={paymentMethods}
                setCurrentStep={setCurrentStep}
                navigate={navigate}
                handlePlaceOrder={handlePlaceOrder}
                processingPayment={processingPayment}
              />
            )}
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
                  <span>Subtotal ({itemCount} items)</span>
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
                    <span>Rs. {finalTotal.toLocaleString()}</span>
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