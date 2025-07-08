
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartModal = ({ isOpen, onClose }: SizeChartModalProps) => {
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
          <img 
            src="/lovable-uploads/ef9761af-3579-4600-886a-a57ecbf0a519.png" 
            alt="Size Chart"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeChartModal;
