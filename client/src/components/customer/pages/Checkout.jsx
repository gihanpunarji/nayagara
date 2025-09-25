import React, { useState } from 'react';
import {
  MapPin, CreditCard, Truck, Shield, Check, ChevronLeft,
  Plus, Edit, Trash2, Lock, AlertCircle, Gift, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

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

  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'Kasun Perera',
      address: '123 Galle Road, Colombo 03',
      phone: '+94 77 123 4567',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'Kasun Perera',
      address: '456 Business Center, Colombo 07',
      phone: '+94 77 123 4567',
      isDefault: false
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex',
      icon: CreditCard,
      processing_fee: 0
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: MapPin,
      processing_fee: 0
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      description: 'PayPal, Google Pay',
      icon: Shield,
      processing_fee: 2
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
    { id: 1, title: 'Shipping Address', completed: currentStep > 1 },
    { id: 2, title: 'Payment Method', completed: currentStep > 2 },
    { id: 3, title: 'Review Order', completed: false }
  ];

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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Select Delivery Address</h3>

      <div className="space-y-4 mb-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => setSelectedAddress(address.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedAddress === address.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{address.type}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900">{address.name}</p>
                <p className="text-gray-600">{address.address}</p>
                <p className="text-gray-600">{address.phone}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center space-x-2 text-primary-600 font-medium hover:text-primary-700 transition-colors mb-6">
        <Plus className="w-4 h-4" />
        <span>Add New Address</span>
      </button>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          disabled={!selectedAddress}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Payment
        </button>
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
    const selectedAddr = addresses.find(addr => addr.id === selectedAddress);
    const selectedPay = paymentMethods.find(pay => pay.id === selectedPayment);

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

        {/* Delivery Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Change
            </button>
          </div>

          {selectedAddr && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedAddr.name}</p>
              <p className="text-gray-600">{selectedAddr.address}</p>
              <p className="text-gray-600">{selectedAddr.phone}</p>
            </div>
          )}
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