
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';

const Shipping = () => {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBanner />
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Shipping Information
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dhaka Shipping */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Dhaka
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                Within 4-5 Business Day.
              </p>
              <p className="text-lg text-gray-700">
                70 Taka delivery charge applicable.
              </p>
            </div>

            {/* Outside Dhaka Shipping */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Outside Dhaka
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                Within 6-8 Business Days
              </p>
              <p className="text-lg text-gray-700">
                140 Taka delivery charge applicable.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shipping;
