import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  const addItemToAPI = useCallback(async (productId, quantity, variantId = null) => {
    if (!isAuthenticated || !user) return false;

    try {
      await api.post('/cart/add', { productId, quantity, variantId });
      return true;
    } catch (error) {
      return false;
    }
  }, [isAuthenticated, user]);

  // Add product to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    const productId = product.product_id || product.id;
    const selectedVariant = product.selectedVariant || null;
    const variantId = selectedVariant ? selectedVariant.variant_id : null;

    // Unique Item ID (Product ID or ProductID-VariantID)
    const itemId = variantId ? `${productId}-${variantId}` : productId;

    if (isAuthenticated && user) {
      // For authenticated users: add to database
      const success = await addItemToAPI(productId, quantity, variantId);
      if (success) {
        // Reload cart from API to get updated data
        await loadCartFromAPI();
      }
      return success;
    } else {
      // For guest users: add to localStorage
      const productTitle = product.product_title || product.name;

      // Determine price and image based on variant
      let price = parseFloat(product.price || 0);
      let image = product.image; // basic product image

      if (typeof product.images === 'string') {
        image = product.images.split(',')[0].trim();
      } else if (Array.isArray(product.images) && product.images.length > 0) {
        image = product.images[0]?.image_url || product.images[0];
      }

      if (selectedVariant) {
        if (selectedVariant.price) price = parseFloat(selectedVariant.price);
        if (selectedVariant.image_url) image = selectedVariant.image_url;
      }

      const cartItem = {
        id: itemId,
        product_id: productId,
        variant_id: variantId,
        name: productTitle,
        title: productTitle,
        price: price,
        quantity: quantity,
        weight_kg: parseFloat(product.weight_kg || 1.0),
        images: [image], // specific image
        image: image,
        seller: product.seller_name || product.seller || 'Unknown Seller',
        seller_id: product.seller_id,
        category: product.category,
        subcategory: product.sub_category_name || product.subCategory,
        location: product.city_name || product.location,
        inStock: true, // simplified
        stockCount: selectedVariant ? selectedVariant.stock_quantity : (product.stock_quantity || 999),
        attributes: selectedVariant && selectedVariant.attributes ? selectedVariant.attributes : {}
      };

      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.id === itemId);
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
  const removeFromCart = useCallback(async (itemId) => {
    if (isAuthenticated && user) {
      // For authenticated users: remove from database
      try {
        // itemId can be "pid" or "pid-vid"
        let productId = itemId;
        let variantId = null;

        if (typeof itemId === 'string' && itemId.includes('-')) {
          const parts = itemId.split('-');
          productId = parts[0];
          variantId = parts[1];
        }

        let url = `/cart/item/${productId}`;
        if (variantId) url += `?variantId=${variantId}`;

        await api.delete(url);
        // Reload cart from API
        await loadCartFromAPI();
      } catch (error) {
        // Silent fail
      }
    } else {
      // For guest users: remove from localStorage
      setCart(prevCart => {
        const newCart = prevCart.filter(item => item.id !== itemId);
        saveCartToLocalStorage(newCart);
        return newCart;
      });
    }
  }, [isAuthenticated, user, loadCartFromAPI, saveCartToLocalStorage]);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (isAuthenticated && user) {
      // For authenticated users: update in database
      try {
        let productId = itemId;
        let variantId = null;

        if (typeof itemId === 'string' && itemId.includes('-')) {
          const parts = itemId.split('-');
          productId = parts[0];
          variantId = parts[1];
        }

        await api.put(`/cart/item/${productId}`, { quantity: newQuantity, variantId });
        // Reload cart from API
        await loadCartFromAPI();
      } catch (error) {
        // Silent fail
      }
    } else {
      // For guest users: update in localStorage
      setCart(prevCart => {
        const newCart = prevCart.map(item =>
          (item.id === itemId)
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

  // OPTIMIZED: Calculate totals with useMemo to prevent recalculation on every render
  const subtotal = useMemo(() =>
    cart.reduce((sum, item) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return sum + (price * quantity);
    }, 0),
    [cart]
  );

  const itemCount = useMemo(() =>
    cart.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0),
    [cart]
  );

  // Calculate shipping from product shipping_cost field
  const calculatedShipping = useMemo(() =>
    cart.reduce((total, item) => {
      const shippingCost = parseFloat(item.shipping_cost || 0);
      const quantity = parseInt(item.quantity || 0);
      return total + (shippingCost * quantity);
    }, 0),
    [cart]
  );

  const total = useMemo(() =>
    subtotal + calculatedShipping,
    [subtotal, calculatedShipping]
  );

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    // Crude check: if ANY variant of this product is in cart
    return cart.some(item => item.product_id === productId);
  }, [cart]);

  // Get item quantity in cart (Total for product, or specific if needed)
  // Note: Previous behavior was by product ID.
  const getItemQuantity = useCallback((productId) => {
    return cart
      .filter(item => item.product_id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
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
    shipping: calculatedShipping,
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