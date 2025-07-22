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
const CustomerInfoForm = ({
  customerInfo,
  onCustomerInfoChange
}: CustomerInfoFormProps) => {
  return <div className="p-6 rounded-lg border border-gray-700 bg-zinc-900">
      <h3 className="text-xl text-white mb-6 font-medium">Billing Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-normal mb-2">
              First Name
            </label>
            <input type="text" value={customerInfo.firstName} onChange={e => onCustomerInfoChange('firstName', e.target.value)} className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400" required />
          </div>
          
          <div>
            <label className="block text-white font-normal mb-2">
              Last Name
            </label>
            <input type="text" value={customerInfo.lastName} onChange={e => onCustomerInfoChange('lastName', e.target.value)} className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400" required />
          </div>
        </div>

        <div>
          <label className="block text-white font-normal mb-2">
            Email
          </label>
          <input type="email" value={customerInfo.email} onChange={e => onCustomerInfoChange('email', e.target.value)} className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400" required />
        </div>

        <div>
          <label className="block text-white font-normal mb-2">
            Phone Number
          </label>
          <input type="tel" value={customerInfo.phone} onChange={e => onCustomerInfoChange('phone', e.target.value)} className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400" required />
        </div>

        <div>
          <label className="block text-white font-normal mb-2">
            Address
          </label>
          <textarea value={customerInfo.address} onChange={e => onCustomerInfoChange('address', e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-normal mb-2">
              City
            </label>
            <input type="text" value={customerInfo.city} onChange={e => onCustomerInfoChange('city', e.target.value)} className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400" required />
          </div>

          <div>
            <label className="block text-white font-normal mb-2">
              ZIP Code
            </label>
            <input type="text" value={customerInfo.zipCode} onChange={e => onCustomerInfoChange('zipCode', e.target.value)} className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400" required />
          </div>
        </div>
      </div>
    </div>;
};
export default CustomerInfoForm;