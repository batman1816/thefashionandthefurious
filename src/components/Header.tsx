
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <p>FREE SHIPPING ON ORDERS OVER $75 | WORLDWIDE DELIVERY</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-center flex-1 md:flex-none">
            <div className="text-red-600">THE FASHION</div>
            <div className="text-black text-lg">& FURIOUS</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/drivers" className="hover:text-red-600 transition-colors font-medium">
              DRIVERS
            </Link>
            <Link to="/f1-classic" className="hover:text-red-600 transition-colors font-medium">
              F1 CLASSIC
            </Link>
            <Link to="/teams" className="hover:text-red-600 transition-colors font-medium">
              TEAMS
            </Link>
          </nav>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="hover:text-red-600 transition-colors" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/drivers" 
                className="hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                DRIVERS
              </Link>
              <Link 
                to="/f1-classic" 
                className="hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                F1 CLASSIC
              </Link>
              <Link 
                to="/teams" 
                className="hover:text-red-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                TEAMS
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
