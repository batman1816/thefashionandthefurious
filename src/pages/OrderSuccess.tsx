import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  if (!order) {
    return <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Link to="/" className="text-red-600 hover:underline">Return to home</Link>
        </div>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="mx-auto mb-6 text-green-600" size={64} />
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-white mb-8 text-xl text-center">Thank you for your order.</p>

          <div className="rounded-lg p-6 mb-8 text-left bg-zinc-950">
            <h2 className="text-xl font-semibold mb-4 text-white text-center">Order Details</h2>
            
            <div className="space-y-2 mb-4">
              <p className="text-white"><strong>Order ID:</strong> #{order.id}</p>
              <p className="text-white"><strong>Total:</strong> Tk {order.total.toFixed(2)}</p>
              <p className="text-white"><strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
            </div>

            <h3 className="font-semibold mb-2 text-white text-center">Items Ordered:</h3>
            <div className="space-y-2">
              {(() => {
              try {
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                return Array.isArray(items) ? items.map((item: any, index: number) => <div key={index} className="flex justify-between">
                      <span className="text-white text-left">{item.product.name} (Size: {item.size}) × {item.quantity}</span>
                      <span className="text-white">Tk {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>) : <p className="text-white">No items found</p>;
              } catch (error) {
                return <p className="text-white">Error loading items</p>;
              }
            })()}
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/" className="inline-block bg-white hover:bg-gray-100 text-black px-8 py-3 font-semibold transition-colors duration-300">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default OrderSuccess;