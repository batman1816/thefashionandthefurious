
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus } from 'lucide-react';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import ProductImageCarousel from './ProductImageCarousel';
import SizeChart from './SizeChart';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  console.log('ProductModal rendered for:', product.name);

  // Filter out XS from sizes and memoize the result
  const availableSizes = product.sizes?.filter(size => size.toUpperCase() !== 'XS') || [];

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success(`Added ${product.name} to cart!`);
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success(`Added ${product.name} to cart!`);
    onClose();
    navigate('/checkout');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked, closing modal');
      onClose();
    }
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Prepare images for carousel
  const carouselImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
      ? [product.image_url] 
      : [];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Product Image Carousel */}
          <div className="flex items-center justify-center p-8">
            <ProductImageCarousel 
              images={carouselImages}
              productName={product.name}
              className="aspect-square w-full max-w-md"
            />
          </div>

          {/* Product Info */}
          <div className="p-12 flex flex-col">
            <h1 className="text-2xl font-normal text-black mb-4 tracking-wide leading-relaxed">
              {product.name.toUpperCase()}
            </h1>
            
            <div className="text-xl font-normal text-black mb-2">
              Tk {product.price}.00 BDT
            </div>

            <p className="text-sm text-gray-500 mb-8 underline">
              Shipping calculated at checkout.
            </p>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-normal mb-4 text-black">SIZE</h3>
                <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`flex-shrink-0 px-4 py-2 text-sm font-normal transition-all duration-200 border ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Chart */}
            <div className="mb-8">
              <SizeChart />
            </div>

            {/* Quantity */}
            <div className="mb-12">
              <h3 className="text-sm font-normal mb-4 text-black">Quantity</h3>
              <div className="flex items-center border border-gray-300 w-fit bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-8 py-4 text-center min-w-[80px] font-normal border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white border border-black text-black py-4 px-8 font-normal transition-all duration-200 hover:bg-gray-50 transform hover:scale-[1.01] active:scale-[0.97] active:-translate-y-1"
              >
                Add to cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-black text-white py-4 px-8 font-normal transition-all duration-200 hover:bg-gray-800 transform hover:scale-[1.01] active:scale-[0.97] active:-translate-y-1"
              >
                Buy it now
              </button>
            </div>

            {/* View Details Link */}
            <button 
              onClick={handleViewDetails}
              className="text-sm text-gray-500 hover:text-black transition-colors duration-200 text-left group flex items-center"
            >
              View full details 
              <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
