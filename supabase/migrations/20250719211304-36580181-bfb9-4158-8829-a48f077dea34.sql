-- Fix banner RLS policies to allow authenticated users to manage banners
DROP POLICY IF EXISTS "Allow authenticated users to read and manage banners" ON public.banners;
DROP POLICY IF EXISTS "Unified banner access" ON public.banners;

-- Create comprehensive policies for banner management
CREATE POLICY "Allow authenticated users to insert banners" 
ON public.banners 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update banners" 
ON public.banners 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete banners" 
ON public.banners 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow everyone to view banners" 
ON public.banners 
FOR SELECT 
USING (true);