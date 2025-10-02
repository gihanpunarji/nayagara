-- Advertisement tables for the multi-seller platform

-- Main advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  ad_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(12,2) NOT NULL,
  is_negotiable BOOLEAN DEFAULT FALSE,
  contact_number VARCHAR(20) NOT NULL,
  location_city VARCHAR(100) NOT NULL,
  location_district VARCHAR(100),
  images JSON,
  ad_type ENUM('vehicle', 'property') NOT NULL,
  package_type ENUM('standard', 'urgent', 'featured') DEFAULT 'standard',
  payment_amount DECIMAL(10,2) DEFAULT 0,
  vehicle_data JSON,
  property_data JSON,
  status ENUM('pending_approval', 'approved', 'rejected', 'expired') DEFAULT 'pending_approval',
  admin_notes TEXT,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_location (location_city, location_district),
  INDEX idx_status (status),
  INDEX idx_user (user_id),
  INDEX idx_package (package_type),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Advertisement payments table
CREATE TABLE IF NOT EXISTS ad_payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  ad_id INT NOT NULL,
  package_type ENUM('standard', 'urgent', 'featured') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_payment (user_id),
  INDEX idx_ad_payment (ad_id),
  INDEX idx_payment_status (payment_status),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (ad_id) REFERENCES advertisements(ad_id) ON DELETE CASCADE
);

-- Cities table for location filtering
CREATE TABLE IF NOT EXISTS cities (
  city_id INT PRIMARY KEY AUTO_INCREMENT,
  city_name VARCHAR(100) NOT NULL,
  district_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_city_name (city_name),
  INDEX idx_district (district_id),
  FOREIGN KEY (district_id) REFERENCES districts(district_id)
);

-- Insert sample cities (some major Sri Lankan cities)
INSERT IGNORE INTO cities (city_name, district_id) VALUES
('Colombo', 1),
('Kandy', 2),
('Galle', 3),
('Jaffna', 4),
('Negombo', 1),
('Anuradhapura', 5),
('Matara', 3),
('Batticaloa', 6),
('Kurunegala', 7),
('Ratnapura', 8),
('Badulla', 9),
('Trincomalee', 10),
('Vavuniya', 11),
('Kalmunai', 12),
('Panadura', 1),
('Moratuwa', 1),
('Kesbewa', 1),
('Maharagama', 1),
('Kotte', 1),
('Dehiwala', 1);

-- Update districts table if it doesn't have all districts
INSERT IGNORE INTO districts (district_name) VALUES
('Colombo'),
('Kandy'),
('Galle'),
('Jaffna'),
('Anuradhapura'),
('Batticaloa'),
('Kurunegala'),
('Ratnapura'),
('Badulla'),
('Trincomalee'),
('Vavuniya'),
('Ampara'),
('Kalutara'),
('Gampaha'),
('Matale'),
('Nuwara Eliya'),
('Polonnaruwa'),
('Hambantota'),
('Monaragala'),
('Puttalam'),
('Kegalle'),
('Moneragala'),
('Mannar'),
('Mullaitivu'),
('Kilinochchi');