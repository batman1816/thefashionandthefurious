
-- Add Bkash transaction fields to the orders table
ALTER TABLE public.orders 
ADD COLUMN bkash_transaction_id TEXT,
ADD COLUMN bkash_sender_number TEXT;
