import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner';
import { Banner } from '../../types/Product';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BannerFormProps {
  editingBanner?: Banner;
  onSubmit: (bannerData: Omit<Banner, 'id'> | Banner) => Promise<void>;
  onCancel: () => void;
}

const BannerForm = ({ editingBanner, onSubmit, onCancel }: BannerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormData = editingBanner
    ? {
        image_url: editingBanner.image_url || '',
        video_url: editingBanner.video_url || '',
        button_text: editingBanner.button_text || '',
        button_link: editingBanner.button_link || '',
        is_active: editingBanner.is_active || false,
        media_type: editingBanner.media_type || 'image'
      }
    : {
        image_url: '',
        video_url: '',
        button_text: '',
        button_link: '',
        is_active: true,
        media_type: 'image' as 'image' | 'video'
      };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, media_type: value as 'image' | 'video' }));
  };

  const handleIsActiveChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.image_url.trim() && !formData.video_url.trim()) {
      toast.error('Please add an image or video');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (editingBanner) {
        await onSubmit({
          ...editingBanner,
          ...formData,
          media_type: formData.media_type
        });
      } else {
        await onSubmit({
          ...formData,
          media_type: formData.media_type
        });
      }
      
      // Reset form
      setFormData({
        image_url: '',
        video_url: '',
        button_text: '',
        button_link: '',
        is_active: true,
        media_type: 'image'
      });
    } catch (error) {
      console.error('Error submitting banner:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-md space-y-4">
      <h3 className="text-xl font-semibold text-white">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h3>

      <div>
        <Label htmlFor="image_url" className="text-white">Image URL</Label>
        <Input
          type="text"
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="Enter image URL"
          className="bg-zinc-800 text-white"
        />
      </div>

      <div>
        <Label htmlFor="video_url" className="text-white">Video URL</Label>
        <Input
          type="text"
          id="video_url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          placeholder="Enter video URL"
          className="bg-zinc-800 text-white"
        />
      </div>

      <div>
        <Label htmlFor="button_text" className="text-white">Button Text</Label>
        <Input
          type="text"
          id="button_text"
          name="button_text"
          value={formData.button_text}
          onChange={handleChange}
          placeholder="Enter button text"
          className="bg-zinc-800 text-white"
        />
      </div>

      <div>
        <Label htmlFor="button_link" className="text-white">Button Link</Label>
        <Input
          type="text"
          id="button_link"
          name="button_link"
          value={formData.button_link}
          onChange={handleChange}
          placeholder="Enter button link"
          className="bg-zinc-800 text-white"
        />
      </div>

      <div>
        <Label className="text-white">Media Type</Label>
        <Select onValueChange={handleMediaTypeChange} defaultValue={formData.media_type}>
          <SelectTrigger className="bg-zinc-800 text-white">
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white">
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="is_active" className="text-white">Active</Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={handleIsActiveChange}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 text-zinc-400 rounded hover:bg-zinc-700 transition-colors"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default BannerForm;
