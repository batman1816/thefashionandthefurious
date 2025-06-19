
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '../context/BannerContext';

const RotatingBanner = () => {
  const { banners } = useBanners();
  const activeBanners = banners.filter(banner => banner.is_active);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
      }, 5000); // Auto-rotate every 5 seconds

      return () => clearInterval(interval);
    }
  }, [activeBanners.length]);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

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
          className="w-full h-full object-cover"
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Banner Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            {currentBanner.button_text && currentBanner.button_link && (
              <Link
                to={currentBanner.button_link}
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {currentBanner.button_text}
              </Link>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RotatingBanner;
