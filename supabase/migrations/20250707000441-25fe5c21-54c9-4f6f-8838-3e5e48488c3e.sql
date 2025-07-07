
-- Create sales table for individual product sales
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  original_price INTEGER NOT NULL,
  sale_price INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bundle deals table
CREATE TABLE public.bundle_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  deal_type TEXT NOT NULL DEFAULT 'buy_2_get_1_half_off',
  is_active BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  discount_percentage INTEGER NOT NULL DEFAULT 50,
  minimum_quantity INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create global sales settings table
CREATE TABLE public.sales_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  global_sale_active BOOLEAN NOT NULL DEFAULT false,
  global_sale_title TEXT,
  global_sale_start TIMESTAMP WITH TIME ZONE,
  global_sale_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for sales table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sales" 
  ON public.sales 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to manage sales" 
  ON public.sales 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Add RLS policies for bundle_deals table
ALTER TABLE public.bundle_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bundle deals" 
  ON public.bundle_deals 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to manage bundle deals" 
  ON public.bundle_deals 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Add RLS policies for sales_settings table
ALTER TABLE public.sales_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sales settings" 
  ON public.sales_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to manage sales settings" 
  ON public.sales_settings 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Insert default sales settings record
INSERT INTO public.sales_settings (global_sale_active) VALUES (false);

-- Create function to automatically deactivate expired sales
CREATE OR REPLACE FUNCTION public.update_expired_sales()
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
