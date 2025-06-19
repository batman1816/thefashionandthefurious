
import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { SiteSettings as SiteSettingsType } from '../../types/Product';
import { uploadImage } from '../../utils/imageUpload';
import { toast } from 'sonner';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import SalesChart from './SalesChart';

const SiteSettings = () => {
  const {
    analytics,
    loading: analyticsLoading
  } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettingsType>({
    id: '',
    site_name: 'The Fashion & The Furious',
    contact_email: 'thefashionnfurious@gmail.com',
    support_email: 'thefashionnfurious@gmail.com',
    logo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('site_settings').select('id, site_name, contact_email, support_email, logo_url').single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      if (data) {
        const settingsData: SiteSettingsType = {
          id: data.id || '',
          site_name: data.site_name || 'The Fashion & The Furious',
          contact_email: data.contact_email || 'thefashionnfurious@gmail.com',
          support_email: data.support_email || 'thefashionnfurious@gmail.com',
          logo_url: data.logo_url || ''
        };
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const logoUrl = await uploadImage(file, 'banner-images');
      setSettings(prev => ({
        ...prev,
        logo_url: logoUrl
      }));

      // Save logo URL immediately
      if (settings.id) {
        const {
          error
        } = await supabase.from('site_settings').update({
          logo_url: logoUrl
        }).eq('id', settings.id);
        if (error) throw error;
        toast.success('Logo updated successfully');
      }
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading settings...</div>
      </div>;
  }

  return <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Site Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="rounded-lg p-6 bg-zinc-800">
          <h3 className="text-xl font-semibold mb-6">General Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input type="text" value="The Fashion & The Furious" readOnly className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-300 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Site name is fixed and cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input type="email" value="thefashionnfurious@gmail.com" readOnly className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-300 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Contact email is fixed and cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input type="email" value="thefashionnfurious@gmail.com" readOnly className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-gray-300 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Support email is fixed and cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="rounded-lg p-6 bg-zinc-800">
          <h3 className="text-xl font-semibold mb-6">Branding</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" disabled={uploading} />
                <label htmlFor="logo-upload" className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-400 mb-4">
                    {uploading ? 'Uploading...' : 'Upload your logo'}
                  </p>
                  <button type="button" className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors" disabled={uploading}>
                    Choose File
                  </button>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Current Logo Preview</h4>
              <div className="p-4 rounded text-center bg-zinc-900">
                {settings.logo_url ? <img src={settings.logo_url} alt="Logo" className="max-h-16 mx-auto" /> : <div className="text-xl font-bold">
                    <div className="text-white">THE FASHION</div>
                    <div className="text-white">& THE FURIOUS</div>
                  </div>}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="rounded-lg p-6 bg-zinc-800">
          <h3 className="text-xl font-semibold mb-6">Site Analytics</h3>
          
          {analyticsLoading ? <div className="text-center text-gray-400">Loading analytics...</div> : <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded text-center bg-zinc-900">
                <div className="text-2xl font-bold text-white">{analytics.total_orders}</div>
                <div className="text-sm text-gray-400">Total Orders</div>
              </div>
              <div className="p-4 rounded text-center bg-zinc-900">
                <div className="text-2xl font-bold text-white">{analytics.total_products}</div>
                <div className="text-sm text-gray-400">Products</div>
              </div>
              <div className="p-4 rounded text-center bg-zinc-900">
                <div className="text-2xl font-bold text-white">TK{analytics.total_revenue.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Revenue</div>
              </div>
              <div className="p-4 rounded text-center bg-zinc-900">
                <div className="text-2xl font-bold text-white">{analytics.total_visitors}</div>
                <div className="text-sm text-gray-400">Visitors</div>
              </div>
            </div>}
        </div>

        {/* Sales Chart */}
        <div className="rounded-lg p-6 bg-zinc-800">
          <h3 className="text-xl font-semibold mb-6">Sales Overview</h3>
          <SalesChart />
        </div>
      </div>
    </div>;
};

export default SiteSettings;
