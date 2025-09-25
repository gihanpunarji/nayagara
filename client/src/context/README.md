# 🌐 **Context Package**

This folder contains **React Contexts** that provide global state management for your Nayagara multi-selling platform.

## 📁 **What is React Context?**

React Context is a way to pass data through the component tree without having to pass props down manually at every level. It's perfect for:
- User authentication state
- Shopping cart data
- Theme preferences
- Language settings
- Notification system

## 🎯 **Context vs Props vs State**

| **Local State** | **Props** | **Context** |
|----------------|-----------|-------------|
| Single component | Parent to child | Global access |
| `useState` | Manual passing | Automatic access |
| Component-level | Limited levels | Any component |

## 📚 **Example Files (Learning Purpose)**

- `_example_AuthContext.jsx` - Global authentication state
- `_example_NotificationContext.jsx` - Toast notification system

*Note: Files starting with `_example_` are for learning and won't affect your project.*

## 🏗 **How to Create a Context**

### **1. Create the Context File**

```javascript
// context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    itemCount: cart.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
```

### **2. Wrap Your App**

```javascript
// App.js or main.jsx
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <YourAppComponents />
    </CartProvider>
  );
}
```

### **3. Use in Components**

```javascript
// Any component
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const isInCart = cart.some(item => item.id === product.id);

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>
        {isInCart ? 'In Cart ✓' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

## 💡 **Context Ideas for Your Platform**

### **Essential Contexts:**

1. **AuthContext** - User authentication
   ```javascript
   const { user, login, logout, isAuthenticated } = useAuth();
   ```

2. **CartContext** - Shopping cart management
   ```javascript
   const { cart, addToCart, removeFromCart, total } = useCart();
   ```

3. **NotificationContext** - Toast messages
   ```javascript
   const { showSuccess, showError, showInfo } = useNotification();
   ```

4. **ThemeContext** - UI theme management
   ```javascript
   const { theme, toggleTheme, isDark } = useTheme();
   ```

### **Advanced Contexts:**

5. **SellerContext** - Seller-specific data
   ```javascript
   const { sellerProfile, products, orders } = useSeller();
   ```

6. **AdminContext** - Admin panel data
   ```javascript
   const { users, systemStats, pendingApprovals } = useAdmin();
   ```

7. **LanguageContext** - Multi-language support
   ```javascript
   const { language, setLanguage, t } = useLanguage();
   ```

## ⚡ **Performance Considerations**

### **Context Optimization Tips:**

1. **Split Contexts** - Don't put everything in one context
   ```javascript
   // Good: Separate concerns
   <AuthProvider>
     <CartProvider>
       <NotificationProvider>
         <App />
       </NotificationProvider>
     </CartProvider>
   </AuthProvider>
   ```

2. **Memoize Values** - Prevent unnecessary re-renders
   ```javascript
   const value = useMemo(() => ({
     user,
     login,
     logout
   }), [user]);
   ```

3. **Use useCallback** - For function values
   ```javascript
   const addToCart = useCallback((product) => {
     setCart(prev => [...prev, product]);
   }, []);
   ```

## 🚨 **Common Mistakes to Avoid**

❌ **Don't do this:**
```javascript
// Creating context without error checking
export const useCart = () => useContext(CartContext);
```

✅ **Do this instead:**
```javascript
// Always check if context exists
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

❌ **Don't put everything in one context:**
```javascript
// Too much in one context
const AppContext = createContext({
  user, cart, notifications, theme, language, products, orders...
});
```

✅ **Split into focused contexts:**
```javascript
// Separate contexts for different concerns
<AuthProvider>
  <CartProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </CartProvider>
</AuthProvider>
```

## 🎯 **When to Use Context**

### **Use Context when:**
- ✅ Data is needed by many components at different levels
- ✅ You're prop-drilling (passing props through many levels)
- ✅ The state is truly global (user auth, theme, cart)
- ✅ The data doesn't change very frequently

### **Don't use Context when:**
- ❌ Only 2-3 components need the data
- ❌ The state changes very frequently (performance issues)
- ❌ You can easily pass props through 1-2 levels
- ❌ The data is only needed in one part of your app

## 🚀 **Getting Started**

1. **Identify Global State** - What data needs to be accessed by many components?
2. **Create Context** - Start with one context (like AuthContext)
3. **Wrap Your App** - Add the Provider around your app
4. **Use the Context** - Import and use the custom hook in components
5. **Test Thoroughly** - Make sure the context works as expected

Remember: Context is powerful but use it wisely. Not everything needs to be global state!