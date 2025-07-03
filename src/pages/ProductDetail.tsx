
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormattedText from '../components/FormattedText';
import ProductImageCarousel from '../components/ProductImageCarousel';
import SizeChart from '../components/SizeChart';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.slug === slug);

  // Filter out XS from sizes
  const availableSizes = product ? product.sizes.filter(size => size.toUpperCase() !== 'XS') : [];

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success(`Added ${product.name} to cart!`);
    navigate('/checkout');
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Carousel */}
          <ProductImageCarousel 
            images={carouselImages}
            productName={product.name}
            className="aspect-square"
          />

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="text-2xl font-normal text-gray-900 mb-6">
              TK {product.price}
            </div>

            <div className="prose text-gray-600 mb-8">
              <FormattedText text={product.description} />
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 border-2 font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Chart */}
            <div className="mb-6">
              <SizeChart />
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 hover:border-gray-400"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 hover:border-gray-400"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4 mb-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white border border-black text-black py-4 px-8 font-semibold transition-colors duration-300 hover:bg-gray-50"
              >
                Add to cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 px-8 font-semibold transition-colors duration-300"
              >
                BUY NOW
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 mt-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span className="uppercase">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
