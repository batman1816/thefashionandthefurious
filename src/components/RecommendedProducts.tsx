import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import { useProducts } from '../context/ProductsContext';
import ProductModal from './ProductModal';
import { useIsMobile } from '../hooks/use-mobile';

interface RecommendedProductsProps {
  currentProductId: string;
}

const RecommendedProducts = ({ currentProductId }: RecommendedProductsProps) => {
  const { products } = useProducts();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Get 4 random products excluding the current one
  useEffect(() => {
    const otherProducts = products.filter(p => p.id !== currentProductId && p.is_active);
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    setRecommendedProducts(shuffled.slice(0, 4));
  }, [products, currentProductId]);

  const handleProductClick = (product: Product) => {
    if (isMobile) {
      navigate(`/product/${product.slug || product.id}`);
    } else {
      setSelectedProduct(product);
    }
  };

  const getHoverImage = (product: Product) => {
    return product.images && product.images.length > 1 ? product.images[1] : null;
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {recommendedProducts.map((product) => {
          const mainImage = product.image_url || (product.images && product.images[0]);
          const hoverImage = getHoverImage(product);
          const isHovered = hoveredProduct === product.id;

          return (
            <div key={product.id} className="group">
              <div 
                className="aspect-square bg-gray-100 rounded-none mb-3 md:mb-4 overflow-hidden cursor-pointer relative"
                onClick={() => handleProductClick(product)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Main Product Image */}
                <img
                  src={mainImage}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isHovered && hoverImage ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                
                {/* Hover Image */}
                {hoverImage && (
                  <img
                    src={hoverImage}
                    alt={`${product.name} - hover`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-sm md:text-base font-normal text-gray-900 mb-1 md:mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm md:text-base font-normal text-gray-900">
                  Tk {product.price}.00 BDT
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default RecommendedProducts;