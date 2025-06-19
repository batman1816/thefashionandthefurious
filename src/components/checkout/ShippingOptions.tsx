
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface ShippingOptionsProps {
  shippingOption: string;
  onShippingOptionChange: (option: string) => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({ shippingOption, onShippingOptionChange }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Shipping Options</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={shippingOption} onValueChange={onShippingOptionChange} className="space-y-3">
          <div className="flex items-center space-x-3">
            <RadioGroupItem 
              value="inside-dhaka" 
              id="inside-dhaka"
              className="border-gray-600 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="inside-dhaka" className="text-sm text-gray-300 cursor-pointer">
              Inside Dhaka (TK 70)
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem 
              value="outside-dhaka" 
              id="outside-dhaka"
              className="border-gray-600 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="outside-dhaka" className="text-sm text-gray-300 cursor-pointer">
              Outside Dhaka (TK 140)
            </label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ShippingOptions;
