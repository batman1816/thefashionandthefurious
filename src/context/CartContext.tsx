
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types/Product';
import { supabase } from '../integrations/supabase/client';

interface BundleDeal {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  minimum_quantity: number;
  max_discount_items: number;
  is_active: boolean;
  end_date: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getBundleDiscount: () => number;
  activeBundleDeal: BundleDeal | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeBundleDeal, setActiveBundleDeal] = useState<BundleDeal | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Fetch active bundle deals
  useEffect(() => {
    const fetchBundleDeals = async () => {
      try {
        const { data, error } = await supabase
          .from('bundle_deals')
          .select('*')
          .eq('is_active', true)
          .gte('end_date', new Date().toISOString())
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching bundle deals:', error);
          return;
        }

        setActiveBundleDeal(data || null);
      } catch (error) {
        console.error('Error fetching bundle deals:', error);
      }
    };

    fetchBundleDeals();
  }, []);

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { product, size, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.product.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getBundleDiscount = () => {
    if (!activeBundleDeal) {
      return 0;
    }

    // Filter out items that are already on individual sale
    const nonSaleItems = cartItems.filter(item => !item.product.originalPrice);
    
    // Calculate total quantity of non-sale items only
    const totalNonSaleQuantity = nonSaleItems.reduce((total, item) => total + item.quantity, 0);
    
    console.log('Bundle Deal Check:', {
      totalNonSaleQuantity,
      minimumRequired: activeBundleDeal.minimum_quantity,
      dealActive: activeBundleDeal.is_active,
      nonSaleItemsCount: nonSaleItems.length,
      totalItemsCount: cartItems.length
    });
    
    // Only apply discount if we meet the minimum quantity requirement with non-sale items
    if (totalNonSaleQuantity < activeBundleDeal.minimum_quantity) {
      return 0;
    }

    // Create a flat array of all individual non-sale items (expanding quantities)
    const allNonSaleItems: { product: Product; price: number }[] = [];
    nonSaleItems.forEach(cartItem => {
      for (let i = 0; i < cartItem.quantity; i++) {
        allNonSaleItems.push({
          product: cartItem.product,
          price: cartItem.product.price
        });
      }
    });

    // Sort items by price (highest first) to apply discount to most expensive items
    allNonSaleItems.sort((a, b) => b.price - a.price);
    
    let discountAmount = 0;
    const itemsToDiscount = Math.min(activeBundleDeal.max_discount_items, allNonSaleItems.length);
    
    for (let i = 0; i < itemsToDiscount; i++) {
      discountAmount += (allNonSaleItems[i].price * activeBundleDeal.discount_percentage) / 100;
    }

    console.log('Bundle Discount Applied:', {
      discountAmount,
      itemsToDiscount,
      discountPercentage: activeBundleDeal.discount_percentage,
      appliedToNonSaleItemsOnly: true
    });

    return discountAmount;
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const bundleDiscount = getBundleDiscount();
    return subtotal - bundleDiscount;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
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
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
