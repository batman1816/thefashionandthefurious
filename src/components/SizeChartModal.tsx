
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartModal = ({ isOpen, onClose }: SizeChartModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const sizeChartUrl = "/lovable-uploads/ef9761af-3579-4600-886a-a57ecbf0a519.png";

  // Preload the image when component mounts
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = sizeChartUrl;
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 border-0">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
          >
            <X size={20} />
          </button>
          {imageLoaded ? (
            <img 
              src={sizeChartUrl}
              alt="Size Chart"
              className="w-full h-auto rounded-lg"
              loading="eager"
            />
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Loading size chart...</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeChartModal;
