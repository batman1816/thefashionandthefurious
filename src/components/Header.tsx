
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-black shadow-sm border-b border-black">
      {/* Top Bar */}
      <div className="text-white text-center py-1 text-xs bg-zinc-950">
        
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-1 md:flex-none">
            <img src="/lovable-uploads/1bfadb02-757f-46dc-b0c2-f866a1969b54.png" alt="The Fashion & The Furious" className="h-12 md:h-14 object-contain" />
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <nav className="hidden md:flex space-x-8 ml-auto mr-8">
            <Link to="/shop-all" className="text-white hover:text-white transition-all font-medium text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Shop All
            </Link>
            <Link to="/drivers" className="text-white hover:text-white transition-all font-medium text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Drivers
            </Link>
            <Link to="/f1-classic" className="text-white hover:text-white transition-all font-medium text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              F1 Classics
            </Link>
            <Link to="/teams" className="text-white hover:text-white transition-all font-medium text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Teams
            </Link>
            <Link to="/sales" className="text-white hover:text-white transition-all font-medium text-sm uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Sales
            </Link>
          </nav>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <img 
              src="/lovable-uploads/f50749f8-7e4e-41ba-b8e4-18d0a369170e.png" 
              alt="Cart" 
              className="w-10 h-10 hover:opacity-75 transition-opacity" 
            />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link to="/shop-all" className="text-white hover:text-white transition-all font-medium uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" onClick={() => setIsMenuOpen(false)}>
                Shop All
              </Link>
              <Link to="/drivers" className="text-white hover:text-white transition-all font-medium uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" onClick={() => setIsMenuOpen(false)}>
                Drivers
              </Link>
              <Link to="/f1-classic" className="text-white hover:text-white transition-all font-medium uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" onClick={() => setIsMenuOpen(false)}>
                F1 Classics
              </Link>
              <Link to="/teams" className="text-white hover:text-white transition-all font-medium uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" onClick={() => setIsMenuOpen(false)}>
                Teams
              </Link>
              <Link to="/sales" className="text-white hover:text-white transition-all font-medium uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" onClick={() => setIsMenuOpen(false)}>
                Sales
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
