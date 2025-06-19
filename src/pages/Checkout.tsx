
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

const Checkout = () => {
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
    // Generate a random number between 100 and 999999
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
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="space-y-4">
            {/* Customer Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={customerInfo.zipCode}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>

            {/* Shipping Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Options
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="standard"
                    name="shippingOption"
                    type="radio"
                    value="standard"
                    checked={shippingOption === 'standard'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label htmlFor="standard" className="ml-3 block text-sm font-medium text-gray-700">
                    Standard Shipping (TK50)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="express"
                    name="shippingOption"
                    type="radio"
                    value="express"
                    checked={shippingOption === 'express'}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label htmlFor="express" className="ml-3 block text-sm font-medium text-gray-700">
                    Express Shipping (TK100)
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
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
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
