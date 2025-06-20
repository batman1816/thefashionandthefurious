
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBanners } from '../../context/BannerContext';
import { Banner } from '../../types/Product';
import { deleteImage } from '../../utils/imageUpload';
import { toast } from 'sonner';
import BannerForm from './banner/BannerForm';
import BannerList from './banner/BannerList';

const BannerManagement = () => {
  const {
    banners,
    loading,
    addBanner,
    updateBanner,
    deleteBanner
  } = useBanners();
  
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

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
      // Delete image from storage if it's hosted on Supabase
      if (banner.image_url.includes('supabase')) {
        try {
          await deleteImage(banner.image_url, 'banner-images');
          console.log('Banner image deleted from storage');
        } catch (error) {
          console.error('Error deleting image from storage:', error);
          // Continue with banner deletion even if image deletion fails
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
        <h2 className="text-2xl font-bold text-white">Banner Management</h2>
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

      {isAddingBanner && (
        <BannerForm
          editingBanner={editingBanner}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <BannerList
        banners={banners}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={toggleBannerStatus}
      />
    </div>
  );
};

export default BannerManagement;
