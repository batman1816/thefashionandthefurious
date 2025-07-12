-- Add category column to banners table for category-specific banners
ALTER TABLE public.banners 
ADD COLUMN category text DEFAULT 'home';

-- Add title and description columns for category banners
ALTER TABLE public.banners 
ADD COLUMN title text,
ADD COLUMN description text;

-- Create index for better performance
CREATE INDEX idx_banners_category ON public.banners(category);
CREATE INDEX idx_banners_active_category ON public.banners(is_active, category);