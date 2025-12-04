-- Migration: Add icon_image column to categories table
-- This column will store the URL of the .ico file uploaded to Cloudinary

ALTER TABLE categories
ADD COLUMN icon_image VARCHAR(255) NULL AFTER icon;

-- Verify the column was added
DESCRIBE categories;
