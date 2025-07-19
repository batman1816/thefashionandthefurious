
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '../context/BannerContext';

const RotatingBanner = () => {
  const { banners, loading } = useBanners();
  const activeBanners = banners.filter(banner => 
    banner.is_active && (banner.category === 'home' || !banner.category)
  );
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate banners every 8 seconds (increased for videos)
  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [activeBanners.length]);

  // Reset index if it's out of bounds
  useEffect(() => {
    if (currentBannerIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentBannerIndex(0);
    }
  }, [activeBanners.length, currentBannerIndex]);

  // Handle transition effect
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentBannerIndex]);

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

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[80vh] min-h-[400px] overflow-hidden">
      <div className="relative w-full h-full">
        {/* Render all banners with stacking and opacity transitions */}
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentBannerIndex 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0'
            }`}
          >
            {banner.media_type === 'video' && banner.video_url ? (
              <div className="relative w-full h-full">
                <video
                  src={banner.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center center',
                    willChange: 'transform'
                  }}
                  onCanPlay={(e) => {
                    // Video is ready to play
                    const video = e.currentTarget;
                    video.style.opacity = '1';
                  }}
                  onLoadedData={(e) => {
                    // Force play for mobile devices and optimize buffering
                    const video = e.currentTarget;
                    video.style.opacity = '0';
                    
                    // Pre-buffer more content
                    if (video.buffered.length > 0) {
                      const bufferedEnd = video.buffered.end(0);
                      const duration = video.duration;
                      if (bufferedEnd / duration > 0.3) { // 30% buffered
                        video.style.opacity = '1';
                      }
                    }
                    
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(error => {
                        console.log('Autoplay prevented:', error);
                        // Fallback: try to play on user interaction
                        const playOnInteraction = () => {
                          video.play();
                          document.removeEventListener('touchstart', playOnInteraction);
                          document.removeEventListener('click', playOnInteraction);
                        };
                        document.addEventListener('touchstart', playOnInteraction);
                        document.addEventListener('click', playOnInteraction);
                      });
                    }
                  }}
                  onError={(e) => {
                    console.error('Failed to load banner video:', banner.video_url);
                  }}
                />
                {/* Mobile optimization: ensure video content isn't cut off */}
                <style>{`
                  @media (max-width: 768px) {
                    video {
                      object-fit: cover;
                      object-position: center 35%;
                    }
                  }
                  @media (max-width: 480px) {
                    video {
                      object-fit: cover;
                      object-position: center 40%;
                    }
                  }
                `}</style>
              </div>
            ) : banner.image_url ? (
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load banner image:', banner.image_url);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            
            {/* Banner Button - Bottom Center */}
            {banner.button_text && banner.button_link && (
              <div className={`absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-700 px-4 ${
                index === currentBannerIndex 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}>
                <Link
                  to={banner.button_link}
                  className="inline-block bg-transparent border-2 border-white text-white px-4 sm:px-8 py-2 sm:py-3 font-semibold text-sm sm:text-lg tracking-wide text-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  {banner.button_text}
                </Link>
              </div>
            )}
          </div>
        ))}

        {/* Navigation arrows - only show if more than one banner */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-30"
              aria-label="Previous banner"
            >
              <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-30"
              aria-label="Next banner"
            >
              <ChevronRight size={24} className="sm:w-8 sm:h-8" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default RotatingBanner;
