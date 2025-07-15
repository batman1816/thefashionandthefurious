
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../context/ProductsContext';

const ShopAll = () => {
  const { products } = useProducts();
  
  // Filter to only show active products (all t-shirts regardless of category/tags)
  const allProducts = products.filter(product => product.is_active !== false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Category Hero */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
            SHOP ALL
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our complete collection of premium Formula 1 apparel and merchandise.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          {allProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {allProducts.length} Products
                </h2>
              </div>
              <ProductGrid products={allProducts} />
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No products found
              </h2>
              <p className="text-gray-600">
                Check back soon for new arrivals!
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopAll;
