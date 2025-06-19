
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Link to="/" className="text-red-600 hover:underline">Return to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="mx-auto mb-6 text-green-600" size={64} />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="space-y-2 mb-4">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Total:</strong> TK{order.total.toFixed(2)}</p>
              <p><strong>Date:</strong> {order.date.toLocaleDateString()}</p>
            </div>

            <h3 className="font-semibold mb-2">Items Ordered:</h3>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.product.name} (Size: {item.size}) × {item.quantity}</span>
                  <span>TK{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold transition-colors duration-300"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
