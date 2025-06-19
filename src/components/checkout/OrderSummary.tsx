
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
    <div className="space-y-4">
      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {cartItems.map((item, index) => (
          <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-gray-300">
            <span>Product {index + 1}</span>
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

      {/* Complete Purchase Button */}
      <button
        type="submit"
        className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-gray-900 bg-gray-300 hover:bg-white transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Complete Purchase'}
      </button>
    </div>
  );
};

export default OrderSummary;
