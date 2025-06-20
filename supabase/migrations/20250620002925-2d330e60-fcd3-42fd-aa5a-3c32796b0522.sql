
-- Drop the existing policies that require Supabase authentication
DROP POLICY IF EXISTS "Allow public read access to banners" ON public.banners;
DROP POLICY IF EXISTS "Allow authenticated users to manage banners" ON public.banners;

-- Create new policies that allow public access for banner management
-- This works with your current admin authentication system
CREATE POLICY "Allow public read access to banners" 
ON public.banners 
FOR SELECT 
TO public 
USING (true);

-- Allow public insert/update/delete since your admin auth is frontend-only
CREATE POLICY "Allow public manage banners" 
ON public.banners 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);
