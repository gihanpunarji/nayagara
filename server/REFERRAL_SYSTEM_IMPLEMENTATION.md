# Enhanced 8-Level Referral System Implementation

## Overview
This implementation creates a comprehensive 8-level referral system with profit-based commissions, dynamic discount tiers, and automatic referral link unlocking at the 5000 rupee threshold.

## Key Features Implemented

### ✅ 1. Database Schema Enhancements
- **Users Table**: Added referral tracking fields
  - `total_purchase_amount`: Tracks cumulative purchases (excluding shipping)
  - `referral_link_unlocked`: Boolean for 5000+ threshold unlock
  - `referral_code`: Unique referral code for each user
  - `referred_by_user_id`: Direct referrer reference

- **New Tables**:
  - `referral_chain`: 8-level deep referral tracking
  - `referral_commissions`: Detailed commission tracking with profit breakdown
  - `user_purchase_tiers`: User tier management for discounts

### ✅ 2. Profit Calculation Engine
- **ProfitCalculator** (`/src/utils/profitCalculator.js`):
  - Calculates product profit: `selling_price - cost_price`
  - Deducts 3% payment gateway fee from selling price
  - Supports complex multi-product orders
  - Handles dynamic discount calculation by user tier

### ✅ 3. 8-Level Referral Chain Management
- **Referral Helpers** (`/src/utils/referralHelpers.js`):
  - Automatic chain creation when users register with referral codes
  - Commission distribution across 8 levels maximum
  - Referral link unlock when users reach 5000 rupee threshold
  - Purchase amount tracking and tier updates

### ✅ 4. Commission Structure (As Per Requirements)

#### **Scenario A: First Purchase or Below 5000 Threshold**
- **Level 1 (Direct Referrer)**: 30% of net profit
- **Levels 2-8**: 5% of net profit each
- **System**: Remaining profit

#### **Scenario B: Subsequent Purchases (5000+ threshold)**
- **Buyer Discount**:
  - Tier 1 (0-5000): 15% of net profit
  - Tier 2 (5001-10000): Sliding scale 15%-30% of net profit
  - Tier 3 (10000+): 30% of net profit
  
- **Referrer Commissions** (Option 2 Model):
  - **Level 1**: 30% of remaining profit
  - **Levels 2-8**: 3% of remaining profit each
  - **System**: Remaining profit

### ✅ 5. API Endpoints

#### **User Referral Management** (`/api/referral/*`)
- `GET /stats` - User's referral statistics
- `GET /validate/:referralCode` - Validate referral codes
- `POST /register` - Register with referral code
- `GET /my-code` - Get user's referral code
- `GET /my-earnings` - Get referral earnings
- `GET /my-referrals` - Get referred users

#### **Admin Management** (`/api/admin/referrals/*`)
- `GET /settings` - System settings
- `PUT /settings` - Update system settings
- `GET /users` - User referral data
- `GET /tiers` - Commission tiers
- `PUT /tiers` - Update commission tiers
- `GET /history` - Commission history

### ✅ 6. Automatic Order Processing
- **Order Completion Integration**:
  - Automatically processes referral commissions when payment is completed
  - Updates user purchase amounts and tier status
  - Applies buyer discounts for eligible users
  - Distributes commissions to referral chain
  - Updates wallet balances

### ✅ 7. Enhanced Models
- **User Model**: Added referral-aware user creation and purchase tracking
- **Wallet Model**: Enhanced for commission tracking
- **Settings Model**: Manages all referral configuration

## Implementation Details

### Purchase Amount Calculation
- Only product prices count toward the 5000 threshold (shipping excluded)
- Cumulative across all orders
- Automatically unlocks referral link at threshold

### Profit Distribution Logic
1. Calculate gross profit: `selling_price - cost_price`
2. Deduct payment gateway fee: `gross_profit - (selling_price × 3%)`
3. Apply buyer discount (if applicable): `net_profit × discount_percentage`
4. Distribute remaining profit to referral chain
5. System keeps remainder

### Commission Distribution Priority
1. **Payment Gateway Fee**: 3% of selling price
2. **Buyer Discount**: Varies by tier (0-30% of net profit)
3. **Level 1 Referrer**: 30% of remaining net profit
4. **Levels 2-8**: 3-5% each of remaining net profit
5. **System**: All remaining profit

## Database Migration Required

To apply this system, run:
```sql
SOURCE /path/to/server/sql/referral_system_enhancements.sql
```

This will:
- Add new columns to users table
- Create referral_chain, referral_commissions, and user_purchase_tiers tables
- Insert default system settings
- Initialize existing users with referral codes

## Testing Endpoints

### Calculate Profits (Development)
```
POST /api/referral/calculate-profit
{
  "orderItems": [
    {
      "unit_price": 100,
      "quantity": 2,
      "product_cost": 70
    }
  ]
}
```

### Simulate Commission Distribution
```
POST /api/referral/simulate-commission
{
  "buyerUserId": 123,
  "netProfit": 54,
  "isFirstPurchase": false
}
```

## System Configuration

All percentages and thresholds are configurable via the `system_settings` table:
- `payment_gateway_fee_percent`: 3.00
- `referral_unlock_purchase_threshold`: 5000.00
- `referral_l1_commission_percent`: 30.00
- `referral_l2_to_8_commission_percent`: 5.00 (first purchase) / 3.00 (subsequent)
- Tier discount percentages
- Commission model selection

## Example Scenarios

### Scenario 1: First Purchase - Product Price 100, Cost 70
- Gross Profit: 30
- Gateway Fee: 3 (3% of 100)
- Net Profit: 27
- L1 Commission: 8.1 (30% of 27)
- L2-8 Commission: 1.35 each (5% of 27)
- System: 8.65

### Scenario 2: User with 7500 Total Purchases - Same Product
- Net Profit: 27
- Buyer Discount: 6.075 (22.5% sliding scale)
- Remaining: 20.925
- L1 Commission: 6.28 (30% of remaining)
- L2-8 Commission: 0.628 each (3% of remaining)
- System: 10.255

## File Structure
```
server/
├── sql/
│   └── referral_system_enhancements.sql    # Database schema
├── src/
│   ├── controllers/
│   │   ├── referralController.js            # Referral API endpoints
│   │   ├── adminReferralController.js       # Enhanced admin endpoints
│   │   └── orderController.js               # Updated order processing
│   ├── models/
│   │   └── User.js                          # Enhanced user model
│   ├── routes/
│   │   └── referralRoutes.js                # Referral routes
│   └── utils/
│       ├── profitCalculator.js              # Profit calculation engine
│       └── referralHelpers.js               # Enhanced referral logic
```

## Security & Performance Considerations
- All database operations use transactions for consistency
- Referral processing doesn't block order completion
- Commission calculations are logged for audit
- User purchase amounts are cached for performance
- Referral codes are unique and secure

## Next Steps
1. Apply database migration
2. Test with sample data
3. Configure system settings as needed
4. Monitor commission distributions
5. Add frontend integration for referral management

---
*This implementation fully supports the complex 8-level referral system with dynamic discounts and profit-based commissions as specified.*