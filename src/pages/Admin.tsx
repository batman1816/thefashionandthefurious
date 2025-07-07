
import React, { useState } from 'react';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import BannerManagement from '../components/admin/BannerManagement';
import SiteSettings from '../components/admin/SiteSettings';
import MakeIntegration from '../components/admin/MakeIntegration';
import SalesManagement from '../components/admin/SalesManagement';

const ADMIN_PASSWORD = 'yUsrA@#$2618';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Welcome to admin panel!');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    toast.success('Logged out successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16 bg-zinc-950">
          <AdminLogin onLogin={handleLogin} />
        </div>
        <Footer />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onLogout={handleLogout} />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'sales':
        return <SalesManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'make':
        return <MakeIntegration />;
      case 'settings':
        return <SiteSettings />;
      default:
        return <AdminDashboard onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 bg-zinc-950">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 rounded-lg p-6 bg-zinc-900">
            <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'products', label: 'Products', icon: '📦' },
                { id: 'orders', label: 'Orders', icon: '🛒' },
                { id: 'sales', label: 'Sales', icon: '🏷️' },
                { id: 'banners', label: 'Banners', icon: '🖼️' },
                { id: 'make', label: 'Make.com', icon: '🔗' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 rounded-lg p-8 bg-zinc-950">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
