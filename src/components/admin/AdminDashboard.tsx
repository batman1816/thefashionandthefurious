
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import SalesManagement from './SalesManagement';
import BannerManagement from './BannerManagement';
import CategoryBannerManagement from './CategoryBannerManagement';
import SiteSettings from './SiteSettings';
import SalesChart from './SalesChart';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { analytics, loading } = useSiteSettings();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="rounded-lg p-6 bg-zinc-800">
            <h3 className="text-xl font-semibold mb-6 text-white">Sales Overview</h3>
            <SalesChart />
            
            {/* Total Sales and Orders Summary */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700">
              <div className="p-4 rounded text-center bg-zinc-900">
                <div className="text-2xl font-bold text-white">
                  {loading ? '...' : `Tk${analytics.total_revenue.toFixed(2)}`}
                </div>
                <div className="text-sm text-gray-400">Total Sales</div>
              </div>
              <div className="p-4 rounded text-center bg-zinc-900">
                <div className="text-2xl font-bold text-white">
                  {loading ? '...' : analytics.total_orders}
                </div>
                <div className="text-sm text-gray-400">Total Orders</div>
              </div>
            </div>
          </div>
        );
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'sales':
        return <SalesManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'category-banners':
        return <CategoryBannerManagement />;
      case 'settings':
        return <SiteSettings />;
      default:
        return <div className="text-white">Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-4 py-2 rounded transition-colors text-slate-50 bg-zinc-800 hover:bg-zinc-700 font-normal"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900 border-r border-gray-800">
          <div className="p-4">
            <h2 className="text-white text-lg font-semibold mb-4">Admin Panel</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === 'dashboard' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-zinc-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveSection('products')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === 'products' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-zinc-700'
                }`}
              >
                Product Management
              </button>
              <button
                onClick={() => setActiveSection('orders')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === 'orders' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-zinc-700'
                }`}
              >
                Order Management
              </button>
              <button
                onClick={() => setActiveSection('sales')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === 'sales' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-zinc-700'
                }`}
              >
                Sales Management
              </button>
              <button
                onClick={() => setActiveSection('banners')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === 'banners' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-zinc-700'
                }`}
              >
                Home Banner Management
              </button>
              <button
                onClick={() => setActiveSection('category-banners')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === 'category-banners' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-zinc-700'
                }`}
              >
                Category Banners
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === 'settings' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-zinc-700'
                }`}
              >
                Site Settings
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-zinc-950 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
