-- Add slug column to products table
ALTER TABLE public.products 
ADD COLUMN slug text UNIQUE;

-- Create index for better performance
CREATE INDEX idx_products_slug ON public.products(slug);

-- Function to generate slug from product name
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Update existing products with slugs based on their names
UPDATE public.products 
SET slug = generate_slug(name) 
WHERE slug IS NULL;

-- Create trigger to auto-generate slug for new products
CREATE OR REPLACE FUNCTION update_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_slug
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_slug();