import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'The Fashion & Furious',
    contactEmail: 'orders@thefashionandfurious.com',
    shippingCost: '500',
    logoUrl: '',
    supportEmail: 'support@thefashionandfurious.com'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save these to your backend
    toast.success('Settings saved successfully!');
  };

  const handleLogoUpload = () => {
    // In a real app, you would handle file upload here
    toast.success('Logo uploaded successfully!');
  };

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
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <p className="text-xs text-gray-400 mt-1">Email where order notifications will be sent</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shipping Cost (৳)</label>
              <input
                type="number"
                name="shippingCost"
                value={settings.shippingCost}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={20} />
              Save Settings
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
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-400 mb-4">Upload your logo</p>
                <button
                  onClick={handleLogoUpload}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
                >
                  Choose File
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Current Logo Preview</h4>
              <div className="bg-gray-700 p-4 rounded text-center">
                <div className="text-xl font-bold">
                  <div className="text-red-400">THE FASHION</div>
                  <div className="text-white">& FURIOUS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
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
