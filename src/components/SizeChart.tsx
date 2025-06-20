
import { Ruler } from 'lucide-react';

interface SizeChartProps {
  className?: string;
}

const SizeChart = ({ className = "" }: SizeChartProps) => {
  return (
    <div className={`flex items-center text-sm font-normal text-black ${className}`}>
      <Ruler size={14} className="mr-2" />
      Size Chart
    </div>
  );
};

export default SizeChart;
