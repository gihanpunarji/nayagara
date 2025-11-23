-- Add amount_per_kilo column to shipping_settings table
ALTER TABLE shipping_settings ADD COLUMN IF NOT EXISTS amount_per_kilo DECIMAL(10,2) DEFAULT 200.00;

-- Set default value
UPDATE shipping_settings SET amount_per_kilo = 200.00 WHERE amount_per_kilo IS NULL OR amount_per_kilo = 0;

-- Or insert a row if table is empty
INSERT INTO shipping_settings (setting_key, setting_value, setting_description, amount_per_kilo)
VALUES ('default', 'default', 'Default shipping settings', 200.00)
ON DUPLICATE KEY UPDATE amount_per_kilo = 200.00;
