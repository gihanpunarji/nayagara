-- Add subcategory_id field to products table
ALTER TABLE products ADD COLUMN subcategory_id INT(11) DEFAULT NULL;

-- Add foreign key constraint for subcategory_id
ALTER TABLE products ADD CONSTRAINT `products_ibfk_2` 
FOREIGN KEY (`subcategory_id`) REFERENCES `sub_categories` (`sub_category_id`);

-- Create index for better performance
CREATE INDEX idx_products_subcategory ON products(subcategory_id);