
import React from 'react';
import MakeWebhook from '../webhooks/MakeWebhook';

const MakeIntegration = () => {
  const handleWebhookSave = (url: string) => {
    console.log('Make.com webhook URL saved:', url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Make.com Integration</h2>
        <p className="text-gray-400 mb-6">
          Connect your store to Make.com to automate workflows when new orders are received.
        </p>
      </div>
      
      <MakeWebhook onWebhookSave={handleWebhookSave} />
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">What data is sent to Make.com?</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Order Information:</strong> Order ID, status, date, totals</p>
          <p><strong>Customer Details:</strong> Name, email, phone, address</p>
          <p><strong>Product Details:</strong> Items, quantities, sizes, prices</p>
          <p><strong>Shipping Info:</strong> Shipping option and costs</p>
        </div>
      </div>
    </div>
  );
};

export default MakeIntegration;
