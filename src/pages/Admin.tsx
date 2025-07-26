
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductManagement from '../components/admin/ProductManagement';
import MousepadManagement from '../components/admin/MousepadManagement';
import TShirtManagement from '../components/admin/TShirtManagement';
import OrderManagement from '../components/admin/OrderManagement';
import BannerManagement from '../components/admin/BannerManagement';
import AnnouncementBannerManagement from '../components/admin/AnnouncementBannerManagement';
import SalesManagement from '../components/admin/SalesManagement';
import SiteSettings from '../components/admin/SiteSettings';
import MakeIntegration from '../components/admin/MakeIntegration';

const ADMIN_PASSWORD = 'yUsrA@#$2618';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      try {
        // Sign in anonymously with Supabase for RLS policies
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error('Auth error:', error);
          toast.error('Authentication failed');
          return;
        }
        setIsAuthenticated(true);
        toast.success('Welcome to admin panel!');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed');
      }
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setActiveTab('dashboard');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
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
      case 'mousepads':
        return <MousepadManagement />;
      case 'tshirts':
        return <TShirtManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'announcement':
        return <AnnouncementBannerManagement />;
      case 'sales':
        return <SalesManagement />;
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
                { id: 'products', label: 'All Products', icon: '📦' },
                { id: 'mousepads', label: 'Mousepads', icon: '🖱️' },
                { id: 'tshirts', label: 'T-Shirts', icon: '👕' },
                { id: 'orders', label: 'Orders', icon: '🛒' },
                { id: 'banners', label: 'Banners', icon: '🖼️' },
                { id: 'announcement', label: 'Announcement', icon: '📢' },
                { id: 'sales', label: 'Sales', icon: '🏷️' },
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
