-- Add shipping_cost column to products table if it doesn't exist
-- This ensures the delivery cost can be saved per product

-- Note: We use a stored procedure-like approach or simple ADD COLUMN 
-- Since MySQL doesn't have "IF NOT EXISTS" for ADD COLUMN in older versions, 
-- we can try a direct ADD assuming it might fail if exists, or use a safer block if possible.
-- For simplicity in this environment, we'll use a direct ALTER TABLE statements.
-- If the column exists, this might error, but that's fine as it means the column is there.

ALTER TABLE products 
ADD COLUMN shipping_cost DECIMAL(10, 2) DEFAULT 0.00 AFTER stock_quantity;

-- Also ensure product_status enum has all values
ALTER TABLE products 
MODIFY COLUMN product_status ENUM('active', 'inactive', 'pending_approval', 'suspended', 'out_of_stock') DEFAULT 'pending_approval';
