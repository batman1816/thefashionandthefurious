
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

  const handleNavigation = (path: string) => {
    navigate(path);
    scrollToTop();
    setIsMenuOpen(false);
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
            <button 
              onClick={() => handleNavigation('/')}
              className="hover:text-gray-300 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/drivers')}
              className="hover:text-gray-300 transition-colors"
            >
              Drivers
            </button>
            <button 
              onClick={() => handleNavigation('/f1-classic')}
              className="hover:text-gray-300 transition-colors"
            >
              F1 Classic
            </button>
            <button 
              onClick={() => handleNavigation('/teams')}
              className="hover:text-gray-300 transition-colors"
            >
              Teams
            </button>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleNavigation('/cart')}
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
              <button 
                onClick={() => handleNavigation('/')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/drivers')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                Drivers
              </button>
              <button 
                onClick={() => handleNavigation('/f1-classic')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                F1 Classic
              </button>
              <button 
                onClick={() => handleNavigation('/teams')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                Teams
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
