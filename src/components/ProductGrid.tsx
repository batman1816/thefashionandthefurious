
import React from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from './ui/aspect-ratio';
import { Badge } from './ui/badge';
import { Product } from '../types/Product';
import { useSalesContext } from '../context/SalesContext';
import SaleBadge from './SaleBadge';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  const { getSaleForProduct, isProductOnSale } = useSalesContext();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {title && (
        <h2 className="text-3xl font-bold text-white text-center">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const sale = getSaleForProduct(product.id);
          const onSale = isProductOnSale(product.id);
          
          return (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105 relative"
            >
              {/* Sale Badge */}
              {onSale && <SaleBadge />}

              <AspectRatio ratio={1} className="bg-gray-700">
                <img
                  src={product.images?.[0] || product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </AspectRatio>
              
              <div className="p-4 space-y-2">
                <h3 className="text-white font-semibold group-hover:text-gray-300 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                {product.category && (
                  <Badge variant="secondary" className="text-xs">
                    {product.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                )}
                
                <div className="flex items-center gap-2">
                  {onSale && sale ? (
                    <>
                      <span className="text-gray-400 line-through text-sm">
                        TK {sale.original_price}
                      </span>
                      <span className="text-red-400 font-bold text-lg">
                        TK {sale.sale_price}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{sale.percentage_off}%
                      </Badge>
                    </>
                  ) : (
                    <span className="text-white font-bold text-lg">
                      TK {product.price}
                    </span>
                  )}
                </div>
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.slice(0, 4).map((size) => (
                      <span key={size} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-xs text-gray-400">+{product.sizes.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
