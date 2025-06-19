
import { supabase } from '../integrations/supabase/client';

export const uploadImage = async (file: File, bucket: 'product-images' | 'banner-images'): Promise<string> => {
  try {
    console.log(`Starting upload to bucket: ${bucket}`, file);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`Uploading file: ${filePath}`);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Public URL generated:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const deleteImage = async (url: string, bucket: 'product-images' | 'banner-images'): Promise<void> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    console.log(`Deleting file: ${fileName} from bucket: ${bucket}`);
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for image deletion as it's not critical
  }
};
