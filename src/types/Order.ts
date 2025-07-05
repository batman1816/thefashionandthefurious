
import { Json } from '../integrations/supabase/types';

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_zip_code: string;
  items: Json;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_option: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  bkash_transaction_id?: string | null;
  bkash_sender_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  fulfilled_orders: number;
}
