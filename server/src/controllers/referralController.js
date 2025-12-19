const User = require('../models/User');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const { getReferralStatistics, getUserByReferralCode, processReferralCommissions } = require('../utils/referralHelpers');
const ProfitCalculator = require('../utils/profitCalculator');

const referralController = {
  /**
   * Get user's referral statistics
   */
  async getUserReferralStats(req, res) {
    try {
      const userId = req.user.user_id;
      const stats = await getReferralStatistics(userId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting referral stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get referral statistics'
      });
    }
  },

  /**
   * Validate a referral code
   */
  async validateReferralCode(req, res) {
    try {
      const { referralCode } = req.params;
      
      if (!referralCode) {
        return res.status(400).json({
          success: false,
          message: 'Referral code is required'
        });
      }

      const referrer = await getUserByReferralCode(referralCode);
      
      if (!referrer) {
        return res.status(404).json({
          success: false,
          message: 'Invalid referral code'
        });
      }

      if (!referrer.referral_link_unlocked) {
        return res.status(400).json({
          success: false,
          message: 'Referral code is not active'
        });
      }

      res.json({
        success: true,
        data: {
          valid: true,
          referrerName: `${referrer.first_name} ${referrer.last_name}`,
          referrerEmail: referrer.user_email
        }
      });
    } catch (error) {
      console.error('Error validating referral code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate referral code'
      });
    }
  },

  /**
   * Register a new user with referral code
   */
  async registerWithReferralCode(req, res) {
    try {
      const { mobile, email, password, firstName, lastName, referralCode } = req.body;

      // Validate required fields
      if (!mobile || !email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      // If referral code provided, validate it first
      if (referralCode) {
        const referrer = await getUserByReferralCode(referralCode);
        if (!referrer || !referrer.referral_link_unlocked) {
          return res.status(400).json({
            success: false,
            message: 'Invalid or inactive referral code'
          });
        }
      }

      // Create user with referral
      const newUser = await User.createWithReferral({
        mobile,
        email,
        password,
        firstName,
        lastName,
        role: 'customer',
        referralCode
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          userId: newUser.user_id,
          email: newUser.user_email,
          referralCode: newUser.referral_code,
          referralUsed: !!referralCode
        }
      });
    } catch (error) {
      console.error('Error registering user with referral:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to register user'
      });
    }
  },

  /**
   * Get user's own referral code
   */
  async getMyReferralCode(req, res) {
    try {
      const userId = req.user.user_id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          referralCode: user.referral_code,
          referralUnlocked: user.referral_link_unlocked,
          totalPurchased: parseFloat(user.total_purchase_amount || 0),
          unlockThreshold: 5000,
          referralLink: user.referral_link_unlocked 
            ? `${process.env.FRONT_END_API}/register?ref=${user.referral_code}`
            : null
        }
      });
    } catch (error) {
      console.error('Error getting referral code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get referral code'
      });
    }
  },

  /**
   * Get user's referral earnings
   */
  async getMyEarnings(req, res) {
    try {
      const userId = req.user.user_id;
      const wallet = await Wallet.findByUserId(userId);
      const transactions = await Wallet.getTransactionsByUserId(userId, 50, 0);
      
      // Filter referral-related transactions
      const referralTransactions = transactions.filter(t => 
        t.description && t.description.toLowerCase().includes('referral')
      );

      res.json({
        success: true,
        data: {
          totalEarnings: parseFloat(wallet?.balance || 0),
          referralEarnings: referralTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          transactions: referralTransactions
        }
      });
    } catch (error) {
      console.error('Error getting referral earnings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get referral earnings'
      });
    }
  },

  /**
   * Get user's referred users
   */
  async getMyReferrals(req, res) {
    try {
      const userId = req.user.user_id;
      const { getConnection } = require('../config/database');
      const pool = getConnection();
      let connection;

      try {
        connection = await pool.getConnection();
        
        // Get direct referrals
        const [directReferrals] = await connection.execute(`
          SELECT 
            u.user_id,
            u.first_name,
            u.last_name,
            u.user_email,
            u.total_purchase_amount,
            u.created_at as joined_date,
            (SELECT SUM(rc.commission_amount) 
             FROM referral_commissions rc 
             WHERE rc.buyer_user_id = u.user_id AND rc.referrer_user_id = ?) as commissions_earned
          FROM users u
          JOIN referral_chain rc ON u.user_id = rc.user_id
          WHERE rc.level_1_user_id = ?
          ORDER BY u.created_at DESC
        `, [userId, userId]);

        // Get total referrals count by level
        const [levelCounts] = await connection.execute(`
          SELECT 
            'L1' as level, COUNT(*) as count FROM referral_chain WHERE level_1_user_id = ?
          UNION ALL
          SELECT 'L2' as level, COUNT(*) as count FROM referral_chain WHERE level_2_user_id = ?
          UNION ALL
          SELECT 'L3' as level, COUNT(*) as count FROM referral_chain WHERE level_3_user_id = ?
          UNION ALL
          SELECT 'L4' as level, COUNT(*) as count FROM referral_chain WHERE level_4_user_id = ?
          UNION ALL
          SELECT 'L5' as level, COUNT(*) as count FROM referral_chain WHERE level_5_user_id = ?
          UNION ALL
          SELECT 'L6' as level, COUNT(*) as count FROM referral_chain WHERE level_6_user_id = ?
          UNION ALL
          SELECT 'L7' as level, COUNT(*) as count FROM referral_chain WHERE level_7_user_id = ?
          UNION ALL
          SELECT 'L8' as level, COUNT(*) as count FROM referral_chain WHERE level_8_user_id = ?
        `, [userId, userId, userId, userId, userId, userId, userId, userId]);

        res.json({
          success: true,
          data: {
            directReferrals,
            levelCounts,
            totalDirectReferrals: directReferrals.length
          }
        });
      } finally {
        if (connection) connection.release();
      }
    } catch (error) {
      console.error('Error getting user referrals:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get referral data'
      });
    }
  },

  /**
   * Process referrals for a completed order
   */
  async processOrderReferrals(req, res) {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      // Get order details
      const order = await Order.getOrderByNumber(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Get order items with product details
      const orderItems = await Order.getOrderItems(order.order_id);
      
      // Add product cost information to order items
      const { getConnection } = require('../config/database');
      const pool = getConnection();
      let connection;

      try {
        connection = await pool.getConnection();
        
        for (let item of orderItems) {
          const [productRows] = await connection.execute(
            "SELECT cost FROM products WHERE product_id = ?",
            [item.product_id]
          );
          item.product_cost = productRows[0]?.cost || 0;
        }

        // Process referral commissions
        const result = await processReferralCommissions(order.order_id, order.customer_id, orderItems);

        res.json({
          success: true,
          message: 'Referral commissions processed successfully',
          data: result
        });
      } finally {
        if (connection) connection.release();
      }
    } catch (error) {
      console.error('Error processing order referrals:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process order referrals'
      });
    }
  },

  /**
   * Calculate profit margins for testing
   */
  async calculateProfitMargins(req, res) {
    try {
      const { orderItems } = req.body;

      if (!orderItems || !Array.isArray(orderItems)) {
        return res.status(400).json({
          success: false,
          message: 'Order items array is required'
        });
      }

      const profitData = await ProfitCalculator.calculateOrderProfit(orderItems);

      res.json({
        success: true,
        data: profitData
      });
    } catch (error) {
      console.error('Error calculating profit margins:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate profit margins'
      });
    }
  },

  /**
   * Calculate user discount for testing
   */
  async calculateUserDiscount(req, res) {
    try {
      const { userId, netProfit } = req.body;

      if (!userId || !netProfit) {
        return res.status(400).json({
          success: false,
          message: 'User ID and net profit are required'
        });
      }

      const discountData = await ProfitCalculator.calculateBuyerDiscount(userId, netProfit);

      res.json({
        success: true,
        data: discountData
      });
    } catch (error) {
      console.error('Error calculating user discount:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate user discount'
      });
    }
  },

  /**
   * Simulate commission distribution for testing
   */
  async simulateCommission(req, res) {
    try {
      const { buyerUserId, netProfit, isFirstPurchase } = req.body;

      if (!buyerUserId || !netProfit) {
        return res.status(400).json({
          success: false,
          message: 'Buyer user ID and net profit are required'
        });
      }

      const commissionData = await ProfitCalculator.calculateCommissionDistribution(
        buyerUserId,
        netProfit,
        isFirstPurchase || false
      );

      res.json({
        success: true,
        data: commissionData
      });
    } catch (error) {
      console.error('Error simulating commission:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to simulate commission distribution'
      });
    }
  },

  /**
   * Get user's referral network (who referred them and who they referred)
   */
  async getUserReferralNetwork(req, res) {
    try {
      const userId = req.user.user_id;
      const { getConnection } = require('../config/database');
      const pool = getConnection();
      let connection;

      try {
        connection = await pool.getConnection();

        // Get the user's referrer (top user)
        const [referrerRows] = await connection.execute(`
          SELECT
            u.user_id,
            u.first_name,
            u.last_name,
            u.user_email,
            u.total_purchase_amount,
            u.created_at,
            rc.level_1_user_id
          FROM referral_chain rc
          JOIN users u ON rc.level_1_user_id = u.user_id
          WHERE rc.user_id = ?
        `, [userId]);

        // Get users referred by this user (direct referrals only)
        const [referredUsersRows] = await connection.execute(`
          SELECT
            u.user_id,
            u.first_name,
            u.last_name,
            u.user_email,
            u.total_purchase_amount,
            u.created_at,
            (SELECT SUM(rc.commission_amount)
             FROM referral_commissions rc
             WHERE rc.buyer_user_id = u.user_id AND rc.referrer_user_id = ?) as total_commissions_earned
          FROM users u
          JOIN referral_chain rc ON u.user_id = rc.user_id
          WHERE rc.level_1_user_id = ?
          ORDER BY u.created_at DESC
        `, [userId, userId]);

        res.json({
          success: true,
          data: {
            topUser: referrerRows[0] || null,
            referredUsers: referredUsersRows,
            totalReferredUsers: referredUsersRows.length
          }
        });

      } finally {
        if (connection) connection.release();
      }
    } catch (error) {
      console.error('Error getting referral network:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get referral network'
      });
    }
  },

  /**
   * Calculate referral discount for cart items at checkout
   */
  async calculateCartDiscount(req, res) {
    try {
      const userId = req.user.user_id;
      const { cartItems } = req.body;

      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart items are required'
        });
      }

      const { getConnection } = require('../config/database');
      const pool = getConnection();
      let connection;

      try {
        connection = await pool.getConnection();

        // Get user's total purchase amount and referral status
        const [userRows] = await connection.execute(
          "SELECT total_purchase_amount, referral_link_unlocked FROM users WHERE user_id = ?",
          [userId]
        );

        if (!userRows[0]) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        const user = userRows[0];
        const totalPurchased = parseFloat(user.total_purchase_amount || 0);

        // Check if user is eligible for discount (must have unlocked referral AND total >= 5000)
        if (!user.referral_link_unlocked || totalPurchased < 5000) {
          return res.json({
            success: true,
            data: {
              eligible: false,
              discountAmount: 0,
              discountPercentage: 0,
              totalPurchased: totalPurchased,
              unlockThreshold: 5000,
              message: 'Complete purchases worth Rs. 5,000 to unlock referral discounts'
            }
          });
        }

        // Calculate profit for each cart item and total discount
        let totalDiscountAmount = 0;
        const itemBreakdown = [];

        for (const item of cartItems) {
          // Get product cost
          const [productRows] = await connection.execute(
            "SELECT cost, price FROM products WHERE product_id = ?",
            [item.product_id || item.id]
          );

          if (productRows[0]) {
            const product = productRows[0];
            const costPrice = parseFloat(product.cost || 0);
            const sellingPrice = parseFloat(item.price || product.price || 0);
            const quantity = parseInt(item.quantity || 1);

            // Calculate profit for this item
            const orderItem = {
              unit_price: sellingPrice,
              quantity: quantity,
              product_cost: costPrice
            };

            const itemProfit = await ProfitCalculator.calculateOrderItemProfit(orderItem);
            const discountData = await ProfitCalculator.calculateBuyerDiscount(userId, itemProfit.netProfit);

            if (discountData.discountApplicable) {
              totalDiscountAmount += discountData.discountAmount;
              itemBreakdown.push({
                product_id: item.product_id || item.id,
                product_title: item.product_title || item.name,
                netProfit: itemProfit.netProfit,
                discountPercentage: discountData.discountPercentage,
                discountAmount: discountData.discountAmount
              });
            }
          }
        }

        res.json({
          success: true,
          data: {
            eligible: true,
            discountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
            discountPercentage: totalPurchased >= 10000 ? 30 : Math.round(15 + ((totalPurchased - 5000) / (10000 - 5000)) * 15),
            totalPurchased: totalPurchased,
            userTier: totalPurchased >= 10000 ? 3 : 2,
            itemBreakdown: itemBreakdown,
            message: 'Referral discount applied!'
          }
        });

      } finally {
        if (connection) connection.release();
      }
    } catch (error) {
      console.error('Error calculating cart discount:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate cart discount'
      });
    }
  }
};

module.exports = referralController;