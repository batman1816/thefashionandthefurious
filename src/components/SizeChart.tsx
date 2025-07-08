
import { useState } from 'react';
import { Ruler } from 'lucide-react';
import SizeChartModal from './SizeChartModal';

interface SizeChartProps {
  className?: string;
}

const SizeChart = ({ className = "" }: SizeChartProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center text-sm font-normal text-black hover:text-gray-600 transition-colors cursor-pointer ${className}`}
      >
        <Ruler size={14} className="mr-2" />
        Size Chart
      </button>
      
      <SizeChartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default SizeChart;
