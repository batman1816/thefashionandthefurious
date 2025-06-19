
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import ProductModal from './ProductModal';
import { Product } from '../types/Product';

const NewProductsSection = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products with "New" tag and take only the first 4
  const newProducts = products
    .filter(product => product.tags?.includes('New'))
    .slice(0, 4);

  const handleChooseOptions = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Choose options clicked for:', product.name);
    setSelectedProduct(product);
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
          NEW PRODUCTS
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {newProducts.map((product) => {
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

        {/* View All Button */}
        <div className="text-center">
          <Link 
            to="/new-products" 
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

export default NewProductsSection;
