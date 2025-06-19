import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-black text-white py-[9px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 my-0 py-0">
          <p className="text-slate-300">&copy; 2024 The Fashion & Furious. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;