
import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { useBanners, Banner } from '../../context/BannerContext';

const BannerManagement = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useBanners();
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState({
    image: '',
    buttonText: '',
    buttonLink: '',
    isActive: true
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      alert('Please upload an image');
      return;
    }

    const bannerData = {
      id: editingBanner?.id || Date.now().toString(),
      image: formData.image,
      buttonText: formData.buttonText || undefined,
      buttonLink: formData.buttonLink || undefined,
      isActive: formData.isActive
    };

    if (editingBanner) {
      updateBanner(bannerData);
      setEditingBanner(null);
    } else {
      addBanner(bannerData);
      setIsAddingBanner(false);
    }

    // Reset form
    setFormData({
      image: '',
      buttonText: '',
      buttonLink: '',
      isActive: true
    });
  };

  const handleEdit = (banner: Banner) => {
    setFormData({
      image: banner.image,
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      isActive: banner.isActive
    });
    setEditingBanner(banner);
    setIsAddingBanner(true);
  };

  const handleCancel = () => {
    setIsAddingBanner(false);
    setEditingBanner(null);
    setFormData({
      image: '',
      buttonText: '',
      buttonLink: '',
      isActive: true
    });
  };

  const toggleBannerStatus = (banner: Banner) => {
    updateBanner({ ...banner, isActive: !banner.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Banner Management</h2>
        {!isAddingBanner && (
          <button
            onClick={() => setIsAddingBanner(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={20} />
            Add Banner
          </button>
        )}
      </div>

      {isAddingBanner && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingBanner ? 'Edit Banner' : 'Add New Banner'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Banner Image *</label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white"
                  >
                    <Upload size={32} className="mb-2" />
                    <span>Click to upload banner image</span>
                  </label>
                </div>
                
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full max-w-md h-32 object-cover rounded border-2 border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Button Text (Optional)</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  placeholder="e.g., Shop Now"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Button Link (Optional)</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  placeholder="e.g., /drivers"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-white">Active Banner</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                {editingBanner ? 'Update Banner' : 'Add Banner'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-white">Image</th>
                <th className="px-6 py-3 text-left text-white">Button Text</th>
                <th className="px-6 py-3 text-left text-white">Button Link</th>
                <th className="px-6 py-3 text-left text-white">Status</th>
                <th className="px-6 py-3 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id} className="border-b border-gray-700">
                  <td className="px-6 py-4">
                    <img
                      src={banner.image}
                      alt="Banner"
                      className="w-24 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-white">{banner.buttonText || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{banner.buttonLink || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      banner.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleBannerStatus(banner)}
                        className={`p-2 rounded ${
                          banner.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {banner.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {banners.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No banners added yet. Create your first banner to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
