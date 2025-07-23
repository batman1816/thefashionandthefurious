-- Add color_variants column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_variants JSONB DEFAULT NULL;