
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';

const Returns = () => {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBanner />
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-8">
            NO RETURNS
          </h1>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Returns;
