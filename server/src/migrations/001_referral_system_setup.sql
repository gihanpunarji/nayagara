-- Migration to set up the referral and discount system

-- 1. Add market_price to the products table
-- This will store the market value of a product, used to calculate profit.
ALTER TABLE `products`
ADD COLUMN `market_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 AFTER `price`;

-- 2. Add columns to the users table for tracking referral progress
-- total_purchase_amount: Tracks lifetime spending to determine discount tiers.
-- referral_link_unlocked: A flag to check if the user can refer others.
ALTER TABLE `users`
ADD COLUMN `total_purchase_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 AFTER `nic`,
ADD COLUMN `referral_link_unlocked` BOOLEAN NOT NULL DEFAULT FALSE AFTER `total_purchase_amount`;

-- 3. Add a setting for the payment gateway fee percentage
-- This allows the admin to adjust the fee used in the net profit calculation.
INSERT INTO `system_settings` (`setting_category`, `setting_key`, `setting_value`, `setting_description`, `is_editable`)
VALUES
('payment', 'payment_gateway_fee_percent', '3.0', 'The percentage (e.g., 3.0 for 3%) deducted for payment gateway fees when calculating net profit for referral commissions.', 1)
ON DUPLICATE KEY UPDATE
`setting_value` = '3.0';

-- 4. Add a setting for the total distributable profit percentage
-- This is the total percentage of net profit shared among the buyer (as discount) and referrers (as commission) in Scenario B.
INSERT INTO `system_settings` (`setting_category`, `setting_key`, `setting_value`, `setting_description`, `is_editable`)
VALUES
('general', 'referral_total_payout_percent', '81.0', 'The total percentage of Net Profit (e.g., 81.0 for 81%) distributed as buyer discounts and referrer commissions for subsequent purchases.', 1)
ON DUPLICATE KEY UPDATE
`setting_value` = '81.0';

-- 5. Add a setting for the purchase threshold to unlock referrals
INSERT INTO `system_settings` (`setting_category`, `setting_key`, `setting_value`, `setting_description`, `is_editable`)
VALUES
('general', 'referral_unlock_purchase_threshold', '5000', 'The total lifetime purchase amount a user must reach to unlock their referral link.', 1)
ON DUPLICATE KEY UPDATE
`setting_value` = '5000';
