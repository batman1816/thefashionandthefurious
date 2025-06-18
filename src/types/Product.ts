
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string; // Changed from image to image_url to match database
  category: 'drivers' | 'f1-classic' | 'teams';
  sizes: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  date: Date;
  status: 'pending' | 'fulfilled';
}

export interface Banner {
  id: string;
  image_url: string; // Changed from image to image_url
  button_text?: string;
  button_link?: string;
  is_active: boolean;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  contact_email: string;
  support_email: string;
  shipping_cost: number;
  logo_url?: string;
}
