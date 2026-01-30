const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");

// Get all cart items for authenticated user
const getCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const cartItems = await Cart.getByUserId(userId);

    const formattedItems = cartItems.map(item => ({
      id: item.variant_id ? `${item.product_id}-${item.variant_id}` : item.product_id, // Unique ID for frontend key
      product_id: item.product_id,
      variant_id: item.variant_id,
      cart_id: item.cart_id,
      name: item.product_title,
      title: item.product_title,
      price: parseFloat(item.variant_price || item.price || 0),
      cost: parseFloat(item.cost || 0),
      original_price: parseFloat(item.cost || 0),
      quantity: item.quantity,
      image: item.variant_image || item.image_url,
      seller: item.seller_business_name || `${item.seller_first_name || ''} ${item.seller_last_name || ''}`.trim() || 'Unknown Seller',
      seller_id: item.seller_id,
      stockCount: item.variant_id ? 999 : (item.stock_quantity || 0), // Ideally fetch variant stock
      inStock: true, // Simplified for now
      currency: item.currency_code || 'LKR',
      weight_kg: parseFloat(item.weight_kg || 1.0),
      shipping_cost: parseFloat(item.shipping_cost || 0),
      attributes: item.variant_attributes ? (typeof item.variant_attributes === 'string' ? JSON.parse(item.variant_attributes) : item.variant_attributes) : {}
    }));

    const subtotal = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate shipping based on individual product shipping_cost from products table
    const shipping = formattedItems.reduce((sum, item) => sum + (item.shipping_cost * item.quantity), 0);

    res.json({
      success: true,
      items: formattedItems,
      itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal,
      shipping: parseFloat(shipping.toFixed(2)),
      total: subtotal + shipping
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart items',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId, quantity = 1, variantId } = req.body;

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

    // Validate variant if provided
    if (variantId) {
      // Find variant
      // Optimally we should have ProductVariant.findById, but we have findByProductId
      try {
        const variants = await ProductVariant.findByProductId(productId);
        const variant = variants.find(v => v.variant_id == variantId);

        if (!variant) {
          return res.status(404).json({
            success: false,
            message: 'Variant not found'
          });
        }

        if (variant.stock_quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Only ${variant.stock_quantity} items available for this variation`
          });
        }
      } catch (e) {
        console.warn("CartController: Variant check skipped due to missing table/error", e.message);
        // If variants system fails, we might choosing to block or allow as non-variant
        // Safe bet: Block adding *invalid* variant, but if table doesn't exist, we can't add variant anyway.
        return res.status(400).json({ success: false, message: "Variants not currently available." });
      }
    } else {
      // Check stock (main product)
      if (product.stock_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock_quantity} items available`
        });
      }
    }

    // Check if user owns the product
    if (product.seller_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add your own product to cart'
      });
    }

    await Cart.addItem(userId, productId, quantity, variantId);

    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error("AddTo Cart Error", error);
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
    const { quantity, variantId } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    await Cart.updateQuantity(userId, productId, quantity, variantId);

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
    const { variantId } = req.query; // Get variantId from query params

    await Cart.removeItem(userId, productId, variantId);

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

    // OPTIMIZED: Fetch all products in a single query
    const productIds = guestItems
      .map(item => item.product_id || item.id)
      .filter(id => id);

    if (productIds.length === 0) {
      return res.json({
        success: true,
        message: 'No items to merge'
      });
    }

    // Single query instead of N queries
    const productsMap = await Product.findByIds(productIds);

    // Filter valid items and add to cart
    for (const item of guestItems) {
      const productId = item.product_id || item.id;
      const quantity = item.quantity || 1;

      if (!productId || quantity <= 0) continue;

      const product = productsMap.get(productId);

      // Validate product exists, user doesn't own it, and stock is sufficient
      if (product && product.seller_id !== userId && product.stock_quantity >= quantity) {
        try {
          await Cart.addItem(userId, productId, quantity);
        } catch (error) {
          // Skip invalid items, continue with others
          console.error(`Failed to add item ${productId} to cart:`, error);
        }
      }
    }

    res.json({
      success: true,
      message: 'Guest cart merged successfully'
    });
  } catch (error) {
    console.error('Cart merge error:', error);
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