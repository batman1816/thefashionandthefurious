
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('drivers', 'f1-classic', 'teams')),
  sizes TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'The Fashion & Furious',
  contact_email TEXT NOT NULL DEFAULT 'orders@thefashionandfurious.com',
  support_email TEXT NOT NULL DEFAULT 'support@thefashionandfurious.com',
  shipping_cost INTEGER NOT NULL DEFAULT 500,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('banner-images', 'banner-images', true);

-- Create storage policies for product images
CREATE POLICY "Public Access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Public Upload for product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Update for product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Public Delete for product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- Create storage policies for banner images
CREATE POLICY "Public Access for banner images" ON storage.objects
FOR SELECT USING (bucket_id = 'banner-images');

CREATE POLICY "Public Upload for banner images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'banner-images');

CREATE POLICY "Public Update for banner images" ON storage.objects
FOR UPDATE USING (bucket_id = 'banner-images');

CREATE POLICY "Public Delete for banner images" ON storage.objects
FOR DELETE USING (bucket_id = 'banner-images');

-- Insert initial products data (using proper UUIDs)
INSERT INTO public.products (name, description, price, category, sizes, stock, image_url) VALUES
('Lewis Hamilton Championship Tee', 'Premium cotton t-shirt celebrating Lewis Hamilton''s legendary F1 career. Features vintage-inspired graphics and comfortable fit.', 2250, 'drivers', ARRAY['S', 'M', 'L', 'XL', 'XXL'], 50, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop'),
('Max Verstappen Racing Jersey', 'Official-style racing jersey inspired by Max Verstappen''s dominant performances. Moisture-wicking fabric for ultimate comfort.', 3250, 'drivers', ARRAY['S', 'M', 'L', 'XL'], 30, 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=500&fit=crop'),
('Ferrari Scuderia Heritage Tee', 'Classic Ferrari team t-shirt with vintage Scuderia logo. Perfect for any Ferrari fan and F1 enthusiast.', 2000, 'teams', ARRAY['S', 'M', 'L', 'XL', 'XXL'], 75, 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=500&fit=crop'),
('Red Bull Racing Team Shirt', 'Official Red Bull Racing inspired team shirt. Features the iconic Red Bull logo and racing stripes.', 2750, 'teams', ARRAY['S', 'M', 'L', 'XL'], 40, 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=500&fit=crop'),
('Classic F1 Monaco Grand Prix Tee', 'Vintage-style Monaco Grand Prix t-shirt celebrating the most prestigious race in Formula 1.', 2500, 'f1-classic', ARRAY['S', 'M', 'L', 'XL', 'XXL'], 60, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=500&fit=crop'),
('Ayrton Senna Legend Tribute', 'Tribute t-shirt honoring the legendary Ayrton Senna. Features iconic helmet design and inspiring quotes.', 2400, 'f1-classic', ARRAY['S', 'M', 'L', 'XL'], 35, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop'),
('McLaren Papaya Orange Racing Tee', 'McLaren team t-shirt in signature papaya orange. Modern design with classic McLaren racing heritage.', 2100, 'teams', ARRAY['S', 'M', 'L', 'XL', 'XXL'], 45, 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=500&fit=crop'),
('Charles Leclerc Monaco Winner Shirt', 'Commemorative shirt celebrating Charles Leclerc''s Monaco victory. Premium quality with embroidered details.', 2900, 'drivers', ARRAY['S', 'M', 'L', 'XL'], 25, 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=500&fit=crop');

-- Insert initial site settings
INSERT INTO public.site_settings (site_name, contact_email, support_email, shipping_cost) 
VALUES ('The Fashion & Furious', 'orders@thefashionandfurious.com', 'support@thefashionandfurious.com', 500);
