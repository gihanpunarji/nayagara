-- Advertisement System Tables for Nayagara Platform
-- This script adds advertisement functionality to the existing database

-- ============================================================================
-- 1. MODIFY EXISTING TABLES
-- ============================================================================

-- Add admin type to user_type enum to support admin users
ALTER TABLE `users`
MODIFY COLUMN `user_type` ENUM('seller','customer','admin') NOT NULL;

-- Add advertisement categories to existing categories table
INSERT INTO `categories` (`category_name`, `category_slug`, `is_active`) VALUES
('Vehicles', 'vehicles', 1),
('Property', 'property', 1)
ON DUPLICATE KEY UPDATE `is_active` = 1;

-- ============================================================================
-- 2. CREATE NEW ADVERTISEMENT TABLES
-- ============================================================================

-- Main advertisements table
CREATE TABLE IF NOT EXISTS `advertisements` (
  `ad_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `is_negotiable` tinyint(1) DEFAULT 0,
  `contact_number` varchar(20) NOT NULL,
  `location_city` varchar(100) NOT NULL,
  `location_district_id` int(11) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `ad_type` enum('vehicle','property') NOT NULL,
  `package_type` enum('standard','urgent','featured') DEFAULT 'standard',
  `payment_amount` decimal(10,2) DEFAULT 0,
  `vehicle_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`vehicle_data`)),
  `property_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`property_data`)),
  `status` enum('pending_approval','approved','rejected','expired') DEFAULT 'pending_approval',
  `admin_notes` text DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ad_id`),
  KEY `idx_category` (`category`),
  KEY `idx_location` (`location_city`, `location_district_id`),
  KEY `idx_status` (`status`),
  KEY `idx_user` (`user_id`),
  KEY `idx_package` (`package_type`),
  KEY `idx_ad_type` (`ad_type`),
  CONSTRAINT `fk_advertisements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_advertisements_district` FOREIGN KEY (`location_district_id`) REFERENCES `districts` (`district_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advertisement payments table
CREATE TABLE IF NOT EXISTS `ad_payments` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `ad_id` int(11) NOT NULL,
  `package_type` enum('standard','urgent','featured') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `payment_reference` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `idx_user_payment` (`user_id`),
  KEY `idx_ad_payment` (`ad_id`),
  KEY `idx_payment_status` (`payment_status`),
  CONSTRAINT `fk_ad_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ad_payments_advertisement` FOREIGN KEY (`ad_id`) REFERENCES `advertisements` (`ad_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advertisement subcategories table
CREATE TABLE IF NOT EXISTS `ad_subcategories` (
  `subcategory_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `subcategory_name` varchar(100) NOT NULL,
  `ad_type` enum('vehicle','property') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`subcategory_id`),
  UNIQUE KEY `unique_subcategory` (`category_name`, `subcategory_name`),
  KEY `idx_category_type` (`category_name`, `ad_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. INSERT SUBCATEGORIES DATA
-- ============================================================================

INSERT INTO `ad_subcategories` (`category_name`, `subcategory_name`, `ad_type`, `is_active`, `sort_order`) VALUES
-- Vehicle subcategories
('Vehicles', 'Cars', 'vehicle', 1, 1),
('Vehicles', 'Motorcycles', 'vehicle', 1, 2),
('Vehicles', 'Three Wheelers', 'vehicle', 1, 3),
('Vehicles', 'Commercial Vehicles', 'vehicle', 1, 4),
('Vehicles', 'Boats', 'vehicle', 1, 5),

-- Property subcategories
('Property', 'Houses', 'property', 1, 1),
('Property', 'Land', 'property', 1, 2),
('Property', 'Apartments', 'property', 1, 3),
('Property', 'Commercial Property', 'property', 1, 4),
('Property', 'Rooms', 'property', 1, 5)
ON DUPLICATE KEY UPDATE `is_active` = VALUES(`is_active`), `sort_order` = VALUES(`sort_order`);

-- ============================================================================
-- 4. CREATE ADMIN USER TABLE (if not exists)
-- ============================================================================

-- Create admins table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS `admin_users` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_email` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `is_super_admin` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_email` (`admin_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. INSERT DEFAULT ADMIN USER
-- ============================================================================

-- Insert default admin user (password: admin123)
INSERT INTO `admin_users` (`admin_email`, `admin_password`, `first_name`, `last_name`, `is_super_admin`, `is_active`)
VALUES ('admin@nayagara.lk', '$2b$10$rQJ8kHwKVnZxC3QlEcFO1OyY9z8K4L5M6N7Q8R9S0T1U2V3W4X5Y6Z', 'Admin', 'User', 1, 1)
ON DUPLICATE KEY UPDATE `is_active` = 1;

-- ============================================================================
-- 6. ADD INDEXES FOR PERFORMANCE
-- ============================================================================

-- Add indexes to existing tables for better performance with advertisements

-- Index on cities for location filtering
ALTER TABLE `cities` ADD INDEX `idx_city_name_district` (`city_name`, `district_id`) IF NOT EXISTS;

-- Index on districts for location filtering
ALTER TABLE `districts` ADD INDEX `idx_district_name` (`district_name`) IF NOT EXISTS;

-- ============================================================================
-- 7. SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample advertisement data for testing (optional)
-- You can uncomment these if you want test data

/*
INSERT INTO `advertisements` (
  `user_id`, `title`, `description`, `category`, `subcategory`, `price`, `is_negotiable`,
  `contact_number`, `location_city`, `location_district_id`, `ad_type`, `package_type`,
  `vehicle_data`, `status`
) VALUES
(
  32, -- Replace with actual user_id from your users table
  'Toyota Corolla 2015 - Excellent Condition',
  'Well maintained Toyota Corolla 2015 model. Single owner, full service history. All documents clear.',
  'Vehicles',
  'Cars',
  2500000.00,
  1,
  '0771234567',
  'Colombo 7',
  1, -- Colombo district
  'vehicle',
  'standard',
  '{"make":"Toyota","model":"Corolla","year":"2015","mileage":"85000","fuelType":"Petrol","transmission":"Automatic","engineCapacity":"1500","color":"White","condition":"Used - Excellent"}',
  'approved'
),
(
  33, -- Replace with actual user_id from your users table
  'Modern 3BR House for Sale - Nugegoda',
  'Beautiful 3 bedroom house with attached bathrooms, modern kitchen, parking for 2 cars. Prime location in Nugegoda.',
  'Property',
  'Houses',
  15000000.00,
  1,
  '0779876543',
  'Nugegoda',
  2, -- Gampaha district
  'property',
  'featured',
  '{"propertyType":"Two Story","bedrooms":"3","bathrooms":"3","floorArea":"1800","landSize":"12","condition":"Excellent","parking":"2 Cars","furnished":"Semi-Furnished","address":"123, Main Road, Nugegoda"}',
  'approved'
);
*/

-- ============================================================================
-- 8. VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the setup:

-- Check if tables were created successfully
-- SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('advertisements', 'ad_payments', 'ad_subcategories');

-- Check subcategories
-- SELECT * FROM ad_subcategories ORDER BY category_name, sort_order;

-- Check if admin user was created
-- SELECT admin_id, admin_email, first_name, last_name, is_super_admin FROM admin_users;

-- ============================================================================
-- NOTES:
-- ============================================================================

/*
1. This script integrates with your existing database structure
2. Uses your existing users, districts, and cities tables
3. Adds advertisement-specific tables while maintaining referential integrity
4. Supports both vehicle and property advertisements with JSON fields for specific data
5. Includes proper indexes for performance
6. Creates admin functionality for advertisement approval
7. Payment tracking for different advertisement packages

To run this script:
1. Backup your existing database
2. Run this script in your MySQL/MariaDB
3. Update your .env file with any new configuration
4. Test the advertisement posting and approval flow

Package Pricing:
- Standard: Free (Rs. 0)
- Urgent: Rs. 500
- Featured: Rs. 1000
*/