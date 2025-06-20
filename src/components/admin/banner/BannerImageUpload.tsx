
import { Upload } from 'lucide-react';
import { uploadImage } from '../../../utils/imageUpload';
import { toast } from 'sonner';

interface BannerImageUploadProps {
  imageUrl: string;
  uploading: boolean;
  onImageChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

const BannerImageUpload = ({ 
  imageUrl, 
  uploading, 
  onImageChange, 
  onUploadingChange 
}: BannerImageUploadProps) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    onUploadingChange(true);
    try {
      console.log('Starting image upload for banner...');
      const uploadedImageUrl = await uploadImage(file, 'banner-images');
      console.log('Banner image uploaded successfully:', uploadedImageUrl);
      
      onImageChange(uploadedImageUrl);
      toast.success('Banner image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload banner image. Please try again.');
    } finally {
      onUploadingChange(false);
    }
  };

  return (
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
            className={`cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload size={32} className="mb-2" />
            <span className="text-center">
              {uploading ? 'Uploading...' : 'Click to upload banner image'}
              <br />
              <small className="text-gray-500">Max size: 5MB</small>
            </span>
          </label>
        </div>
        
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Banner Preview"
              className="w-full max-w-md h-32 object-cover rounded border-2 border-gray-600"
              onError={(e) => {
                console.error('Failed to load banner preview image');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerImageUpload;
