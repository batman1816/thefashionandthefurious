
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
            id="standard"
            name="shippingOption"
            type="radio"
            value="standard"
            checked={shippingOption === 'standard'}
            onChange={(e) => onShippingOptionChange(e.target.value)}
            className="h-4 w-4 text-red-600 border-gray-600 bg-gray-700 focus:ring-red-500"
          />
          <label htmlFor="standard" className="ml-3 block text-sm text-gray-300">
            Standard Shipping (TK50)
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="express"
            name="shippingOption"
            type="radio"
            value="express"
            checked={shippingOption === 'express'}
            onChange={(e) => onShippingOptionChange(e.target.value)}
            className="h-4 w-4 text-red-600 border-gray-600 bg-gray-700 focus:ring-red-500"
          />
          <label htmlFor="express" className="ml-3 block text-sm text-gray-300">
            Express Shipping (TK100)
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingOptions;
