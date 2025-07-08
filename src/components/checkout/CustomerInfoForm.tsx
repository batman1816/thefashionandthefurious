
import React from 'react';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (field: string, value: string) => void;
}

const CustomerInfoForm = ({ customerInfo, onCustomerInfoChange }: CustomerInfoFormProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Customer Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={customerInfo.firstName}
            onChange={(e) => onCustomerInfoChange('firstName', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={customerInfo.lastName}
            onChange={(e) => onCustomerInfoChange('lastName', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => onCustomerInfoChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => onCustomerInfoChange('phone', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Address *
          </label>
          <textarea
            value={customerInfo.address}
            onChange={(e) => onCustomerInfoChange('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            City *
          </label>
          <input
            type="text"
            value={customerInfo.city}
            onChange={(e) => onCustomerInfoChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            value={customerInfo.zipCode}
            onChange={(e) => onCustomerInfoChange('zipCode', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
