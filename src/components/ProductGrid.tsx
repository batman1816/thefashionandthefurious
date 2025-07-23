
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
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleChooseOptions = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
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
    
    return colorVariant?.images?.[0] || product.image_url || (product.images && product.images[0]);
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
                    <span style={{ backgroundColor: '#C24242' }} className="text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1 uppercase tracking-wide">
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

              {/* Product Info */}
              <div className="text-left space-y-1">
                <h3 className="text-sm sm:text-base font-normal text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                  {product.name}
                </h3>
                {product.saleInfo && product.originalPrice ? (
                  <div className="text-sm sm:text-base font-normal text-gray-900 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                      <span className="line-through text-gray-400">Tk {product.originalPrice}.00</span>
                      <span>Tk {product.price}.00 BDT</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base font-normal text-gray-900 mb-2">
                    Tk {product.price}
                  </p>
                )}
                
                {/* Choose Options Button */}
                <button 
                  onClick={(e) => handleChooseOptions(product, e)}
                  className="w-full border border-gray-400 text-black py-2 px-2 text-xs sm:text-sm font-normal hover:bg-gray-50 transition-colors duration-200"
                >
                  Choose options
                </button>
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
