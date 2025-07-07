
import Header from '../components/Header';
import Footer from '../components/Footer';
import RotatingBanner from '../components/RotatingBanner';
import NewProductsSection from '../components/NewProductsSection';
import DriversSection from '../components/DriversSection';
import SaleModal from '../components/SaleModal';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Sale Modal - shows when there's an active sale */}
      <SaleModal />
      
      {/* Rotating Banner */}
      <RotatingBanner />

      {/* New Products Section */}
      <NewProductsSection />

      {/* Drivers Section */}
      <DriversSection />

      <Footer />
    </div>
  );
};

export default Index;
