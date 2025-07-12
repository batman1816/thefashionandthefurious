import { Upload, Video } from 'lucide-react';
import { uploadImage } from '../../../utils/imageUpload';
import { toast } from 'sonner';

interface BannerVideoUploadProps {
  videoUrl: string;
  uploading: boolean;
  onVideoChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

const BannerVideoUpload = ({ 
  videoUrl, 
  uploading, 
  onVideoChange, 
  onUploadingChange 
}: BannerVideoUploadProps) => {
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    // Validate file size (max 50MB for videos)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video size must be less than 50MB');
      return;
    }

    // Create a video element to check duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(video.src);
      
      // Check if video is longer than 20 seconds
      if (video.duration > 20) {
        toast.error('Video duration must be 20 seconds or less');
        return;
      }

      // If duration is valid, proceed with upload
      onUploadingChange(true);
      try {
        console.log('Starting video upload for banner...');
        const uploadedVideoUrl = await uploadImage(file, 'banner-images');
        console.log('Banner video uploaded successfully:', uploadedVideoUrl);
        
        onVideoChange(uploadedVideoUrl);
        toast.success('Banner video uploaded successfully');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload banner video. Please try again.');
      } finally {
        onUploadingChange(false);
      }
    };

    video.src = URL.createObjectURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
      // Create a synthetic event to reuse the upload logic
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleVideoUpload(syntheticEvent);
      } else {
        toast.error('Please drop a valid video file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <label className="block text-white mb-2">Banner Video * (Max 20 seconds)</label>
      <div className="space-y-4">
        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 transition-colors hover:border-gray-500"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="banner-video-upload"
            disabled={uploading}
          />
          <label
            htmlFor="banner-video-upload"
            className={`cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Video size={32} className="mb-2" />
            <span className="text-center">
              {uploading ? 'Uploading...' : 'Click to upload or drag & drop video'}
              <br />
              <small className="text-gray-500">Max duration: 20 seconds, Max size: 50MB</small>
            </span>
          </label>
        </div>
        
        {videoUrl && (
          <div className="mt-4">
            <video
              src={videoUrl}
              controls
              className="w-full max-w-md h-32 object-cover rounded border-2 border-gray-600"
              onError={(e) => {
                console.error('Failed to load banner preview video');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerVideoUpload;