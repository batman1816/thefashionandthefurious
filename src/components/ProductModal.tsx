import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart } from 'lucide-react';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import ProductImageCarousel from './ProductImageCarousel';
import SizeChart from './SizeChart';
import { scrollToTop } from '../utils/scrollToTop';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    addToCart({
      product,
      size: selectedSize,
      quantity
    });
    
    toast.success(`Added ${product.name} to cart!`);
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    addToCart({
      product,
      size: selectedSize,
      quantity
    });
    
    navigate('/checkout');
    scrollToTop();
    onClose();
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.slug}`);
    scrollToTop();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ProductImageCarousel images={product.images || [product.image_url || '']} />
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">
                TK {product.price.toFixed(2)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Size:
                </label>
                <div className="mt-1">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Choose a size</option>
                    {product.sizes && product.sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-blue-500 hover:underline mt-2 block text-sm"
                >
                  View Size Chart
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min="1"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>BUY NOW</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border border-black text-black py-3 px-6 hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>ADD TO CART</span>
                </button>
              </div>

              <button
                onClick={handleViewDetails}
                className="w-full text-gray-600 hover:text-black transition-colors py-2"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSizeChart && (
        <SizeChart onClose={() => setShowSizeChart(false)} />
      )}
    </div>
  );
};

export default ProductModal;
