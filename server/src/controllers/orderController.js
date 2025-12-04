const Order = require("../models/Order");
const User = require("../models/User");
const { processReferralCommissions } = require("../utils/referralHelpers");

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


    // Create order items
    const orderItemPromises = cart_items.map(async (item) => {
      const product_attributes = {
        color: item.color || null,
        size: item.size || null,
        variant: item.variant || null
      };
      
      console.log("item ", item);

      return await Order.createOrderItem({
        order_id,
        product_id: item.product_id || item.id,
        seller_id: item.seller_id,
        product_title: item.product_title || item.name,
        product_description: item.description || item.shortDescription || '',
        unit_price: item.cost || item.originalPrice || item.original_price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        product_attributes_snapshot: JSON.stringify(product_attributes),
        product_image_url: item.image || (item.images && item.images[0]) || null
      });
    });

    await Promise.all(orderItemPromises);

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
        
        // Attempt to process referrals, but don't let it break the order flow
        try {
          const Product = require("../models/Product");

          // Get order items with product cost information
          const orderItems = await Order.getOrderItems(order.order_id);

          // Add product cost information to order items using Product model
          for (let item of orderItems) {
            item.product_cost = await Product.getCostById(item.product_id);
          }

          // Process referral commissions with the new system
          await processReferralCommissions(order.order_id, order.customer_id, orderItems);
          console.log(`Referral commissions processed successfully for order ${order.order_number}`);
        } catch (referralError) {
          console.error(`[Non-blocking Error] Failed to process referrals for order ${order.order_number}:`, referralError);
        }

        // Send confirmation email and SMS
        try {

          const customer = await User.findById(order.customer_id);

          if (customer) {
            const customerEmail = customer.user_email;
            const customerMobile = customer.user_mobile;
            const customerName = `${customer.first_name} ${customer.last_name}`;

            // Send confirmation email
            if (customerEmail) {
              const nodeMailer = require("nodemailer");
              const transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD,
                },
              });

              await transporter.sendMail({
                from: `"Nayagara" <${process.env.EMAIL_USERNAME}>`,
                to: customerEmail,
                subject: `Order Confirmation - ${order.order_number}`,
                html: `
                  <h2>Thank you for your order!</h2>
                  <p>Dear ${customerName},</p>
                  <p>Your order <strong>${order.order_number}</strong> has been confirmed.</p>
                  <p><strong>Order Total:</strong> Rs. ${order.total_amount}</p>
                  <p>We will notify you when your order is ready to ship.</p>
                  <br>
                  <p>Thank you for shopping with Nayagara!</p>
                `,
              });
              console.log(`Confirmation email sent to ${customerEmail}`);
            }

            // Send confirmation SMS
            if (customerMobile) {
              fetch("https://app.text.lk/api/v3/sms/send", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.TEXTLK_API_KEY}`,
                },
                body: JSON.stringify({
                  recipient: customerMobile,
                  sender_id: process.env.TEXTLK_SENDER_ID,
                  type: "plain",
                  message: `Thank you for your order! Your order ${order.order_number} has been confirmed. Total: Rs. ${order.total_amount}. - Nayagara`,
                }),
              })
                .then((response) => response.json())
                .then((data) => console.log(`Confirmation SMS sent to ${customerMobile}`))
                .catch((error) => console.error("Error sending SMS:", error));
            }
          }
        } catch (notificationError) {
          console.error(`[Non-blocking Error] Failed to send notifications for order ${order.order_number}:`, notificationError);
        }
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

const getSellerOrders = async (req, res) => {
  try {
    const seller_id = req.user.user_id;
    const orders = await Order.getSellerOrders(seller_id);
    res.json({
      success: true,
      message: 'Seller orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve seller orders',
      error: error.message
    });
  }
};

const getSellerOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;
    const seller_id = req.user.user_id;

    // First, verify that this order has items belonging to the seller
    const sellerOrders = await Order.getSellerOrders(seller_id);
    const isSellerOrder = sellerOrders.some(order => order.order_id == order_id);

    if (!isSellerOrder) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    // Get order items
    const items = await Order.getOrderItems(order_id);

    // Filter items to only those belonging to the seller
    const sellerItems = items.filter(item => item.seller_id === seller_id);

    res.json({
      success: true,
      message: 'Order items retrieved successfully',
      data: sellerItems
    });

  } catch (error) {
    console.error('Get seller order items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order items',
      error: error.message
    });
  }
};

const updateSellerOrderStatus = async (req, res) => {
  try {
    const { order_id, status, tracking_number } = req.body;
    const seller_id = req.user.user_id;

    if (!order_id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing order ID or status'
      });
    }

    // Verify that this order has items belonging to the seller
    const sellerOrders = await Order.getSellerOrders(seller_id);
    const isSellerOrder = sellerOrders.some(order => order.order_id == order_id);

    if (!isSellerOrder) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this order'
      });
    }

    // Update the order status in orders table
    const affectedRows = await Order.updateOrderStatus(order_id, status, tracking_number);

    if (affectedRows > 0) {
      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: {
          order_id,
          status,
          tracking_number
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to update order status'
      });
    }

  } catch (error) {
    console.error('Update seller order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: error.message
    });
  }
};

const calculateShipping = async (req, res) => {
  try {
    const { cartItems } = req.body;
    console.log('Calculating shipping for cart items:', cartItems?.length);

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.json({
        success: true,
        data: {
          totalWeight: 0,
          amountPerKilo: 0,
          shippingCost: 0
        }
      });
    }

    const { getConnection } = require('../config/database');
    const pool = getConnection();
    let connection;

    try {
      connection = await pool.getConnection();

      // Get shipping rate per kilo from amount_per_kilo column
      let [shippingSettings] = await connection.execute(
        "SELECT amount_per_kilo FROM shipping_settings LIMIT 1"
      );

      if (!shippingSettings || !shippingSettings[0] || !shippingSettings[0].amount_per_kilo) {
        // Use default rate if not set
        console.log('No shipping settings found, using default 200');
      }

      const amountPerKilo = parseFloat(shippingSettings[0]?.amount_per_kilo || 200);
      console.log('Shipping rate per kilo:', amountPerKilo);
      let totalWeight = 0;

      // Calculate total weight from all cart items
      for (const item of cartItems) {
        const productId = item.product_id || item.id;
        const quantity = parseInt(item.quantity || 1);

        if (!productId) continue;

        try {
          // Get product weight - default to 1kg if not set
          const [productRows] = await connection.execute(
            "SELECT COALESCE(weight_kg, 1.0) as weight_kg FROM products WHERE product_id = ?",
            [productId]
          );

          if (productRows && productRows[0]) {
            const weightKg = parseFloat(productRows[0].weight_kg || 1.0);
            totalWeight += weightKg * quantity;
          } else {
            // If product not found, assume 1kg
            totalWeight += 1.0 * quantity;
          }
        } catch (itemError) {
          console.error(`Error getting weight for product ${productId}:`, itemError);
          // Default to 1kg per item on error
          totalWeight += 1.0 * quantity;
        }
      }

      const shippingCost = totalWeight * amountPerKilo;

      res.json({
        success: true,
        data: {
          totalWeight: parseFloat(totalWeight.toFixed(2)),
          amountPerKilo: amountPerKilo,
          shippingCost: parseFloat(shippingCost.toFixed(2))
        }
      });

    } finally {
      if (connection) connection.release();
    }

  } catch (error) {
    console.error('Error calculating shipping:', error);
    // Return default shipping on error instead of failing
    res.json({
      success: true,
      data: {
        totalWeight: 0,
        amountPerKilo: 200,
        shippingCost: 1000 // Fallback to Rs. 1000
      }
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const { orders, pagination } = await Order.getAllOrders({ page, limit });

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.order_id);
      const items = await Order.getOrderItemsForMultipleOrders(orderIds);
      
      const itemsByOrderId = items.reduce((acc, item) => {
        if (!acc[item.order_id]) {
          acc[item.order_id] = [];
        }
        acc[item.order_id].push(item);
        return acc;
      }, {});

      const ordersWithItems = orders.map(order => ({
        ...order,
        items: itemsByOrderId[order.order_id] || []
      }));

      res.json({
        success: true,
        message: 'All orders retrieved successfully',
        data: ordersWithItems,
        pagination
      });
    } else {
      res.json({
        success: true,
        message: 'No orders found',
        data: [],
        pagination
      });
    }
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve all orders',
      error: error.message
    });
  }
};

const getSellerEarnings = async (req, res) => {
  try {
    const seller_id = req.user.user_id;
    const earnings = await Order.getSellerEarnings(seller_id);

    res.json({
      success: true,
      message: 'Seller earnings retrieved successfully',
      data: earnings
    });
  } catch (error) {
    console.error('Get seller earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve seller earnings',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  updateOrderPaymentStatus,
  getUserOrders,
  getOrderDetails,
  getSellerOrders,
  getSellerOrderDetails,
  updateSellerOrderStatus,
  calculateShipping,
  getAllOrders,
  getSellerEarnings
};