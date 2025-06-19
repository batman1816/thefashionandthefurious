
import React from 'react';

interface ShippingOptionsProps {
  shippingOption: string;
  onShippingOptionChange: (option: string) => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({ shippingOption, onShippingOptionChange }) => {
  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Shipping Options
      </label>
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="inside-dhaka"
            name="shippingOption"
            type="radio"
            value="inside-dhaka"
            checked={shippingOption === 'inside-dhaka'}
            onChange={(e) => onShippingOptionChange(e.target.value)}
            className="h-4 w-4 text-red-600 border-gray-600 bg-gray-700 focus:ring-red-500"
          />
          <label htmlFor="inside-dhaka" className="ml-3 block text-sm text-gray-300">
            Inside Dhaka (TK 70)
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="outside-dhaka"
            name="shippingOption"
            type="radio"
            value="outside-dhaka"
            checked={shippingOption === 'outside-dhaka'}
            onChange={(e) => onShippingOptionChange(e.target.value)}
            className="h-4 w-4 text-red-600 border-gray-600 bg-gray-700 focus:ring-red-500"
          />
          <label htmlFor="outside-dhaka" className="ml-3 block text-sm text-gray-300">
            Outside Dhaka (TK 140)
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingOptions;
