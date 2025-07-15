
import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';
import ProductModal from '../components/ProductModal';
import { Product } from '../types/Product';

const PRODUCTS_PER_PAGE = 10;

const NewProducts = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products with "New" tag AND active status
  const newProducts = products.filter(product => 
    product.tags?.includes('New') && product.is_active === true
  );
  
  const totalPages = Math.ceil(newProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = newProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes && product.sizes.length > 0) {
      addToCart(product, product.sizes[0], 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBanner />
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          All New Products
        </h1>

        {paginatedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No new products available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {paginatedProducts.map((product) => {
                const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image_url;
                const hoverImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;
                
                return (
                  <div 
                    key={product.id} 
                    className="group cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
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
                    
                    <div className="text-left">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-light">
                        T-SHIRT / {product.category.replace('-', ' ').toUpperCase()}
                      </div>
                      <h3 className="text-base font-medium text-black mb-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="text-base font-normal text-black mb-3">
                        Tk {product.price}
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full bg-black text-white py-2 px-4 text-sm font-normal hover:bg-gray-800 transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border ${
                      currentPage === page
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default NewProducts;
