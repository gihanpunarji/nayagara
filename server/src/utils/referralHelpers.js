const { getConnection } = require("../config/database");
const Referral = require("../models/Referral");
const Wallet = require("../models/Wallet");
const ProfitCalculator = require("./profitCalculator");
const crypto = require("crypto");

/**
 * Generates a unique referral code for a user
 * @param {number} userId - The user ID
 * @returns {string} Unique referral code
 */
function generateReferralCode(userId) {
  const timestamp = Date.now().toString();
  const hash = crypto.createHash('md5').update(`${userId}${timestamp}`).digest('hex');
  return `REF${String(userId).padStart(6, '0')}${hash.substring(0, 6).toUpperCase()}`;
}

/**
 * Creates or updates the referral chain for a new user
 * @param {number} newUserId - The new user's ID
 * @param {number} referrerUserId - The referrer's user ID
 */
async function createReferralChain(newUserId, referrerUserId) {
  const pool = getConnection();
  let connection;
  
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Get the referrer's chain to extend it
    const [referrerChainRows] = await connection.execute(
      "SELECT * FROM referral_chain WHERE user_id = ?",
      [referrerUserId]
    );

    let newUserChain = {
      level_1_user_id: referrerUserId,
      level_2_user_id: null,
      level_3_user_id: null,
      level_4_user_id: null,
      level_5_user_id: null,
      level_6_user_id: null,
      level_7_user_id: null,
      level_8_user_id: null,
    };

    if (referrerChainRows[0]) {
      // Extend the chain by shifting levels up
      const referrerChain = referrerChainRows[0];
      newUserChain.level_2_user_id = referrerChain.level_1_user_id;
      newUserChain.level_3_user_id = referrerChain.level_2_user_id;
      newUserChain.level_4_user_id = referrerChain.level_3_user_id;
      newUserChain.level_5_user_id = referrerChain.level_4_user_id;
      newUserChain.level_6_user_id = referrerChain.level_5_user_id;
      newUserChain.level_7_user_id = referrerChain.level_6_user_id;
      newUserChain.level_8_user_id = referrerChain.level_7_user_id;
      // Level 8 from referrer chain is dropped (only 8 levels max)
    }

    // Insert the new user's referral chain
    await connection.execute(
      `INSERT INTO referral_chain 
       (user_id, level_1_user_id, level_2_user_id, level_3_user_id, level_4_user_id,
        level_5_user_id, level_6_user_id, level_7_user_id, level_8_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `,
      [
        newUserId,
        newUserChain.level_1_user_id,
        newUserChain.level_2_user_id,
        newUserChain.level_3_user_id,
        newUserChain.level_4_user_id,
        newUserChain.level_5_user_id,
        newUserChain.level_6_user_id,
        newUserChain.level_7_user_id,
        newUserChain.level_8_user_id,
      ]
    );

    // Update users table with referrer information
    await connection.execute(
      "UPDATE users SET referred_by_user_id = ? WHERE user_id = ?",
      [referrerUserId, newUserId]
    );

    // Create entry in legacy referral table for backward compatibility
    await connection.execute(
      "INSERT INTO referral (users_user_id, referred_by) VALUES (?, ?)",
      [newUserId, referrerUserId]
    );

    await connection.commit();
    console.log(`Created referral chain for user ${newUserId} referred by ${referrerUserId}`);
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating referral chain:', error);
    throw new Error('Failed to create referral chain');
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Updates user's total purchase amount and checks for referral unlock
 * @param {number} userId - User ID
 * @param {number} purchaseAmount - Purchase amount (excluding shipping)
 */
async function updateUserPurchaseAmount(userId, purchaseAmount) {
  const pool = getConnection();
  let connection;
  
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Get current user data
    const [userRows] = await connection.execute(
      "SELECT total_purchase_amount, referral_link_unlocked, referral_code FROM users WHERE user_id = ?",
      [userId]
    );

    if (!userRows[0]) {
      throw new Error('User not found');
    }

    const user = userRows[0];
    const currentTotal = parseFloat(user.total_purchase_amount || 0);
    const newTotal = currentTotal + parseFloat(purchaseAmount);
    
    // Check if referral link should be unlocked (5000 threshold)
    const unlockThreshold = 5000; // This could be made configurable
    const shouldUnlock = !user.referral_link_unlocked && newTotal >= unlockThreshold;
    
    let referralCode = user.referral_code;
    if (!referralCode) {
      referralCode = generateReferralCode(userId);
    }

    // Update user's purchase amount and referral status
    await connection.execute(
      `UPDATE users 
       SET total_purchase_amount = ?, 
           referral_link_unlocked = ?, 
           referral_code = ?
       WHERE user_id = ?`,
      [newTotal, shouldUnlock || user.referral_link_unlocked, referralCode, userId]
    );

    // Update or create user tier information
    let currentTier = 1;
    if (newTotal >= 10000) {
      currentTier = 3;
    } else if (newTotal >= 5000) {
      currentTier = 2;
    }

    await connection.execute(
      `INSERT INTO user_purchase_tiers 
       (user_id, current_tier, tier_start_amount, tier_end_amount, discount_percentage, commission_l1_percentage, commission_l2_to_8_percentage)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       current_tier = VALUES(current_tier),
       tier_start_amount = VALUES(tier_start_amount),
       tier_end_amount = VALUES(tier_end_amount),
       discount_percentage = VALUES(discount_percentage),
       commission_l1_percentage = VALUES(commission_l1_percentage),
       commission_l2_to_8_percentage = VALUES(commission_l2_to_8_percentage)`,
      [
        userId,
        currentTier,
        currentTier === 1 ? 0 : (currentTier === 2 ? 5000 : 10000),
        currentTier === 3 ? null : (currentTier === 2 ? 10000 : 5000),
        currentTier === 1 ? 0 : (currentTier === 2 ? 15 : 30), // Base discount percentages
        30, // Base L1 commission
        currentTier === 1 ? 5 : 3  // Base L2-8 commission
      ]
    );

    await connection.commit();
    
    if (shouldUnlock) {
      console.log(`User ${userId} unlocked referral link with total purchases: ${newTotal}`);
    }
    
    return {
      newTotal,
      referralUnlocked: shouldUnlock,
      currentTier,
      referralCode
    };
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating user purchase amount:', error);
    throw new Error('Failed to update user purchase data');
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Processes referral commissions for a given order using the new profit-based system
 * @param {number} orderId The order ID to process commissions for
 * @param {number} customerId The customer (buyer) ID
 * @param {Array} orderItems Array of order items
 */
async function processReferralCommissions(orderId, customerId, orderItems) {
  const pool = getConnection();
  let connection;
  
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    console.log(`Processing referral commissions for order ${orderId}, customer ${customerId}`);

    // Calculate total order profit
    const orderProfitData = await ProfitCalculator.calculateOrderProfit(orderItems);
    console.log('Order profit data:', orderProfitData);
    
    // Update user's purchase amount (excluding shipping charges)
    const totalPurchaseAmount = orderProfitData.totals.totalSellingAmount;
    console.log("purchase amount for referral processing:", totalPurchaseAmount);
    const userUpdateResult = await updateUserPurchaseAmount(customerId, totalPurchaseAmount);
    
    // Check if this is the user's first purchase over 5000
    const isFirstPurchaseOverThreshold = userUpdateResult.referralUnlocked;
    
    // Calculate buyer discount if applicable
    let totalBuyerDiscount = 0;
    if (!isFirstPurchaseOverThreshold && userUpdateResult.newTotal >= 5000) {
      // This is a subsequent purchase after unlocking referral
      for (const item of orderProfitData.items) {
        const discountData = await ProfitCalculator.calculateBuyerDiscount(customerId, item.netProfit);
        if (discountData.discountApplicable) {
          totalBuyerDiscount += discountData.discountAmount;
          
          // Apply discount to order
          await connection.execute(
            "UPDATE orders SET discount_amount = discount_amount + ? WHERE order_id = ?",
            [discountData.discountAmount, orderId]
          );
        }
      }
    }

    // Process commission distribution for each order item
    let totalCommissionsDistributed = 0;
    
    for (const item of orderProfitData.items) {
      const commissionDistribution = await ProfitCalculator.calculateCommissionDistribution(
        customerId, 
        item.netProfit, 
        isFirstPurchaseOverThreshold || userUpdateResult.newTotal < 5000
      );

      // Record commissions for each referrer in the chain
      for (const commission of commissionDistribution.commissions) {
        // Insert commission record
        await connection.execute(
          `INSERT INTO referral_commissions 
           (order_id, order_item_id, buyer_user_id, referrer_user_id, referrer_level,
            original_profit_amount, gateway_fee_amount, net_profit_amount,
            commission_percentage, commission_amount, commission_type, buyer_discount_amount, processed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,
          [
            orderId,
            item.order_item_id,
            customerId,
            commission.userId,
            commission.level,
            item.grossProfit,
            item.gatewayFee,
            item.netProfit,
            commission.percentage,
            commission.amount,
            isFirstPurchaseOverThreshold ? 'first_purchase' : 'subsequent_purchase',
            totalBuyerDiscount,
            new Date()
          ]
        );

        // Add commission to referrer's wallet
        await Wallet.addCommission({
          userId: commission.userId,
          amount: commission.amount,
          description: `L${commission.level} referral commission from order #${orderId}`,
          orderId: orderId
        });

        // Create legacy referral reward record for backward compatibility
        await Referral.createReward({
          userId: commission.userId,
          orderId: orderId,
          level: commission.level,
          amount: commission.amount
        });

        totalCommissionsDistributed += commission.amount;
      }
    }

    await connection.commit();
    
    console.log(`Processed referral commissions for order ${orderId}:`);
    console.log(`- Total profit distributed: ${orderProfitData.totals.totalNetProfit}`);
    console.log(`- Total commissions: ${totalCommissionsDistributed}`);
    console.log(`- Total buyer discount: ${totalBuyerDiscount}`);
    console.log(`- System amount: ${orderProfitData.totals.totalNetProfit - totalCommissionsDistributed}`);
    
    return {
      success: true,
      totalProfit: orderProfitData.totals.totalNetProfit,
      totalCommissions: totalCommissionsDistributed,
      buyerDiscount: totalBuyerDiscount,
      userUnlockedReferral: userUpdateResult.referralUnlocked
    };
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error processing referral commissions:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Gets user by referral code
 * @param {string} referralCode - The referral code
 * @returns {Object} User object or null
 */
async function getUserByReferralCode(referralCode) {
  const pool = getConnection();
  let connection;
  
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT user_id, first_name, last_name, user_email, referral_link_unlocked FROM users WHERE referral_code = ?",
      [referralCode]
    );
    return rows[0] || null;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Gets referral statistics for a user
 * @param {number} userId - User ID
 * @returns {Object} Referral statistics
 */
async function getReferralStatistics(userId) {
  const pool = getConnection();
  let connection;
  
  try {
    connection = await pool.getConnection();
    
    // Get total commissions earned
    const [commissionRows] = await connection.execute(
      "SELECT SUM(commission_amount) as total_earned FROM referral_commissions WHERE referrer_user_id = ?",
      [userId]
    );
    
    // Get number of direct referrals
    const [directRefRows] = await connection.execute(
      "SELECT COUNT(*) as direct_referrals FROM referral_chain WHERE level_1_user_id = ?",
      [userId]
    );
    
    // Get number of total referrals in chain (all levels)
    const [totalRefRows] = await connection.execute(
      `SELECT COUNT(*) as total_referrals FROM referral_chain WHERE 
       level_1_user_id = ? OR level_2_user_id = ? OR level_3_user_id = ? OR level_4_user_id = ? OR
       level_5_user_id = ? OR level_6_user_id = ? OR level_7_user_id = ? OR level_8_user_id = ?`,
      [userId, userId, userId, userId, userId, userId, userId, userId]
    );
    
    // Get user's purchase tier
    const [userRows] = await connection.execute(
      "SELECT total_purchase_amount, referral_link_unlocked, referral_code FROM users WHERE user_id = ?",
      [userId]
    );
    
    const user = userRows[0] || {};
    
    return {
      totalEarned: parseFloat(commissionRows[0]?.total_earned || 0),
      directReferrals: parseInt(directRefRows[0]?.direct_referrals || 0),
      totalReferrals: parseInt(totalRefRows[0]?.total_referrals || 0),
      totalPurchased: parseFloat(user.total_purchase_amount || 0),
      referralUnlocked: Boolean(user.referral_link_unlocked),
      referralCode: user.referral_code,
      canEarnCommissions: Boolean(user.referral_link_unlocked)
    };
    
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use processReferralCommissions instead
 */
async function processReferralsAndDiscounts(order) {
  console.warn('processReferralsAndDiscounts is deprecated. Use processReferralCommissions instead.');
  // You can implement this to bridge to the new system if needed
}

module.exports = {
  generateReferralCode,
  createReferralChain,
  updateUserPurchaseAmount,
  processReferralCommissions,
  getUserByReferralCode,
  getReferralStatistics,
  processReferralsAndDiscounts // Legacy support
};
