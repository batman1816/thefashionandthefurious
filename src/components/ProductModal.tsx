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
const ProductModal = ({
  product,
  onClose
}: ProductModalProps) => {
  const navigate = useNavigate();
  const {
    addToCart
  } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Filter out XS and S from sizes and memoize the result
  const availableSizes = product.sizes?.filter(size => size.toUpperCase() !== 'XS' && size.toUpperCase() !== 'S') || [];
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);
  useEffect(() => {
    if (product.color_variants && product.color_variants.length > 0 && !selectedColor) {
      setSelectedColor(product.color_variants[0].color);
    }
  }, [product, selectedColor]);
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.color_variants && product.color_variants.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    addToCart(product, selectedSize, quantity, selectedColor);
    toast.success(`Added ${product.name} to cart!`);
    onClose();
  };
  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.color_variants && product.color_variants.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    addToCart(product, selectedSize, quantity, selectedColor);
    toast.success(`Added ${product.name} to cart!`);
    onClose();
    navigate('/checkout');
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
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
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  // Get the correct image based on selected color or size (for mousepads)
  const getDisplayImages = () => {
    // For mousepads, check size variants first
    if (product.category === 'mousepads' && selectedSize && product.size_variants) {
      const sizeVariant = product.size_variants.find(variant => variant.size === selectedSize);
      if (sizeVariant?.image_url) {
        return [sizeVariant.image_url];
      }
    }
    
    // For other products, check color variants
    if (selectedColor && product.color_variants) {
      const colorVariant = product.color_variants.find(variant => variant.color.toLowerCase() === selectedColor.toLowerCase());
      if (colorVariant?.images && colorVariant.images.length > 0) {
        return colorVariant.images;
      }
    }
    
    return product.images && product.images.length > 0 ? product.images : product.image_url ? [product.image_url] : [];
  };
  const carouselImages = getDisplayImages();
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Product Image Carousel */}
          <div className="flex items-center justify-center p-8">
            <ProductImageCarousel images={carouselImages} productName={product.name} className="aspect-square w-full max-w-md" />
          </div>

          {/* Product Info */}
          <div className="p-12 flex flex-col">
            <h1 className="text-2xl font-normal text-black mb-4 tracking-wide leading-relaxed">
              {product.name.toUpperCase()}
            </h1>
            
            {product.saleInfo && product.originalPrice ? <div className="text-xl font-normal text-black mb-2">
                <span className="line-through text-gray-400 mr-2">Tk {product.originalPrice}.00</span>
                <span>Tk {product.price}.00 BDT</span>
              </div> : <div className="text-xl font-normal text-black mb-2">
                Tk {product.price}.00
              </div>}

            <p className="text-sm text-gray-500 mb-8 underline px-[13px] py-[3px]">
              Shipping calculated at checkout.
            </p>

            {/* Color Selection */}
            {product.color_variants && product.color_variants.length > 0 && <div className="mb-4">
                <h3 className="text-sm font-normal mb-4 text-black">COLOR</h3>
                <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto">
                  {product.color_variants.map(variant => <button key={variant.color} onClick={() => handleColorSelect(variant.color)} className={`flex-shrink-0 px-4 py-2 text-sm font-normal transition-all duration-200 border ${selectedColor === variant.color ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>
                      {variant.color}
                    </button>)}
                </div>
              </div>}

            {/* Size Selection */}
            {availableSizes.length > 0 && <div className="mb-4">
                <h3 className="text-sm font-normal mb-4 text-black">SIZE</h3>
                <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto">
                  {availableSizes.map(size => <button key={size} onClick={() => handleSizeSelect(size)} className={`flex-shrink-0 px-4 py-2 text-sm font-extralight transition-all duration-200 border border-black rounded-full ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`} style={{fontFamily: 'Poppins', fontWeight: 200}}>
                      {size}
                    </button>)}
                </div>
              </div>}

            {/* Size Chart */}
            <div className="mb-8">
              <SizeChart />
            </div>

            {/* Quantity */}
            <div className="mb-12">
              <h3 className="text-sm font-normal mb-4 text-black">Quantity</h3>
              <div className="flex items-center border border-gray-300 bg-transparent rounded-none w-fit py-px px-[12px]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={quantity <= 1}>
                  <Minus size={16} />
                </button>
                <span className="px-3 py-2 min-w-[40px] font-poppins-extralight text-base text-zinc-950 text-center font-normal">
                  {quantity}
                </span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-50">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4 mb-8">
              <button onClick={handleAddToCart} className="w-full bg-white border border-black text-black py-4 px-8 font-normal transition-all duration-200 hover:bg-gray-50 transform hover:scale-[1.01] active:scale-[0.97] active:-translate-y-1">
                Add to cart
              </button>
              <button onClick={handleBuyNow} className="w-full bg-black text-white py-4 px-8 font-normal transition-all duration-200 hover:bg-gray-800 transform hover:scale-[1.01] active:scale-[0.97] active:-translate-y-1">
                Buy it now
              </button>
            </div>

            {/* View Details Link */}
            <button onClick={handleViewDetails} className="text-sm text-gray-500 hover:text-black transition-colors duration-200 text-left group flex items-center">
              View full details 
              <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default ProductModal;