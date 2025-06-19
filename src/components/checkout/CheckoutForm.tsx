
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import CustomerInfoForm from './CustomerInfoForm';
import ShippingOptions from './ShippingOptions';
import OrderSummary from './OrderSummary';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

const CheckoutForm = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [shippingOption, setShippingOption] = useState('inside-dhaka');
  const [shippingCost, setShippingCost] = useState(70);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cartSubtotal = getCartTotal();
    const calculatedTax = cartSubtotal * 0.08; // 8% tax
    setSubtotal(cartSubtotal);
    setTax(calculatedTax);
    setTotal(cartSubtotal + shippingCost + calculatedTax);
  }, [cartItems, shippingCost, getCartTotal]);

  useEffect(() => {
    if (shippingOption === 'outside-dhaka') {
      setShippingCost(140);
    } else {
      setShippingCost(70);
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

    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
      toast.error('Please fill in all required fields.');
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
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: customerInfo.email,
        customer_phone: '', // Not collected in new form
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
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Information */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerInfoForm 
                  customerInfo={customerInfo} 
                  onInputChange={handleInputChange}
                />
              </CardContent>
            </Card>
            
            <ShippingOptions 
              shippingOption={shippingOption}
              onShippingOptionChange={setShippingOption}
            />
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary 
                  cartItems={cartItems}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  tax={tax}
                  total={total}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
