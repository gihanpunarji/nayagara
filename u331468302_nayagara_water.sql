-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 08, 2025 at 09:23 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u331468302_nayagara_water`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_type` enum('billing','shipping','seller_business') NOT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `city_id` int(11) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `address_type`, `line1`, `line2`, `postal_code`, `city_id`, `is_default`, `is_active`, `updated_at`) VALUES
(1, 39, 'seller_business', 'I 52/2 Pannala North ', 'Ampagala', '73232', 286, 1, 1, '2025-10-05 03:22:08'),
(2, 44, 'seller_business', '123 Test St', 'Unit 1', '10000', 1, 1, 1, '2025-10-04 12:41:00'),
(3, 46, 'seller_business', 'No 31/ Jayanthi Mawatha', 'nikaweratiya', '31244', 187, 1, 1, '2025-10-05 12:04:51');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `mobile` varchar(11) NOT NULL,
  `is_super_admin` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_code` int(6) DEFAULT NULL,
  `mobile_code` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `admin_email`, `admin_password`, `first_name`, `last_name`, `mobile`, `is_super_admin`, `is_active`, `last_login`, `created_at`, `updated_at`, `email_code`, `mobile_code`) VALUES
(2, 'gihanpunarji@gmail.com', '$2b$10$ixL06.BNLYZ5yENxpaMVG.m7zXugVQxzrNXIIymVT09gF1HYjY8sa', 'Gayan', 'Pushpakumara', '94788915271', 1, 1, '2025-09-29 12:12:07', '2025-09-29 12:12:07', '2025-10-02 15:00:12', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ad_packages`
--

CREATE TABLE `ad_packages` (
  `package_id` int(11) NOT NULL,
  `package_name` varchar(100) NOT NULL,
  `package_description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `applicable_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`applicable_categories`)),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bank`
--

CREATE TABLE `bank` (
  `bank_id` int(11) NOT NULL,
  `bank_name` varchar(40) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `holder_name` varchar(50) NOT NULL,
  `bank_code` int(11) NOT NULL,
  `branch_name` varchar(20) NOT NULL,
  `users_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bank`
--

INSERT INTO `bank` (`bank_id`, `bank_name`, `account_number`, `holder_name`, `bank_code`, `branch_name`, `users_user_id`) VALUES
(1, 'People\'s Bank', '102030405060', 'Genius Seller', 100010, 'Ruwanwella', 39),
(2, 'Commercial Bank', '5000200001', 'Akila Bhanuka', 43, 'Anamaduwa', 37);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_slug` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `category_slug`, `is_active`) VALUES
(1, 'Electronics', 'electronics', 1),
(2, 'Fashion', 'fashion', 1),
(3, 'Home & Living', 'home-living', 1),
(4, 'Beauty & Health', 'beauty-health', 1),
(5, 'Sports', 'sports', 1),
(6, 'Automotive', 'automotive', 1),
(7, 'Books & Media', 'books-media', 1),
(8, 'Groceries', 'groceries', 1),
(9, 'Toys & Games', 'toys-games', 1),
(10, 'Services', 'services', 1);

-- --------------------------------------------------------

--
-- Table structure for table `category_fields`
--

CREATE TABLE `category_fields` (
  `field_id` int(11) NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `field_label` varchar(100) NOT NULL,
  `field_type` enum('text','number','select','multiselect','date','boolean','textarea','file') NOT NULL,
  `field_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`field_options`)),
  `is_required` tinyint(1) DEFAULT 0,
  `sub_categories_sub_category_id` int(11) NOT NULL,
  `validation_rules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`validation_rules`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `category_fields`
--

INSERT INTO `category_fields` (`field_id`, `field_name`, `field_label`, `field_type`, `field_options`, `is_required`, `sub_categories_sub_category_id`, `validation_rules`) VALUES
(45, 'brand', 'Brand', 'select', '[\"Apple\",\"Samsung\",\"Xiaomi\",\"OnePlus\"]', 1, 1, NULL),
(46, 'storage', 'Storage Capacity', 'select', '[\"64GB\",\"128GB\",\"256GB\"]', 1, 1, NULL),
(47, 'ram', 'RAM Size', 'select', '[\"4GB\",\"6GB\",\"8GB\"]', 1, 1, NULL),
(48, 'battery', 'Battery Capacity (mAh)', 'number', NULL, 0, 1, NULL),
(49, 'warranty', 'Warranty Period (Months)', 'number', NULL, 0, 1, NULL),
(50, 'brand', 'Brand', 'select', '[\"HP\",\"Dell\",\"Lenovo\",\"Asus\",\"Apple\"]', 1, 2, NULL),
(51, 'processor', 'Processor Type', 'select', '[\"Intel i5\",\"Intel i7\",\"Ryzen 5\",\"Ryzen 7\"]', 1, 2, NULL),
(52, 'ram', 'RAM Size', 'select', '[\"8GB\",\"16GB\",\"32GB\"]', 1, 2, NULL),
(53, 'storage', 'Storage Type', 'select', '[\"SSD\",\"HDD\"]', 1, 2, NULL),
(54, 'graphics', 'Has Dedicated GPU', 'boolean', NULL, 0, 2, NULL),
(55, 'brand', 'Brand', 'text', NULL, 0, 6, NULL),
(56, 'size', 'Available Sizes', 'multiselect', '[\"S\",\"M\",\"L\",\"XL\",\"XXL\"]', 1, 6, NULL),
(57, 'color', 'Color', 'select', '[\"Black\",\"White\",\"Blue\",\"Red\",\"Green\"]', 1, 6, NULL),
(58, 'material', 'Material Type', 'text', NULL, 0, 6, NULL),
(59, 'wash_care', 'Wash Care Instructions', 'textarea', NULL, 0, 6, NULL),
(60, 'material', 'Material', 'select', '[\"Wood\",\"Metal\",\"Plastic\",\"Fabric\"]', 1, 10, NULL),
(61, 'dimensions', 'Dimensions (LxWxH)', 'text', NULL, 1, 10, NULL),
(62, 'weight', 'Weight (kg)', 'number', NULL, 0, 10, NULL),
(63, 'warranty', 'Warranty Period (Months)', 'number', NULL, 0, 10, NULL),
(64, 'brand', 'Brand', 'text', NULL, 1, 13, NULL),
(65, 'skin_type', 'Suitable Skin Type', 'multiselect', '[\"Dry\",\"Oily\",\"Normal\",\"Sensitive\"]', 1, 13, NULL),
(66, 'ingredients', 'Key Ingredients', 'textarea', NULL, 0, 13, NULL),
(67, 'expiry_date', 'Expiry Date', 'date', NULL, 1, 13, NULL),
(68, 'brand', 'Brand', 'text', NULL, 1, 16, NULL),
(69, 'type', 'Equipment Type', 'select', '[\"Treadmill\",\"Dumbbell\",\"Cycle\",\"Bench\"]', 1, 16, NULL),
(70, 'weight_capacity', 'Max Weight Capacity (kg)', 'number', NULL, 0, 16, NULL),
(71, 'is_foldable', 'Foldable', 'boolean', NULL, 0, 16, NULL),
(72, 'brand', 'Brand', 'select', '[\"Toyota\",\"Nissan\",\"Suzuki\",\"Honda\"]', 1, 18, NULL),
(73, 'model', 'Model Name', 'text', NULL, 1, 18, NULL),
(74, 'mileage', 'Mileage (km/l)', 'number', NULL, 0, 18, NULL),
(75, 'fuel_type', 'Fuel Type', 'select', '[\"Petrol\",\"Diesel\",\"Hybrid\",\"Electric\"]', 1, 18, NULL),
(76, 'transmission', 'Transmission Type', 'select', '[\"Manual\",\"Automatic\"]', 1, 18, NULL),
(77, 'author', 'Author', 'text', NULL, 1, 21, NULL),
(78, 'publisher', 'Publisher', 'text', NULL, 0, 21, NULL),
(79, 'language', 'Language', 'select', '[\"English\",\"Sinhala\",\"Tamil\"]', 1, 21, NULL),
(80, 'isbn', 'ISBN Number', 'text', NULL, 1, 21, NULL),
(81, 'published_date', 'Published Date', 'date', NULL, 0, 21, NULL),
(82, 'product_name', 'Product Name', 'text', NULL, 1, 24, NULL),
(83, 'weight', 'Weight (kg)', 'number', NULL, 1, 24, NULL),
(84, 'origin', 'Country of Origin', 'text', NULL, 0, 24, NULL),
(85, 'organic', 'Is Organic', 'boolean', NULL, 0, 24, NULL),
(86, 'expiry_date', 'Expiry Date', 'date', NULL, 0, 24, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `city_id` int(11) NOT NULL,
  `city_name` varchar(100) NOT NULL,
  `district_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`city_id`, `city_name`, `district_id`) VALUES
(167, 'Addalachchenai', 17),
(42, 'Agalawatta', 3),
(164, 'Akkaraipattu', 17),
(47, 'Akurana', 4),
(98, 'Akuressa', 8),
(206, 'Alawwa', 18),
(35, 'Aluthgama', 3),
(80, 'Ambalangoda', 7),
(108, 'Ambalantota', 9),
(198, 'Ambanpola', 18),
(163, 'Ampara', 17),
(196, 'Anamaduwa', 18),
(217, 'Anuradhapura', 20),
(283, 'Aranayaka', 25),
(271, 'Ayagama', 24),
(83, 'Baddegama', 7),
(241, 'Badulla', 22),
(265, 'Balangoda', 24),
(191, 'Bamunakotuwa', 18),
(37, 'Bandaragama', 3),
(242, 'Bandarawela', 22),
(154, 'Batticaloa', 16),
(109, 'Beliatta', 9),
(82, 'Bentota', 7),
(34, 'Beruwala', 3),
(260, 'Bibile', 23),
(185, 'Bingiriya', 18),
(73, 'Bogawantalawa', 6),
(91, 'Bope-Poddala', 7),
(284, 'Bulathkohupitiya', 25),
(39, 'Bulathsinhala', 3),
(256, 'Buttala', 23),
(117, 'Chavakachcheri', 10),
(135, 'Cheddikulam', 13),
(209, 'Chilaw', 19),
(1, 'Colombo 1', 1),
(10, 'Colombo 10', 1),
(11, 'Colombo 11', 1),
(12, 'Colombo 12', 1),
(13, 'Colombo 13', 1),
(14, 'Colombo 14', 1),
(15, 'Colombo 15', 1),
(2, 'Colombo 2', 1),
(3, 'Colombo 3', 1),
(4, 'Colombo 4', 1),
(5, 'Colombo 5', 1),
(6, 'Colombo 6', 1),
(7, 'Colombo 7', 1),
(8, 'Colombo 8', 1),
(9, 'Colombo 9', 1),
(175, 'Damana', 17),
(58, 'Dambulla', 5),
(207, 'Dankotuwa', 18),
(177, 'Dehiattakandiya', 17),
(288, 'Dehiowita', 25),
(125, 'Delft', 10),
(56, 'Delthota', 4),
(287, 'Deraniyagala', 25),
(105, 'Devinuwara', 8),
(95, 'Dikwella', 8),
(237, 'Dimbulagala', 21),
(27, 'Divulapitiya', 2),
(269, 'Eheliyagoda', 24),
(199, 'Ehetuwewa', 18),
(276, 'Elapatha', 24),
(249, 'Ella', 22),
(81, 'Elpitiya', 7),
(264, 'Embilipitiya', 24),
(220, 'Eppawala', 20),
(157, 'Eravur', 16),
(224, 'Galenbindunuwewa', 20),
(60, 'Galewela', 5),
(188, 'Galgamuwa', 18),
(282, 'Galigamuwa', 25),
(78, 'Galle', 7),
(16, 'Gampaha', 2),
(44, 'Gampola', 4),
(200, 'Ganewatta', 18),
(70, 'Ginigathena', 6),
(205, 'Giribawa', 18),
(195, 'Giriulla', 18),
(267, 'Godakawela', 24),
(152, 'Gomarankadawala', 15),
(86, 'Gonapinuwala', 7),
(97, 'Hakmana', 8),
(247, 'Haldummulla', 22),
(106, 'Hambantota', 9),
(76, 'Hangranketha', 6),
(77, 'Hanguranketha', 6),
(243, 'Haputale', 22),
(51, 'Harispattuwa', 4),
(68, 'Hatton', 6),
(79, 'Hikkaduwa', 7),
(223, 'Hingurakgoda', 20),
(33, 'Horana', 3),
(222, 'Horowpothana', 20),
(193, 'Ibbagamuwa', 18),
(84, 'Imaduwa', 7),
(38, 'Ingiriya', 3),
(145, 'Iranaipalai', 14),
(19, 'Ja-Ela', 2),
(116, 'Jaffna', 10),
(23, 'Kadawatha', 2),
(48, 'Kadugannawa', 4),
(235, 'Kaduruwela', 21),
(272, 'Kalawana', 24),
(165, 'Kalmunai', 17),
(216, 'Kalpitiya', 19),
(31, 'Kalutara', 3),
(155, 'Kaluwanchikudy', 16),
(252, 'Kandaketiya', 22),
(43, 'Kandy', 4),
(150, 'Kantale', 15),
(119, 'Karainagar', 10),
(172, 'Karaitivu', 17),
(215, 'Karukupone', 19),
(111, 'Kataragama', 9),
(49, 'Katugastota', 4),
(18, 'Katunayake', 2),
(278, 'Kegalle', 25),
(218, 'Kekirawa', 20),
(21, 'Kelaniya', 2),
(126, 'Kilinochchi', 11),
(147, 'Kinniya', 15),
(25, 'Kiribathgoda', 2),
(104, 'Kirinda-Puhulwella', 8),
(186, 'Kobeigane', 18),
(273, 'Kolonna', 24),
(122, 'Kopay', 10),
(158, 'Koralai Pattu', 16),
(71, 'Kotagala', 6),
(101, 'Kotapola', 8),
(189, 'Kotawehera', 18),
(74, 'Kotmale', 6),
(148, 'Kuchchaveli', 15),
(180, 'Kuliyapitiya', 18),
(55, 'Kundasale', 4),
(138, 'Kurumankadu', 13),
(179, 'Kurunegala', 18),
(270, 'Kuruwita', 24),
(66, 'Laggala-Pallegama', 5),
(170, 'Lahugala', 17),
(238, 'Lankapura', 21),
(115, 'Lunugamvehera', 9),
(213, 'Madampe', 19),
(259, 'Madulla', 23),
(178, 'Mahaoya', 17),
(245, 'Mahiyanganaya', 22),
(99, 'Malimbada', 8),
(144, 'Mallavi', 14),
(159, 'Manmunai North', 16),
(160, 'Manmunai South & Eruvil Pattu', 16),
(161, 'Manmunai West', 16),
(130, 'Mannar', 12),
(133, 'Manthai West', 12),
(212, 'Marawila', 19),
(72, 'Maskeliya', 6),
(201, 'Maspotha', 18),
(57, 'Matale', 5),
(92, 'Matara', 8),
(36, 'Matugama', 3),
(279, 'Mawanella', 25),
(194, 'Mawathagama', 18),
(257, 'Medagama', 23),
(221, 'Medawachchiya', 20),
(236, 'Medirigiriya', 21),
(184, 'Melsiripura', 18),
(225, 'Mihintale', 20),
(26, 'Minuwangoda', 2),
(30, 'Mirigama', 2),
(94, 'Mirissa', 8),
(254, 'Monaragala', 23),
(140, 'Mullaitivu', 14),
(132, 'Musali', 12),
(149, 'Muttur', 15),
(90, 'Nagoda', 7),
(173, 'Nainthalawa', 17),
(123, 'Nallur', 10),
(131, 'Nanattan', 12),
(181, 'Narammala', 18),
(211, 'Nattandiya', 19),
(64, 'Naula', 5),
(176, 'Navithanveli', 17),
(45, 'Nawalapitiya', 4),
(136, 'Nedunkerny', 13),
(17, 'Negombo', 2),
(89, 'Neluwa', 7),
(187, 'Nikaweratiya', 18),
(28, 'Nittambuwa', 2),
(274, 'Nivithigala', 24),
(277, 'Nivitigala', 24),
(67, 'Nuwara Eliya', 6),
(226, 'Nuwaragam Palatha Central', 20),
(227, 'Nuwaragam Palatha East', 20),
(141, 'Oddusuddan', 14),
(112, 'Okewela', 9),
(137, 'Omanthai', 13),
(228, 'Padaviya', 20),
(174, 'Padiyathalawa', 17),
(40, 'Palindanuwara', 3),
(127, 'Pallai', 11),
(214, 'Pallama', 19),
(63, 'Pallepola', 5),
(229, 'Palugaswewa', 20),
(32, 'Panadura', 3),
(139, 'Pandarikulam', 13),
(183, 'Pannala', 18),
(128, 'Paranthan', 11),
(102, 'Pasgoda', 8),
(248, 'Passara', 22),
(52, 'Pathahewaheta', 4),
(22, 'Peliyagoda', 2),
(268, 'Pelmadulla', 24),
(46, 'Peradeniya', 4),
(103, 'Pitabeddara', 8),
(118, 'Point Pedro', 10),
(190, 'Polgahawela', 18),
(234, 'Polonnaruwa', 21),
(197, 'Polpithigama', 18),
(129, 'Poonakary', 11),
(162, 'Porativu Pattu', 16),
(169, 'Pottuvil', 17),
(142, 'Puthukkudiyiruppu', 14),
(208, 'Puttalam', 19),
(24, 'Ragama', 2),
(230, 'Rajanganaya', 20),
(266, 'Rakwana', 24),
(231, 'Rambewa', 20),
(281, 'Rambukkana', 25),
(202, 'Rasnayakapura', 18),
(263, 'Ratnapura', 24),
(62, 'Rattota', 5),
(192, 'Rideegama', 18),
(253, 'Rideemaliyadda', 22),
(246, 'Ridimaliyadda', 22),
(286, 'Ruwanwella', 25),
(166, 'Sainthamaruthu', 17),
(171, 'Sammanthurai', 17),
(124, 'Sandilipay', 10),
(153, 'Seruvila', 15),
(258, 'Sewanagala', 23),
(59, 'Sigiriya', 5),
(262, 'Siyambalanduwa', 23),
(251, 'Soranathota', 22),
(113, 'Suriyawewa', 9),
(69, 'Talawakele', 6),
(96, 'Tangalle', 8),
(121, 'Tellippalai', 10),
(240, 'Thamankaduwa', 21),
(151, 'Thambalagamuwa', 15),
(219, 'Thambuttegama', 20),
(261, 'Thanamalvila', 23),
(100, 'Thihagoda', 8),
(232, 'Thirappane', 20),
(168, 'Thirukkovil', 17),
(114, 'Thissamaharama', 9),
(143, 'Thunukkai', 14),
(107, 'Tissamaharama', 9),
(146, 'Trincomalee', 15),
(203, 'Udubaddawa', 18),
(88, 'Udugama', 7),
(53, 'Udunuwara', 4),
(61, 'Ukuwela', 5),
(250, 'Uva-Paranagama', 22),
(156, 'Valachchenai', 16),
(134, 'Vavuniya', 13),
(120, 'Velanai', 10),
(29, 'Veyangoda', 2),
(41, 'Walallawita', 3),
(75, 'Walapane', 6),
(87, 'Wanduramba', 7),
(280, 'Warakapola', 25),
(182, 'Wariyapola', 18),
(20, 'Wattala', 2),
(50, 'Wattegama', 4),
(110, 'Weeraketiya', 9),
(204, 'Weerambugedara', 18),
(93, 'Weligama', 8),
(275, 'Weligepola', 24),
(239, 'Welikanda', 21),
(244, 'Welimada', 22),
(255, 'Wellawaya', 23),
(210, 'Wennappuwa', 19),
(233, 'Wijayapura', 20),
(85, 'Yakkalamulla', 7),
(65, 'Yatawatta', 5),
(54, 'Yatinuwara', 4),
(285, 'Yatiyantota', 25);

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `conversation_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `conversation_type` enum('customer_seller','customer_admin','seller_admin') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `status` enum('active','closed','archived') DEFAULT 'active',
  `last_message_at` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `country_id` int(11) NOT NULL,
  `country_name` varchar(100) NOT NULL,
  `country_code` varchar(3) NOT NULL,
  `currency_code` varchar(3) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`country_id`, `country_name`, `country_code`, `currency_code`, `is_active`) VALUES
(2, 'Sri Lanka', 'LK', 'LKR', 1),
(3, 'United States', 'US', 'USD', 1),
(4, 'United Kingdom', 'UK', 'GBP', 1),
(5, 'India', 'IN', 'INR', 1),
(6, 'Canada', 'CA', 'CAD', 1),
(7, 'Australia', 'AU', 'AUD', 1),
(8, 'Germany', 'DE', 'EUR', 1),
(9, 'France', 'FR', 'EUR', 1),
(10, 'Japan', 'JP', 'JPY', 1),
(11, 'Singapore', 'SG', 'SGD', 1),
(12, 'Malaysia', 'MY', 'MYR', 1);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `coupon_code` varchar(50) NOT NULL,
  `coupon_name` varchar(100) NOT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `minimum_order_amount` decimal(10,2) DEFAULT 0.00,
  `maximum_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `valid_from` timestamp NULL DEFAULT current_timestamp(),
  `valid_until` timestamp NOT NULL,
  `applicable_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`applicable_categories`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon_usage`
--

CREATE TABLE `coupon_usage` (
  `usage_id` int(11) NOT NULL,
  `coupon_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `used_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `district_id` int(11) NOT NULL,
  `district_name` varchar(100) NOT NULL,
  `province_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`district_id`, `district_name`, `province_id`) VALUES
(17, 'Ampara', 5),
(20, 'Anuradhapura', 7),
(22, 'Badulla', 8),
(16, 'Batticaloa', 5),
(1, 'Colombo', 1),
(7, 'Galle', 3),
(2, 'Gampaha', 1),
(9, 'Hambantota', 3),
(10, 'Jaffna', 4),
(3, 'Kalutara', 1),
(4, 'Kandy', 2),
(25, 'Kegalle', 9),
(11, 'Kilinochchi', 4),
(18, 'Kurunegala', 6),
(12, 'Mannar', 4),
(5, 'Matale', 2),
(8, 'Matara', 3),
(23, 'Monaragala', 8),
(14, 'Mullaitivu', 4),
(6, 'Nuwara Eliya', 2),
(21, 'Polonnaruwa', 7),
(19, 'Puttalam', 6),
(24, 'Ratnapura', 9),
(15, 'Trincomalee', 5),
(13, 'Vavuniya', 4);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_type` enum('customer','seller','admin') NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `message_type` enum('text','image','file') DEFAULT 'text',
  `attachment_url` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `sent_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_type` enum('admin','seller','customer') NOT NULL,
  `user_id` int(11) NOT NULL,
  `notification_type` enum('order','message','product_approved','product_expired','review','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `related_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `shipping_address_id` int(11) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT 0.00,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  `order_status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `tracking_number` varchar(100) DEFAULT NULL,
  `order_datetime` timestamp NULL DEFAULT current_timestamp(),
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_description` text DEFAULT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total_price` decimal(15,2) NOT NULL,
  `product_attributes_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`product_attributes_snapshot`)),
  `product_image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_payments`
--

CREATE TABLE `order_payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_status` enum('pending','processing','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `gateway_reference` varchar(255) DEFAULT NULL,
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gateway_response`)),
  `paid_at` timestamp NULL DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL,
  `refund_amount` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_shipping_addresses`
--

CREATE TABLE `order_shipping_addresses` (
  `shipping_address_id` int(11) NOT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `city_name` varchar(100) NOT NULL,
  `district_name` varchar(100) NOT NULL,
  `province_name` varchar(100) NOT NULL,
  `country_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `method_id` int(11) NOT NULL,
  `method_name` varchar(50) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `method_description` text DEFAULT NULL,
  `processing_fee` decimal(5,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_slug` varchar(255) NOT NULL,
  `product_description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `currency_code` varchar(3) DEFAULT 'LKR',
  `weight_kg` decimal(8,3) DEFAULT 0.000,
  `stock_quantity` int(11) DEFAULT 0,
  `product_status` enum('draft','pending_approval','active','inactive','sold','expired') DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT 0,
  `is_promoted` tinyint(1) DEFAULT 0,
  `location_city_id` int(11) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `view_count` int(11) DEFAULT 0,
  `inquiry_count` int(11) DEFAULT 0,
  `product_attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`product_attributes`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_title`, `product_slug`, `product_description`, `category_id`, `seller_id`, `price`, `currency_code`, `weight_kg`, `stock_quantity`, `product_status`, `is_featured`, `is_promoted`, `location_city_id`, `meta_title`, `meta_description`, `view_count`, `inquiry_count`, `product_attributes`, `created_at`, `updated_at`, `expires_at`) VALUES
(1006, 'Iphone 17 pro max', 'iphone-17-pro-max', 'The Apple iPhone 17 Pro Max was released in September 2025, alongside the iPhone 17 Pro, iPhone 17, and iPhone Air. It features a re-engineered aluminum unibody design with a vapor chamber cooling system, an upgraded 48MP triple-lens camera system, and the A19 Pro chip', 1, 39, 340000.00, 'LKR', NULL, 3, '', 0, 0, NULL, 'Iphone 17 pro max', 'The Apple iPhone 17 Pro Max was released in September 2025, alongside the iPhone 17 Pro, iPhone 17, and iPhone Air. It features a re-engineered aluminum unibody', 0, 0, '{\"battery\":\"4823\",\"brand\":\"Apple\",\"ram\":\"8GB\",\"storage\":\"256GB\",\"warranty\":\"12\"}', '2025-10-05 16:45:53', '2025-10-05 16:45:53', '2025-11-04 16:45:53'),
(1007, 'Samsung galaxy S25 Ultra', 'samsung-galaxy-s25-ultra', 'The Samsung Galaxy S25 Ultra is a high-end Android smartphone. It was released on February 7, 2025. The phone has a titanium build, an updated quad-camera system, and a Snapdragon 8 Elite processor. This provides strong performance and AI capabilities. \r\nKey features:\r\nPerformance: All S25 models use the overclocked Snapdragon 8 Elite for Galaxy processor. This offers improved performance.\r\nDisplay: The 6.9-inch Dynamic LTPO AMOLED 2X display has a QHD+ resolution and a 120Hz adaptive refresh rate. It is protected by Corning Gorilla Armor 2.\r\nDesign: The phone has a titanium frame and a flat display with rounded corners.\r\nCameras: The quad-camera system includes a 200MP main camera, a 50MP ultrawide camera, and two telephoto lenses. The Ultra introduces a Quad Tele System.\r\nArtificial Intelligence: It has updated Galaxy AI features, including the Gemini assistant from Google, Now Brief, and Audio Eraser.\r\nBattery and charging: The Galaxy S25 Ultra has a 5,000mAh battery with 45W wired charging and 15W Qi2 wireless charging.\r\nSoftware and support: The device launched with Android 15 and One UI 7. It is promised seven years of OS and security updates. ', 1, 39, 279999.95, 'LKR', NULL, 10, '', 0, 0, NULL, 'Samsung galaxy S25 Ultra', 'The Samsung Galaxy S25 Ultra is a high-end Android smartphone. It was released on February 7, 2025. The phone has a titanium build, an updated quad-camera syste', 0, 0, '{\"battery\":\"\",\"brand\":\"\",\"ram\":\"\",\"storage\":\"\",\"warranty\":\"\"}', '2025-10-05 16:56:56', '2025-10-05 17:05:51', '2025-11-04 16:56:56'),
(1011, 'Love Hypothesis | A Romance Novel that Gets All the Stars', 'love-hypothesis-a-romance-novel-that-gets-all-the-stars', 'A Romance Novel that Gets All the Stars', 4, 39, 2000.00, 'LKR', NULL, 10, '', 0, 0, NULL, 'Love Hypothesis | A Romance Novel that Gets All the Stars', 'A Romance Novel that Gets All the Stars', 0, 0, '{}', '2025-10-05 17:38:05', '2025-10-05 17:38:05', '2025-11-04 17:38:05');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_alt` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `image_url`, `image_alt`, `is_primary`) VALUES
(506, 1006, '/uploads/products/39_1759662952916_4ixh3s.jpeg', 'Iphone 17 pro max - Image 1', 1),
(507, 1006, '/uploads/products/39_1759662952928_uv7f72.jpeg', 'Iphone 17 pro max - Image 2', 0),
(508, 1006, '/uploads/products/39_1759662952929_f3jam4.webp', 'Iphone 17 pro max - Image 3', 0),
(509, 1006, '/uploads/products/39_1759662952929_59wtwz.jpeg', 'Iphone 17 pro max - Image 4', 0),
(510, 1007, '/uploads/products/39_1759663616334_jjrt2u.webp', 'Samsung galaxy S25 Ultra - Image 1', 1),
(511, 1007, '/uploads/products/39_1759663616335_5iz3jz.jpeg', 'Samsung galaxy S25 Ultra - Image 2', 0),
(512, 1007, '/uploads/products/39_1759663616336_q4ml5p.webp', 'Samsung galaxy S25 Ultra - Image 3', 0),
(513, 1007, '/uploads/products/39_1759663616338_o3xhbi.jpeg', 'Samsung galaxy S25 Ultra - Image 4', 0),
(514, 1011, '/uploads/products/39_1759666085589_mdhoj2.jpg', 'Love Hypothesis | A Romance Novel that Gets All the Stars - Image 1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_packages`
--

CREATE TABLE `product_packages` (
  `product_package_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `purchase_date` timestamp NULL DEFAULT current_timestamp(),
  `expiry_date` timestamp NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `review_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_item_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `review_title` varchar(255) DEFAULT NULL,
  `review_text` text DEFAULT NULL,
  `is_verified_purchase` tinyint(1) DEFAULT 0,
  `review_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `helpful_votes` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `province_id` int(11) NOT NULL,
  `province_name` varchar(100) NOT NULL,
  `country_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`province_id`, `province_name`, `country_id`) VALUES
(2, 'Central', 2),
(5, 'Eastern', 2),
(7, 'North Central', 2),
(6, 'North Western', 2),
(4, 'Northern', 2),
(9, 'Sabaragamuwa', 2),
(3, 'Southern', 2),
(8, 'Uva', 2),
(1, 'Western', 2);

-- --------------------------------------------------------

--
-- Table structure for table `referral`
--

CREATE TABLE `referral` (
  `referral_id` int(11) NOT NULL,
  `users_user_id` int(11) NOT NULL,
  `referral_code` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `referred_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `referral`
--

INSERT INTO `referral` (`referral_id`, `users_user_id`, `referral_code`, `created_at`, `referred_by`) VALUES
(1, 39, '201265', '2025-10-01 13:32:03', 42);

-- --------------------------------------------------------

--
-- Table structure for table `referral_milestone`
--

CREATE TABLE `referral_milestone` (
  `milestone_id` int(11) NOT NULL,
  `milestone_type` enum('REFERRAL LINK','DISCOUNT') DEFAULT NULL,
  `achieved_at` timestamp NULL DEFAULT NULL,
  `users_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referral_rewards`
--

CREATE TABLE `referral_rewards` (
  `rewards_id` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `reward_amount` double DEFAULT NULL,
  `users_user_id` int(11) NOT NULL,
  `orders_order_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refund_payments`
--

CREATE TABLE `refund_payments` (
  `refund_payment_id` int(11) NOT NULL,
  `return_request_id` int(11) NOT NULL,
  `original_payment_id` int(11) NOT NULL,
  `refund_amount` decimal(15,2) NOT NULL,
  `refund_method` enum('original_payment_method','bank_transfer','store_credit') DEFAULT 'original_payment_method',
  `refund_status` enum('pending','processing','completed','failed') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `return_requests`
--

CREATE TABLE `return_requests` (
  `return_id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `return_reason` enum('defective_product','wrong_item_sent','not_as_described','damaged_in_shipping','changed_mind','other') NOT NULL,
  `return_description` text DEFAULT NULL,
  `return_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`return_images`)),
  `return_status` enum('requested','under_review','approved','rejected','item_received','refund_processed','completed','cancelled') DEFAULT 'requested',
  `admin_notes` text DEFAULT NULL,
  `refund_amount` decimal(15,2) DEFAULT NULL,
  `refund_type` enum('full_refund','partial_refund','replacement','store_credit') DEFAULT 'full_refund',
  `requested_at` timestamp NULL DEFAULT current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `refund_processed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review_helpful_votes`
--

CREATE TABLE `review_helpful_votes` (
  `vote_id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_helpful` tinyint(1) NOT NULL,
  `voted_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_settings`
--

CREATE TABLE `shipping_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(500) NOT NULL,
  `setting_description` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart`
--

CREATE TABLE `shopping_cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopping_cart_item`
--

CREATE TABLE `shopping_cart_item` (
  `cart_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `shopping_cart_cart_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` int(11) NOT NULL,
  `store_name` varchar(50) NOT NULL,
  `store_description` text NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`store_id`, `store_name`, `store_description`, `user_id`) VALUES
(1, 'Genius Seller Store', 'Genius Seller Store is your one-stop destination for the latest and most reliable electronic products. From cutting-edge smartphones and powerful laptops to smart home devices and essential accessories, we bring you high-quality tech at unbeatable prices. Whether you’re a gadget lover or a professional looking for trusted electronics, Genius Seller Store ensures genuine products, fast delivery, and excellent customer support — making your shopping experience smarter and easier.', 39);

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `sub_category_id` int(11) NOT NULL,
  `sub_category_name` varchar(40) NOT NULL,
  `categories_category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`sub_category_id`, `sub_category_name`, `categories_category_id`) VALUES
(1, 'Mobile Phones', 1),
(2, 'Laptops', 1),
(3, 'Televisions', 1),
(4, 'Cameras', 1),
(5, 'Men Clothing', 2),
(6, 'Women Clothing', 2),
(7, 'Shoes', 2),
(8, 'Accessories', 2),
(9, 'Furniture', 3),
(10, 'Kitchen Appliances', 3),
(11, 'Home Decor', 3),
(12, 'Skincare', 4),
(13, 'Haircare', 4),
(14, 'Makeup', 4),
(15, 'Fitness Equipment', 5),
(16, 'Outdoor Sports', 5),
(17, 'Team Sports', 5),
(18, 'Car Accessories', 6),
(19, 'Motorbike Gear', 6),
(20, 'Car Electronics', 6),
(21, 'Books', 7),
(22, 'Magazines', 7),
(23, 'Music CDs', 7),
(24, 'Fruits', 8),
(25, 'Vegetables', 8),
(26, 'Snacks', 8),
(27, 'Beverages', 8),
(28, 'Board Games', 9),
(29, 'Action Figures', 9),
(30, 'Puzzles', 9),
(31, 'Home Cleaning', 10),
(32, 'Plumbing', 10),
(33, 'Electrical', 10);

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_category` enum('general','payment','shipping','notification','seo','security') NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `setting_description` text DEFAULT NULL,
  `is_editable` tinyint(1) DEFAULT 1,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction_type`
--

CREATE TABLE `transaction_type` (
  `transaction_type_id` int(10) UNSIGNED ZEROFILL NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `wallet_transactions_transaction_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `user_mobile` varchar(20) DEFAULT NULL,
  `nic` varchar(12) DEFAULT NULL,
  `user_type` enum('seller','customer') NOT NULL,
  `user_status` enum('active','inactive','suspended','pending_verification') DEFAULT 'pending_verification',
  `email_verified` tinyint(1) DEFAULT 0,
  `mobile_verified` tinyint(1) DEFAULT 0,
  `profile_image` varchar(500) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mobile_verification_code` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_password`, `first_name`, `last_name`, `user_mobile`, `nic`, `user_type`, `user_status`, `email_verified`, `mobile_verified`, `profile_image`, `last_login`, `created_at`, `updated_at`, `mobile_verification_code`, `reset_token`, `reset_token_expires`) VALUES
(32, 'ravindu@gmail.com', '$2b$10$RUb5egz43NcoEmGSE4L.O.W9VidjtsWWdwz7hrsp5c8PWXt3/lBvG', 'Ravindu', 'Perera', '94714109179', '200201321121', 'seller', 'pending_verification', 0, 1, NULL, '2025-09-24 09:21:15', '2025-09-24 09:21:15', '2025-09-24 07:03:10', NULL, '', '0000-00-00 00:00:00'),
(34, 'navodyasuneth5@gmail.com', '$2b$10$bY4ISyM1ghSb762fwAv0ue6f1ONOotlAe2SGMxjZEp4jaHtACz35i', 'Suneth', 'Prabash', NULL, '0752010915', 'seller', 'pending_verification', 0, 0, NULL, '2025-09-25 12:09:58', '2025-09-25 12:09:58', '2025-10-03 14:19:50', NULL, '3a08b696f59860986a458e1aaa6993379fbe8848a1e7d777d1cb790d8ec2c876', '0000-00-00 00:00:00'),
(35, 'shkdtraders@gmail.com', '$2b$10$KqTk77Pvg9wagCeJX3XNk.I9jVfdkpfAAu3HGCkeIvwEJv/48Fufq', 'Suneth', 'Navodya', NULL, '0772010915', 'seller', 'pending_verification', 0, 0, NULL, '2025-09-25 12:18:57', '2025-09-25 12:18:57', '2025-09-25 12:18:57', NULL, NULL, NULL),
(37, 'bhanuprabhashwara244@gmail.com', '$2b$10$te4bVgAKpVyfPJSrLdZjz.qDKOUHpvMCsgJEC66qdQqBYzMbQsEh.', 'Akila', 'Akila', '94710157724', '200106903999', 'seller', 'active', 0, 1, '/uploads/profile-pictures/37_1759645586115.jpg', '2025-09-25 16:06:24', '2025-09-25 16:06:24', '2025-10-05 11:56:34', NULL, NULL, NULL),
(38, 'wedakaragedara.gunasinghe@mail.bcu.ac.uk', '$2b$10$A7i6rEVKMFu9BEucI6j8J.Zan.OvOAMhh7JNd8hu4sjSmR8H/ZFe6', 'Supun', 'Gunasinghe', '0778223712', NULL, 'customer', 'active', 0, 0, NULL, '2025-09-26 02:08:23', '2025-09-26 02:08:23', '2025-09-26 02:08:23', NULL, NULL, NULL),
(39, 'giniuosgaming2212@gmail.com', '$2b$10$4ShaZ.uhg20r8fQJIdwTA.LoiZ0bHggvVat7pTyWfGOs45hZp04VG', 'Genius', 'Seller', '94112233445', '20020030013', 'seller', 'active', 0, 1, '/uploads/profile-pictures/39_1759599951515.jpeg', '2025-09-27 14:37:49', '2025-09-27 14:37:49', '2025-10-05 08:48:17', NULL, NULL, NULL),
(42, 'gihanpunarji@gmail.com', '$2b$10$I6rTXCLgnrIqK0dcmMXsQuna8jIis4tFd8udR/JsmTiOwwD/XSSqG', 'Gihan', 'Punarji', '94715327065', '200204301186', 'seller', 'pending_verification', 0, 0, NULL, '2025-09-28 13:32:21', '2025-09-28 13:32:21', '2025-10-05 06:19:33', '878259', '9fc245d6b8e11dfe9c60bd8daf79bb24f1c836ce5602a79be28beeebfcd15754', '0000-00-00 00:00:00'),
(43, 'test@test.com', '$2b$10$5Y6onXt0sUZW26POlPQ5QuvhM78kghsFxIO7/K9m2NYrTbWCMxKtu', 'Test', 'User', '94711234567', NULL, 'customer', 'active', 0, 0, NULL, '2025-10-04 12:34:10', '2025-10-04 12:34:10', '2025-10-04 12:34:10', NULL, NULL, NULL),
(44, 'seller@test.com', '$2b$10$HSu8zLBXTNDGnJdtdFUsVe6r0nbixcihfaTrLFjNnhvoOm1NswKva', 'Test', 'Seller', NULL, '123456789V', 'seller', 'pending_verification', 0, 0, NULL, '2025-10-04 12:41:00', '2025-10-04 12:41:00', '2025-10-04 12:41:00', NULL, NULL, NULL),
(45, 'krangika002@gmail.com', '$2b$10$qfqG/mFWJkwuShg.qib5eOKaXWH9pjQRJYReWHKA5RzCmTuj4R8Fu', 'Kasuni', 'Rangika', '0715327065', NULL, 'customer', 'active', 0, 0, NULL, '2025-10-04 13:06:34', '2025-10-04 13:06:34', '2025-10-04 08:06:38', NULL, NULL, NULL),
(46, 'silvester2191@gmail.com', '$2b$10$aWE/jQPq7nbMnUtAgj8xHeCacaVc099NMpPuQfc.e2Q18QoWuREN2', 'Janeth', 'Vidarsha', '94712404793', '200106903991', 'seller', 'pending_verification', 0, 0, NULL, '2025-10-05 12:04:50', '2025-10-05 12:04:50', '2025-10-05 06:35:24', '215296', NULL, NULL),
(47, 'supun9402@gmail.com', '$2b$10$Wf54iKolbUY8TJbl.W7PGOVivElNoKoT5SeJvU5Y2Ir76MNwnqgW6', 'Supun', 'Gunasinghe', '0772010915', NULL, 'customer', 'active', 0, 0, NULL, '2025-10-05 12:22:54', '2025-10-05 12:22:54', '2025-10-05 12:22:54', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_wallet`
--

CREATE TABLE `user_wallet` (
  `wallet_id` int(11) NOT NULL,
  `balance` double NOT NULL DEFAULT 0,
  `last_updated` timestamp NOT NULL,
  `users_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_wallet_wallet_id` int(11) NOT NULL,
  `amount` double DEFAULT NULL,
  `description` text DEFAULT NULL,
  `bebitted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whishlist_item`
--

CREATE TABLE `whishlist_item` (
  `cart_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `wishlist_wishlist_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `wishlist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `added_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `idx_user_address` (`user_id`,`address_type`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_email` (`admin_email`);

--
-- Indexes for table `ad_packages`
--
ALTER TABLE `ad_packages`
  ADD PRIMARY KEY (`package_id`);

--
-- Indexes for table `bank`
--
ALTER TABLE `bank`
  ADD PRIMARY KEY (`bank_id`),
  ADD KEY `fk_bank_users1` (`users_user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_slug` (`category_slug`),
  ADD KEY `idx_active_categories` (`is_active`);

--
-- Indexes for table `category_fields`
--
ALTER TABLE `category_fields`
  ADD PRIMARY KEY (`field_id`),
  ADD KEY `fk_category_fields_sub_categories1` (`sub_categories_sub_category_id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`city_id`),
  ADD UNIQUE KEY `unique_city_per_district` (`city_name`,`district_id`),
  ADD KEY `district_id` (`district_id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`conversation_id`),
  ADD KEY `idx_customer_conversations` (`customer_id`,`last_message_at`),
  ADD KEY `idx_seller_conversations` (`seller_id`,`last_message_at`),
  ADD KEY `idx_admin_conversations` (`admin_id`,`last_message_at`),
  ADD KEY `idx_product_conversations` (`product_id`,`created_at`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`country_id`),
  ADD UNIQUE KEY `country_name` (`country_name`),
  ADD UNIQUE KEY `country_code` (`country_code`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `coupon_code` (`coupon_code`),
  ADD KEY `idx_coupon_code` (`coupon_code`,`is_active`),
  ADD KEY `idx_coupon_validity` (`is_active`,`valid_from`,`valid_until`);

--
-- Indexes for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  ADD PRIMARY KEY (`usage_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_coupon_usage` (`coupon_id`,`used_at`),
  ADD KEY `idx_user_coupon_usage` (`user_id`,`used_at`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`district_id`),
  ADD UNIQUE KEY `unique_district_per_province` (`district_name`,`province_id`),
  ADD KEY `province_id` (`province_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_conversation_messages` (`conversation_id`,`sent_at`),
  ADD KEY `idx_unread_messages` (`conversation_id`,`is_read`,`sent_at`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_user_notifications` (`user_type`,`user_id`,`is_read`,`created_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `shipping_address_id` (`shipping_address_id`),
  ADD KEY `idx_customer_orders` (`customer_id`,`order_datetime`),
  ADD KEY `idx_order_status` (`order_status`,`order_datetime`),
  ADD KEY `idx_tracking_number` (`tracking_number`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items` (`order_id`),
  ADD KEY `idx_seller_orders` (`seller_id`);

--
-- Indexes for table `order_payments`
--
ALTER TABLE `order_payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `payment_method_id` (`payment_method_id`),
  ADD KEY `idx_order_payments` (`order_id`),
  ADD KEY `idx_payment_status` (`payment_status`,`created_at`),
  ADD KEY `idx_transaction_id` (`transaction_id`);

--
-- Indexes for table `order_shipping_addresses`
--
ALTER TABLE `order_shipping_addresses`
  ADD PRIMARY KEY (`shipping_address_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`method_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `product_slug` (`product_slug`),
  ADD KEY `idx_category_status` (`category_id`,`product_status`),
  ADD KEY `idx_seller_products` (`seller_id`,`product_status`),
  ADD KEY `idx_location_products` (`location_city_id`,`product_status`),
  ADD KEY `idx_featured_products` (`is_featured`,`product_status`),
  ADD KEY `idx_stock_products` (`stock_quantity`,`product_status`);
ALTER TABLE `products` ADD FULLTEXT KEY `idx_product_search` (`product_title`,`product_description`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `idx_product_images` (`product_id`);

--
-- Indexes for table `product_packages`
--
ALTER TABLE `product_packages`
  ADD PRIMARY KEY (`product_package_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `unique_user_product_review` (`user_id`,`product_id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `idx_product_reviews` (`product_id`,`review_status`,`created_at`);

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`province_id`),
  ADD UNIQUE KEY `unique_province_per_country` (`province_name`,`country_id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `referral`
--
ALTER TABLE `referral`
  ADD PRIMARY KEY (`referral_id`),
  ADD KEY `fk_referral_users1_idx` (`users_user_id`),
  ADD KEY `fk_referral_users2_idx` (`referred_by`);

--
-- Indexes for table `referral_milestone`
--
ALTER TABLE `referral_milestone`
  ADD PRIMARY KEY (`milestone_id`),
  ADD KEY `fk_referral_milestone_users1_idx` (`users_user_id`);

--
-- Indexes for table `referral_rewards`
--
ALTER TABLE `referral_rewards`
  ADD PRIMARY KEY (`rewards_id`),
  ADD KEY `fk_referral_rewards_users1_idx` (`users_user_id`),
  ADD KEY `fk_referral_rewards_orders1_idx` (`orders_order_id`);

--
-- Indexes for table `refund_payments`
--
ALTER TABLE `refund_payments`
  ADD PRIMARY KEY (`refund_payment_id`),
  ADD KEY `return_request_id` (`return_request_id`),
  ADD KEY `original_payment_id` (`original_payment_id`),
  ADD KEY `idx_refund_status` (`refund_status`,`created_at`);

--
-- Indexes for table `return_requests`
--
ALTER TABLE `return_requests`
  ADD PRIMARY KEY (`return_id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `idx_customer_returns` (`customer_id`,`requested_at`),
  ADD KEY `idx_seller_returns` (`seller_id`,`return_status`),
  ADD KEY `idx_return_status` (`return_status`,`requested_at`);

--
-- Indexes for table `review_helpful_votes`
--
ALTER TABLE `review_helpful_votes`
  ADD PRIMARY KEY (`vote_id`),
  ADD UNIQUE KEY `unique_user_review_vote` (`review_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipping_settings`
--
ALTER TABLE `shipping_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD UNIQUE KEY `unique_user_product_cart` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_user_cart` (`user_id`);

--
-- Indexes for table `shopping_cart_item`
--
ALTER TABLE `shopping_cart_item`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `fk_shopping_cart_item_shopping_cart1_idx` (`shopping_cart_cart_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`store_id`),
  ADD KEY `fk_store_users` (`user_id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`sub_category_id`),
  ADD KEY `fk_sub_categories_categories1` (`categories_category_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `unique_setting` (`setting_category`,`setting_key`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `transaction_type`
--
ALTER TABLE `transaction_type`
  ADD PRIMARY KEY (`transaction_type_id`),
  ADD KEY `fk_transaction_type_wallet_transactions1_idx` (`wallet_transactions_transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD UNIQUE KEY `user_mobile` (`user_mobile`),
  ADD UNIQUE KEY `nic_UNIQUE` (`nic`);

--
-- Indexes for table `user_wallet`
--
ALTER TABLE `user_wallet`
  ADD PRIMARY KEY (`wallet_id`),
  ADD KEY `fk_user_wallet_users1_idx` (`users_user_id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `fk_wallet_transactions_user_wallet1_idx` (`user_wallet_wallet_id`);

--
-- Indexes for table `whishlist_item`
--
ALTER TABLE `whishlist_item`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `fk_whishlist_item_wishlist1_idx` (`wishlist_wishlist_id`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD UNIQUE KEY `unique_user_product_wishlist` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_user_wishlist` (`user_id`,`added_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ad_packages`
--
ALTER TABLE `ad_packages`
  MODIFY `package_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank`
--
ALTER TABLE `bank`
  MODIFY `bank_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `category_fields`
--
ALTER TABLE `category_fields`
  MODIFY `field_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=289;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `conversation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `country_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  MODIFY `usage_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `district_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_payments`
--
ALTER TABLE `order_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_shipping_addresses`
--
ALTER TABLE `order_shipping_addresses`
  MODIFY `shipping_address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1012;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=515;

--
-- AUTO_INCREMENT for table `product_packages`
--
ALTER TABLE `product_packages`
  MODIFY `product_package_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `province_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `referral`
--
ALTER TABLE `referral`
  MODIFY `referral_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `referral_milestone`
--
ALTER TABLE `referral_milestone`
  MODIFY `milestone_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referral_rewards`
--
ALTER TABLE `referral_rewards`
  MODIFY `rewards_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refund_payments`
--
ALTER TABLE `refund_payments`
  MODIFY `refund_payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `return_requests`
--
ALTER TABLE `return_requests`
  MODIFY `return_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review_helpful_votes`
--
ALTER TABLE `review_helpful_votes`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping_settings`
--
ALTER TABLE `shipping_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shopping_cart_item`
--
ALTER TABLE `shopping_cart_item`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `store_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `sub_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `user_wallet`
--
ALTER TABLE `user_wallet`
  MODIFY `wallet_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whishlist_item`
--
ALTER TABLE `whishlist_item`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `wishlist_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `addresses_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`);

--
-- Constraints for table `bank`
--
ALTER TABLE `bank`
  ADD CONSTRAINT `fk_bank_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `category_fields`
--
ALTER TABLE `category_fields`
  ADD CONSTRAINT `fk_category_fields_sub_categories1` FOREIGN KEY (`sub_categories_sub_category_id`) REFERENCES `sub_categories` (`sub_category_id`);

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`);

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `conversations_ibfk_4` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`);

--
-- Constraints for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  ADD CONSTRAINT `coupon_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`),
  ADD CONSTRAINT `coupon_usage_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `coupon_usage_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shipping_address_id`) REFERENCES `order_shipping_addresses` (`shipping_address_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_payments`
--
ALTER TABLE `order_payments`
  ADD CONSTRAINT `order_payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_payments_ibfk_2` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`method_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`location_city_id`) REFERENCES `cities` (`city_id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_packages`
--
ALTER TABLE `product_packages`
  ADD CONSTRAINT `product_packages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `product_packages_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `ad_packages` (`package_id`);

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `product_reviews_ibfk_3` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`);

--
-- Constraints for table `provinces`
--
ALTER TABLE `provinces`
  ADD CONSTRAINT `provinces_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`);

--
-- Constraints for table `referral`
--
ALTER TABLE `referral`
  ADD CONSTRAINT `fk_referral_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_referral_users2` FOREIGN KEY (`referred_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `referral_milestone`
--
ALTER TABLE `referral_milestone`
  ADD CONSTRAINT `fk_referral_milestone_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `referral_rewards`
--
ALTER TABLE `referral_rewards`
  ADD CONSTRAINT `fk_referral_rewards_orders1` FOREIGN KEY (`orders_order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_referral_rewards_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `refund_payments`
--
ALTER TABLE `refund_payments`
  ADD CONSTRAINT `refund_payments_ibfk_1` FOREIGN KEY (`return_request_id`) REFERENCES `return_requests` (`return_id`),
  ADD CONSTRAINT `refund_payments_ibfk_2` FOREIGN KEY (`original_payment_id`) REFERENCES `order_payments` (`payment_id`);

--
-- Constraints for table `return_requests`
--
ALTER TABLE `return_requests`
  ADD CONSTRAINT `return_requests_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`),
  ADD CONSTRAINT `return_requests_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `return_requests_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `review_helpful_votes`
--
ALTER TABLE `review_helpful_votes`
  ADD CONSTRAINT `review_helpful_votes_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`review_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `review_helpful_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `shopping_cart`
--
ALTER TABLE `shopping_cart`
  ADD CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shopping_cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `shopping_cart_item`
--
ALTER TABLE `shopping_cart_item`
  ADD CONSTRAINT `fk_shopping_cart_item_shopping_cart1` FOREIGN KEY (`shopping_cart_cart_id`) REFERENCES `shopping_cart` (`cart_id`);

--
-- Constraints for table `store`
--
ALTER TABLE `store`
  ADD CONSTRAINT `fk_store_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `fk_sub_categories_categories1` FOREIGN KEY (`categories_category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`admin_id`);

--
-- Constraints for table `transaction_type`
--
ALTER TABLE `transaction_type`
  ADD CONSTRAINT `fk_transaction_type_wallet_transactions1` FOREIGN KEY (`wallet_transactions_transaction_id`) REFERENCES `wallet_transactions` (`transaction_id`);

--
-- Constraints for table `user_wallet`
--
ALTER TABLE `user_wallet`
  ADD CONSTRAINT `fk_user_wallet_users1` FOREIGN KEY (`users_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `fk_wallet_transactions_user_wallet1` FOREIGN KEY (`user_wallet_wallet_id`) REFERENCES `user_wallet` (`wallet_id`);

--
-- Constraints for table `whishlist_item`
--
ALTER TABLE `whishlist_item`
  ADD CONSTRAINT `fk_whishlist_item_wishlist1` FOREIGN KEY (`wishlist_wishlist_id`) REFERENCES `wishlist` (`wishlist_id`);

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
