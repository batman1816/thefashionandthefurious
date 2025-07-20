-- Fix RLS policies to allow anonymous authenticated users for admin operations
-- This is needed because the current user is authenticated anonymously

-- Update announcement_banner policies to allow anonymous authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to insert announcement banners" ON public.announcement_banner;
DROP POLICY IF EXISTS "Allow authenticated users to update announcement banners" ON public.announcement_banner;
DROP POLICY IF EXISTS "Allow authenticated users to delete announcement banners" ON public.announcement_banner;

CREATE POLICY "Allow any authenticated user to insert announcement banners" 
ON public.announcement_banner 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to update announcement banners" 
ON public.announcement_banner 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to delete announcement banners" 
ON public.announcement_banner 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Update sales policies to allow anonymous authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to insert sales" ON public.sales;
DROP POLICY IF EXISTS "Allow authenticated users to update sales" ON public.sales;
DROP POLICY IF EXISTS "Allow authenticated users to delete sales" ON public.sales;

CREATE POLICY "Allow any authenticated user to insert sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to update sales" 
ON public.sales 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to delete sales" 
ON public.sales 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Update bundle_deals policies to allow anonymous authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to insert bundle deals" ON public.bundle_deals;
DROP POLICY IF EXISTS "Allow authenticated users to update bundle deals" ON public.bundle_deals;
DROP POLICY IF EXISTS "Allow authenticated users to delete bundle deals" ON public.bundle_deals;

CREATE POLICY "Allow any authenticated user to insert bundle deals" 
ON public.bundle_deals 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to update bundle deals" 
ON public.bundle_deals 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to delete bundle deals" 
ON public.bundle_deals 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Update sales_settings policies to allow anonymous authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to insert sales settings" ON public.sales_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update sales settings" ON public.sales_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete sales settings" ON public.sales_settings;

CREATE POLICY "Allow any authenticated user to insert sales settings" 
ON public.sales_settings 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to update sales settings" 
ON public.sales_settings 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow any authenticated user to delete sales settings" 
ON public.sales_settings 
FOR DELETE 
USING (auth.role() = 'authenticated');