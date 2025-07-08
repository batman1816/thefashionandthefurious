
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
  bkashTransactionId?: string | null;
  bkashSenderNumber?: string | null;
}

export const sendOrderToMake = async (orderData: OrderWebhookData) => {
  try {
    const webhookUrl = 'https://hook.eu2.make.com/9a3ot85hqlbthqjyqx41nt1d4bhbfkqc';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Webhook sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending webhook:', error);
    throw error;
  }
};
