import { useState } from 'react';
import { Banner } from '../../../types/Product';
import BannerImageUpload from './BannerImageUpload';
import BannerLinkSelector from './BannerLinkSelector';
import { toast } from 'sonner';
interface BannerFormProps {
  editingBanner: Banner | null;
  onSubmit: (bannerData: Omit<Banner, 'id'> | Banner) => Promise<void>;
  onCancel: () => void;
}
const BannerForm = ({
  editingBanner,
  onSubmit,
  onCancel
}: BannerFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    image_url: editingBanner?.image_url || '',
    button_text: editingBanner?.button_text || '',
    button_link: editingBanner?.button_link || '',
    is_active: editingBanner?.is_active ?? true
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error('Please upload a banner image');
      return;
    }
    if (!formData.image_url.trim()) {
      toast.error('Please upload a valid banner image');
      return;
    }
    try {
      const bannerData = {
        image_url: formData.image_url,
        button_text: formData.button_text || null,
        button_link: formData.button_link || null,
        is_active: formData.is_active
      };
      console.log('Submitting banner data:', bannerData);
      if (editingBanner) {
        await onSubmit({
          ...bannerData,
          id: editingBanner.id
        });
      } else {
        await onSubmit(bannerData);
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(`Failed to ${editingBanner ? 'update' : 'add'} banner. Please try again.`);
    }
  };
  return <div className="p-6 rounded-lg bg-zinc-900">
      <h3 className="text-xl font-semibold text-white mb-4">
        {editingBanner ? 'Edit Banner' : 'Add New Banner'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <BannerImageUpload imageUrl={formData.image_url} uploading={uploading} onImageChange={url => setFormData(prev => ({
        ...prev,
        image_url: url
      }))} onUploadingChange={setUploading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Button Text (Optional)</label>
            <input type="text" value={formData.button_text} onChange={e => setFormData(prev => ({
            ...prev,
            button_text: e.target.value
          }))} className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-gray-500 focus:outline-none" placeholder="e.g., Shop Now" maxLength={50} />
          </div>
          <BannerLinkSelector buttonLink={formData.button_link} onLinkChange={link => setFormData(prev => ({
          ...prev,
          button_link: link
        }))} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData(prev => ({
          ...prev,
          is_active: e.target.checked
        }))} className="w-4 h-4" />
          <label htmlFor="isActive" className="text-white">Active Banner</label>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={uploading || !formData.image_url} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            {editingBanner ? 'Update Banner' : 'Add Banner'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>;
};
export default BannerForm;