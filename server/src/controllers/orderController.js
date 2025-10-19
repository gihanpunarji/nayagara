const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const {
      order_number,
      cart_items,
      shipping_address,
      billing_address,
      subtotal,
      shipping_cost,
      tax_amount = 0,
      discount_amount = 0,
      total_amount,
      payment_method = 'payhere'
    } = req.body;

    const customer_id = req.user.user_id;

    // Validate required fields
    if (!order_number || !cart_items || !shipping_address || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    console.log('Creating order for customer:', customer_id);
    console.log('Order data:', { order_number, subtotal, shipping_cost, total_amount });

    // Create shipping address first
    const shipping_address_id = await Order.createShippingAddress({
      line1: shipping_address.line1,
      line2: shipping_address.line2 || '',
      postal_code: shipping_address.postalCode,
      city_name: shipping_address.city,
      district_name: shipping_address.district,
      province_name: shipping_address.province,
      country_name: shipping_address.country || 'Sri Lanka'
    });

    console.log('Created shipping address with ID:', shipping_address_id);

    // Create the order
    const order_id = await Order.createOrder({
      order_number,
      customer_id,
      shipping_address_id,
      subtotal,
      shipping_cost,
      tax_amount,
      discount_amount,
      total_amount,
      order_status: 'pending',
      payment_status: 'pending'
    });

    console.log('Created order with ID:', order_id);

    // Create order items
    const orderItemPromises = cart_items.map(async (item) => {
      const product_attributes = {
        color: item.color || null,
        size: item.size || null,
        variant: item.variant || null
      };

      return await Order.createOrderItem({
        order_id,
        product_id: item.product_id || item.id,
        seller_id: item.seller_id,
        product_title: item.product_title || item.name,
        product_description: item.description || '',
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        product_attributes_snapshot: JSON.stringify(product_attributes),
        product_image_url: item.image || null
      });
    });

    await Promise.all(orderItemPromises);
    console.log('Created order items for order:', order_id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order_id,
        order_number,
        shipping_address_id
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { order_number, payment_status, payment_id } = req.body;

    if (!order_number || !payment_status) {
      return res.status(400).json({
        success: false,
        message: 'Missing order number or payment status'
      });
    }

    // Get order details
    const order = await Order.getOrderByNumber(order_number);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment status
    const affectedRows = await Order.updateOrderPaymentStatus(order.order_id, payment_status);
    
    if (affectedRows > 0) {
      // If payment is completed, update order status to confirmed
      if (payment_status === 'completed') {
        await Order.updateOrderStatus(order.order_id, 'confirmed');
      }

      console.log(`Order ${order_number} payment status updated to ${payment_status}`);
      
      res.json({
        success: true,
        message: 'Order payment status updated successfully',
        data: {
          order_id: order.order_id,
          order_number,
          payment_status
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to update order payment status'
      });
    }

  } catch (error) {
    console.error('Update order payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating payment status',
      error: error.message
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const customer_id = req.user.user_id;
    const orders = await Order.getUserOrders(customer_id);

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await Order.getOrderItems(order.order_id);
        return {
          ...order,
          items
        };
      })
    );

    res.json({
      success: true,
      message: 'User orders retrieved successfully',
      data: ordersWithItems
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { order_number } = req.params;
    const customer_id = req.user.user_id;

    const order = await Order.getOrderByNumber(order_number);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to the user
    if (order.customer_id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    const items = await Order.getOrderItems(order.order_id);

    res.json({
      success: true,
      message: 'Order details retrieved successfully',
      data: {
        ...order,
        items
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  updateOrderPaymentStatus,
  getUserOrders,
  getOrderDetails
};