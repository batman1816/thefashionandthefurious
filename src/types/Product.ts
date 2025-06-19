
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  sizes: string[];
  stock: number;
  image_url?: string;
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
}
