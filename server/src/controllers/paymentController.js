const crypto = require('crypto');
const Order = require('../models/Order');

const createPayHerePayment = async (req, res) => {
  try {
    console.log('PayHere payment request received:', req.body);
    
    const {
      amount,
      currency = 'LKR',
      order_id,
      items,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      country = 'Sri Lanka'
    } = req.body;

    console.log('Extracted payment data:', {
      amount, currency, order_id, items, first_name, last_name, email, phone, address, city, country
    });

    // Validate required fields
    if (!amount || !order_id || !first_name || !last_name || !email || !phone) {
      console.log('Validation failed - missing fields:', {
        amount: !!amount,
        order_id: !!order_id,
        first_name: !!first_name,
        last_name: !!last_name,
        email: !!email,
        phone: !!phone
      });
      
      return res.status(400).json({
        success: false,
        message: 'Missing required payment fields',
        missing_fields: {
          amount: !amount,
          order_id: !order_id,
          first_name: !first_name,
          last_name: !last_name,
          email: !email,
          phone: !phone
        }
      });
    }

    // Check environment variables
    console.log('Environment check:', {
      merchant_id: process.env.PAYHERE_MERCHANT_ID ? 'Set' : 'Missing',
      merchant_secret: process.env.PAYHERE_MERCHANT_SECRET ? 'Set' : 'Missing',
      front_end_api: process.env.FRONT_END_API ? 'Set' : 'Missing'
    });

    // PayHere payment data
    const paymentData = {
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: `${process.env.FRONT_END_API}/payment/success`,
      cancel_url: `${process.env.FRONT_END_API}/payment/cancel`,
      notify_url: `${process.env.FRONT_END_API}/payment/notify`,
      order_id: order_id,
      items: items || 'Order Items',
      currency: currency,
      amount: parseFloat(amount).toFixed(2),
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      address: address || '',
      city: city || '',
      country: country
    };

    // Generate PayHere hash
    const hash = crypto
      .createHash('md5')
      .update(
        process.env.PAYHERE_MERCHANT_ID +
        order_id +
        parseFloat(amount).toFixed(2) +
        currency +
        crypto.createHash('md5').update(process.env.PAYHERE_MERCHANT_SECRET).digest('hex').toUpperCase()
      )
      .digest('hex')
      .toUpperCase();

    paymentData.hash = hash;

    res.json({
      success: true,
      message: 'Payment data generated successfully',
      data: paymentData
    });

  } catch (error) {
    console.error('PayHere payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating payment',
      error: error.message
    });
  }
};

const handlePayHereNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = req.body;

    // Verify the notification is from PayHere
    const local_md5sig = crypto
      .createHash('md5')
      .update(
        merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto.createHash('md5').update(process.env.PAYHERE_MERCHANT_SECRET).digest('hex').toUpperCase()
      )
      .digest('hex')
      .toUpperCase();

    if (local_md5sig === md5sig && merchant_id === process.env.PAYHERE_MERCHANT_ID) {
      // Valid notification from PayHere
      console.log('PayHere Notification Received:', {
        order_id,
        payment_id,
        status_code,
        amount: payhere_amount
      });

      // Handle different status codes
      switch (status_code) {
        case '2':
          // Payment successful
          console.log(`Payment successful for order ${order_id}`);
          try {
            await Order.updateOrderPaymentStatus(order_id, 'completed');
            await Order.updateOrderStatus(order_id, 'confirmed');
            console.log(`Order ${order_id} status updated to confirmed`);
          } catch (error) {
            console.error(`Failed to update order ${order_id}:`, error);
          }
          break;
        case '-1':
          // Payment canceled
          console.log(`Payment canceled for order ${order_id}`);
          try {
            await Order.updateOrderPaymentStatus(order_id, 'failed');
          } catch (error) {
            console.error(`Failed to update order ${order_id}:`, error);
          }
          break;
        case '-2':
          // Payment failed
          console.log(`Payment failed for order ${order_id}`);
          try {
            await Order.updateOrderPaymentStatus(order_id, 'failed');
          } catch (error) {
            console.error(`Failed to update order ${order_id}:`, error);
          }
          break;
        case '-3':
          // Payment pending
          console.log(`Payment pending for order ${order_id}`);
          try {
            await Order.updateOrderPaymentStatus(order_id, 'pending');
          } catch (error) {
            console.error(`Failed to update order ${order_id}:`, error);
          }
          break;
        default:
          console.log(`Unknown payment status ${status_code} for order ${order_id}`);
      }

      res.status(200).send('OK');
    } else {
      console.log('Invalid PayHere notification received');
      res.status(400).send('Invalid notification');
    }

  } catch (error) {
    console.error('PayHere notification error:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createPayHerePayment,
  handlePayHereNotify
};