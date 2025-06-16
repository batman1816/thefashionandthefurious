
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link 
          key={product.id} 
          to={`/product/${product.id}`}
          className="group bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500 uppercase">
                {product.category}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
