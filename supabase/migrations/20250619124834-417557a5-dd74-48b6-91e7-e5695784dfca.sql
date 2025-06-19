
-- Add shipping_cost column to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN shipping_cost integer NOT NULL DEFAULT 500;
