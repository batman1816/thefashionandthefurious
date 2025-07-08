
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import CustomerInfoForm from './CustomerInfoForm';
import OrderSummary from './OrderSummary';
import ShippingOptions from './ShippingOptions';
import { sendOrderToMake } from '../../utils/makeWebhook';

const CheckoutForm = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [shippingOption, setShippingOption] = useState('inside-dhaka');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  
  // bKash payment info
  const [bkashTransactionId, setBkashTransactionId] = useState('');
  const [bkashSenderNumber, setBkashSenderNumber] = useState('');

  const getShippingCost = () => {
    switch (shippingOption) {
      case 'inside-dhaka':
        return 70;
      case 'outside-dhaka':
        return 130;
      default:
        return 70;
    }
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || 
        !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
      toast.error('Please fill in all customer information fields');
      return false;
    }

    if (paymentMethod === 'bkash' && (!bkashTransactionId || !bkashSenderNumber)) {
      toast.error('Please provide bKash transaction ID and sender number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = Math.random().toString().slice(2, 8);
      const subtotal = getCartTotal();
      const shippingCost = getShippingCost();
      const total = subtotal + shippingCost;

      console.log('🛒 CHECKOUT DEBUG: About to insert order into database:', orderId);

      const orderData = {
        id: orderId,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_city: customerInfo.city,
        customer_zip_code: customerInfo.zipCode,
        items: cartItems.map(item => ({
          product: item.product,
          size: item.size,
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price
        })),
        subtotal,
        shipping_cost: shippingCost,
        total,
        shipping_option: shippingOption,
        status: 'pending',
        bkash_transaction_id: paymentMethod === 'bkash' ? bkashTransactionId : null,
        bkash_sender_number: paymentMethod === 'bkash' ? bkashSenderNumber : null
      };

      console.log('📊 BKASH DEBUG: Order data with bKash info:', {
        bkash_transaction_id: orderData.bkash_transaction_id,
        bkash_sender_number: orderData.bkash_sender_number
      });

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('✅ Order successfully inserted into database:', orderId);

      // Send to Make.com webhook
      try {
        console.log('🔗 CHECKOUT DEBUG: About to send order to Make.com webhook:', orderId);
        await sendOrderToMake({
          orderId,
          customerName: customerInfo.name,
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
          subtotal,
          shippingCost,
          total,
          shippingOption,
          orderDate: new Date().toISOString(),
          status: 'pending',
          bkashTransactionId: paymentMethod === 'bkash' ? bkashTransactionId : null,
          bkashSenderNumber: paymentMethod === 'bkash' ? bkashSenderNumber : null
        });
        console.log('✅ CHECKOUT DEBUG: Successfully sent order to Make.com:', orderId);
      } catch (webhookError) {
        console.log('❌ CHECKOUT DEBUG: Failed to send order to Make.com:', orderId);
        console.error('Webhook error:', webhookError);
        // Don't fail the entire checkout if webhook fails
      }

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-success?orderId=${orderId}`);

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CustomerInfoForm
            customerInfo={customerInfo}
            onCustomerInfoChange={handleCustomerInfoChange}
          />
          
          <ShippingOptions
            selectedOption={shippingOption}
            onOptionChange={setShippingOption}
          />

          {/* Payment Method */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-pink-500"
                />
                <span className="text-white">bKash</span>
              </label>
              
              {paymentMethod === 'bkash' && (
                <div className="ml-6 space-y-4 p-4 bg-pink-900/20 rounded border border-pink-600">
                  <div className="text-pink-400 text-sm">
                    <p className="font-semibold mb-2">bKash Payment Instructions:</p>
                    <p>1. Send money to: <strong>01XXXXXXXXX</strong></p>
                    <p>2. Enter the transaction details below</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      bKash Transaction ID *
                    </label>
                    <input
                      type="text"
                      value={bkashTransactionId}
                      onChange={(e) => setBkashTransactionId(e.target.value)}
                      placeholder="Enter bKash TXN ID"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Your bKash Number *
                    </label>
                    <input
                      type="text"
                      value={bkashSenderNumber}
                      onChange={(e) => setBkashSenderNumber(e.target.value)}
                      placeholder="Enter your bKash number"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OrderSummary shippingCost={getShippingCost()} />
          
          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : `Place Order - TK${(getCartTotal() + getShippingCost()).toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
