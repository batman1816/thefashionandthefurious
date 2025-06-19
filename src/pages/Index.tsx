
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import RotatingBanner from '../components/RotatingBanner';
import { useProducts } from '../context/ProductsContext';

const Index = () => {
  const { products } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 8));

  useEffect(() => {
    setFeaturedProducts(products.slice(0, 8));
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Rotating Banner */}
      <RotatingBanner />

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            FEATURED PRODUCTS
          </h2>
          <ProductGrid products={featuredProducts} />
          
          <div className="text-center mt-12">
            <Link 
              to="/drivers" 
              className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-colors duration-300 uppercase tracking-wide"
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
