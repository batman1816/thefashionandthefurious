
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../context/ProductsContext';

const CategoryPage = () => {
  const location = useLocation();
  const { products } = useProducts();
  
  // Extract category from pathname
  const category = location.pathname.substring(1); // Remove leading slash
  
  const categoryProducts = products.filter(product => 
    product.category === category
  );

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'drivers':
        return 'DRIVERS COLLECTION';
      case 'f1-classic':
        return 'F1 CLASSIC COLLECTION';
      case 'teams':
        return 'TEAMS COLLECTION';
      default:
        return 'COLLECTION';
    }
  };

  const getCategoryDescription = (cat: string) => {
    switch (cat) {
      case 'drivers':
        return 'Celebrate your favorite F1 drivers with our exclusive collection of premium apparel featuring legendary racers.';
      case 'f1-classic':
        return 'Vintage-inspired designs celebrating the golden era of Formula 1 racing and iconic moments in motorsport history.';
      case 'teams':
        return 'Show your team pride with officially-inspired merchandise from the most iconic constructors in Formula 1.';
      default:
        return 'Discover our premium Formula 1 apparel collection.';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Category Hero */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {getCategoryTitle(category || '')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {getCategoryDescription(category || '')}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {categoryProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categoryProducts.length} Products
                </h2>
              </div>
              <ProductGrid products={categoryProducts} />
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No products found in this category
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

export default CategoryPage;
