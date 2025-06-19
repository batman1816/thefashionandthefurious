
import React from 'react';

interface ShippingOptionsProps {
  shippingOption: string;
  onShippingOptionChange: (option: string) => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({ shippingOption, onShippingOptionChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Shipping Options
      </label>
      <div className="mt-2 space-y-2">
        <div className="flex items-center">
          <input
            id="standard"
            name="shippingOption"
            type="radio"
            value="standard"
            checked={shippingOption === 'standard'}
            onChange={(e) => onShippingOptionChange(e.target.value)}
            className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
          />
          <label htmlFor="standard" className="ml-3 block text-sm font-medium text-gray-700">
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
            className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
          />
          <label htmlFor="express" className="ml-3 block text-sm font-medium text-gray-700">
            Express Shipping (TK100)
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingOptions;
