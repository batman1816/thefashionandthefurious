
import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, shippingCost, total }) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      <div className="flex justify-between text-gray-700">
        <span>Subtotal:</span>
        <span>TK{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Shipping:</span>
        <span>TK{shippingCost.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-medium text-gray-900 mt-2">
        <span>Total:</span>
        <span>TK{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
