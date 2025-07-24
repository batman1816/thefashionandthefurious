import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBanners } from '../../context/BannerContext';
import { Banner } from '../../types/Product';
import { deleteImage } from '../../utils/imageUpload';
import { toast } from 'sonner';
import BannerForm from './banner/BannerForm';
import BannerList from './banner/BannerList';

const CategoryBannerManagement = () => {
  const {
    banners,
    loading,
    addBanner,
    updateBanner,
    deleteBanner
  } = useBanners();
  
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('home');

  const categories = [
    { value: 'home', label: 'Home Page' },
    { value: 'drivers', label: 'Drivers' },
    { value: 'teams', label: 'Teams' },
    { value: 'f1-classic', label: 'F1 Classic' },
    { value: 'mousepads', label: 'Mousepads' },
    { value: 'shop-all', label: 'Shop All' }
  ];

  const categoryBanners = banners.filter(banner => 
    banner.category === selectedCategory || (!banner.category && selectedCategory === 'home')
  );

  const handleSubmit = async (bannerData: Omit<Banner, 'id'> | Banner) => {
    try {
      if ('id' in bannerData) {
        await updateBanner(bannerData);
        setEditingBanner(null);
        toast.success('Banner updated successfully');
      } else {
        await addBanner(bannerData);
        toast.success('Banner added successfully');
      }
      setIsAddingBanner(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(`Failed to ${('id' in bannerData) ? 'update' : 'add'} banner. Please try again.`);
      throw error;
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsAddingBanner(true);
  };

  const handleCancel = () => {
    setIsAddingBanner(false);
    setEditingBanner(null);
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      await updateBanner({
        ...banner,
        is_active: !banner.is_active
      });
      toast.success(`Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast.error('Failed to update banner status');
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      return;
    }

    try {
      if (banner.image_url && banner.image_url.includes('supabase')) {
        try {
          await deleteImage(banner.image_url, 'banner-images');
        } catch (error) {
          console.error('Error deleting image from storage:', error);
        }
      }
      
      if (banner.video_url && banner.video_url.includes('supabase')) {
        try {
          await deleteImage(banner.video_url, 'banner-images');
        } catch (error) {
          console.error('Error deleting video from storage:', error);
        }
      }
      
      await deleteBanner(banner.id);
      toast.success('Banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
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
        <h2 className="text-2xl font-bold text-white">Category Banner Management</h2>
        {!isAddingBanner && (
          <button
            onClick={() => setIsAddingBanner(true)}
            className="text-white px-4 py-2 rounded flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <Plus size={20} />
            Add Banner
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded transition-colors ${
              selectedCategory === category.value
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {isAddingBanner && (
        <BannerForm
          editingBanner={editingBanner}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          {categories.find(c => c.value === selectedCategory)?.label} Banners ({categoryBanners.length})
        </h3>
        <BannerList
          banners={categoryBanners}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleBannerStatus}
        />
      </div>
    </div>
  );
};

export default CategoryBannerManagement;