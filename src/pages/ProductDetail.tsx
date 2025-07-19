import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormattedText from '../components/FormattedText';
import ProductImageCarousel from '../components/ProductImageCarousel';
import RecommendedProducts from '../components/RecommendedProducts';
import SizeChart from '../components/SizeChart';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
const ProductDetail = () => {
  const {
    slug
  } = useParams();
  const navigate = useNavigate();
  const {
    products
  } = useProducts();
  const {
    addToCart
  } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
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
  useEffect(() => {
    if (product?.color_variants && product.color_variants.length > 0 && !selectedColor) {
      setSelectedColor(product.color_variants[0].color);
    }
  }, [product, selectedColor]);
  if (!product) {
    return <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
        <Footer />
      </div>;
  }
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
    navigate('/checkout');
  };
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  // Get the correct image based on selected color
  const getDisplayImages = () => {
    if (selectedColor && product.color_variants) {
      const colorVariant = product.color_variants.find(variant => variant.color.toLowerCase() === selectedColor.toLowerCase());
      if (colorVariant?.image_url) {
        return [colorVariant.image_url];
      }
    }
    return product.images && product.images.length > 0 ? product.images : product.image_url ? [product.image_url] : [];
  };
  const carouselImages = getDisplayImages();
  return <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Carousel */}
          <ProductImageCarousel images={carouselImages} productName={product.name} className="aspect-square" />

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="font-bold mb-4 text-2xl text-zinc-950">
              {product.name}
            </h1>
            
            {product.saleInfo && product.originalPrice ? <div className="text-2xl font-normal text-gray-900 mb-6">
                <span className="line-through mr-2 text-base text-zinc-600">Tk {product.originalPrice}.00</span>
                <span className="text-lg text-zinc-950">Tk {product.price}.00 BDT</span>
              </div> : <div className="text-xl font-normal text-gray-900 mb-6">
                Tk {product.price}.00
              </div>}

            <div className="prose text-gray-600 mb-8">
              <FormattedText text={product.description} />
            </div>

            {/* Color Selection */}
            {product.color_variants && product.color_variants.length > 0 && <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.color_variants.map(variant => <button key={variant.color} onClick={() => handleColorSelect(variant.color)} className={`px-4 py-2 border-2 font-medium transition-colors ${selectedColor === variant.color ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-gray-400'}`}>
                      {variant.color}
                    </button>)}
                </div>
              </div>}

            {/* Size Selection */}
            {availableSizes.length > 0 && <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => <button key={size} onClick={() => handleSizeSelect(size)} className={`px-4 py-2 border-2 font-medium transition-colors ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-gray-400'}`}>
                      {size}
                    </button>)}
                </div>
              </div>}

            {/* Size Chart */}
            <div className="mb-6">
              <SizeChart />
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 bg-transparent rounded-none">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[60px] font-poppins-extralight text-base text-zinc-950 text-center font-normal">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="p-2 hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4 mb-4">
              <button onClick={handleAddToCart} className="w-full bg-white border border-black text-black py-4 px-8 font-semibold transition-all duration-200 hover:bg-gray-50 transform hover:scale-[1.01] active:scale-[0.97] active:-translate-y-1">
                Add to cart
              </button>
              <button onClick={handleBuyNow} className="w-full bg-black hover:bg-gray-800 text-white py-4 px-8 font-semibold transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.97] active:-translate-y-1">
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

        {/* You may also like section */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">You may also like</h2>
          <RecommendedProducts currentProductId={product.id} />
        </div>
      </div>

      <Footer />
    </div>;
};
export default ProductDetail;