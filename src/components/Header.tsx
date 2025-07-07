
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSalesContext } from '../context/SalesContext';
import CountdownTimer from './CountdownTimer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { globalSaleActive, globalSaleInfo } = useSalesContext();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Check if there's an active global sale or scheduled sale
  const showSaleInNav = globalSaleActive && globalSaleInfo?.global_sale_title;
  const showCountdownInNav = !globalSaleActive && globalSaleInfo?.global_sale_start && 
    new Date(globalSaleInfo.global_sale_start) > new Date();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black shadow-lg relative z-50">
      {/* Sale Banner/Countdown */}
      {(showSaleInNav || showCountdownInNav) && (
        <div className="bg-red-600 text-white py-2 px-4 text-center">
          {showSaleInNav && (
            <div className="font-bold text-sm md:text-base">
              🔥 {globalSaleInfo.global_sale_title} 🔥
            </div>
          )}
          {showCountdownInNav && (
            <div className="flex justify-center">
              <CountdownTimer 
                targetDate={new Date(globalSaleInfo.global_sale_start)}
                className="scale-75 md:scale-100"
              />
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">F1</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">
              The Fashion & Furious
            </span>
            <span className="text-white font-bold text-lg sm:hidden">
              F&F
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link to="/drivers" className="text-white hover:text-gray-300 transition-colors">
              Drivers
            </Link>
            <Link to="/category/f1-classic" className="text-white hover:text-gray-300 transition-colors">
              F1 Classic
            </Link>
            <Link to="/category/teams" className="text-white hover:text-gray-300 transition-colors">
              Teams
            </Link>
            <Link to="/new" className="text-white hover:text-gray-300 transition-colors">
              New
            </Link>
            
            {/* Show SALE link if global sale is active */}
            {showSaleInNav && (
              <Link 
                to="/category/sale" 
                className="text-red-400 hover:text-red-300 transition-colors font-bold animate-pulse"
              >
                SALE
              </Link>
            )}
          </nav>

          {/* Cart and Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative text-white hover:text-gray-300 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Admin Login */}
            <button
              onClick={() => navigate('/admin')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <User className="h-6 w-6" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white hover:text-gray-300 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/drivers" 
                className="text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Drivers
              </Link>
              <Link 
                to="/category/f1-classic" 
                className="text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                F1 Classic
              </Link>
              <Link 
                to="/category/teams" 
                className="text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Teams
              </Link>
              <Link 
                to="/new" 
                className="text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                New
              </Link>
              
              {/* Show SALE link if global sale is active */}
              {showSaleInNav && (
                <Link 
                  to="/category/sale" 
                  className="text-red-400 hover:text-red-300 transition-colors font-bold animate-pulse"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SALE
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
