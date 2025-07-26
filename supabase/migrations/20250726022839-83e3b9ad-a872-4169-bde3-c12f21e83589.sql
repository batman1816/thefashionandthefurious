-- Add size_pricing column to products table for mousepad size-based pricing
ALTER TABLE products ADD COLUMN size_pricing JSONB DEFAULT NULL;

-- Create index for better performance on size_pricing queries
CREATE INDEX idx_products_size_pricing ON products USING GIN(size_pricing);

-- Add comment to explain the structure
COMMENT ON COLUMN products.size_pricing IS 'JSON object storing size-specific prices for mousepads, e.g., {"900 X 400 MM": 1500, "700 X 300 MM": 1200}';