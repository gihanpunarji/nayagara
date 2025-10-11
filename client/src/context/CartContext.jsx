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
      console.error('Error loading cart from localStorage:', error);
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
      console.error('Error saving cart to localStorage:', error);
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
        console.log("cart from api", response.data.items);
        
      }
    } catch (error) {
      console.error('Error loading cart from API:', error);
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
      console.error('Error adding item to API:', error);
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
        image: product.images ? (
          typeof product.images === 'string' ? 
            product.images.split(',')[0].trim() : 
            (Array.isArray(product.images) ? product.images[0]?.image_url || product.images[0] : product.images)
        ) : (product.image || null),
        seller: product.seller_name || product.seller || 'Unknown Seller',
        seller_id: product.seller_id,
        category: product.category,
        subcategory: product.sub_category_name || product.subCategory,
        location: product.city_name || product.location,
        inStock: (product.stock_quantity !== undefined && product.stock_quantity > 0) || product.stock_quantity === undefined,
        stockCount: product.stock_quantity || 999
      };

      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.product_id === productId);
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
        console.error('Error removing item from API:', error);
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
        console.error('Error updating quantity in API:', error);
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
        console.error('Error clearing cart from API:', error);
      }
    } else {
      localStorage.removeItem('nayagara_cart');
    }
  }, [isAuthenticated, user]);


  // Load cart from localStorage for guest users or from API for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromAPI();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user, loadCartFromAPI, loadCartFromLocalStorage]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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