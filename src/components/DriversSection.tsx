
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';
import { Product } from '../types/Product';
import { toast } from 'sonner';

const DriversSection = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products with "Drivers" tag and take only the first 4
  const driversProducts = products
    .filter(product => product.tags?.includes('Drivers'))
    .slice(0, 4);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Add to cart clicked for:', product.name);
    // Add with default size (first available size)
    if (product.sizes && product.sizes.length > 0) {
      addToCart(product, product.sizes[0], 1);
      toast.success(`Added ${product.name} to cart!`);
    }
  };

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product.name);
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    console.log('Modal closed');
    setSelectedProduct(null);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          DRIVERS
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {driversProducts.map((product) => {
            const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image_url;
            const hoverImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;
            
            return (
              <div 
                key={product.id} 
                className="group cursor-pointer bg-white"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gray-50 relative mb-4">
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <img
                    src={hoverImage}
                    alt={product.name}
                    className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
                  <div className="text-base font-normal text-black">
                    Tk {product.price}.00 BDT
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
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

        {/* View All Button */}
        <div className="text-center">
          <Link 
            to="/drivers-products" 
            className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-colors duration-300 uppercase tracking-wide"
          >
            VIEW ALL
          </Link>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </section>
  );
};

export default DriversSection;
