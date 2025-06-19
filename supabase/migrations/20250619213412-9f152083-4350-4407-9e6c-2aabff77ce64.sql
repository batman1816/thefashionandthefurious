
-- Remove the stock column from the products table
ALTER TABLE public.products DROP COLUMN IF EXISTS stock;
