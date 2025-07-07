
-- Add sales navigation and countdown functionality
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS next_sale_title TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS next_sale_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_sale_countdown BOOLEAN DEFAULT false;

-- Update sales table to include more detailed information
ALTER TABLE sales ADD COLUMN IF NOT EXISTS sale_title TEXT;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS sale_description TEXT;

-- Update bundle_deals table for better control
ALTER TABLE bundle_deals ADD COLUMN IF NOT EXISTS applicable_categories TEXT[];
ALTER TABLE bundle_deals ADD COLUMN IF NOT EXISTS max_discount_items INTEGER DEFAULT 1;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_active_dates ON sales(is_active, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bundle_deals_active_dates ON bundle_deals(is_active, start_date, end_date);

-- Create a function to automatically update expired sales
CREATE OR REPLACE FUNCTION update_expired_sales()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Deactivate individual product sales that have expired
  UPDATE public.sales 
  SET is_active = false, updated_at = now()
  WHERE is_active = true 
    AND end_date IS NOT NULL 
    AND end_date < now();
    
  -- Deactivate bundle deals that have expired
  UPDATE public.bundle_deals 
  SET is_active = false, updated_at = now()
  WHERE is_active = true 
    AND end_date IS NOT NULL 
    AND end_date < now();
    
  -- Deactivate global sales that have expired
  UPDATE public.sales_settings 
  SET global_sale_active = false, updated_at = now()
  WHERE global_sale_active = true 
    AND global_sale_end IS NOT NULL 
    AND global_sale_end < now();
END;
$$;
