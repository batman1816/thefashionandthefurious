
-- Enable Row Level Security on products table (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view products (public access)
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Create policy to allow inserting products (for admin functionality)
CREATE POLICY "Allow inserting products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow updating products (for admin functionality)
CREATE POLICY "Allow updating products" 
  ON public.products 
  FOR UPDATE 
  USING (true);

-- Create policy to allow deleting products (for admin functionality)
CREATE POLICY "Allow deleting products" 
  ON public.products 
  FOR DELETE 
  USING (true);
