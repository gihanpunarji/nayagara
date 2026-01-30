ALTER TABLE shopping_cart ADD COLUMN variant_id INT NULL DEFAULT NULL;
ALTER TABLE shopping_cart ADD CONSTRAINT fk_cart_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL;
