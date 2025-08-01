import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src="/lovable-uploads/1bfadb02-757f-46dc-b0c2-f866a1969b54.png" alt="The Fashion & The Furious" className="h-20 object-contain" />
            </div>
            <p className="text-gray-400 mb-4 text-lg">Premium apparel inspired by F1 for racing enthusiasts, by racing enthusiasts.🏎️</p>
          </div>

          {/* Quick Links - mobile/tablet: grouped with support, desktop: separate */}
          <div className="lg:block">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0">
              <div>
                <h4 className="font-semibold mb-4">SHOP</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/drivers" className="hover:text-white transition-colors">Drivers</Link></li>
                  <li><Link to="/f1-classic" className="hover:text-white transition-colors">F1 Classic</Link></li>
                  <li><Link to="/teams" className="hover:text-white transition-colors">Teams</Link></li>
                </ul>
              </div>

              {/* Customer Service & Social Media - mobile/tablet: beside shop, desktop: separate column */}
              <div className="lg:hidden">
                <div className="flex items-center gap-4 mb-4">
                  <h4 className="font-semibold">SUPPORT</h4>
                  <div className="flex gap-3">
                    <a href="https://www.instagram.com/thefashionandthefurious_?igsh=ZGRsZTcyazl3bGp4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                      <Instagram size={20} />
                    </a>
                    <a href="https://www.facebook.com/share/1EhKPkuewp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                      <Facebook size={20} />
                    </a>
                    <a href="https://wa.me/8801941126350" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                  <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Customer Service & Social Media - desktop only */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-4 mb-4">
              <h4 className="font-semibold">SUPPORT</h4>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/thefashionandthefurious_?igsh=ZGRsZTcyazl3bGp4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/share/1EhKPkuewp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://wa.me/8801941126350" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 The Fashion &amp; The Furious. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;