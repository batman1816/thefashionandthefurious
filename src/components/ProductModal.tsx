
import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useSalesContext } from '../context/SalesContext';
import { Badge } from './ui/badge';
import SaleBadge from './SaleBadge';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { getSaleForProduct, isProductOnSale } = useSalesContext();

  if (!isOpen || !product) return null;

  const sale = getSaleForProduct(product.id);
  const onSale = isProductOnSale(product.id);
  const currentPrice = onSale && sale ? sale.sale_price : product.price;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [product.image_url] 
    : ['/placeholder.svg'];

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart({
      product: {
        ...product,
        price: currentPrice // Use the current price (sale price if on sale)
      },
      size: selectedSize || '',
      quantity
    });

    toast.success(`Added ${quantity} ${product.name} to cart`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Sale Badge */}
        {onSale && <SaleBadge />}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-white' : 'border-gray-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                
                <div className="flex items-center gap-4 mb-4">
                  {onSale && sale ? (
                    <>
                      <span className="text-gray-400 line-through text-xl">
                        TK {sale.original_price}
                      </span>
                      <span className="text-red-400 font-bold text-2xl">
                        TK {sale.sale_price}
                      </span>
                      <Badge variant="destructive">
                        -{sale.percentage_off}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-white font-bold text-2xl">
                      TK {product.price}
                    </span>
                  )}
                </div>

                {product.category && (
                  <Badge variant="secondary" className="mb-4">
                    {product.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300">{product.description}</p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          selectedSize === size
                            ? 'bg-white text-black border-white'
                            : 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-white text-xl font-semibold w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-black font-semibold py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
              >
                Add to Cart - TK {(currentPrice * quantity).toFixed(2)}
              </button>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-gray-300 border-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
