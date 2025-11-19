import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load cart from localStorage (guest users)
  const loadCartFromLocalStorage = useCallback(() => {
    try {
      setLoading(true);
      const savedCart = localStorage.getItem('nayagara_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage (guest users)
  const saveCartToLocalStorage = useCallback((cartItems) => {
    try {
      localStorage.setItem('nayagara_cart', JSON.stringify(cartItems));
    } catch (error) {
      // Silent fail for localStorage errors
    }
  }, []);

  // Load cart from API (authenticated users)
  const loadCartFromAPI = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        setCart(response.data.items || []);
      }
    } catch (error) {
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, loadCartFromLocalStorage]);

  // Add item to API (authenticated users)
  const addItemToAPI = useCallback(async (productId, quantity) => {
    if (!isAuthenticated || !user) return false;

    try {
      await api.post('/cart/add', { productId, quantity });
      return true;
    } catch (error) {
      return false;
    }
  }, [isAuthenticated, user]);

  // Add product to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    const productId = product.product_id || product.id;

    if (isAuthenticated && user) {
      // For authenticated users: add to database
      const success = await addItemToAPI(productId, quantity);
      if (success) {
        // Reload cart from API to get updated data
        await loadCartFromAPI();
      }
      return success;
    } else {
      // For guest users: add to localStorage
      const productTitle = product.product_title || product.name;
      const productPrice = parseFloat(product.price || 0);

      const cartItem = {
        id: productId,
        product_id: productId,
        name: productTitle,
        title: productTitle,
        price: productPrice,
        quantity: quantity,
        images: product.images ? (
          typeof product.images === 'string' ? 
            [product.images.split(',')[0].trim()] : 
            (Array.isArray(product.images) ? [product.images[0]?.image_url || product.images[0]] : [product.images])
        ) : (product.image ? [product.image] : []),
        seller: product.seller_name || product.seller || 'Unknown Seller',
        seller_id: product.seller_id,
        category: product.category,
        subcategory: product.sub_category_name || product.subCategory,
        location: product.city_name || product.location,
        inStock: (product.stock_quantity !== undefined && product.stock_quantity > 0) || product.stock_quantity === undefined,
        stockCount: product.stock_quantity || 999
      };

      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.product_id === productId || item.id === productId);
        let newCart;

        if (existingItemIndex > -1) {
          // Update quantity if item already exists
          newCart = prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item to cart
          newCart = [...prevCart, cartItem];
        }

        saveCartToLocalStorage(newCart);
        return newCart;
      });

      return true;
    }
  }, [isAuthenticated, user, addItemToAPI, loadCartFromAPI, saveCartToLocalStorage]);

  // Remove product from cart
  const removeFromCart = useCallback(async (productId) => {
    if (isAuthenticated && user) {
      // For authenticated users: remove from database
      try {
        await api.delete(`/cart/item/${productId}`);
        // Reload cart from API
        await loadCartFromAPI();
      } catch (error) {
        // Silent fail
      }
    } else {
      // For guest users: remove from localStorage
      setCart(prevCart => {
        const newCart = prevCart.filter(item => item.product_id !== productId && item.id !== productId);
        saveCartToLocalStorage(newCart);
        return newCart;
      });
    }
  }, [isAuthenticated, user, loadCartFromAPI, saveCartToLocalStorage]);

  // Update item quantity
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated && user) {
      // For authenticated users: update in database
      try {
        await api.put(`/cart/item/${productId}`, { quantity: newQuantity });
        // Reload cart from API
        await loadCartFromAPI();
      } catch (error) {
        // Silent fail
      }
    } else {
      // For guest users: update in localStorage
      setCart(prevCart => {
        const newCart = prevCart.map(item =>
          (item.product_id === productId || item.id === productId)
            ? { ...item, quantity: newQuantity }
            : item
        );
        saveCartToLocalStorage(newCart);
        return newCart;
      });
    }
  }, [isAuthenticated, user, removeFromCart, loadCartFromAPI, saveCartToLocalStorage]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setCart([]);
    
    // Clear from appropriate storage
    if (isAuthenticated && user) {
      try {
        await api.delete('/cart');
      } catch (error) {
        // Silent fail
      }
    } else {
      localStorage.removeItem('nayagara_cart');
    }
  }, [isAuthenticated, user]);

  // Merge guest cart with user cart when user logs in
  const mergeGuestCart = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    const guestCart = localStorage.getItem('nayagara_cart');
    if (guestCart) {
      try {
        const guestItems = JSON.parse(guestCart);
        if (guestItems.length > 0) {
          setLoading(true);
          // Merge with existing user cart
          await api.post('/cart/merge', { guestItems });
          // Clear guest cart from localStorage
          localStorage.removeItem('nayagara_cart');
          // Reload cart from API to show merged result
          await loadCartFromAPI();
        }
      } catch (error) {
        // Silent fail on merge error
      } finally {
        setLoading(false);
      }
    }
  }, [isAuthenticated, user, loadCartFromAPI]);

  // Call merge when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      mergeGuestCart();
    }
  }, [isAuthenticated, user, mergeGuestCart]);

  // Load cart from localStorage for guest users or from API for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromAPI();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user, loadCartFromAPI, loadCartFromLocalStorage]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price || 0);
    const quantity = parseInt(item.quantity || 0);
    return sum + (price * quantity);
  }, 0);
  const itemCount = cart.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

  // Calculate shipping (free over Rs. 50,000)
  const shipping = subtotal > 50000 ? 0 : 1000;
  const total = subtotal + shipping;

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return cart.some(item => item.product_id === productId || item.id === productId);
  }, [cart]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((productId) => {
    const item = cart.find(item => item.product_id === productId || item.id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  const value = {
    // State
    cart,
    loading,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCartFromAPI,
    mergeGuestCart,

    // Computed values
    subtotal,
    shipping,
    total,
    itemCount,
    isEmpty: cart.length === 0,

    // Utility functions
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};