
-- Add is_active column to products table
ALTER TABLE public.products 
ADD COLUMN is_active boolean NOT NULL DEFAULT true;
