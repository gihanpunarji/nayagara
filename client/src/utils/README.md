# 🔧 **Utils Package**

This folder contains **Utility Functions** - pure functions that perform common tasks across your Nayagara multi-selling platform.

## 📁 **Directory Structure**

```
utils/
├── customer/          # Customer-specific utilities
├── seller/           # Seller-specific utilities
├── admin/            # Admin-specific utilities
├── shared/           # Shared utilities across all roles
└── README.md         # This file
```

## 🎯 **What are Utility Functions?**

Utility functions are **pure functions** that:
- Take input and return output (no side effects)
- Don't modify external state
- Are predictable and testable
- Can be reused across multiple components
- Perform common operations like formatting, validation, calculations

## 📚 **Example Files (Learning Purpose)**

- `_example_formatters.js` - Format currency, dates, numbers
- `_example_validators.js` - Form validation functions
- `_example_cartCalculations.js` - Shopping cart calculations

*Note: Files starting with `_example_` are for learning and won't affect your project.*

## 🏗 **How to Create Utility Functions**

### **1. Create the Utility File**

```javascript
// utils/shared/formatters.js
export const formatCurrency = (amount, currency = 'LKR') => {
  if (amount == null || isNaN(amount)) return 'Rs. 0.00';

  const num = parseFloat(amount);

  if (currency === 'LKR') {
    return `Rs. ${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(num);
};

export const formatDate = (date, style = 'medium') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'short' ? 'short' : 'long',
    day: 'numeric'
  });
};
```

### **2. Use in Components**

```javascript
import { formatCurrency, formatDate } from '../utils/shared/formatters';

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatCurrency(product.price)}</p>
      <small>Added {formatDate(product.createdAt)}</small>
    </div>
  );
}
```

## 💡 **Utility Categories for Your Platform**

### **📊 Formatters (`shared/formatters.js`)**
```javascript
formatCurrency(25000)           // "Rs. 25,000.00"
formatDate('2024-01-15')        // "January 15, 2024"
formatPhoneNumber('0771234567') // "077 123 4567"
formatFileSize(1048576)         // "1 MB"
truncateText(text, 50)          // "This is a long text..."
```

### **✅ Validators (`shared/validators.js`)**
```javascript
validateEmail('user@example.com')     // { valid: true }
validatePassword('Password123')       // { valid: true }
validatePhoneNumber('0771234567')     // { valid: true }
validatePrice(25000)                  // { valid: true }
```

### **🛒 Customer Utils (`customer/cartCalculations.js`)**
```javascript
calculateCartTotal(cartItems)         // { subtotal, shipping, total }
calculateShipping(items, location)    // { cost, type, breakdown }
calculateDiscount(subtotal, promoCode) // { valid, amount, message }
checkFreeShippingProgress(total)      // { qualified, remaining, percentage }
```

### **📦 Seller Utils (`seller/productHelpers.js`)**
```javascript
generateSKU(category, name)           // "ELE-IPH-001"
calculateProfit(cost, price)         // { profit, margin }
validateProductData(productData)     // { valid, errors }
formatInventoryStatus(stock)         // "Low Stock", "In Stock", etc.
```

### **⚙️ Admin Utils (`admin/systemHelpers.js`)**
```javascript
calculateSystemStats(users, orders)  // { totalUsers, totalRevenue }
generateReport(data, type)           // Excel/PDF report data
validateSystemHealth(metrics)        // Health score and alerts
formatUserActivity(logs)             // Formatted activity data
```

## 🎯 **Pure Functions Best Practices**

### **✅ Good Utility Function:**
```javascript
// Pure function - predictable, testable
export const calculateTax = (amount, taxRate = 0.15) => {
  if (amount <= 0) return 0;
  return amount * taxRate;
};

// Usage
const tax = calculateTax(1000, 0.15); // Always returns 150
```

### **❌ Avoid Side Effects:**
```javascript
// Not a utility function - has side effects
export const updateCartTotal = (cart) => {
  cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);
  localStorage.setItem('cart', JSON.stringify(cart)); // Side effect!
  return cart;
};
```

### **✅ Better Approach:**
```javascript
// Pure utility function
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((sum, item) => sum + item.price, 0);
};

// Use in component/hook where side effects belong
const updateCart = () => {
  const newTotal = calculateCartTotal(cart.items);
  setCart(prev => ({ ...prev, total: newTotal }));
  localStorage.setItem('cart', JSON.stringify(cart));
};
```

## 🧪 **Testing Utility Functions**

Utilities are easy to test because they're pure functions:

```javascript
// utils/shared/formatters.test.js
import { formatCurrency, validateEmail } from './formatters';

test('formatCurrency formats LKR correctly', () => {
  expect(formatCurrency(25000)).toBe('Rs. 25,000.00');
  expect(formatCurrency(0)).toBe('Rs. 0.00');
  expect(formatCurrency(null)).toBe('Rs. 0.00');
});

test('validateEmail validates correctly', () => {
  expect(validateEmail('user@example.com').valid).toBe(true);
  expect(validateEmail('invalid-email').valid).toBe(false);
  expect(validateEmail('').valid).toBe(false);
});
```

## 📂 **Recommended File Structure**

```
utils/
├── shared/
│   ├── formatters.js          # Format currency, dates, numbers
│   ├── validators.js          # Form validation functions
│   ├── constants.js           # App-wide constants
│   ├── storage.js            # LocalStorage helpers
│   └── api.js                # API configuration
├── customer/
│   ├── cartCalculations.js   # Cart math functions
│   ├── productFilters.js     # Product filtering logic
│   └── addressHelpers.js     # Address formatting/validation
├── seller/
│   ├── productHelpers.js     # Product management utilities
│   ├── orderProcessing.js    # Order processing logic
│   └── analyticsCalculations.js # Analytics math
└── admin/
    ├── userManagement.js     # User management helpers
    ├── systemHealth.js       # System monitoring utilities
    └── reportGeneration.js   # Report generation logic
```

## ⚡ **Performance Tips**

1. **Keep Functions Small** - One responsibility per function
2. **Avoid Heavy Computations** - Cache results if needed
3. **Use Memoization** - For expensive calculations
4. **Type Checking** - Handle edge cases (null, undefined, wrong types)

```javascript
// Good: Handle edge cases
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return 'Rs. 0.00';
  // ... rest of function
};

// Good: Memoization for expensive operations
const memoizedCalculation = (function() {
  const cache = new Map();

  return function expensiveCalculation(input) {
    if (cache.has(input)) {
      return cache.get(input);
    }

    const result = /* expensive calculation */;
    cache.set(input, result);
    return result;
  };
})();
```

## 🚀 **Getting Started**

1. **Identify Repeated Logic** - Look for functions you copy/paste
2. **Extract Pure Functions** - Move calculations and formatting to utils
3. **Group by Domain** - Customer, seller, admin, or shared
4. **Write Tests** - Easy to test since they're pure functions
5. **Document Well** - Add JSDoc comments for complex functions

```javascript
/**
 * Calculates shipping cost based on location and weight
 * @param {Object[]} items - Array of cart items
 * @param {string} location - Delivery location
 * @param {boolean} expressDelivery - Whether express delivery is selected
 * @returns {Object} Shipping cost breakdown
 */
export const calculateShipping = (items, location, expressDelivery = false) => {
  // Implementation here
};
```

Remember: Utility functions should be the reliable, predictable building blocks of your application!