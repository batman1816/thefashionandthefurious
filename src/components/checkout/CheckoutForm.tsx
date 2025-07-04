
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import CustomerInfoForm from './CustomerInfoForm';
import ShippingOptions from './ShippingOptions';
import OrderSummary from './OrderSummary';
import { sendOrderToMake, OrderWebhookData } from '../../utils/makeWebhook';

interface CustomerInfo {
  firstName: string;
  lastName: string;
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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  
  const [shippingOption, setShippingOption] = useState('inside-dhaka');
  const [shippingCost, setShippingCost] = useState(70);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bkashAccount, setBkashAccount] = useState('');
  const [bkashTransactionId, setBkashTransactionId] = useState('');

  useEffect(() => {
    const cartSubtotal = getCartTotal();
    setSubtotal(cartSubtotal);
    setTotal(cartSubtotal + shippingCost);
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
    
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!bkashAccount || !bkashTransactionId) {
      toast.error('Please fill in your Bkash account number and transaction ID.');
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

      console.log('🛒 CHECKOUT DEBUG: About to insert order into database:', orderId);
      const { error } = await supabase.from('orders').insert(orderData);
      
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      console.log('✅ Order successfully inserted into database:', orderId);

      // Prepare webhook data immediately after successful database insert
      const makeWebhookData: OrderWebhookData = {
        orderId: orderId,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerZipCode: customerInfo.zipCode,
        items: cartItems.map(item => ({
          productName: item.product.name,
          productPrice: item.product.price,
          size: item.size,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        subtotal: subtotal,
        shippingCost: shippingCost,
        total: total,
        shippingOption: shippingOption,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      console.log('🔗 CHECKOUT DEBUG: About to send order to Make.com webhook:', orderId);
      
      // Send to Make.com webhook - wait for the result
      try {
        const webhookSuccess = await sendOrderToMake(makeWebhookData);
        if (!webhookSuccess) {
          console.log('❌ CHECKOUT DEBUG: Failed to send order to Make.com:', orderId);
        }
      } catch (webhookError) {
        console.error('❌ CHECKOUT DEBUG: Webhook error:', webhookError);
      }

      // Clear cart and navigate regardless of webhook status
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/order-success', { state: { order: { ...orderData, orderDate: new Date().toISOString() } } });
      
    } catch (error) {
      console.error('❌ CHECKOUT DEBUG: Error placing order:', error);
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
              <CardHeader className="bg-zinc-900">
                <CardTitle className="text-xl font-semibold text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="bg-zinc-900">
                <CustomerInfoForm customerInfo={customerInfo} onInputChange={handleInputChange} />
              </CardContent>
            </Card>
            
            <ShippingOptions shippingOption={shippingOption} onShippingOptionChange={setShippingOption} />
          </div>

          {/* Bkash Payment Instructions */}
          <div className="mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-zinc-900 pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Select Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-zinc-900 space-y-3">
                <div className="bg-blue-500 text-white p-3 rounded-lg text-center font-medium">
                  bKash
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Bkash Instructions:</h4>
                  <div className="text-sm text-gray-300 space-y-1 mb-3">
                    <p>1. Open up the Bkash app & Choose "SEND MONEY"</p>
                    <p>2. Enter the Bkash Account Number, which is given down below</p>
                    <p>3. Enter the exact amount and Confirm the Transaction</p>
                    <p>4. After sending money, you'll receive a Bkash Transaction ID (TRX ID).</p>
                  </div>
                  
                  <div className="text-green-400 font-semibold mb-3">
                    You need to send us: TK {shippingCost}
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Type:</span>
                      <span className="text-white">PERSONAL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Number:</span>
                      <span className="text-red-400">01311506938</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">Your Bkash Account Number</label>
                      <input
                        type="text"
                        placeholder="01XXXXXXXXX"
                        value={bkashAccount}
                        onChange={(e) => setBkashAccount(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">Bkash Transaction ID</label>
                      <input
                        type="text"
                        placeholder="Txn ID"
                        value={bkashTransactionId}
                        onChange={(e) => setBkashTransactionId(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-zinc-900">
                <CardTitle className="text-xl font-semibold text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="bg-zinc-900">
                <OrderSummary cartItems={cartItems} subtotal={subtotal} shippingCost={shippingCost} total={total} loading={loading} />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
