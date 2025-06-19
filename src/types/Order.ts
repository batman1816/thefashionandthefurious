
export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_zip_code: string;
  items: any[]; // JSON array of cart items
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_option: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  fulfilled_orders: number;
}
