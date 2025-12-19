-- Add shipping rate setting
INSERT INTO shipping_settings (setting_key, setting_value, setting_description)
VALUES ('shipping_rate_per_kg', '200', 'Shipping cost per kilogram in LKR')
ON DUPLICATE KEY UPDATE
  setting_value = '200',
  setting_description = 'Shipping cost per kilogram in LKR';

-- Verify
SELECT * FROM shipping_settings WHERE setting_key = 'shipping_rate_per_kg';
