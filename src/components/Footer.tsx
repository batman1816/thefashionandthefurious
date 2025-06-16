
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold mb-4">
              <div className="text-red-600">THE FASHION</div>
              <div>& FURIOUS</div>
            </div>
            <p className="text-gray-400 mb-4">
              Premium Formula 1 inspired apparel for racing enthusiasts worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">SHOP</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/drivers" className="hover:text-white transition-colors">Drivers</Link></li>
              <li><Link to="/f1-classic" className="hover:text-white transition-colors">F1 Classic</Link></li>
              <li><Link to="/teams" className="hover:text-white transition-colors">Teams</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">SUPPORT</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">STAY UPDATED</h4>
            <p className="text-gray-400 mb-4">Get the latest F1 apparel and exclusive offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-600"
              />
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 font-semibold transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 The Fashion & Furious. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
