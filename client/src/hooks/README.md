# 🎣 **Hooks Package**

This folder contains **Custom React Hooks** that encapsulate reusable stateful logic for your Nayagara multi-selling platform.

## 📁 **Directory Structure**

```
hooks/
├── customer/          # Customer-specific hooks
├── seller/           # Seller-specific hooks
├── admin/            # Admin-specific hooks
├── shared/           # Shared hooks across all roles
└── README.md         # This file
```

## 🎯 **What are Custom Hooks?**

Custom hooks are JavaScript functions that:
- Start with "use" (e.g., `useCart`, `useAuth`)
- Can call other React hooks inside them
- Allow you to extract and reuse component logic
- Share stateful logic between multiple components

## 📚 **Example Files (Learning Purpose)**

- `_example_useCart.js` - Shopping cart management hook
- `_example_useProducts.js` - Seller product management hook
- `_example_useApi.js` - API calls with loading states

*Note: Files starting with `_example_` are for learning and won't affect your project.*

## 🏗 **How to Create a Hook**

1. **Create the file:** `hooks/customer/useWishlist.js`
2. **Write the hook:**
   ```javascript
   import { useState, useCallback } from 'react';

   export const useWishlist = () => {
     const [wishlist, setWishlist] = useState([]);

     const addToWishlist = useCallback((product) => {
       setWishlist(prev => [...prev, product]);
     }, []);

     const removeFromWishlist = useCallback((productId) => {
       setWishlist(prev => prev.filter(item => item.id !== productId));
     }, []);

     return { wishlist, addToWishlist, removeFromWishlist };
   };
   ```

3. **Use in components:**
   ```javascript
   import { useWishlist } from '../hooks/customer/useWishlist';

   function ProductCard({ product }) {
     const { addToWishlist } = useWishlist();

     return (
       <button onClick={() => addToWishlist(product)}>
         Add to Wishlist
       </button>
     );
   }
   ```

## 💡 **Hook Ideas for Your Platform**

### **Customer Hooks:**
- `useCart` - Shopping cart management
- `useWishlist` - Wishlist functionality
- `useCheckout` - Checkout process logic
- `useSearch` - Product search with filters
- `useReviews` - Product reviews and ratings

### **Seller Hooks:**
- `useProducts` - Product CRUD operations
- `useOrders` - Order management
- `useAnalytics` - Sales analytics data
- `useInventory` - Stock management
- `useCustomers` - Customer management

### **Admin Hooks:**
- `useUsers` - User management
- `useModeration` - Content moderation
- `useSystemStats` - System health metrics
- `useSettings` - System configuration

### **Shared Hooks:**
- `useAuth` - Authentication logic
- `useApi` - API calls with loading states
- `useLocalStorage` - Local storage management
- `useDebounce` - Debouncing for search inputs
- `useWindowSize` - Responsive design helpers

## ✅ **Benefits of Custom Hooks**

1. **Reusability** - Use same logic in multiple components
2. **Separation of Concerns** - Keep components focused on UI
3. **Testability** - Test business logic separately
4. **Performance** - Optimize re-renders with proper dependencies
5. **Maintainability** - Centralized logic is easier to update

## 🚀 **Getting Started**

1. Look at the example files to understand the pattern
2. Identify repeated logic in your components
3. Extract that logic into a custom hook
4. Import and use the hook in your components
5. Test the hook thoroughly

Remember: Custom hooks are just functions that use other hooks. They help you organize and reuse your React logic!