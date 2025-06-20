
-- Create banner-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banner-images',
  'banner-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policy for banner images
CREATE POLICY "Public Access for Banner Images" ON storage.objects
FOR ALL USING (bucket_id = 'banner-images');

-- Create policy for authenticated uploads
CREATE POLICY "Authenticated users can upload banner images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'banner-images');

-- Create policy for authenticated updates
CREATE POLICY "Authenticated users can update banner images" ON storage.objects
FOR UPDATE USING (bucket_id = 'banner-images');

-- Create policy for authenticated deletes
CREATE POLICY "Authenticated users can delete banner images" ON storage.objects
FOR DELETE USING (bucket_id = 'banner-images');
