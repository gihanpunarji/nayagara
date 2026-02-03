-- Add indexes to products table for performance optimization
CREATE INDEX idx_products_status ON products(product_status);
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_view_count ON products(view_count);
CREATE INDEX idx_products_inquiry_count ON products(inquiry_count);

-- detailed composite index for common search/filter patterns
CREATE INDEX idx_products_status_created ON products(product_status, created_at);
CREATE INDEX idx_products_status_category ON products(product_status, category_id);

-- Add indexes to product_images table
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(is_primary);
