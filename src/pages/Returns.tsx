
import Header from '../components/Header';
import Footer from '../components/Footer';

const Returns = () => {
  return (
    <div className="min-h-screen bg-white">
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
