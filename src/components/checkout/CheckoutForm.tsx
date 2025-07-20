import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import CustomerInfoForm from './CustomerInfoForm';
import OrderSummary from './OrderSummary';
import ShippingOptions from './ShippingOptions';
import { sendOrderToMake } from '../../utils/makeWebhook';
const CheckoutForm = () => {
  const {
    cartItems,
    clearCart,
    getCartTotal,
    removeInactiveProducts
  } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
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
        return 140;
      default:
        return 70;
    }
  };
  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value,
      name: field === 'firstName' || field === 'lastName' ? `${field === 'firstName' ? value : prev.firstName} ${field === 'lastName' ? value : prev.lastName}`.trim() : prev.name
    }));
  };
  const validateForm = () => {
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
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
    
    // Remove any inactive products from cart before checkout
    const removedItems = removeInactiveProducts();
    if (removedItems.length > 0) {
      toast.error(`${removedItems.length} product(s) were removed from your cart as they are no longer available`);
      if (cartItems.filter(item => {
        const currentProduct = products.find(p => p.id === item.product.id);
        return currentProduct && currentProduct.is_active;
      }).length === 0) {
        toast.error('Your cart is now empty');
        return;
      }
    }
    
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
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        customer_city: customerInfo.city,
        customer_zip_code: customerInfo.zipCode,
        items: cartItems.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            category: item.product.category,
            image_url: item.product.image_url
          },
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
      const {
        error
      } = await supabase.from('orders').insert([orderData]);
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

      // Navigate with order data in state
      navigate('/order-success', {
        state: {
          order: {
            ...orderData,
            orderDate: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CustomerInfoForm customerInfo={customerInfo} onCustomerInfoChange={handleCustomerInfoChange} />
          
          <ShippingOptions shippingOption={shippingOption} onShippingOptionChange={setShippingOption} />
        </div>

        <div className="space-y-6">
          {/* Payment Method */}
          <div className="p-6 rounded-lg border border-gray-700 bg-zinc-900">
            <div className="flex items-center mb-4">
              <h3 className="text-white text-xl text-left font-normal">Payment</h3>
            </div>
            
            <div className="mb-6">
              <button type="button" className="w-full py-3 px-4 text-zinc-50 text-left rounded-lg bg-transparent text-lg font-normal">Bkash</button>
            </div>

            <div className="space-y-4">
              <div className="text-gray-300">
                <p className="font-semibold mb-3">Bkash Instructions:</p>
                <ol className="space-y-1 text-sm">
                  <li>1. Open up the Bkash app & Choose "SEND MONEY"</li>
                  <li>2. Enter the Bkash Account Number, which is given down below</li>
                  <li>3. Enter the exact amount and Confirm the Transaction</li>
                  <li>4. After sending money, you'll receive a Bkash Transaction ID (TRX ID).</li>
                </ol>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800">
                <p className="text-green-400 mb-2 font-medium">You need to send us: Tk {getShippingCost()}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Account Type:</span>
                  <span className="text-white font-semibold">PERSONAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Account Number:</span>
                  <span className="text-red-400 font-semibold">01311506938</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Your Bkash Account Number
                </label>
                <input type="text" value={bkashSenderNumber} onChange={e => setBkashSenderNumber(e.target.value)} placeholder="01XXXXXXXXX" required className="w-full px-4 py-3 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Bkash Transaction ID
                </label>
                <input type="text" value={bkashTransactionId} onChange={e => setBkashTransactionId(e.target.value)} placeholder="Txn ID" required className="w-full px-4 py-3 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
            </div>
          </div>

          <OrderSummary cartItems={cartItems} subtotal={getCartTotal()} shippingCost={getShippingCost()} total={getCartTotal() + getShippingCost()} loading={isSubmitting} onSubmit={handleSubmit} />
        </div>
      </form>
    </div>;
};
export default CheckoutForm;