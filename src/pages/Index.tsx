
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-black to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            THE FASHION &<br />FURIOUS
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Premium Formula 1 Inspired Apparel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/drivers" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-none font-semibold transition-all duration-300 transform hover:scale-105"
            >
              SHOP DRIVERS
            </Link>
            <Link 
              to="/teams" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-none font-semibold transition-all duration-300"
            >
              SHOP TEAMS
            </Link>
          </div>
        </div>
      </section>

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
