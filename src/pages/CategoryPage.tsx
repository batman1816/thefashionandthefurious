import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../context/ProductsContext';
import CategoryBanner from '../components/CategoryBanner';
import AnnouncementBanner from '../components/AnnouncementBanner';
const CategoryPage = () => {
  const location = useLocation();
  const {
    products
  } = useProducts();

  // Extract category from pathname
  const category = location.pathname.substring(1); // Remove leading slash

  // Filter products by category and only include active products
  const categoryProducts = products.filter(product => product.category === category && product.is_active !== false);
  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'drivers':
        return 'DRIVERS COLLECTION';
      case 'f1-classic':
        return 'F1 CLASSIC COLLECTION';
      case 'teams':
        return 'TEAMS COLLECTION';
      case 'mousepads':
        return 'MOUSEPADS COLLECTION';
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
      case 'mousepads':
        return 'Premium gaming mousepads featuring Formula 1 designs. Available in multiple sizes for the perfect desk setup.';
      default:
        return 'Discover our premium Formula 1 collection.';
    }
  };
  return <div className="min-h-screen bg-white">
      <AnnouncementBanner />
      <Header />
      
      {/* Category Banner */}
      <CategoryBanner category={category || ''} />

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {categoryProducts.length > 0 ? <>
              <div className="flex justify-between items-center mb-8">
                
              </div>
              <ProductGrid products={categoryProducts} showSaleTag={true} />
            </> : <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No products found in this category
              </h2>
              <p className="text-gray-600">
                Check back soon for new arrivals!
              </p>
            </div>}
        </div>
      </section>

      <Footer />
    </div>;
};
export default CategoryPage;