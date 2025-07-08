
import React from 'react';
import { CartItem } from '../../types/Product';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  loading: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cartItems, 
  subtotal, 
  shippingCost, 
  total, 
  loading 
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
      
      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {cartItems.map((item, index) => (
          <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-gray-300">
            <span>{item.product.name} (Size: {item.size}) x{item.quantity}</span>
            <span>TK {(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-600 pt-4 space-y-2">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>TK {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span>TK {shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-white text-lg border-t border-gray-600 pt-2">
          <span>Total</span>
          <span>TK {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
