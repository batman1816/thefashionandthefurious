
import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerInfo,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      {/* First Name and Last Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
            First Name
          </label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={customerInfo.firstName}
            onChange={onInputChange}
            required
            className="border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 bg-zinc-200"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
            Last Name
          </label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={customerInfo.lastName}
            onChange={onInputChange}
            required
            className="border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 bg-zinc-200"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={customerInfo.email}
          onChange={onInputChange}
          required
          className="border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 bg-zinc-200"
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
          Address
        </label>
        <Textarea
          id="address"
          name="address"
          value={customerInfo.address}
          onChange={onInputChange}
          rows={3}
          required
          className="border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 bg-zinc-200"
        />
      </div>

      {/* City and ZIP Code Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
            City
          </label>
          <Input
            type="text"
            id="city"
            name="city"
            value={customerInfo.city}
            onChange={onInputChange}
            required
            className="border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 bg-zinc-200"
          />
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-2">
            ZIP Code
          </label>
          <Input
            type="text"
            id="zipCode"
            name="zipCode"
            value={customerInfo.zipCode}
            onChange={onInputChange}
            required
            className="border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 bg-zinc-200"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
