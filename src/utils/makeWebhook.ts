
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
  
  if (!webhookUrl) {
    console.log('No Make.com webhook URL configured');
    return false;
  }

  try {
    console.log('Sending order to Make.com:', orderData.orderId);

    const webhookPayload = {
      event: 'new_order',
      timestamp: new Date().toISOString(),
      source: 'The Fashion & Furious',
      order: orderData
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify(webhookPayload),
    });

    console.log('Order sent to Make.com successfully');
    return true;
  } catch (error) {
    console.error('Error sending order to Make.com:', error);
    return false;
  }
};
