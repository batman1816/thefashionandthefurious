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
    activeBundleDeal,
    getCurrentPrice
  } = useCart();

  if (cartItems.length === 0) {
    return <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 font-poppins-extralight font-extralight">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 font-poppins-extralight font-extralight">Add some amazing F1 apparel to get started!</p>
          <Link to="/" className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-colors font-poppins-light font-light">
            CONTINUE SHOPPING
          </Link>
        </div>
        <Footer />
      </div>;
  }

  const subtotal = getCartSubtotal();
  const bundleDiscount = getBundleDiscount();
  const total = getCartTotal();
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-3 py-6 max-w-7xl">
        {/* Desktop and Mobile Layout */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-16">
          {/* Left Side - Cart Items */}
          <div className="flex-1 lg:max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-poppins-extralight text-zinc-950 font-normal lg:text-4xl">Your cart</h1>
              <Link to="/" className="text-gray-600 hover:text-gray-900 underline font-poppins-extralight font-extralight text-sm lg:text-base">
                Continue shopping
              </Link>
            </div>

            {/* Header Row for Desktop */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-4 border-b border-gray-200 mb-6">
              <div className="col-span-6">
                <span className="uppercase font-poppins-extralight tracking-wider text-zinc-950 font-medium text-sm">PRODUCT</span>
              </div>
              <div className="col-span-3 text-center">
                <span className="uppercase font-poppins-extralight tracking-wider text-sm font-medium text-zinc-950">QUANTITY</span>
              </div>
              <div className="col-span-3 text-right">
                <span className="uppercase font-poppins-extralight tracking-wider text-sm font-medium text-zinc-950">TOTAL</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-6 lg:space-y-8">
              {cartItems.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${item.color || 'default'}`} className="flex lg:grid lg:grid-cols-12 gap-4 pb-6 lg:pb-8 border-b border-gray-100">
                  {/* Mobile Layout */}
                  <div className="flex gap-3 w-full lg:hidden">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-white overflow-hidden flex-shrink-0">
                      <img src={(() => {
                        // For mousepads, show size-specific image first
                        if (item.product.category === 'mousepads' && item.product.size_variants && item.size) {
                          const sizeVariant = item.product.size_variants.find(variant => variant.size === item.size);
                          if (sizeVariant?.image_url) {
                            return sizeVariant.image_url;
                          }
                        }
                        
                        // Get correct image based on color variant
                        if (item.color && item.product.color_variants) {
                          const colorVariant = item.product.color_variants.find(variant => variant.color.toLowerCase() === item.color?.toLowerCase());
                          if (colorVariant?.images && colorVariant.images.length > 0) {
                            return colorVariant.images[0];
                          }
                        }
                        return item.product.main_image || item.product.image_url || (item.product.images && item.product.images[0]);
                      })()} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-poppins-light text-base font-normal text-zinc-950 mb-1">
                        {item.product.name}
                      </h3>
                      
                      {/* Price */}
                      {(() => {
                        const currentPrice = getCurrentPrice(item.product.id);
                        let price = currentPrice.price;
                        
                        // For mousepads, use size-specific pricing
                        if (item.product.category === 'mousepads' && item.product.size_pricing && item.size) {
                          price = item.product.size_pricing[item.size] || currentPrice.price;
                        }
                        
                        return currentPrice.saleInfo && currentPrice.originalPrice ? (
                          <div className="mb-1">
                            <p className="line-through font-poppins-extralight font-normal text-zinc-700 text-sm">
                              Tk {currentPrice.originalPrice.toFixed(2)}
                            </p>
                            <p className="font-poppins-extralight text-zinc-950 font-normal text-base">
                              Tk {price.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-poppins-extralight mb-1 text-zinc-950 font-normal text-base">
                            Tk {price.toFixed(2)}
                          </p>
                        );
                      })()}
                      
                      {/* Color and Size */}
                      {item.color && (
                        <p className="font-poppins-extralight text-sm font-normal text-zinc-950 mb-1">
                          COLOR: {item.color}
                        </p>
                      )}
                      <p className="font-poppins-extralight text-sm font-normal text-zinc-950 mb-3">
                        SIZE: {item.size}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 bg-transparent rounded-none">
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1, item.color)} className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={item.quantity <= 1}>
                            <Minus size={16} />
                          </button>
                          <span className="px-2.5 py-2 min-w-[40px] font-poppins-extralight text-sm text-zinc-950 text-center font-normal">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1, item.color)} className="p-2 hover:bg-gray-50">
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.product.id, item.size, item.color)} className="text-gray-400 hover:text-red-500 p-1.5 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Total Price - Right aligned */}
                    <div className="flex items-start pt-1">
                      <p className="font-poppins-light text-lg text-gray-900 font-normal">
                        Tk {(() => {
                          const currentPrice = getCurrentPrice(item.product.id);
                          let price = currentPrice.price;
                          
                          // For mousepads, use size-specific pricing
                          if (item.product.category === 'mousepads' && item.product.size_pricing && item.size) {
                            price = item.product.size_pricing[item.size] || currentPrice.price;
                          }
                          
                          return (price * item.quantity).toFixed(2);
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:contents">
                    {/* Product Info */}
                    <div className="lg:col-span-6 flex gap-4">
                      <div className="w-32 h-32 bg-white overflow-hidden flex-shrink-0">
                        <img src={(() => {
                          // For mousepads, show size-specific image first
                          if (item.product.category === 'mousepads' && item.product.size_variants && item.size) {
                            const sizeVariant = item.product.size_variants.find(variant => variant.size === item.size);
                            if (sizeVariant?.image_url) {
                              return sizeVariant.image_url;
                            }
                          }
                          
                          // Get correct image based on color variant
                          if (item.color && item.product.color_variants) {
                            const colorVariant = item.product.color_variants.find(variant => variant.color.toLowerCase() === item.color?.toLowerCase());
                            if (colorVariant?.images && colorVariant.images.length > 0) {
                              return colorVariant.images[0];
                            }
                          }
                          return item.product.main_image || item.product.image_url || (item.product.images && item.product.images[0]);
                        })()} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-poppins-light text-lg mb-2 font-normal text-zinc-950 text-left">
                          {item.product.name}
                        </h3>
                        {(() => {
                          const currentPrice = getCurrentPrice(item.product.id);
                          let price = currentPrice.price;
                          
                          // For mousepads, use size-specific pricing
                          if (item.product.category === 'mousepads' && item.product.size_pricing && item.size) {
                            price = item.product.size_pricing[item.size] || currentPrice.price;
                          }
                          
                          return currentPrice.saleInfo && currentPrice.originalPrice ? (
                            <div className="mb-2">
                              <p className="line-through font-poppins-extralight font-normal text-zinc-700 text-sm">
                                Tk {currentPrice.originalPrice.toFixed(2)}
                              </p>
                              <p className="font-poppins-extralight text-zinc-950 font-normal text-base text-left">
                                Tk {price.toFixed(2)}
                              </p>
                            </div>
                          ) : (
                            <p className="font-poppins-extralight mb-2 text-zinc-950 font-normal text-base text-left">
                              Tk {price.toFixed(2)}
                            </p>
                          );
                        })()}
                        {item.color && (
                          <p className="font-poppins-extralight text-sm font-normal text-zinc-950 text-left mb-1">
                            COLOR: {item.color}
                          </p>
                        )}
                        <p className="font-poppins-extralight text-sm font-normal text-zinc-950 text-left">
                          SIZE: {item.size}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="lg:col-span-3 flex lg:justify-center items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 bg-transparent rounded-none w-fit">
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1, item.color)} className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={item.quantity <= 1}>
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-2 min-w-[40px] font-poppins-extralight text-base text-zinc-950 text-center font-normal">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1, item.color)} className="p-2 hover:bg-gray-50">
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.product.id, item.size, item.color)} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="lg:col-span-3 flex lg:justify-end items-center">
                      <div className="text-right">
                        <p className="font-poppins-light text-lg text-gray-900 font-normal">
                          Tk {(() => {
                            const currentPrice = getCurrentPrice(item.product.id);
                            let price = currentPrice.price;
                            
                            // For mousepads, use size-specific pricing
                            if (item.product.category === 'mousepads' && item.product.size_pricing && item.size) {
                              price = item.product.size_pricing[item.size] || currentPrice.price;
                            }
                            
                            return (price * item.quantity).toFixed(2);
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Order Summary for Desktop, Bottom for Mobile */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="bg-white lg:sticky lg:top-8">
              {/* Total Section */}
              <div className="border-t border-gray-200 pt-6 lg:pt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg lg:text-xl font-poppins-extralight font-normal text-zinc-950">Total</span>
                  <span className="text-xl font-poppins-light lg:text-xl text-zinc-950 font-light">
                    Tk {total.toFixed(2)} BDT
                  </span>
                </div>
                
                <p className="font-poppins-extralight mb-8 text-base text-zinc-950 font-light">Shipping calculated at checkout.</p>

                <Link to="/checkout" className="w-full bg-black hover:bg-gray-800 text-white py-4 px-6 font-poppins-light font-light text-center transition-colors duration-200 block text-lg">
                  Check out
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
