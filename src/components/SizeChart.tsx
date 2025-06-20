
import { useState } from 'react';
import { Ruler, Upload, X } from 'lucide-react';

interface SizeChartProps {
  className?: string;
}

const SizeChart = ({ className = "" }: SizeChartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sizeChartImage, setSizeChartImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSizeChartImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSizeChartImage(null);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`flex items-center text-sm font-normal text-black hover:text-gray-600 transition-colors duration-200 ${className}`}
      >
        <Ruler size={14} className="mr-2" />
        Size Chart
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative rounded-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Size Chart</h2>
              
              {!sizeChartImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Upload your size chart image</p>
                  <label className="inline-block bg-black text-white px-6 py-2 cursor-pointer hover:bg-gray-800 transition-colors duration-200">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={sizeChartImage}
                    alt="Size Chart"
                    className="w-full h-auto rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeChart;
