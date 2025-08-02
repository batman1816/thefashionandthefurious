import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    cartItems
  } = useCart();
  const isMobile = useIsMobile();
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return <header className="bg-black shadow-sm border-b border-black">
      {/* Top Bar */}
      <div className="text-white text-center py-1 text-xs bg-zinc-950">
        
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Mobile Menu Button - Only on mobile */}
          {isMobile ? <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="text-white flex flex-col gap-1">
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-black border-0 border-t-0 max-h-[90vh] [&>*]:border-0">
                <div className="flex flex-col h-full">
                  {/* Header with X button and logo */}
                  <div className="flex items-center justify-between p-6 pb-8">
                    <button onClick={() => setIsDrawerOpen(false)} className="text-white">
                      <X size={22} strokeWidth={1} />
                    </button>
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                      <Link to="/" onClick={() => setIsDrawerOpen(false)}>
                        <img src="/lovable-uploads/1bfadb02-757f-46dc-b0c2-f866a1969b54.png" alt="The Fashion & The Furious" className="h-14 object-contain hover:opacity-75 transition-opacity" />
                      </Link>
                    </div>
                    <Link to="/cart" className="relative" onClick={() => setIsDrawerOpen(false)}>
                      <img src="/lovable-uploads/f50749f8-7e4e-41ba-b8e4-18d0a369170e.png" alt="Cart" className="w-10 h-10 hover:opacity-75 transition-opacity" />
                      {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                          {cartItemsCount}
                        </span>}
                    </Link>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="flex-1 px-6">
                    <div className="space-y-6">
                      <Link to="/shop-all" className="inline-block text-white text-lg font-light tracking-widest hover:text-gray-300 active:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-left after:transition-all after:duration-300 hover:after:w-full active:after:w-full" style={{
                    fontFamily: 'Poppins',
                    fontWeight: 300
                  }} onClick={() => setIsDrawerOpen(false)}>
                        SHOP ALL
                      </Link>
                      
                      <Link to="/drivers" className="inline-block text-white text-lg font-light tracking-widest hover:text-gray-300 active:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-left after:transition-all after:duration-300 hover:after:w-full active:after:w-full" style={{
                    fontFamily: 'Poppins',
                    fontWeight: 300
                  }} onClick={() => setIsDrawerOpen(false)}>
                        DRIVERS
                      </Link>

                      <Link to="/f1-classic" className="inline-block text-white text-lg font-light tracking-widest hover:text-gray-300 active:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-left after:transition-all after:duration-300 hover:after:w-full active:after:w-full" style={{
                    fontFamily: 'Poppins',
                    fontWeight: 300
                  }} onClick={() => setIsDrawerOpen(false)}>
                        F1 CLASSIC
                      </Link>

                      <Link to="/teams" className="inline-block text-white text-lg font-light tracking-widest hover:text-gray-300 active:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-left after:transition-all after:duration-300 hover:after:w-full active:after:w-full" style={{
                    fontFamily: 'Poppins',
                    fontWeight: 300
                  }} onClick={() => setIsDrawerOpen(false)}>
                        TEAMS
                      </Link>

                      <Link to="/mousepads" className="inline-block text-white text-lg font-light tracking-widest hover:text-gray-300 active:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-left after:transition-all after:duration-300 hover:after:w-full active:after:w-full" style={{
                    fontFamily: 'Poppins',
                    fontWeight: 300
                  }} onClick={() => setIsDrawerOpen(false)}>
                        MOUSEPADS
                      </Link>

                      <Link to="/sales" className="inline-block text-white text-lg font-light tracking-widest hover:text-gray-300 active:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-left after:transition-all after:duration-300 hover:after:w-full active:after:w-full" style={{
                    fontFamily: 'Poppins',
                    fontWeight: 300
                  }} onClick={() => setIsDrawerOpen(false)}>
                        SALES
                      </Link>
                    </div>
                  </nav>

                  {/* Social Media Links */}
                  <div className="px-6 pb-8 pt-6">
                    <div className="flex gap-6">
                      <a href="https://www.instagram.com/thefashionandthefurious_?igsh=ZGRsZTcyazl3bGp4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                        <Instagram size={24} />
                      </a>
                      <a href="https://www.facebook.com/share/1EhKPkuewp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                        <Facebook size={24} />
                      </a>
                      <a href="https://wa.me/8801941126350" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                        <MessageCircle size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer> : <div className="w-20"></div> // Spacer for desktop
        }

          {/* Logo - Centered on mobile, left-aligned on desktop */}
          <Link to="/" className={isMobile ? "absolute left-1/2 transform -translate-x-1/2" : "flex-none"}>
            <img src="/lovable-uploads/1bfadb02-757f-46dc-b0c2-f866a1969b54.png" alt="The Fashion & The Furious" className="h-16 md:h-16 object-contain" />
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <nav className="hidden lg:flex space-x-8 ml-auto mr-8">
            <Link to="/shop-all" className="text-white hover:text-white transition-all font-poppins-extralight font-extralight text-sm tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Shop All
            </Link>
            <Link to="/drivers" className="text-white hover:text-white transition-all font-poppins-extralight font-extralight text-sm tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Drivers
            </Link>
            <Link to="/f1-classic" className="text-white hover:text-white transition-all font-poppins-extralight font-extralight text-sm tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              F1 Classics
            </Link>
            <Link to="/teams" className="text-white hover:text-white transition-all font-poppins-extralight font-extralight text-sm tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Teams
            </Link>
            <Link to="/mousepads" className="text-white hover:text-white transition-all font-poppins-extralight font-extralight text-sm tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Mousepads
            </Link>
            <Link to="/sales" className="text-white hover:text-white transition-all font-poppins-extralight font-extralight text-sm tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Sales
            </Link>
          </nav>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <img src="/lovable-uploads/f50749f8-7e4e-41ba-b8e4-18d0a369170e.png" alt="Cart" className="w-12 h-12 hover:opacity-75 transition-opacity" />
            {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                {cartItemsCount}
              </span>}
          </Link>
        </div>
      </div>
    </header>;
};
export default Header;