
-- Enable RLS on banners table if not already enabled
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to banners" ON public.banners;
DROP POLICY IF EXISTS "Allow authenticated users to manage banners" ON public.banners;

-- Create policy to allow public read access to banners (for homepage display)
CREATE POLICY "Allow public read access to banners" 
ON public.banners 
FOR SELECT 
TO public 
USING (true);

-- Create policy to allow authenticated users to insert, update, and delete banners
CREATE POLICY "Allow authenticated users to manage banners" 
ON public.banners 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
