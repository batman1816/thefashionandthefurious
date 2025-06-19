
-- Create orders table to store real order data
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY, -- Using TEXT to store custom order IDs like #1001
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_zip_code TEXT NOT NULL,
  items JSONB NOT NULL, -- Store order items as JSON
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  total DECIMAL(10,2) NOT NULL,
  shipping_option TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert orders (for public checkout)
CREATE POLICY "Anyone can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to view orders (for admin functionality)
CREATE POLICY "Anyone can view orders" 
  ON public.orders 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to update orders (for admin functionality)
CREATE POLICY "Anyone can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (true);

-- Create index for faster searches
CREATE INDEX idx_orders_customer_email ON public.orders (customer_email);
CREATE INDEX idx_orders_customer_name ON public.orders (customer_name);
CREATE INDEX idx_orders_customer_phone ON public.orders (customer_phone);
CREATE INDEX idx_orders_status ON public.orders (status);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);

-- Update site_settings table to track analytics
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_visitors INTEGER DEFAULT 0;
