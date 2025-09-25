// 🛒 EXAMPLE: Customer Cart Hook
// This shows how to create a custom hook for shopping cart management
// Usage: const { cart, addToCart, removeFromCart, total } = useCart();

import { useState, useEffect, useCallback } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nayagara_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('nayagara_cart', JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  }, []);

  // Remove product from cart
  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate shipping (free over Rs. 50,000)
  const shipping = subtotal > 50000 ? 0 : 1000;
  const total = subtotal + shipping;

  return {
    // State
    cart,
    loading,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Computed values
    subtotal,
    shipping,
    total,
    itemCount,
    isEmpty: cart.length === 0
  };
};

// 🎯 HOW TO USE IN COMPONENTS:
/*
import { useCart } from '../hooks/customer/useCart';

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const isInCart = cart.some(item => item.id === product.id);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>Rs. {product.price}</p>
      <button onClick={handleAddToCart}>
        {isInCart ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  );
}
*/