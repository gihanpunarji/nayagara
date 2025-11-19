const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Wallet = require('../models/Wallet');
const Settings = require('../models/Settings');

/**
 * Traverses the referral table to get a chain of referrers for a user.
 * @param {number} userId The starting user's ID.
 * @param {number} maxLevels The maximum number of levels to traverse.
 * @returns {Promise<Array<object>>} A list of referrer user objects, ordered from L1 to L8.
 */
const getReferrerChain = async (userId, maxLevels = 8) => {
  const chain = [];
  let currentUserId = userId;

  for (let i = 0; i < maxLevels; i++) {
    const referrer = await Referral.findReferrerByUserId(currentUserId);
    if (referrer && referrer.user_id) {
      chain.push(referrer);
      currentUserId = referrer.user_id;
    } else {
      // No more referrers up the chain
      break;
    }
  }
  return chain;
};

/**
 * Main function to process referral commissions and buyer discounts for a completed order.
 * @param {object} order The order object from the database.
 */
const processReferralsAndDiscounts = async (order) => {
  console.log(`Processing referrals and discounts for order ${order.order_number}...`);

  try {
    // 1. Fetch all necessary data
    const settings = await Settings.getAll();
    const buyer = await User.findById(order.customer_id);
    if (!buyer) {
      throw new Error(`Buyer with ID ${order.customer_id} not found.`);
    }
    const orderItems = await Order.getOrderItems(order.order_id);

    const gatewayFeePercent = parseFloat(settings.get('payment_gateway_fee_percent') || '3.0');
    const totalPayoutPercent = parseFloat(settings.get('referral_total_payout_percent') || '81.0');
    const unlockThreshold = parseFloat(settings.get('referral_unlock_purchase_threshold') || '5000');
    const l1CommissionPercent = parseFloat(settings.get('referral_l1_commission_percent') || '30.0');
    const l2to8CommissionPercent = parseFloat(settings.get('referral_l2_to_8_commission_percent') || '3.0');
    const tier1DiscountPercent = parseFloat(settings.get('referral_tier1_discount_percent') || '15.0');
    const tier2MaxDiscountPercent = parseFloat(settings.get('referral_tier2_max_discount_percent') || '30.0');
    const tier3DiscountPercent = parseFloat(settings.get('referral_tier3_discount_percent') || '30.0');

    // 2. Calculate Total Net Profit for the order
    let totalNetProfit = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product_id);
      if (!product || !product.market_price) {
        console.warn(`Product with ID ${item.product_id} not found or has no market price. Skipping for profit calculation.`);
        continue;
      }

      const grossProfit = parseFloat(product.market_price) - parseFloat(product.price);
      const gatewayFee = parseFloat(product.market_price) * (gatewayFeePercent / 100);
      const netProfit = grossProfit - gatewayFee;
      
      if (netProfit > 0) {
        totalNetProfit += netProfit * item.quantity;
      }
    }

    if (totalNetProfit <= 0) {
      console.log(`Order ${order.order_number} has no net profit. No commissions or discounts will be applied.`);
      // Still need to update user's purchase history
      await User.updatePurchaseInfo(buyer.user_id, order.total_amount, unlockThreshold);
      return;
    }

    console.log(`Order ${order.order_number} - Total Net Profit: ${totalNetProfit}`);

    // 3. Get the referrer chain
    const referrerChain = await getReferrerChain(buyer.user_id);

    // 4. Determine scenario and apply logic
    const isFirstPurchase = parseFloat(buyer.total_purchase_amount) === 0;

    if (isFirstPurchase) {
      // --- Scenario A: A User's First-Ever Purchase ---
      console.log(`Scenario A: First purchase for user ${buyer.user_id}`);
      if (referrerChain.length > 0) {
        for (let i = 0; i < referrerChain.length; i++) {
          const level = i + 1;
          const referrer = referrerChain[i];
          let commission = 0;

          if (level === 1) { // Level 1 referrer
            commission = totalNetProfit * (l1CommissionPercent / 100);
          } else { // Level 2-8 referrers
            commission = totalNetProfit * (l2to8CommissionPercent / 100);
          }

          if (commission > 0) {
            console.log(`L${level} commission for user ${referrer.user_id}: ${commission}`);
            await Referral.createReward({ userId: referrer.user_id, orderId: order.order_id, level, amount: commission });
            await Wallet.addCommission({ userId: referrer.user_id, amount: commission, description: `L${level} commission from order ${order.order_number}`, orderId: order.order_id });
          }
        }
      }
    } else {
      // --- Scenario B: A User's Second and All Subsequent Purchases ---
      console.log(`Scenario B: Subsequent purchase for user ${buyer.user_id}`);
      const lifetimeSpent = parseFloat(buyer.total_purchase_amount);
      let buyerDiscountPercent = 0;

      // Calculate buyer's discount tier
      if (lifetimeSpent > 0 && lifetimeSpent <= 5000) {
        buyerDiscountPercent = tier1DiscountPercent;
      } else if (lifetimeSpent > 5000 && lifetimeSpent <= 10000) {
        // Linear scale from 15% to 30%
        const progress = (lifetimeSpent - 5000) / 5000; // How far into the 5001-10000 range they are
        buyerDiscountPercent = tier1DiscountPercent + (progress * (tier2MaxDiscountPercent - tier1DiscountPercent));
      } else { // > 10000
        buyerDiscountPercent = tier3DiscountPercent;
      }

      const buyerDiscountAmount = totalNetProfit * (buyerDiscountPercent / 100);
      console.log(`Buyer discount: ${buyerDiscountAmount} (${buyerDiscountPercent}%)`);

      // Update order with the discount amount
      await Order.addDiscount(order.order_id, buyerDiscountAmount);

      // Calculate the remaining pool for referrers
      const totalPayoutAmount = totalNetProfit * (totalPayoutPercent / 100);
      const referrerPool = totalPayoutAmount - buyerDiscountAmount;
      const commissionModel = settings.get('referral_commission_model') || 'option1';

      if (referrerPool > 0 && referrerChain.length > 0) {
        if (commissionModel === 'option2') {
          console.log('Commission Model: Option 2');
          // Option 2: Commission percentage changes based on the buyer's spending tier.
          let l1Share, l2to8Share;
          if (lifetimeSpent <= 5000) {
            l1Share = 15;
            l2to8Share = 2;
          } else if (lifetimeSpent > 5000 && lifetimeSpent <= 10000) {
            const progress = (lifetimeSpent - 5000) / 5000;
            l1Share = 15 + progress * 15; // Scales from 15 to 30
            l2to8Share = 2 + progress * 1; // Scales from 2 to 3
          } else { // > 10000
            l1Share = 30;
            l2to8Share = 3;
          }

          const totalShares = l1Share + (l2to8Share * 7);

          for (let i = 0; i < referrerChain.length; i++) {
            const level = i + 1;
            const referrer = referrerChain[i];
            let commission = 0;
            
            if (level === 1) {
              commission = (l1Share / totalShares) * referrerPool;
            } else {
              commission = (l2to8Share / totalShares) * referrerPool;
            }

            if (commission > 0) {
              console.log(`L${level} commission for user ${referrer.user_id}: ${commission}`);
              await Referral.createReward({ userId: referrer.user_id, orderId: order.order_id, level, amount: commission });
              await Wallet.addCommission({ userId: referrer.user_id, amount: commission, description: `L${level} commission from order ${order.order_number}`, orderId: order.order_id });
            }
          }
        } else {
          // Option 1: Standard commission
          console.log('Commission Model: Option 1');
          const totalShares = 51; // L1=30, L2-8=3*7=21. Total = 51
          for (let i = 0; i < referrerChain.length; i++) {
            const level = i + 1;
            const referrer = referrerChain[i];
            let commission = 0;
            
            if (level === 1) {
              commission = (30 / totalShares) * referrerPool;
            } else {
              commission = (3 / totalShares) * referrerPool;
            }

            if (commission > 0) {
              console.log(`L${level} commission for user ${referrer.user_id}: ${commission}`);
              await Referral.createReward({ userId: referrer.user_id, orderId: order.order_id, level, amount: commission });
              await Wallet.addCommission({ userId: referrer.user_id, amount: commission, description: `L${level} commission from order ${order.order_number}`, orderId: order.order_id });
            }
          }
        }
      }
    }

    // 5. Update buyer's total purchase amount and unlock status
    await User.updatePurchaseInfo(buyer.user_id, order.total_amount, unlockThreshold);
    console.log(`Updated purchase info for user ${buyer.user_id}.`);
  } catch (error) {
    console.error(`Error processing referrals for order ${order.order_number}:`, error);
    // Optionally, you could add a mechanism to retry processing the order later
  }
};

module.exports = {
  processReferralsAndDiscounts,
};
