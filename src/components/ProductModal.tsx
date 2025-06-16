
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus } from 'lucide-react';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success(`Added ${product.name} to cart!`);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative rounded-none shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="p-8 flex flex-col">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              {product.name}
            </h1>
            
            <div className="text-2xl font-medium text-gray-900 mb-6">
              ৳{product.price}.00 BDT
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Shipping calculated at checkout.
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 uppercase tracking-wide">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3 uppercase tracking-wide">Quantity</h3>
              <div className="flex items-center border border-gray-300 w-fit bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-3 text-center min-w-[80px] font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white border border-black text-black py-3 px-8 font-medium hover:bg-gray-50 transition-colors duration-200 uppercase tracking-wide"
              >
                Add to cart
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 px-8 font-medium hover:bg-gray-800 transition-colors duration-200 uppercase tracking-wide"
              >
                Buy it now
              </button>
            </div>

            {/* View Details Link */}
            <Link 
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-black transition-colors underline"
            >
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
