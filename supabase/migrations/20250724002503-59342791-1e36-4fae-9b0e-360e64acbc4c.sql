-- Add size_variants and main_image columns to products table for mousepad functionality
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS size_variants JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS main_image TEXT DEFAULT NULL;