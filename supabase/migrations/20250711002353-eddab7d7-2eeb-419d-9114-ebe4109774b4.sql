-- Add video_url and media_type columns to banners table if they don't exist
ALTER TABLE public.banners 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video'));