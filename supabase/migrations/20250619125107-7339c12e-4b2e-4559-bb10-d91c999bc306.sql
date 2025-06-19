
-- Remove shipping_cost column from site_settings table
ALTER TABLE public.site_settings 
DROP COLUMN shipping_cost;
