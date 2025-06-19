
import { useState } from 'react';
import { LogOut, Package, FileText, Settings, Image } from 'lucide-react';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import SiteSettings from './SiteSettings';
import BannerManagement from './BannerManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'banners':
        return <BannerManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'settings':
        return <SiteSettings />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-black min-h-screen border-r border-gray-800">
          <div className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-950">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
