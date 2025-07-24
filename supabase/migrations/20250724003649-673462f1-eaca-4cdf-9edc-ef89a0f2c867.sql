-- Update the products table category constraint to include mousepads
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE public.products ADD CONSTRAINT products_category_check 
CHECK (category IN ('drivers', 'f1-classic', 'teams', 'mousepads'));