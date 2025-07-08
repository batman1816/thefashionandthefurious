
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {/* Bundle Deal Banner */}
        {activeBundleDeal && cartItems.length >= activeBundleDeal.minimum_quantity && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">🎉 Bundle Deal Applied!</p>
            <p>{activeBundleDeal.description}</p>
            <p>You saved TK {bundleDiscount.toFixed(2)}!</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-4 border border-gray-200">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">Size: {item.size}</p>
                    <p className="text-lg font-normal text-gray-900">
                      TK {item.product.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="p-1 border border-gray-300 hover:border-gray-400"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="p-1 border border-gray-300 hover:border-gray-400"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Item Total */}
                    <p className="font-normal text-gray-900">
                      TK {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between font-normal text-lg">
                  <span>Subtotal:</span>
                  <span>TK {subtotal.toFixed(2)}</span>
                </div>
                
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-normal">
                    <span>Bundle Discount:</span>
                    <span>-TK {bundleDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-xl border-t pt-2">
                  <span>Total:</span>
                  <span>TK {total.toFixed(2)}</span>
                </div>
                
                <p className="text-sm text-gray-600">
                  Shipping will be calculated at checkout
                </p>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 font-semibold transition-colors duration-300 block text-center"
              >
                PROCEED TO CHECKOUT
              </Link>

              <Link
                to="/"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 px-6 font-semibold transition-colors duration-300 block text-center mt-4"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
