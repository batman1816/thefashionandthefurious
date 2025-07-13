
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

const ProductImageCarousel = ({ images, productName, className = "" }: ProductImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Filter out any empty or invalid images
  const validImages = images.filter(img => img && img.trim() !== '');
  
  if (validImages.length === 0) {
    return <div className={`bg-gray-50 flex items-center justify-center ${className}`}>
      <span className="text-gray-400">No image available</span>
    </div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-50 ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={validImages[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        
        {/* Navigation arrows - only show if more than one image */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}
        
        {/* Image indicators - more prominent dots like pagination */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 border-2 ${
                  index === currentImageIndex 
                    ? 'bg-white border-white' 
                    : 'bg-transparent border-white hover:bg-white hover:bg-opacity-50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
