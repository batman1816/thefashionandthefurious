
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '../context/BannerContext';

const RotatingBanner = () => {
  const { banners, loading } = useBanners();
  const activeBanners = banners.filter(banner => banner.is_active);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activeBanners.length]);

  // Reset index if it's out of bounds
  useEffect(() => {
    if (currentBannerIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentBannerIndex(0);
    }
  }, [activeBanners.length, currentBannerIndex]);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  if (loading) {
    return (
      <section className="relative bg-gradient-to-r from-red-600 via-black to-red-600 text-white py-32 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">Loading...</div>
        </div>
      </section>
    );
  }

  if (activeBanners.length === 0) {
    return (
      <section className="relative bg-gradient-to-r from-red-600 via-black to-red-600 text-white py-32 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            PREMIUM F1 INSPIRED<br />APPAREL
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Experience the thrill of Formula 1 fashion
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
    );
  }

  const currentBanner = activeBanners[currentBannerIndex];

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        <img
          src={currentBanner.image_url}
          alt="Banner"
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            console.error('Failed to load banner image:', currentBanner.image_url);
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Banner Button - Bottom Center */}
        {currentBanner.button_text && currentBanner.button_link && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <Link
              to={currentBanner.button_link}
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 font-semibold text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-300"
            >
              {currentBanner.button_text}
            </Link>
          </div>
        )}

        {/* Navigation arrows - only show if more than one banner */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Previous banner"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Next banner"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots indicator - only show if more than one banner */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RotatingBanner;
