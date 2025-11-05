/*
 Navicat Premium Dump SQL

 Source Server         : sql connection
 Source Server Type    : MySQL
 Source Server Version : 80035 (8.0.35)
 Source Host           : localhost:3306
 Source Schema         : nayagara_db

 Target Server Type    : MySQL
 Target Server Version : 80035 (8.0.35)
 File Encoding         : 65001

 Date: 05/11/2025 10:38:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ad_packages
-- ----------------------------
DROP TABLE IF EXISTS `ad_packages`;
CREATE TABLE `ad_packages` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `package_name` varchar(100) NOT NULL,
  `package_description` text,
  `price` decimal(10,2) NOT NULL,
  `duration_days` int NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `applicable_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`package_id`),
  CONSTRAINT `ad_packages_chk_1` CHECK (json_valid(`features`)),
  CONSTRAINT `ad_packages_chk_2` CHECK (json_valid(`applicable_categories`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for addresses
-- ----------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_type` enum('billing','shipping','seller_business') NOT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `city_id` int NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `city_id` (`city_id`),
  KEY `idx_user_address` (`user_id`,`address_type`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `addresses_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_email` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `mobile` varchar(11) NOT NULL,
  `is_super_admin` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email_code` int DEFAULT NULL,
  `mobile_code` int DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_email` (`admin_email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `category_slug` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_slug` (`category_slug`),
  KEY `idx_active_categories` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for category_fields
-- ----------------------------
DROP TABLE IF EXISTS `category_fields`;
CREATE TABLE `category_fields` (
  `field_id` int NOT NULL AUTO_INCREMENT,
  `field_name` varchar(100) NOT NULL,
  `field_label` varchar(100) NOT NULL,
  `field_type` enum('text','number','select','multiselect','date','boolean','textarea','file') NOT NULL,
  `field_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_required` tinyint(1) DEFAULT '0',
  `validation_rules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `sub_categories_sub_category_id` int NOT NULL,
  PRIMARY KEY (`field_id`),
  KEY `fk_category_fields_sub_categories1_idx` (`sub_categories_sub_category_id`),
  CONSTRAINT `fk_category_fields_sub_categories1` FOREIGN KEY (`sub_categories_sub_category_id`) REFERENCES `mydb`.`sub_categories` (`sub_category_id`),
  CONSTRAINT `category_fields_chk_1` CHECK (json_valid(`field_options`)),
  CONSTRAINT `category_fields_chk_2` CHECK (json_valid(`validation_rules`))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for cities
-- ----------------------------
DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(100) NOT NULL,
  `district_id` int NOT NULL,
  PRIMARY KEY (`city_id`),
  UNIQUE KEY `unique_city_per_district` (`city_name`,`district_id`),
  KEY `district_id` (`district_id`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`)
) ENGINE=InnoDB AUTO_INCREMENT=289 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for conversations
-- ----------------------------
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations` (
  `conversation_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `customer_id` int NOT NULL,
  `seller_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `conversation_type` enum('customer_seller','customer_admin','seller_admin') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `status` enum('active','closed','archived') DEFAULT 'active',
  `last_message_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`conversation_id`),
  KEY `idx_customer_conversations` (`customer_id`,`last_message_at`),
  KEY `idx_seller_conversations` (`seller_id`,`last_message_at`),
  KEY `idx_admin_conversations` (`admin_id`,`last_message_at`),
  KEY `idx_product_conversations` (`product_id`,`created_at`),
  CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `conversations_ibfk_4` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for countries
-- ----------------------------
DROP TABLE IF EXISTS `countries`;
CREATE TABLE `countries` (
  `country_id` int NOT NULL AUTO_INCREMENT,
  `country_name` varchar(100) NOT NULL,
  `country_code` varchar(3) NOT NULL,
  `currency_code` varchar(3) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`country_id`),
  UNIQUE KEY `country_name` (`country_name`),
  UNIQUE KEY `country_code` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for coupon_usage
-- ----------------------------
DROP TABLE IF EXISTS `coupon_usage`;
CREATE TABLE `coupon_usage` (
  `usage_id` int NOT NULL AUTO_INCREMENT,
  `coupon_id` int NOT NULL,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `used_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usage_id`),
  KEY `order_id` (`order_id`),
  KEY `idx_coupon_usage` (`coupon_id`,`used_at`),
  KEY `idx_user_coupon_usage` (`user_id`,`used_at`),
  CONSTRAINT `coupon_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`),
  CONSTRAINT `coupon_usage_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `coupon_usage_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for coupons
-- ----------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `coupon_id` int NOT NULL AUTO_INCREMENT,
  `coupon_code` varchar(50) NOT NULL,
  `coupon_name` varchar(100) NOT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `minimum_order_amount` decimal(10,2) DEFAULT '0.00',
  `maximum_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `usage_count` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `valid_from` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_until` timestamp NOT NULL,
  `applicable_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`coupon_id`),
  UNIQUE KEY `coupon_code` (`coupon_code`),
  KEY `idx_coupon_code` (`coupon_code`,`is_active`),
  KEY `idx_coupon_validity` (`is_active`,`valid_from`,`valid_until`),
  CONSTRAINT `coupons_chk_1` CHECK (json_valid(`applicable_categories`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for districts
-- ----------------------------
DROP TABLE IF EXISTS `districts`;
CREATE TABLE `districts` (
  `district_id` int NOT NULL AUTO_INCREMENT,
  `district_name` varchar(100) NOT NULL,
  `province_id` int NOT NULL,
  PRIMARY KEY (`district_id`),
  UNIQUE KEY `unique_district_per_province` (`district_name`,`province_id`),
  KEY `province_id` (`province_id`),
  CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_type` enum('customer','seller','admin') NOT NULL,
  `sender_id` int NOT NULL,
  `message_text` text NOT NULL,
  `message_type` enum('text','image','file') DEFAULT 'text',
  `attachment_url` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `idx_conversation_messages` (`conversation_id`,`sent_at`),
  KEY `idx_unread_messages` (`conversation_id`,`is_read`,`sent_at`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_type` enum('admin','seller','customer') NOT NULL,
  `user_id` int NOT NULL,
  `notification_type` enum('order','message','product_approved','product_expired','review','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `related_id` int DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_user_notifications` (`user_type`,`user_id`,`is_read`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_description` text,
  `unit_price` decimal(15,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `total_price` decimal(15,2) NOT NULL,
  `product_attributes_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `product_image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_order_items` (`order_id`),
  KEY `idx_seller_orders` (`seller_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `order_items_chk_1` CHECK (json_valid(`product_attributes_snapshot`))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for order_payments
-- ----------------------------
DROP TABLE IF EXISTS `order_payments`;
CREATE TABLE `order_payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_status` enum('pending','processing','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `gateway_reference` varchar(255) DEFAULT NULL,
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `paid_at` timestamp NULL DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL,
  `refund_amount` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `idx_order_payments` (`order_id`),
  KEY `idx_payment_status` (`payment_status`,`created_at`),
  KEY `idx_transaction_id` (`transaction_id`),
  CONSTRAINT `order_payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_payments_ibfk_2` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`method_id`),
  CONSTRAINT `order_payments_chk_1` CHECK (json_valid(`gateway_response`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for order_shipping_addresses
-- ----------------------------
DROP TABLE IF EXISTS `order_shipping_addresses`;
CREATE TABLE `order_shipping_addresses` (
  `shipping_address_id` int NOT NULL AUTO_INCREMENT,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `city_name` varchar(100) NOT NULL,
  `district_name` varchar(100) NOT NULL,
  `province_name` varchar(100) NOT NULL,
  `country_name` varchar(100) NOT NULL,
  PRIMARY KEY (`shipping_address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `customer_id` int NOT NULL,
  `shipping_address_id` int NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT '0.00',
  `tax_amount` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(15,2) NOT NULL,
  `order_status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `tracking_number` varchar(100) DEFAULT NULL,
  `order_datetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `shipping_address_id` (`shipping_address_id`),
  KEY `idx_customer_orders` (`customer_id`,`order_datetime`),
  KEY `idx_order_status` (`order_status`,`order_datetime`),
  KEY `idx_tracking_number` (`tracking_number`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shipping_address_id`) REFERENCES `order_shipping_addresses` (`shipping_address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for payment_methods
-- ----------------------------
DROP TABLE IF EXISTS `payment_methods`;
CREATE TABLE `payment_methods` (
  `method_id` int NOT NULL AUTO_INCREMENT,
  `method_name` varchar(50) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `method_description` text,
  `processing_fee` decimal(5,2) DEFAULT '0.00',
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for product_images
-- ----------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_alt` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`image_id`),
  KEY `idx_product_images` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=506 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for product_packages
-- ----------------------------
DROP TABLE IF EXISTS `product_packages`;
CREATE TABLE `product_packages` (
  `product_package_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `package_id` int NOT NULL,
  `purchase_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` timestamp NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  PRIMARY KEY (`product_package_id`),
  KEY `product_id` (`product_id`),
  KEY `package_id` (`package_id`),
  CONSTRAINT `product_packages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `product_packages_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `ad_packages` (`package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for product_reviews
-- ----------------------------
DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE `product_reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_item_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `review_title` varchar(255) DEFAULT NULL,
  `review_text` text,
  `is_verified_purchase` tinyint(1) DEFAULT '0',
  `review_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `helpful_votes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `unique_user_product_review` (`user_id`,`product_id`),
  KEY `order_item_id` (`order_item_id`),
  KEY `idx_product_reviews` (`product_id`,`review_status`,`created_at`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `product_reviews_ibfk_3` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_title` varchar(255) NOT NULL,
  `product_slug` varchar(255) NOT NULL,
  `product_description` text,
  `category_id` int NOT NULL,
  `seller_id` int DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `currency_code` varchar(3) DEFAULT 'LKR',
  `weight_kg` decimal(8,3) DEFAULT '0.000',
  `stock_quantity` int DEFAULT '0',
  `product_status` enum('draft','pending_approval','active','inactive','sold','expired') DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_promoted` tinyint(1) DEFAULT '0',
  `location_city_id` int DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `inquiry_count` int DEFAULT '0',
  `product_attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_slug` (`product_slug`),
  KEY `idx_category_status` (`category_id`,`product_status`),
  KEY `idx_seller_products` (`seller_id`,`product_status`),
  KEY `idx_location_products` (`location_city_id`,`product_status`),
  KEY `idx_featured_products` (`is_featured`,`product_status`),
  KEY `idx_stock_products` (`stock_quantity`,`product_status`),
  FULLTEXT KEY `idx_product_search` (`product_title`,`product_description`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `products_ibfk_4` FOREIGN KEY (`location_city_id`) REFERENCES `cities` (`city_id`),
  CONSTRAINT `products_chk_1` CHECK (json_valid(`product_attributes`))
) ENGINE=InnoDB AUTO_INCREMENT=1006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for provinces
-- ----------------------------
DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces` (
  `province_id` int NOT NULL AUTO_INCREMENT,
  `province_name` varchar(100) NOT NULL,
  `country_id` int NOT NULL,
  PRIMARY KEY (`province_id`),
  UNIQUE KEY `unique_province_per_country` (`province_name`,`country_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `provinces_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for referral
-- ----------------------------
DROP TABLE IF EXISTS `referral`;
CREATE TABLE `referral` (
  `referral_id` int NOT NULL AUTO_INCREMENT,
  `users_user_id` int NOT NULL,
  `referral_code` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `referred_by` int NOT NULL,
  PRIMARY KEY (`referral_id`),
  KEY `fk_referral_users1_idx` (`users_user_id`),
  KEY `fk_referral_users2_idx` (`referred_by`),
  CONSTRAINT `fk_referral_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_referral_users2` FOREIGN KEY (`referred_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for referral_milestone
-- ----------------------------
DROP TABLE IF EXISTS `referral_milestone`;
CREATE TABLE `referral_milestone` (
  `milestone_id` int NOT NULL AUTO_INCREMENT,
  `milestone_type` enum('REFERRAL LINK','DISCOUNT') DEFAULT NULL,
  `achieved_at` timestamp NULL DEFAULT NULL,
  `users_user_id` int NOT NULL,
  PRIMARY KEY (`milestone_id`),
  KEY `fk_referral_milestone_users1_idx` (`users_user_id`),
  CONSTRAINT `fk_referral_milestone_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for referral_rewards
-- ----------------------------
DROP TABLE IF EXISTS `referral_rewards`;
CREATE TABLE `referral_rewards` (
  `rewards_id` int NOT NULL AUTO_INCREMENT,
  `level` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `reward_amount` double DEFAULT NULL,
  `users_user_id` int NOT NULL,
  `orders_order_id` int NOT NULL,
  PRIMARY KEY (`rewards_id`),
  KEY `fk_referral_rewards_users1_idx` (`users_user_id`),
  KEY `fk_referral_rewards_orders1_idx` (`orders_order_id`),
  CONSTRAINT `fk_referral_rewards_orders1` FOREIGN KEY (`orders_order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_referral_rewards_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for refund_payments
-- ----------------------------
DROP TABLE IF EXISTS `refund_payments`;
CREATE TABLE `refund_payments` (
  `refund_payment_id` int NOT NULL AUTO_INCREMENT,
  `return_request_id` int NOT NULL,
  `original_payment_id` int NOT NULL,
  `refund_amount` decimal(15,2) NOT NULL,
  `refund_method` enum('original_payment_method','bank_transfer','store_credit') DEFAULT 'original_payment_method',
  `refund_status` enum('pending','processing','completed','failed') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`refund_payment_id`),
  KEY `return_request_id` (`return_request_id`),
  KEY `original_payment_id` (`original_payment_id`),
  KEY `idx_refund_status` (`refund_status`,`created_at`),
  CONSTRAINT `refund_payments_ibfk_1` FOREIGN KEY (`return_request_id`) REFERENCES `return_requests` (`return_id`),
  CONSTRAINT `refund_payments_ibfk_2` FOREIGN KEY (`original_payment_id`) REFERENCES `order_payments` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for return_requests
-- ----------------------------
DROP TABLE IF EXISTS `return_requests`;
CREATE TABLE `return_requests` (
  `return_id` int NOT NULL AUTO_INCREMENT,
  `order_item_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `return_reason` enum('defective_product','wrong_item_sent','not_as_described','damaged_in_shipping','changed_mind','other') NOT NULL,
  `return_description` text,
  `return_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `return_status` enum('requested','under_review','approved','rejected','item_received','refund_processed','completed','cancelled') DEFAULT 'requested',
  `admin_notes` text,
  `refund_amount` decimal(15,2) DEFAULT NULL,
  `refund_type` enum('full_refund','partial_refund','replacement','store_credit') DEFAULT 'full_refund',
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `refund_processed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`return_id`),
  KEY `order_item_id` (`order_item_id`),
  KEY `idx_customer_returns` (`customer_id`,`requested_at`),
  KEY `idx_seller_returns` (`seller_id`,`return_status`),
  KEY `idx_return_status` (`return_status`,`requested_at`),
  CONSTRAINT `return_requests_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`),
  CONSTRAINT `return_requests_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `return_requests_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `return_requests_chk_1` CHECK (json_valid(`return_images`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for review_helpful_votes
-- ----------------------------
DROP TABLE IF EXISTS `review_helpful_votes`;
CREATE TABLE `review_helpful_votes` (
  `vote_id` int NOT NULL AUTO_INCREMENT,
  `review_id` int NOT NULL,
  `user_id` int NOT NULL,
  `is_helpful` tinyint(1) NOT NULL,
  `voted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`vote_id`),
  UNIQUE KEY `unique_user_review_vote` (`review_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `review_helpful_votes_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`review_id`) ON DELETE CASCADE,
  CONSTRAINT `review_helpful_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for shipping_settings
-- ----------------------------
DROP TABLE IF EXISTS `shipping_settings`;
CREATE TABLE `shipping_settings` (
  `setting_id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(500) NOT NULL,
  `setting_description` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for shopping_cart
-- ----------------------------
DROP TABLE IF EXISTS `shopping_cart`;
CREATE TABLE `shopping_cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `unique_user_product_cart` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_user_cart` (`user_id`),
  CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `shopping_cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for shopping_cart_item
-- ----------------------------
DROP TABLE IF EXISTS `shopping_cart_item`;
CREATE TABLE `shopping_cart_item` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `shopping_cart_cart_id` int NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `fk_shopping_cart_item_shopping_cart1_idx` (`shopping_cart_cart_id`),
  CONSTRAINT `fk_shopping_cart_item_shopping_cart1` FOREIGN KEY (`shopping_cart_cart_id`) REFERENCES `shopping_cart` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for system_settings
-- ----------------------------
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `setting_id` int NOT NULL AUTO_INCREMENT,
  `setting_category` enum('general','payment','shipping','notification','seo','security') NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `setting_description` text,
  `is_editable` tinyint(1) DEFAULT '1',
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `unique_setting` (`setting_category`,`setting_key`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for transaction_type
-- ----------------------------
DROP TABLE IF EXISTS `transaction_type`;
CREATE TABLE `transaction_type` (
  `transaction_type_id` int(10) unsigned zerofill NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `wallet_transactions_transaction_id` int NOT NULL,
  PRIMARY KEY (`transaction_type_id`),
  KEY `fk_transaction_type_wallet_transactions1_idx` (`wallet_transactions_transaction_id`),
  CONSTRAINT `fk_transaction_type_wallet_transactions1` FOREIGN KEY (`wallet_transactions_transaction_id`) REFERENCES `wallet_transactions` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for user_wallet
-- ----------------------------
DROP TABLE IF EXISTS `user_wallet`;
CREATE TABLE `user_wallet` (
  `wallet_id` int NOT NULL AUTO_INCREMENT,
  `balance` double NOT NULL DEFAULT '0',
  `last_updated` timestamp NOT NULL,
  `users_user_id` int NOT NULL,
  PRIMARY KEY (`wallet_id`),
  KEY `fk_user_wallet_users1_idx` (`users_user_id`),
  CONSTRAINT `fk_user_wallet_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `user_mobile` varchar(20) DEFAULT NULL,
  `nic` varchar(12) DEFAULT NULL,
  `user_type` enum('seller','customer') NOT NULL,
  `user_status` enum('active','inactive','suspended','pending_verification') DEFAULT 'pending_verification',
  `email_verified` tinyint(1) DEFAULT '0',
  `mobile_verified` tinyint(1) DEFAULT '0',
  `profile_image` varchar(500) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mobile_verification_code` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  UNIQUE KEY `user_mobile` (`user_mobile`),
  UNIQUE KEY `nic_UNIQUE` (`nic`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for wallet_transactions
-- ----------------------------
DROP TABLE IF EXISTS `wallet_transactions`;
CREATE TABLE `wallet_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `user_wallet_wallet_id` int NOT NULL,
  `amount` double DEFAULT NULL,
  `description` text,
  `bebitted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `fk_wallet_transactions_user_wallet1_idx` (`user_wallet_wallet_id`),
  CONSTRAINT `fk_wallet_transactions_user_wallet1` FOREIGN KEY (`user_wallet_wallet_id`) REFERENCES `user_wallet` (`wallet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for whishlist_item
-- ----------------------------
DROP TABLE IF EXISTS `whishlist_item`;
CREATE TABLE `whishlist_item` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `wishlist_wishlist_id` int NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `fk_whishlist_item_wishlist1_idx` (`wishlist_wishlist_id`),
  CONSTRAINT `fk_whishlist_item_wishlist1` FOREIGN KEY (`wishlist_wishlist_id`) REFERENCES `wishlist` (`wishlist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for wishlist
-- ----------------------------
DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE `wishlist` (
  `wishlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `unique_user_product_wishlist` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_user_wishlist` (`user_id`,`added_at`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
