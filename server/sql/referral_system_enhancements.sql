-- Enhanced Referral System Database Schema
-- Supporting 8-level referral chains with complex commission structure

-- Add columns to users table for tracking purchase amounts and referral status
ALTER TABLE users 
ADD COLUMN total_purchase_amount DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN referral_link_unlocked BOOLEAN DEFAULT FALSE,
ADD COLUMN referral_code VARCHAR(50) UNIQUE,
ADD COLUMN referred_by_user_id INT,
ADD INDEX idx_referred_by (referred_by_user_id),
ADD INDEX idx_total_purchase (total_purchase_amount),
ADD INDEX idx_referral_code (referral_code);

-- Create enhanced referral chain table to support 8-level tracking
CREATE TABLE IF NOT EXISTS referral_chain (
    chain_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level_1_user_id INT,
    level_2_user_id INT,
    level_3_user_id INT,
    level_4_user_id INT,
    level_5_user_id INT,
    level_6_user_id INT,
    level_7_user_id INT,
    level_8_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_level_1 (level_1_user_id),
    INDEX idx_level_2 (level_2_user_id),
    INDEX idx_level_3 (level_3_user_id),
    INDEX idx_level_4 (level_4_user_id),
    INDEX idx_level_5 (level_5_user_id),
    INDEX idx_level_6 (level_6_user_id),
    INDEX idx_level_7 (level_7_user_id),
    INDEX idx_level_8 (level_8_user_id),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (level_1_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (level_2_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (level_3_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (level_4_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (level_5_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (level_6_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (level_7_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (level_8_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Enhanced referral commissions table with detailed tracking
CREATE TABLE IF NOT EXISTS referral_commissions (
    commission_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_item_id INT,
    buyer_user_id INT NOT NULL,
    referrer_user_id INT NOT NULL,
    referrer_level INT NOT NULL, -- 1-8
    original_profit_amount DECIMAL(10,2) NOT NULL,
    gateway_fee_amount DECIMAL(10,2) NOT NULL,
    net_profit_amount DECIMAL(10,2) NOT NULL,
    commission_percentage DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    commission_type ENUM('first_purchase', 'subsequent_purchase', 'discount_referral') NOT NULL,
    buyer_discount_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    INDEX idx_order (order_id),
    INDEX idx_buyer (buyer_user_id),
    INDEX idx_referrer (referrer_user_id),
    INDEX idx_level (referrer_level),
    INDEX idx_type (commission_type),
    INDEX idx_processed (processed_at),
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (referrer_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User purchase history for tier calculations
CREATE TABLE IF NOT EXISTS user_purchase_tiers (
    tier_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    current_tier INT NOT NULL, -- 1: 0-5000, 2: 5001-10000, 3: 10000+
    tier_start_amount DECIMAL(10,2) NOT NULL,
    tier_end_amount DECIMAL(10,2),
    discount_percentage DECIMAL(5,2) NOT NULL,
    commission_l1_percentage DECIMAL(5,2) NOT NULL,
    commission_l2_to_8_percentage DECIMAL(5,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_tier (user_id),
    INDEX idx_tier (current_tier),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- System settings for referral configuration
INSERT INTO system_settings (setting_key, setting_value, setting_category, setting_description) VALUES 
-- Basic system settings
('payment_gateway_fee_percent', '3.00', 'system', 'Payment gateway fee percentage'),
('referral_total_payout_percent', '30.00', 'system', 'Total distributable payout percentage'),
('referral_unlock_purchase_threshold', '5000.00', 'system', 'Purchase threshold to unlock referral link'),
('referral_commission_model', 'option1', 'system', 'Commission calculation model'),

-- Scenario A: First purchase commissions
('referral_l1_commission_percent', '30.00', 'referral_tiers', 'Level 1 commission for first purchase'),
('referral_l2_to_8_commission_percent', '5.00', 'referral_tiers', 'Levels 2-8 commission for first purchase'),

-- Scenario B: Buyer discounts by tier
('referral_tier1_discount_percent', '15.00', 'referral_tiers', 'Tier 1 (0-5000) buyer discount'),
('referral_tier2_max_discount_percent', '30.00', 'referral_tiers', 'Tier 2 (5001-10000) max buyer discount'),
('referral_tier3_discount_percent', '30.00', 'referral_tiers', 'Tier 3 (10000+) buyer discount'),

-- Option 2 referrer commissions by tier
('referral_option2_tier1_l1_percent', '30.00', 'referral_tiers', 'Option 2 Tier 1 L1 commission'),
('referral_option2_tier1_l2_to_8_percent', '3.00', 'referral_tiers', 'Option 2 Tier 1 L2-8 commission'),
('referral_option2_tier2_l1_max_percent', '30.00', 'referral_tiers', 'Option 2 Tier 2 L1 max commission'),
('referral_option2_tier2_l2_to_8_max_percent', '3.00', 'referral_tiers', 'Option 2 Tier 2 L2-8 max commission'),
('referral_option2_tier3_l1_percent', '30.00', 'referral_tiers', 'Option 2 Tier 3 L1 commission'),
('referral_option2_tier3_l2_to_8_percent', '3.00', 'referral_tiers', 'Option 2 Tier 3 L2-8 commission')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Create function to generate referral codes
DELIMITER //
CREATE FUNCTION IF NOT EXISTS generate_referral_code(user_id INT) 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    RETURN CONCAT('REF', LPAD(user_id, 6, '0'), SUBSTRING(MD5(CONCAT(user_id, UNIX_TIMESTAMP())), 1, 6));
END//
DELIMITER ;

-- Update existing users to have referral codes and initialize purchase amounts
UPDATE users 
SET 
    referral_code = generate_referral_code(user_id),
    total_purchase_amount = 0.00,
    referral_link_unlocked = FALSE
WHERE referral_code IS NULL;