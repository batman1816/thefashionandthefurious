
import { Suspense, lazy } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';

// Lazy load components that are not immediately visible  
const NewProductsSection = lazy(() => import('../components/NewProductsSection'));
const MousepadSection = lazy(() => import('../components/MousepadSection'));
const DriversSection = lazy(() => import('../components/DriversSection'));
const SalesSection = lazy(() => import('../components/SalesSection'));
// Don't lazy load banner for faster initial display
import RotatingBanner from '../components/RotatingBanner';

// Loading component for lazy-loaded sections
const SectionLoader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBanner />
      <Header />
      
      {/* Rotating Banner - Load immediately as it's above the fold */}
      <RotatingBanner />

      {/* New Products Section - Can be lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <NewProductsSection />
      </Suspense>

      {/* Mousepad Section - Can be lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <MousepadSection />
      </Suspense>

      {/* Drivers Section - Can be lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <DriversSection />
      </Suspense>

      {/* Sales Section - Can be lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <SalesSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Index;
