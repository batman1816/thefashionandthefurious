
export interface OrderWebhookData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerZipCode: string;
  items: Array<{
    productName: string;
    productPrice: number;
    size: string;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingOption: string;
  orderDate: string;
  status: string;
}

export const sendOrderToMake = async (orderData: OrderWebhookData): Promise<boolean> => {
  const webhookUrl = localStorage.getItem('make_webhook_url');
  
  console.log('=== MAKE.COM WEBHOOK DEBUG START ===');
  console.log('Webhook URL from localStorage:', webhookUrl);
  console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
  
  if (!webhookUrl || webhookUrl.trim() === '') {
    console.error('❌ No Make.com webhook URL configured in localStorage');
    console.log('Please go to Admin > Make.com and save your webhook URL');
    return false;
  }

  // Validate URL format
  try {
    new URL(webhookUrl);
  } catch (error) {
    console.error('❌ Invalid webhook URL format:', webhookUrl);
    return false;
  }

  const webhookPayload = {
    event: 'new_order',
    timestamp: new Date().toISOString(),
    source: 'The Fashion & Furious',
    order: orderData
  };

  console.log('Final payload being sent to Make.com:', JSON.stringify(webhookPayload, null, 2));

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log('✅ Webhook response status:', response.status);
    console.log('✅ Webhook response ok:', response.ok);
    
    if (response.ok) {
      console.log('✅ Order sent to Make.com successfully for order:', orderData.orderId);
      console.log('=== MAKE.COM WEBHOOK DEBUG END ===');
      return true;
    } else {
      console.error('❌ Webhook failed with status:', response.status);
      const responseText = await response.text();
      console.error('❌ Response text:', responseText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending order to Make.com:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.log('=== MAKE.COM WEBHOOK DEBUG END ===');
    return false;
  }
};
