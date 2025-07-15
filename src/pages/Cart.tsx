
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartSubtotal, 
    getBundleDiscount, 
    activeBundleDeal 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some amazing F1 apparel to get started!</p>
          <Link 
            to="/" 
            className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = getCartSubtotal();
  const bundleDiscount = getBundleDiscount();
  const total = getCartTotal();
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBanner />
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Shopping Cart</h1>
        
        {/* Bundle Deal Status */}
        {activeBundleDeal && (
          <div className={`border px-4 py-3 rounded-lg mb-6 ${
            totalQuantity >= activeBundleDeal.minimum_quantity
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {totalQuantity >= activeBundleDeal.minimum_quantity ? (
              <>
                <p className="font-semibold">🎉 Bundle Deal Applied!</p>
                <p className="text-sm">{activeBundleDeal.description}</p>
                <p className="text-sm">You saved Tk {bundleDiscount.toFixed(2)}!</p>
              </>
            ) : (
              <>
                <p className="font-semibold">📦 Bundle Deal Available!</p>
                <p className="text-sm">{activeBundleDeal.description}</p>
                <p className="text-sm">Add {activeBundleDeal.minimum_quantity - totalQuantity} more item{(activeBundleDeal.minimum_quantity - totalQuantity) > 1 ? 's' : ''} to unlock {activeBundleDeal.discount_percentage}% off!</p>
              </>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {cartItems.map((item, index) => (
                <div key={`${item.product.id}-${item.size}`} className={`flex gap-6 p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">Size: {item.size}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium min-w-[40px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-lg">
                      Tk {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-gray-500 text-sm">
                        Tk {item.product.price} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})</span>
                  <span>Tk {subtotal.toFixed(2)}</span>
                </div>
                
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bundle Discount</span>
                    <span>-Tk {bundleDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg text-gray-900">
                    <span>Total</span>
                    <span>Tk {total.toFixed(2)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Shipping will be calculated at checkout
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 font-medium transition-colors duration-200 block text-center rounded-lg"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 font-medium transition-colors duration-200 block text-center rounded-lg"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
