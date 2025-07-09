import React from 'react';
interface ShippingOptionsProps {
  shippingOption: string;
  onShippingOptionChange: (option: string) => void;
}
const ShippingOptions = ({
  shippingOption,
  onShippingOptionChange
}: ShippingOptionsProps) => {
  return <div className="p-6 rounded-lg border border-gray-700 bg-zinc-900">
      <h3 className="text-xl font-semibold text-white mb-6">Shipping Options</h3>
      <div className="space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="radio" name="shipping" value="inside-dhaka" checked={shippingOption === 'inside-dhaka'} onChange={e => onShippingOptionChange(e.target.value)} className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500" />
          <span className="text-white font-medium">Inside Dhaka (TK 70)</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="radio" name="shipping" value="outside-dhaka" checked={shippingOption === 'outside-dhaka'} onChange={e => onShippingOptionChange(e.target.value)} className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500" />
          <span className="text-white font-medium">Outside Dhaka (TK 140)</span>
        </label>
      </div>
    </div>;
};
export default ShippingOptions;