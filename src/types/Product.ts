
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number; // For displaying crossed-out original price
  category: string;
  sizes: string[];
  image_url?: string;
  images?: string[]; // Array of image URLs for multiple images
  tags?: string[]; // Array of tags for the product
  is_active?: boolean; // Add is_active field for visibility control
  slug?: string; // URL-friendly slug for SEO
  saleInfo?: {
    title: string;
    description: string;
    endDate: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Banner {
  id: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  contact_email: string;
  support_email: string;
  logo_url?: string;
  next_sale_title?: string;
  next_sale_date?: string;
  show_sale_countdown?: boolean;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'fulfilled';
}
