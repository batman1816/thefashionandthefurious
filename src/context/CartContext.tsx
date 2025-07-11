
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const getCartTotal = () => total;
  const getCartSubtotal = () => total;
  const getBundleDiscount = () => 0;
  const activeBundleDeal = null;

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
      activeBundleDeal
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
