// 🛒 EXAMPLE: Customer Cart Calculation Utilities
// This shows how to create customer-specific utility functions
// Usage: import { calculateCartTotal, calculateShipping } from '../utils/customer/cartCalculations';

// Calculate cart subtotal
export const calculateCartSubtotal = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 0;
  }

  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);
};

// Calculate shipping cost based on various factors
export const calculateShipping = (cartItems, deliveryInfo = {}) => {
  const {
    location = 'Other',
    weight = 0,
    totalValue = 0,
    expressDelivery = false,
    freeShippingThreshold = 50000 // Rs. 50,000
  } = deliveryInfo;

  // Free shipping for orders above threshold
  if (totalValue >= freeShippingThreshold) {
    return { cost: 0, type: 'Free Shipping', reason: 'Order above Rs. 50,000' };
  }

  // Base shipping rates by location (in Rs.)
  const locationRates = {
    'Colombo': 500,
    'Gampaha': 750,
    'Kalutara': 750,
    'Kandy': 1000,
    'Galle': 1200,
    'Matara': 1500,
    'Jaffna': 2000,
    'Other': 1000
  };

  let baseCost = locationRates[location] || locationRates['Other'];

  // Weight-based additional charges (per kg above 2kg)
  if (weight > 2) {
    const extraWeight = weight - 2;
    baseCost += Math.ceil(extraWeight) * 200; // Rs. 200 per extra kg
  }

  // Express delivery surcharge
  if (expressDelivery) {
    baseCost += 1000; // Additional Rs. 1,000 for express
  }

  return {
    cost: baseCost,
    type: expressDelivery ? 'Express Delivery' : 'Standard Delivery',
    breakdown: {
      base: locationRates[location] || locationRates['Other'],
      weightSurcharge: weight > 2 ? Math.ceil(weight - 2) * 200 : 0,
      expressSurcharge: expressDelivery ? 1000 : 0
    }
  };
};

// Calculate total cart value with all charges
export const calculateCartTotal = (cartItems, deliveryInfo = {}, promoCode = null) => {
  const subtotal = calculateCartSubtotal(cartItems);
  const shipping = calculateShipping(cartItems, { ...deliveryInfo, totalValue: subtotal });

  let discount = 0;
  let discountInfo = null;

  // Apply promo code discount
  if (promoCode) {
    const discountResult = calculateDiscount(subtotal, promoCode);
    discount = discountResult.amount;
    discountInfo = discountResult;
  }

  const total = subtotal + shipping.cost - discount;

  return {
    subtotal,
    shipping,
    discount,
    discountInfo,
    total: Math.max(0, total), // Ensure total is never negative
    summary: {
      itemCount: cartItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0),
      savings: discount,
      finalAmount: Math.max(0, total)
    }
  };
};

// Calculate promo code discount
export const calculateDiscount = (subtotal, promoCode) => {
  // Example promo codes (in real app, this would come from API)
  const promoCodes = {
    'WELCOME10': {
      type: 'percentage',
      value: 10,
      minOrder: 10000,
      maxDiscount: 5000,
      description: '10% off on orders above Rs. 10,000 (max Rs. 5,000)'
    },
    'SAVE5000': {
      type: 'fixed',
      value: 5000,
      minOrder: 25000,
      description: 'Rs. 5,000 off on orders above Rs. 25,000'
    },
    'NEWUSER': {
      type: 'percentage',
      value: 15,
      minOrder: 5000,
      maxDiscount: 3000,
      description: '15% off for new users (max Rs. 3,000)'
    }
  };

  const promo = promoCodes[promoCode.toUpperCase()];

  if (!promo) {
    return {
      valid: false,
      amount: 0,
      message: 'Invalid promo code'
    };
  }

  if (subtotal < promo.minOrder) {
    return {
      valid: false,
      amount: 0,
      message: `Minimum order of Rs. ${promo.minOrder.toLocaleString()} required`
    };
  }

  let discountAmount = 0;

  if (promo.type === 'percentage') {
    discountAmount = (subtotal * promo.value) / 100;
    if (promo.maxDiscount) {
      discountAmount = Math.min(discountAmount, promo.maxDiscount);
    }
  } else if (promo.type === 'fixed') {
    discountAmount = promo.value;
  }

  return {
    valid: true,
    amount: discountAmount,
    code: promoCode.toUpperCase(),
    description: promo.description,
    savings: discountAmount
  };
};

// Calculate item-wise discounts
export const calculateItemDiscounts = (cartItems) => {
  return cartItems.map(item => {
    const originalPrice = parseFloat(item.originalPrice || item.price) || 0;
    const currentPrice = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;

    const itemDiscount = originalPrice - currentPrice;
    const totalItemDiscount = itemDiscount * quantity;
    const discountPercentage = originalPrice > 0 ? (itemDiscount / originalPrice) * 100 : 0;

    return {
      ...item,
      discountPerItem: itemDiscount,
      totalDiscount: totalItemDiscount,
      discountPercentage: Math.round(discountPercentage),
      savings: totalItemDiscount
    };
  });
};

// Check if free shipping is close
export const checkFreeShippingProgress = (cartTotal, threshold = 50000) => {
  const remaining = threshold - cartTotal;

  if (remaining <= 0) {
    return {
      qualified: true,
      message: 'You qualify for free shipping!',
      remaining: 0
    };
  }

  const percentage = (cartTotal / threshold) * 100;

  return {
    qualified: false,
    remaining,
    percentage: Math.min(percentage, 100),
    message: `Add Rs. ${remaining.toLocaleString()} more to get free shipping`
  };
};

// Calculate estimated delivery date
export const calculateDeliveryDate = (location = 'Other', expressDelivery = false) => {
  const now = new Date();

  // Delivery days by location
  const deliveryDays = {
    'Colombo': expressDelivery ? 1 : 2,
    'Gampaha': expressDelivery ? 1 : 2,
    'Kalutara': expressDelivery ? 1 : 3,
    'Kandy': expressDelivery ? 2 : 4,
    'Galle': expressDelivery ? 2 : 4,
    'Matara': expressDelivery ? 3 : 5,
    'Jaffna': expressDelivery ? 3 : 6,
    'Other': expressDelivery ? 3 : 5
  };

  const days = deliveryDays[location] || deliveryDays['Other'];
  const deliveryDate = new Date(now);
  deliveryDate.setDate(deliveryDate.getDate() + days);

  return {
    days,
    date: deliveryDate,
    formattedDate: deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    isExpress: expressDelivery
  };
};

// 🎯 USAGE EXAMPLES:
/*
import {
  calculateCartTotal,
  calculateDiscount,
  checkFreeShippingProgress,
  calculateDeliveryDate
} from '../utils/customer/cartCalculations';

function ShoppingCart() {
  const [cartItems] = useState([
    { id: 1, name: 'Phone', price: 25000, quantity: 1, weight: 0.5 },
    { id: 2, name: 'Laptop', price: 85000, quantity: 1, weight: 2.5 }
  ]);

  const [deliveryInfo] = useState({
    location: 'Colombo',
    expressDelivery: false
  });

  const [promoCode] = useState('WELCOME10');

  const cartCalculation = calculateCartTotal(cartItems, deliveryInfo, promoCode);
  const freeShippingStatus = checkFreeShippingProgress(cartCalculation.subtotal);
  const deliveryEstimate = calculateDeliveryDate(deliveryInfo.location, deliveryInfo.expressDelivery);

  return (
    <div>
      <h3>Order Summary</h3>
      <p>Subtotal: Rs. {cartCalculation.subtotal.toLocaleString()}</p>

      {cartCalculation.shipping.cost > 0 ? (
        <p>Shipping: Rs. {cartCalculation.shipping.cost.toLocaleString()}</p>
      ) : (
        <p>Shipping: Free!</p>
      )}

      {cartCalculation.discount > 0 && (
        <p>Discount: -Rs. {cartCalculation.discount.toLocaleString()}</p>
      )}

      <h4>Total: Rs. {cartCalculation.total.toLocaleString()}</h4>

      {!freeShippingStatus.qualified && (
        <div className="free-shipping-progress">
          <p>{freeShippingStatus.message}</p>
          <div className="progress-bar">
            <div style={{width: `${freeShippingStatus.percentage}%`}} />
          </div>
        </div>
      )}

      <p>Estimated delivery: {deliveryEstimate.formattedDate}</p>
    </div>
  );
}

function PromoCodeInput() {
  const [code, setCode] = useState('');
  const [subtotal] = useState(30000);

  const handleApplyCode = () => {
    const result = calculateDiscount(subtotal, code);

    if (result.valid) {
      alert(`Discount applied! You save Rs. ${result.amount.toLocaleString()}`);
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter promo code"
      />
      <button onClick={handleApplyCode}>Apply</button>
    </div>
  );
}
*/