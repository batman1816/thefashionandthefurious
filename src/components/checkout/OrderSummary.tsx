import React from 'react';
import { CartItem } from '../../types/Product';
interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  loading: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}
const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotal,
  shippingCost,
  total,
  loading,
  onSubmit
}) => {
  return <div className="p-6 rounded-lg border border-gray-700 bg-zinc-900">
      <h3 className="text-xl font-semibold text-white mb-6">Order Summary</h3>
      
      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {cartItems.map((item, index) => <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-gray-300">
            <span>{item.product.name} x{item.quantity}</span>
            <span>
              {item.product.saleInfo && item.product.originalPrice ? (
                <>
                  <span className="line-through text-gray-500 mr-2">Tk {(item.product.originalPrice * item.quantity).toFixed(2)}</span>
                  <span>Tk {(item.product.price * item.quantity).toFixed(2)} BDT</span>
                </>
              ) : (
                <span>Tk {(item.product.price * item.quantity).toFixed(2)}</span>
              )}
            </span>
          </div>)}
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>Tk {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span>Tk {shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300 border-t border-gray-600 pt-3">
          <span>Total Amount</span>
          <span>Tk {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-400">
          <span>Shipping (Paid via bKash)</span>
          <span>- Tk {shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-white text-lg border-t border-gray-600 pt-3">
          <span>Amount to Pay Here</span>
          <span>Tk {subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Complete Purchase Button */}
      <button type="submit" onClick={onSubmit} className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-gray-900 bg-gray-300 hover:bg-white transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
        {loading ? 'Processing...' : 'Complete Purchase'}
      </button>
    </div>;
};
export default OrderSummary;