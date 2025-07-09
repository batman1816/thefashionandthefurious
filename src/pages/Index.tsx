
import Header from '../components/Header';
import Footer from '../components/Footer';
import RotatingBanner from '../components/RotatingBanner';
import NewProductsSection from '../components/NewProductsSection';
import SalesSection from '../components/SalesSection';
import DriversSection from '../components/DriversSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Rotating Banner */}
      <RotatingBanner />

      {/* Sales Section */}
      <SalesSection />

      {/* New Products Section */}
      <NewProductsSection />

      {/* Drivers Section */}
      <DriversSection />

      <Footer />
    </div>
  );
};

export default Index;
