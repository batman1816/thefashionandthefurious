-- Create the update timestamp function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create announcement banner settings table
CREATE TABLE public.announcement_banner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL DEFAULT 'FREE SHIPPING ON ORDERS ABOVE 2000 TK !!!',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.announcement_banner ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view announcement banner" 
ON public.announcement_banner 
FOR SELECT 
USING (true);

-- Create policy for admin updates
CREATE POLICY "Admins can update announcement banner" 
ON public.announcement_banner 
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert default record
INSERT INTO public.announcement_banner (text, is_active) 
VALUES ('FREE SHIPPING ON ORDERS ABOVE 2000 TK !!!', false);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_announcement_banner_updated_at
BEFORE UPDATE ON public.announcement_banner
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();