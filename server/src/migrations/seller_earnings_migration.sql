-- =================================================================
-- SELLER EARNINGS TRACKING SYSTEM - DATABASE MIGRATION
-- =================================================================
-- This migration creates the seller_earnings table to track
-- individual order earnings and payment status for sellers
-- =================================================================

-- Step 1: Create seller_earnings table
CREATE TABLE IF NOT EXISTS seller_earnings (
  earning_id INT PRIMARY KEY AUTO_INCREMENT,
  seller_id INT NOT NULL,
  order_id INT NOT NULL,
  order_number VARCHAR(50),
  customer_name VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  paid_at TIMESTAMP NULL,
  payment_id INT NULL,
  notes TEXT NULL,

  -- Foreign keys
  FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL,

  -- Indexes for performance
  INDEX idx_seller_status (seller_id, payment_status),
  INDEX idx_seller_paid (seller_id, paid_at),
  INDEX idx_order (order_id),
  INDEX idx_payment (payment_id)
);

-- Step 2: Add total_paid column to payments table (if not exists)
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS total_paid DECIMAL(10,2) DEFAULT 0
COMMENT 'Running total of all payments made to this seller';

-- Step 3: Populate seller_earnings from existing completed orders
INSERT INTO seller_earnings (seller_id, order_id, order_number, customer_name, amount, earned_at, payment_status)
SELECT
    oi.seller_id,
    o.order_id,
    o.order_number,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    SUM(oi.unit_price * oi.quantity) as amount,
    COALESCE(o.confirmed_at, o.order_datetime) as earned_at,
    'unpaid' as payment_status
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
LEFT JOIN users u ON o.customer_id = u.user_id
WHERE o.payment_status = 'completed'
GROUP BY oi.seller_id, o.order_id, o.order_number, customer_name, earned_at
ON DUPLICATE KEY UPDATE earning_id = earning_id; -- Prevent duplicates if run multiple times

-- Step 4: Initialize total_earned in users table from completed orders
UPDATE users u
SET total_earned = COALESCE((
    SELECT SUM(oi.unit_price * oi.quantity)
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    WHERE oi.seller_id = u.user_id
    AND o.payment_status = 'completed'
), 0)
WHERE u.user_type = 'seller';

-- Step 5: Initialize total_paid in payments table (running totals)
-- This uses session variables to calculate running totals per seller
SET @running_total = 0;
SET @current_user = NULL;

UPDATE payments p
JOIN (
    SELECT
        payment_id,
        user_id,
        amount,
        @running_total := IF(@current_user = user_id, @running_total + amount, amount) AS new_total_paid,
        @current_user := user_id
    FROM payments
    ORDER BY user_id, paid_at
) calc ON p.payment_id = calc.payment_id
SET p.total_paid = calc.new_total_paid;

-- Step 6: Verification queries (optional - comment out for production)
-- Check seller_earnings records
SELECT
    'Seller Earnings Summary' as Report,
    COUNT(*) as total_earnings,
    COUNT(CASE WHEN payment_status = 'unpaid' THEN 1 END) as unpaid_count,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_count,
    SUM(amount) as total_amount
FROM seller_earnings;

-- Check sellers with earnings
SELECT
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as seller_name,
    u.total_earned,
    (SELECT COUNT(*) FROM seller_earnings WHERE seller_id = u.user_id AND payment_status = 'unpaid') as unpaid_orders,
    (SELECT SUM(amount) FROM seller_earnings WHERE seller_id = u.user_id AND payment_status = 'unpaid') as unpaid_amount,
    (SELECT COUNT(*) FROM seller_earnings WHERE seller_id = u.user_id AND payment_status = 'paid') as paid_orders,
    (SELECT SUM(amount) FROM seller_earnings WHERE seller_id = u.user_id AND payment_status = 'paid') as paid_amount
FROM users u
WHERE u.user_type = 'seller'
ORDER BY u.total_earned DESC
LIMIT 10;

-- =================================================================
-- ROLLBACK SCRIPT (use if you need to undo the migration)
-- =================================================================
/*
-- Drop seller_earnings table
DROP TABLE IF EXISTS seller_earnings;

-- Remove total_paid column from payments
ALTER TABLE payments DROP COLUMN IF EXISTS total_paid;

-- Reset total_earned in users table
UPDATE users SET total_earned = 0 WHERE user_type = 'seller';
*/

-- =================================================================
-- END OF MIGRATION
-- =================================================================
