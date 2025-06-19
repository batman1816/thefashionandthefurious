
-- Add a tags column to the products table to store multiple tags
ALTER TABLE public.products 
ADD COLUMN tags text[] DEFAULT '{}';

-- Update existing products to have empty tags array if null
UPDATE public.products 
SET tags = '{}' 
WHERE tags IS NULL;
