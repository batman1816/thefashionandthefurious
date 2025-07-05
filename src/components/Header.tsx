
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { scrollToTop } from '../utils/scrollToTop';

const Header = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    navigate('/cart');
    scrollToTop();
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold hover:text-gray-300 transition-colors"
            onClick={() => scrollToTop()}
          >
            The Fashion & Furious
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className="hover:text-gray-300 transition-colors"
              onClick={() => scrollToTop()}
            >
              Home
            </Link>
            <Link 
              to="/drivers"
              className="hover:text-gray-300 transition-colors"
              onClick={() => scrollToTop()}
            >
              Drivers
            </Link>
            <Link 
              to="/f1-classic"
              className="hover:text-gray-300 transition-colors"
              onClick={() => scrollToTop()}
            >
              F1 Classic
            </Link>
            <Link 
              to="/teams"
              className="hover:text-gray-300 transition-colors"
              onClick={() => scrollToTop()}
            >
              Teams
            </Link>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleCartClick}
              className="relative p-2 hover:text-gray-300 transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="py-4 space-y-2">
              <Link 
                to="/"
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Link>
              <Link 
                to="/drivers"
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                Drivers
              </Link>
              <Link 
                to="/f1-classic"
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                F1 Classic
              </Link>
              <Link 
                to="/teams"
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
              >
                Teams
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
