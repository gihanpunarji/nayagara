-- Migration: Add image column to categories table
-- This column will store the URL of the .ico file uploaded to Cloudinary

-- Check if column exists, if not add it
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image VARCHAR(255) NULL AFTER icon;

-- Verify the column was added
DESCRIBE categories;
