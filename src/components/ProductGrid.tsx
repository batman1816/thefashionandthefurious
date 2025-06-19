
import { useState } from 'react';
import { Product } from '../types/Product';
import ProductModal from './ProductModal';
import FormattedText from './FormattedText';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter to only show active products
  const activeProducts = products.filter(product => product.is_active === true);

  const handleChooseOptions = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeProducts.map((product) => {
          const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image_url;
          const hoverImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;
          
          return (
            <div 
              key={product.id} 
              className="group cursor-pointer bg-white"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-50 relative mb-4">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                />
                <img
                  src={hoverImage}
                  alt={product.name}
                  className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                />
              </div>
              
              {/* Product Info */}
              <div className="text-left space-y-1">
                <div className="text-sm text-gray-500 uppercase tracking-wide font-normal">
                  T-SHIRT / {product.category.replace('-', ' ').toUpperCase()}
                </div>
                <h3 className="text-base font-normal text-black leading-tight text-center">
                  {product.name}
                </h3>
                {product.description && (
                  <FormattedText 
                    text={product.description} 
                    className="text-sm text-gray-600 mt-2"
                  />
                )}
                <div className="text-base font-normal text-black">
                  Tk {product.price}.00 BDT
                </div>
                <div className="pt-2">
                  <button 
                    onClick={(e) => handleChooseOptions(product, e)}
                    className="w-full border border-gray-400 text-black py-2 px-4 text-sm font-normal hover:bg-gray-50 transition-colors duration-200"
                  >
                    Choose options
                  </button>
                </div>
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
