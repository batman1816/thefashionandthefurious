import { useBanners } from '../context/BannerContext';
import { Link } from 'react-router-dom';

interface CategoryBannerProps {
  category: string;
}

const CategoryBanner = ({ category }: CategoryBannerProps) => {
  const { banners, loading } = useBanners();
  
  // Get category-specific banners or fallback to default category hero
  const categoryBanners = banners.filter(banner => 
    banner.is_active && banner.category === category
  );

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
      case 'shop-all':
        return 'SHOP ALL';
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
        return 'Premium gaming mousepads featuring Formula 1 designs and high-quality materials for optimal performance.';
      case 'shop-all':
        return 'Discover our complete Formula 1 apparel collection.';
      default:
        return 'Discover our premium Formula 1 apparel collection.';
    }
  };

  if (loading) {
    return (
      <section className="bg-black text-white py-16 h-[40vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">Loading...</div>
        </div>
      </section>
    );
  }

  // If no custom banner exists, show default category hero
  if (categoryBanners.length === 0) {
    return (
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {getCategoryTitle(category)}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {getCategoryDescription(category)}
          </p>
        </div>
      </section>
    );
  }

  // Show custom category banner
  const banner = categoryBanners[0]; // Use first active banner for now

  return (
    <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[300px] overflow-hidden">
      <div className="relative w-full h-full">
        {banner.media_type === 'video' && banner.video_url ? (
          <div className="relative w-full h-full">
            <video
              src={banner.video_url}
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              preload="metadata"
              className="w-full h-full object-cover"
              onLoadedData={(e) => {
                const video = e.currentTarget;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                  playPromise.catch(error => {
                    console.log('Autoplay prevented:', error);
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
            />
          </div>
        ) : banner.image_url ? (
          <img
            src={banner.image_url}
            alt="Category Banner"
            className="w-full h-full object-cover"
          />
        ) : null}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            {banner.title && (
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                {banner.title}
              </h1>
            )}
            {banner.description && (
              <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
                {banner.description}
              </p>
            )}
            {banner.button_text && banner.button_link && (
              <Link
                to={banner.button_link}
                className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 font-semibold text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-300"
              >
                {banner.button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;