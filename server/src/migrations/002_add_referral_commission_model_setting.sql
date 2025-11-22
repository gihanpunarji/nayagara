INSERT INTO `system_settings` (`setting_category`, `setting_key`, `setting_value`, `setting_description`, `is_editable`)
VALUES
('general', 'referral_commission_model', 'option1', 'The model to use for calculating referrer commissions. Option 1: Standard commission. Option 2: Commission based on buyer''s spending tier.', 1)
ON DUPLICATE KEY UPDATE
`setting_value` = 'option1';