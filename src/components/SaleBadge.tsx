
import React from 'react';

interface SaleBadgeProps {
  className?: string;
  text?: string;
}

const SaleBadge: React.FC<SaleBadgeProps> = ({ 
  className = "", 
  text = "SALE" 
}) => {
  return (
    <div className={`absolute top-2 right-2 z-10 ${className}`}>
      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12 animate-pulse">
        {text}
      </div>
    </div>
  );
};

export default SaleBadge;
