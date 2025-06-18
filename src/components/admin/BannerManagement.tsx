
import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { useBanners } from '../../context/BannerContext';
import { Banner } from '../../types/Product';
import { uploadImage, deleteImage } from '../../utils/imageUpload';
import { toast } from 'sonner';

const BannerManagement = () => {
  const { banners, loading, addBanner, updateBanner, deleteBanner } = useBanners();
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    image_url: '',
    button_text: '',
    button_link: '',
    is_active: true
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'banner-images');
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      toast.success('Banner image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload banner image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast.error('Please upload a banner image');
      return;
    }

    const bannerData = {
      image_url: formData.image_url,
      button_text: formData.button_text || undefined,
      button_link: formData.button_link || undefined,
      is_active: formData.is_active
    };

    try {
      if (editingBanner) {
        await updateBanner({ ...bannerData, id: editingBanner.id });
        setEditingBanner(null);
      } else {
        await addBanner(bannerData);
        setIsAddingBanner(false);
      }

      // Reset form
      setFormData({
        image_url: '',
        button_text: '',
        button_link: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setFormData({
      image_url: banner.image_url,
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      is_active: banner.is_active
    });
    setEditingBanner(banner);
    setIsAddingBanner(true);
  };

  const handleCancel = () => {
    setIsAddingBanner(false);
    setEditingBanner(null);
    setFormData({
      image_url: '',
      button_text: '',
      button_link: '',
      is_active: true
    });
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      await updateBanner({ ...banner, is_active: !banner.is_active });
    } catch (error) {
      console.error('Error toggling banner status:', error);
    }
  };

  const handleDelete = async (banner: Banner) => {
    try {
      // Delete image from storage if it's hosted on Supabase
      if (banner.image_url.includes('supabase')) {
        await deleteImage(banner.image_url, 'banner-images');
      }
      await deleteBanner(banner.id);
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading banners...</div>
      </div>
    );
  }

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
                    disabled={uploading}
                  />
                  <label
                    htmlFor="banner-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white ${uploading ? 'opacity-50' : ''}`}
                  >
                    <Upload size={32} className="mb-2" />
                    <span>{uploading ? 'Uploading...' : 'Click to upload banner image'}</span>
                  </label>
                </div>
                
                {formData.image_url && (
                  <div className="mt-4">
                    <img
                      src={formData.image_url}
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
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  placeholder="e.g., Shop Now"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Button Link (Optional)</label>
                <input
                  type="text"
                  value={formData.button_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  placeholder="e.g., /drivers"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-white">Active Banner</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
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
                      src={banner.image_url}
                      alt="Banner"
                      className="w-24 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-white">{banner.button_text || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{banner.button_link || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      banner.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleBannerStatus(banner)}
                        className={`p-2 rounded ${
                          banner.is_active ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {banner.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner)}
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
