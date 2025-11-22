const { getConnection } = require("../config/database");
const Settings = require("../models/Settings");

class ProfitCalculator {
  /**
   * Calculates profit margins and fees for a product order
   * @param {Object} orderItem - The order item details
   * @param {number} orderItem.unit_price - Selling price of the product
   * @param {number} orderItem.quantity - Quantity ordered
   * @param {number} orderItem.product_cost - Cost price of the product
   * @returns {Object} Profit calculation details
   */
  static async calculateOrderItemProfit(orderItem) {
    try {
      const settings = await Settings.getAll();
      const gatewayFeePercent = parseFloat(settings.get('payment_gateway_fee_percent') || 3.0);
      
      const sellingPrice = parseFloat(orderItem.unit_price);
      const costPrice = parseFloat(orderItem.product_cost || 0);
      const quantity = parseInt(orderItem.quantity);
      
      // Total amounts
      const totalSellingAmount = sellingPrice * quantity;
      const totalCostAmount = costPrice * quantity;
      
      // Calculate gross profit
      const grossProfit = totalSellingAmount - totalCostAmount;
      
      // Calculate payment gateway fee (from selling price)
      const gatewayFee = (totalSellingAmount * gatewayFeePercent) / 100;
      
      // Calculate net profit after gateway fee
      const netProfit = grossProfit - gatewayFee;
      
      return {
        sellingPrice: sellingPrice,
        costPrice: costPrice,
        quantity: quantity,
        totalSellingAmount: totalSellingAmount,
        totalCostAmount: totalCostAmount,
        grossProfit: grossProfit,
        gatewayFeePercent: gatewayFeePercent,
        gatewayFee: gatewayFee,
        netProfit: netProfit,
        profitMargin: grossProfit > 0 ? (netProfit / totalSellingAmount) * 100 : 0
      };
    } catch (error) {
      console.error('Error calculating profit:', error);
      throw new Error('Failed to calculate profit margins');
    }
  }

  /**
   * Calculates total profit for an entire order
   * @param {Array} orderItems - Array of order items
   * @returns {Object} Total order profit calculation
   */
  static async calculateOrderProfit(orderItems) {
    try {
      let totalGrossProfit = 0;
      let totalGatewayFee = 0;
      let totalNetProfit = 0;
      let totalSellingAmount = 0;
      let totalCostAmount = 0;
      
      const itemProfits = [];
      
      for (const item of orderItems) {
        const itemProfit = await this.calculateOrderItemProfit(item);
        itemProfits.push({
          ...item,
          ...itemProfit
        });
        
        totalGrossProfit += itemProfit.grossProfit;
        totalGatewayFee += itemProfit.gatewayFee;
        totalNetProfit += itemProfit.netProfit;
        totalSellingAmount += itemProfit.totalSellingAmount;
        totalCostAmount += itemProfit.totalCostAmount;
      }
      
      return {
        items: itemProfits,
        totals: {
          totalSellingAmount,
          totalCostAmount,
          totalGrossProfit,
          totalGatewayFee,
          totalNetProfit,
          overallProfitMargin: totalSellingAmount > 0 ? (totalNetProfit / totalSellingAmount) * 100 : 0
        }
      };
    } catch (error) {
      console.error('Error calculating order profit:', error);
      throw new Error('Failed to calculate order profit margins');
    }
  }

  /**
   * Calculates discount amount based on user's purchase tier
   * @param {number} userId - User ID
   * @param {number} netProfit - Net profit amount to calculate discount from
   * @returns {Object} Discount calculation details
   */
  static async calculateBuyerDiscount(userId, netProfit) {
    try {
      const pool = getConnection();
      let connection;
      
      try {
        connection = await pool.getConnection();
        
        // Get user's total purchase amount
        const [userRows] = await connection.execute(
          "SELECT total_purchase_amount, referral_link_unlocked FROM users WHERE user_id = ?",
          [userId]
        );
        
        if (!userRows[0]) {
          throw new Error('User not found');
        }
        
        const user = userRows[0];
        const totalPurchased = parseFloat(user.total_purchase_amount || 0);
        
        // If user hasn't unlocked referral link (hasn't reached 5000), no discount
        if (!user.referral_link_unlocked || totalPurchased < 5000) {
          return {
            discountApplicable: false,
            discountAmount: 0,
            discountPercentage: 0,
            userTier: 0,
            totalPurchased: totalPurchased
          };
        }
        
        const settings = await Settings.getTiers();
        let discountPercentage = 0;
        let userTier = 1;
        
        // Determine user tier and discount percentage
        if (totalPurchased >= 10000) {
          // Tier 3: 10000+
          userTier = 3;
          discountPercentage = parseFloat(settings.referral_tier3_discount_percent || 30);
        } else if (totalPurchased >= 5000) {
          // Tier 2: 5001-10000 (sliding scale)
          userTier = 2;
          const maxDiscountPercent = parseFloat(settings.referral_tier2_max_discount_percent || 30);
          const tier1DiscountPercent = parseFloat(settings.referral_tier1_discount_percent || 15);
          
          // Calculate sliding discount: 15% at 5000, scaling to 30% at 10000
          const progressInTier = (totalPurchased - 5000) / (10000 - 5000);
          discountPercentage = tier1DiscountPercent + (progressInTier * (maxDiscountPercent - tier1DiscountPercent));
        } else {
          // Tier 1: Should not reach here if referral_link_unlocked is properly set
          userTier = 1;
          discountPercentage = parseFloat(settings.referral_tier1_discount_percent || 15);
        }
        
        const discountAmount = (netProfit * discountPercentage) / 100;
        
        return {
          discountApplicable: true,
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          discountPercentage: parseFloat(discountPercentage.toFixed(2)),
          userTier: userTier,
          totalPurchased: totalPurchased
        };
        
      } finally {
        if (connection) connection.release();
      }
    } catch (error) {
      console.error('Error calculating buyer discount:', error);
      throw new Error('Failed to calculate buyer discount');
    }
  }

  /**
   * Calculates commission distribution for referral chain
   * @param {number} buyerUserId - The user making the purchase
   * @param {number} netProfit - Net profit to distribute commissions from
   * @param {boolean} isFirstPurchase - Whether this is buyer's first purchase
   * @returns {Array} Commission distribution for each level
   */
  static async calculateCommissionDistribution(buyerUserId, netProfit, isFirstPurchase = false) {
    try {
      const pool = getConnection();
      let connection;
      
      try {
        connection = await pool.getConnection();
        
        // Get referral chain for the buyer
        const [chainRows] = await connection.execute(
          `SELECT level_1_user_id, level_2_user_id, level_3_user_id, level_4_user_id,
                  level_5_user_id, level_6_user_id, level_7_user_id, level_8_user_id
           FROM referral_chain WHERE user_id = ?`,
          [buyerUserId]
        );
        
        if (!chainRows[0]) {
          // No referral chain, all profit goes to system
          return {
            commissions: [],
            totalCommissionAmount: 0,
            systemAmount: netProfit
          };
        }
        
        const chain = chainRows[0];
        const settings = await Settings.getAll();
        const commissions = [];
        let totalCommissionAmount = 0;
        
        // Get buyer's purchase history for tier calculation
        const [buyerRows] = await connection.execute(
          "SELECT total_purchase_amount FROM users WHERE user_id = ?",
          [buyerUserId]
        );
        const buyerTotalPurchased = parseFloat(buyerRows[0]?.total_purchase_amount || 0);
        
        if (isFirstPurchase || buyerTotalPurchased < 5000) {
          // Scenario A: First purchase or below threshold
          const l1Commission = parseFloat(settings.get('referral_l1_commission_percent') || 30);
          const l2to8Commission = parseFloat(settings.get('referral_l2_to_8_commission_percent') || 5);
          
          // Level 1 (direct referrer)
          if (chain.level_1_user_id) {
            const commissionAmount = (netProfit * l1Commission) / 100;
            commissions.push({
              userId: chain.level_1_user_id,
              level: 1,
              percentage: l1Commission,
              amount: parseFloat(commissionAmount.toFixed(2))
            });
            totalCommissionAmount += commissionAmount;
          }
          
          // Levels 2-8
          const l2to8Amount = (netProfit * l2to8Commission) / 100;
          for (let level = 2; level <= 8; level++) {
            const userIdKey = `level_${level}_user_id`;
            if (chain[userIdKey]) {
              commissions.push({
                userId: chain[userIdKey],
                level: level,
                percentage: l2to8Commission,
                amount: parseFloat(l2to8Amount.toFixed(2))
              });
              totalCommissionAmount += l2to8Amount;
            }
          }
          
        } else {
          // Scenario B: Subsequent purchases with buyer getting discount
          const commissionModel = settings.get('referral_commission_model') || 'option1';
          
          if (commissionModel === 'option2') {
            // Use tiered commission structure based on buyer's tier
            const tierSettings = await Settings.getTiers();
            let l1Percent, l2to8Percent;
            
            if (buyerTotalPurchased >= 10000) {
              // Tier 3
              l1Percent = parseFloat(tierSettings.referral_option2_tier3_l1_percent || 30);
              l2to8Percent = parseFloat(tierSettings.referral_option2_tier3_l2_to_8_percent || 3);
            } else if (buyerTotalPurchased >= 5000) {
              // Tier 2
              l1Percent = parseFloat(tierSettings.referral_option2_tier2_l1_max_percent || 30);
              l2to8Percent = parseFloat(tierSettings.referral_option2_tier2_l2_to_8_max_percent || 3);
            } else {
              // Tier 1
              l1Percent = parseFloat(tierSettings.referral_option2_tier1_l1_percent || 30);
              l2to8Percent = parseFloat(tierSettings.referral_option2_tier1_l2_to_8_percent || 3);
            }
            
            // Level 1
            if (chain.level_1_user_id) {
              const commissionAmount = (netProfit * l1Percent) / 100;
              commissions.push({
                userId: chain.level_1_user_id,
                level: 1,
                percentage: l1Percent,
                amount: parseFloat(commissionAmount.toFixed(2))
              });
              totalCommissionAmount += commissionAmount;
            }
            
            // Levels 2-8
            const l2to8Amount = (netProfit * l2to8Percent) / 100;
            for (let level = 2; level <= 8; level++) {
              const userIdKey = `level_${level}_user_id`;
              if (chain[userIdKey]) {
                commissions.push({
                  userId: chain[userIdKey],
                  level: level,
                  percentage: l2to8Percent,
                  amount: parseFloat(l2to8Amount.toFixed(2))
                });
                totalCommissionAmount += l2to8Amount;
              }
            }
          }
        }
        
        const systemAmount = netProfit - totalCommissionAmount;
        
        return {
          commissions: commissions,
          totalCommissionAmount: parseFloat(totalCommissionAmount.toFixed(2)),
          systemAmount: parseFloat(systemAmount.toFixed(2))
        };
        
      } finally {
        if (connection) connection.release();
      }
    } catch (error) {
      console.error('Error calculating commission distribution:', error);
      throw new Error('Failed to calculate commission distribution');
    }
  }
}

module.exports = ProfitCalculator;