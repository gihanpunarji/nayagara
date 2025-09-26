import React, { useState, useEffect } from 'react';
import {
  Minus, Plus, Trash2, ArrowLeft, ShoppingBag,
  Truck, Shield, Clock, MapPin, AlertCircle, Tag, CreditCard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      price: 385000,
      originalPrice: 420000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      seller: 'TechZone Lanka',
      location: 'Colombo 07',
      shipping: 'Free Shipping',
      inStock: true,
      stockCount: 5,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Gaming Laptop RTX 4070',
      price: 425000,
      originalPrice: 485000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      seller: 'Gamer Hub',
      location: 'Nugegoda',
      shipping: 'Rs. 500',
      inStock: true,
      stockCount: 2,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Premium Basmati Rice 25kg',
      price: 4750,
      originalPrice: 5200,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      seller: 'Fresh Mart',
      location: 'Kelaniya',
      shipping: 'Same Day',
      inStock: false,
      stockCount: 0,
      category: 'Grocery'
    }
  ]);

  const [selectedItems, setSelectedItems] = useState(new Set([1, 2]));
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const navigate = useNavigate();

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(newQuantity, item.stockCount || newQuantity) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const moveToWishlist = (id) => {
    removeItem(id);
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id) && item.inStock);
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = selectedCartItems.reduce((sum, item) =>
    sum + ((item.originalPrice - item.price) * item.quantity), 0
  );
  const shippingCost = selectedCartItems.reduce((sum, item) => {
    if (item.shipping === 'Free Shipping' || item.shipping === 'Same Day') return sum;
    return sum + (item.shipping.includes('Rs.') ? parseInt(item.shipping.replace(/[^\d]/g, '')) : 0);
  }, 0);

  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === 'percentage'
      ? (subtotal * appliedPromo.value / 100)
      : appliedPromo.value;
  }

  const total = subtotal + shippingCost - discount;

  const applyPromoCode = () => {
    const promoCodes = {
      'SAVE10': { type: 'percentage', value: 10, description: '10% off on orders above Rs. 50,000' },
      'NEWUSER': { type: 'fixed', value: 5000, description: 'Rs. 5,000 off for new users' }
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(promoCodes[promoCode.toUpperCase()]);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-heading font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-500">{cartItems.length} items in your cart</p>
              </div>
            </div>
            <Link
              to="/shop"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-heading font-bold text-gray-900">Cart Items</h2>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === cartItems.filter(item => item.inStock).length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(new Set(cartItems.filter(item => item.inStock).map(item => item.id)));
                          } else {
                            setSelectedItems(new Set());
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>Select All</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className={`p-6 ${!item.inStock ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        disabled={!item.inStock}
                        className="mt-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                      />

                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Truck className="w-4 h-4" />
                                <span className="text-primary-600 font-medium">{item.shipping}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Sold by: {item.seller}</p>

                            {!item.inStock && (
                              <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-error" />
                                <span className="text-error text-sm font-medium">Out of Stock</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-gray-400 hover:text-error transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-primary-600">
                              Rs. {item.price.toLocaleString()}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                Rs. {item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {item.inStock && (
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stockCount}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {item.inStock && item.stockCount <= 5 && (
                          <p className="text-xs text-warning mt-2">
                            Only {item.stockCount} left in stock
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-heading font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
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
                  <div className="mt-2 p-2 bg-success bg-opacity-10 border border-success rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-success" />
                      <span className="text-sm text-success font-medium">
                        {appliedPromo.description}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedCartItems.length} items)</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `Rs. ${shippingCost.toLocaleString()}`}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-success">
                    <span>You Save</span>
                    <span>-Rs. {savings.toLocaleString()}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Promo Discount</span>
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

              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Your Benefits</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-primary-600" />
                    <span>Buyer Protection Guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-primary-600" />
                    <span>Fast & Secure Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span>Easy Returns & Refunds</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                disabled={selectedItems.size === 0}
                className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg font-bold hover:shadow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Checkout</span>
              </button>

              {selectedItems.size === 0 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Please select items to checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {cartItems.length === 0 && (
        <div className="max-w-md mx-auto text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-lg font-bold hover:shadow-green transition-all duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Start Shopping</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;