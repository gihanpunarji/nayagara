const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get all cart items for authenticated user
const getCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const cartItems = await Cart.getByUserId(userId);
    
    const formattedItems = cartItems.map(item => ({
      id: item.product_id,
      product_id: item.product_id,
      cart_id: item.cart_id,
      name: item.product_title,
      title: item.product_title,
      price: parseFloat(item.price || 0),
      quantity: item.quantity,
      image: item.image_url,
      seller: item.seller_business_name || `${item.seller_first_name || ''} ${item.seller_last_name || ''}`.trim() || 'Unknown Seller',
      seller_id: item.seller_id,
      stockCount: item.stock_quantity || 0,
      inStock: (item.stock_quantity !== undefined && item.stock_quantity > 0),
      currency: item.currency_code || 'LKR'
    }));

    res.json({
      success: true,
      items: formattedItems,
      itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cart items'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock_quantity} items available`
      });
    }

    // Check if user owns the product
    if (product.seller_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add your own product to cart'
      });
    }

    await Cart.addItem(userId, productId, quantity);

    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    await Cart.updateQuantity(userId, productId, quantity);

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.params;

    await Cart.removeItem(userId, productId);

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item'
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    await Cart.clearCart(userId);

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};

// Merge guest cart with user cart (when user logs in)
const mergeCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { guestItems } = req.body;

    if (!Array.isArray(guestItems)) {
      return res.status(400).json({
        success: false,
        message: 'Guest items must be an array'
      });
    }

    // Simple: just add each guest item to user's cart
    for (const item of guestItems) {
      const productId = item.product_id || item.id;
      const quantity = item.quantity || 1;
      
      if (productId && quantity > 0) {
        try {
          // Check if product exists and is valid
          const product = await Product.findById(productId);
          if (product && product.seller_id !== userId && product.stock_quantity >= quantity) {
            await Cart.addItem(userId, productId, quantity);
          }
        } catch (error) {
          // Skip invalid items, continue with others
        }
      }
    }

    res.json({
      success: true,
      message: 'Guest cart merged successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to merge cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
};