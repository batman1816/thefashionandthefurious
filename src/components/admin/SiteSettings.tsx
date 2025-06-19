import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { SiteSettings as SiteSettingsType } from '../../types/Product';
import { uploadImage } from '../../utils/imageUpload';
import { toast } from 'sonner';

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettingsType>({
    id: '',
    site_name: 'The Fashion & Furious',
    contact_email: 'orders@thefashionandfurious.com',
    support_email: 'support@thefashionandfurious.com',
    shipping_cost: 500,
    logo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('id, site_name, contact_email, support_email, shipping_cost, logo_url')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Ensure all required fields are present with defaults
        const settingsData: SiteSettingsType = {
          id: data.id || '',
          site_name: data.site_name || 'The Fashion & Furious',
          contact_email: data.contact_email || 'orders@thefashionandfurious.com',
          support_email: data.support_email || 'support@thefashionandfurious.com',
          shipping_cost: data.shipping_cost || 500,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'shipping_cost' ? parseInt(value) || 0 : value
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const logoUrl = await uploadImage(file, 'banner-images'); // Using banner-images bucket for logo
      setSettings(prev => ({ ...prev, logo_url: logoUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings')
          .update({
            site_name: settings.site_name,
            contact_email: settings.contact_email,
            support_email: settings.support_email,
            shipping_cost: settings.shipping_cost,
            logo_url: settings.logo_url
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('site_settings')
          .insert({
            site_name: settings.site_name,
            contact_email: settings.contact_email,
            support_email: settings.support_email,
            shipping_cost: settings.shipping_cost,
            logo_url: settings.logo_url
          })
          .select('id, site_name, contact_email, support_email, shipping_cost, logo_url')
          .single();

        if (error) throw error;
        if (data) {
          const newSettings: SiteSettingsType = {
            id: data.id,
            site_name: data.site_name,
            contact_email: data.contact_email,
            support_email: data.support_email,
            shipping_cost: data.shipping_cost,
            logo_url: data.logo_url || ''
          };
          setSettings(newSettings);
        }
      }

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Site Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">General Settings</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <p className="text-xs text-gray-400 mt-1">Email where order notifications will be sent</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input
                type="email"
                name="support_email"
                value={settings.support_email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shipping Cost (৳)</label>
              <input
                type="number"
                name="shipping_cost"
                value={settings.shipping_cost}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Branding */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Branding</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="logo-upload"
                  className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                >
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-400 mb-4">
                    {uploading ? 'Uploading...' : 'Upload your logo'}
                  </p>
                  <button
                    type="button"
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
                    disabled={uploading}
                  >
                    Choose File
                  </button>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Current Logo Preview</h4>
              <div className="bg-gray-700 p-4 rounded text-center">
                {settings.logo_url ? (
                  <img 
                    src={settings.logo_url} 
                    alt="Logo" 
                    className="max-h-16 mx-auto"
                  />
                ) : (
                  <div className="text-xl font-bold">
                    <div className="text-red-400">THE FASHION</div>
                    <div className="text-white">& FURIOUS</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Email Configuration</h3>
          
          <div className="space-y-4">
            <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded p-4">
              <h4 className="font-medium text-yellow-400 mb-2">Email Integration Required</h4>
              <p className="text-sm text-gray-300 mb-3">
                To receive order notifications via email, you need to connect your Lovable project to Supabase.
              </p>
              <p className="text-sm text-gray-300">
                Gmail App Password: <code className="bg-gray-700 px-2 py-1 rounded">fbrg zrnd tyuc vtfd</code>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SMTP Settings</label>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Server: smtp.gmail.com</p>
                <p>Port: 587</p>
                <p>Security: TLS</p>
                <p>App Password: fbrg zrnd tyuc vtfd</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Site Analytics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded text-center">
              <div className="text-2xl font-bold text-red-400">0</div>
              <div className="text-sm text-gray-400">Total Orders</div>
            </div>
            <div className="bg-gray-700 p-4 rounded text-center">
              <div className="text-2xl font-bold text-green-400">8</div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
            <div className="bg-gray-700 p-4 rounded text-center">
              <div className="text-2xl font-bold text-blue-400">৳0</div>
              <div className="text-sm text-gray-400">Revenue</div>
            </div>
            <div className="bg-gray-700 p-4 rounded text-center">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-sm text-gray-400">Visitors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
