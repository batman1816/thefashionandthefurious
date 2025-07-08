
import React from 'react';

interface ShippingOptionsProps {
  shippingOption: string;
  onShippingOptionChange: (option: string) => void;
}

const ShippingOptions = ({ shippingOption, onShippingOptionChange }: ShippingOptionsProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Shipping Options</h3>
      <div className="space-y-3">
        <label className="flex items-center justify-between p-3 border border-gray-600 rounded cursor-pointer hover:border-gray-500">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="shipping"
              value="inside-dhaka"
              checked={shippingOption === 'inside-dhaka'}
              onChange={(e) => onShippingOptionChange(e.target.value)}
              className="text-pink-500"
            />
            <div>
              <span className="text-white font-medium">Inside Dhaka</span>
              <p className="text-gray-400 text-sm">Delivery within 2-3 days</p>
            </div>
          </div>
          <span className="text-white font-semibold">TK 70</span>
        </label>

        <label className="flex items-center justify-between p-3 border border-gray-600 rounded cursor-pointer hover:border-gray-500">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="shipping"
              value="outside-dhaka"
              checked={shippingOption === 'outside-dhaka'}
              onChange={(e) => onShippingOptionChange(e.target.value)}
              className="text-pink-500"
            />
            <div>
              <span className="text-white font-medium">Outside Dhaka</span>
              <p className="text-gray-400 text-sm">Delivery within 5-7 days</p>
            </div>
          </div>
          <span className="text-white font-semibold">TK 130</span>
        </label>
      </div>
    </div>
  );
};

export default ShippingOptions;
