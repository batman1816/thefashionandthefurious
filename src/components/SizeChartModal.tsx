
import { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartModal = ({ isOpen, onClose }: SizeChartModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler size={20} />
            Size Chart - Drop Shoulder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Size Chart Image */}
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/ef9761af-3579-4600-886a-a57ecbf0a519.png" 
              alt="Size Chart - Drop Shoulder"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          {/* Size Chart Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Size</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Chest (inch)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Length (inch)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">M</td>
                  <td className="border border-gray-300 px-4 py-2">40"</td>
                  <td className="border border-gray-300 px-4 py-2">28"</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">L</td>
                  <td className="border border-gray-300 px-4 py-2">42"</td>
                  <td className="border border-gray-300 px-4 py-2">29"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">XL</td>
                  <td className="border border-gray-300 px-4 py-2">44"</td>
                  <td className="border border-gray-300 px-4 py-2">30"</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">XXL</td>
                  <td className="border border-gray-300 px-4 py-2">46"</td>
                  <td className="border border-gray-300 px-4 py-2">31"</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Additional Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Measurement Guide:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li>• <strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem</li>
              <li>• All measurements are in inches</li>
              <li>• For the best fit, compare with a similar garment you already own</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeChartModal;
