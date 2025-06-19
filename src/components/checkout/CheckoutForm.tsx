
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import CustomerInfoForm from './CustomerInfoForm';
import ShippingOptions from './ShippingOptions';
import OrderSummary from './OrderSummary';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

const CheckoutForm = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [shippingOption, setShippingOption] = useState('standard');
  const [shippingCost, setShippingCost] = useState(50);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cartSubtotal = getCartTotal();
    setSubtotal(cartSubtotal);
    setTotal(cartSubtotal + shippingCost);
  }, [cartItems, shippingCost, getCartTotal]);

  useEffect(() => {
    if (shippingOption === 'express') {
      setShippingCost(100);
    } else {
      setShippingCost(50);
    }
  }, [shippingOption]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateOrderId = () => {
    return Math.floor(Math.random() * 899900) + 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
      toast.error('Please fill in all customer information fields.');
      return;
    }

    setLoading(true);

    try {
      const orderId = generateOrderId().toString();
      const orderItems = cartItems.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price
        },
        size: item.size,
        quantity: item.quantity
      }));

      const orderData = {
        id: orderId,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_city: customerInfo.city,
        customer_zip_code: customerInfo.zipCode,
        items: JSON.stringify(orderItems),
        subtotal: subtotal,
        shipping_cost: shippingCost,
        shipping_option: shippingOption,
        total: total,
        status: 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);

      if (error) throw error;

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { order: orderData } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="space-y-4">
        <CustomerInfoForm 
          customerInfo={customerInfo} 
          onInputChange={handleInputChange}
        />

        <ShippingOptions 
          shippingOption={shippingOption}
          onShippingOptionChange={setShippingOption}
        />

        <OrderSummary 
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
        />

        <div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md shadow-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
