-- Fix RLS policies for sales table to allow authenticated users to manage sales
CREATE POLICY "Allow authenticated users to insert sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update sales" 
ON public.sales 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete sales" 
ON public.sales 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Fix RLS policies for bundle_deals table to allow authenticated users to manage bundle deals
CREATE POLICY "Allow authenticated users to insert bundle deals" 
ON public.bundle_deals 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update bundle deals" 
ON public.bundle_deals 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete bundle deals" 
ON public.bundle_deals 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Fix RLS policies for sales_settings table to allow authenticated users to manage sales settings
CREATE POLICY "Allow authenticated users to insert sales settings" 
ON public.sales_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update sales settings" 
ON public.sales_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete sales settings" 
ON public.sales_settings 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Fix RLS policies for announcement_banner table to allow authenticated users to manage announcement banners
CREATE POLICY "Allow authenticated users to insert announcement banners" 
ON public.announcement_banner 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update announcement banners" 
ON public.announcement_banner 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete announcement banners" 
ON public.announcement_banner 
FOR DELETE 
USING (auth.uid() IS NOT NULL);