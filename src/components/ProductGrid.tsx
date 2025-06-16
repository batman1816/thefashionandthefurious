
import { useState } from 'react';
import { Product } from '../types/Product';
import ProductModal from './ProductModal';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => setSelectedProduct(product)}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="aspect-square overflow-hidden bg-gray-50 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Quick view overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  Quick View
                </span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-normal text-gray-900 mb-2 text-sm group-hover:text-gray-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-900">
                  ৳{product.price}.00 BDT
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {product.category.replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>
        ))}
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
