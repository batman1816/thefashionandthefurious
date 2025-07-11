
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import ProductModal from './ProductModal';
import { useIsMobile } from '../hooks/use-mobile';

interface ProductGridProps {
  products: Product[];
  showSaleTag?: boolean;
}

const ProductGrid = ({ products, showSaleTag = false }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleProductClick = (product: Product) => {
    if (isMobile) {
      navigate(`/product/${product.slug || product.id}`);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleColorSelect = (productId: string, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  const getProductImage = (product: Product) => {
    const selectedColor = selectedColors[product.id];
    
    if (!selectedColor || !product.color_variants) {
      return product.image_url || (product.images && product.images[0]);
    }

    const colorVariant = product.color_variants.find(variant => 
      variant.color.toLowerCase() === selectedColor.toLowerCase()
    );
    
    return colorVariant?.image_url || product.image_url || (product.images && product.images[0]);
  };

  const getHoverImage = (product: Product) => {
    return product.images && product.images.length > 1 ? product.images[1] : null;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => {
          const mainImage = getProductImage(product);
          const hoverImage = getHoverImage(product);
          const isHovered = hoveredProduct === product.id;

          return (
            <div key={product.id} className="group relative">
              <div 
                className="aspect-square bg-gray-100 rounded-none mb-3 sm:mb-4 overflow-hidden cursor-pointer relative"
                onClick={() => handleProductClick(product)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Sale Tag */}
                {showSaleTag && product.saleInfo && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wide">
                      SALE
                    </span>
                  </div>
                )}

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

              {/* Color Selection */}
              {product.color_variants && product.color_variants.length > 0 && (
                <div className="mb-2 flex gap-2 justify-center">
                  {product.color_variants.map((variant) => (
                    <button
                      key={variant.color}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorSelect(product.id, variant.color);
                      }}
                      className={`px-3 py-1 text-xs font-medium border transition-all duration-200 ${
                        selectedColors[product.id] === variant.color
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-black'
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              )}

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-sm sm:text-base font-normal text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm sm:text-base font-normal text-gray-900">
                  TK {product.price}
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

export default ProductGrid;
