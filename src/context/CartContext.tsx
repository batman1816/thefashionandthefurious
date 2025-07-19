
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types/Product';

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[]; // Add alias for backward compatibility
  addToCart: (product: Product, size: string, quantity: number, color?: string) => void;
  removeFromCart: (productId: string, size: string, color?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getBundleDiscount: () => number;
  activeBundleDeal: any; // Add for compatibility
  getCurrentPrice: (productId: string) => { price: number; originalPrice?: number; saleInfo?: any };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: string, quantity: number = 1, color?: string) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id && 
               item.size === size && 
               item.color === color
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id && 
          item.size === size && 
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { product, size, quantity, color }];
    });
  };

  const removeFromCart = (productId: string, size: string, color?: string) => {
    setItems(currentItems => 
      currentItems.filter(
        item => !(item.product.id === productId && 
                 item.size === size && 
                 item.color === color)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId && 
        item.size === size && 
        item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Function to get current price for a product (checks for active sales)
  const getCurrentPrice = (productId: string) => {
    const currentProduct = currentProducts.find(p => p.id === productId);
    if (currentProduct) {
      return {
        price: currentProduct.price,
        originalPrice: currentProduct.originalPrice,
        saleInfo: currentProduct.saleInfo
      };
    }
    // Fallback to cart item price if product not found in current products
    const cartItem = items.find(item => item.product.id === productId);
    return {
      price: cartItem?.product.price || 0,
      originalPrice: cartItem?.product.originalPrice,
      saleInfo: cartItem?.product.saleInfo
    };
  };

  // Calculate total using current prices
  const total = items.reduce((sum, item) => {
    const currentPrice = getCurrentPrice(item.product.id);
    return sum + (currentPrice.price * item.quantity);
  }, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const getCartTotal = () => total;
  const getCartSubtotal = () => total;
  const getBundleDiscount = () => 0;
  const activeBundleDeal = null;

  // Load current products data (this will be called by ProductsProvider)
  const updateCurrentProducts = (products: Product[]) => {
    setCurrentProducts(products);
  };

  // Add this to window object so ProductsProvider can call it
  useEffect(() => {
    (window as any).updateCartProducts = updateCurrentProducts;
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      cartItems: items, // Alias for backward compatibility
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      getCartTotal,
      getCartSubtotal,
      getBundleDiscount,
      activeBundleDeal,
      getCurrentPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
