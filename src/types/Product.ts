
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
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
