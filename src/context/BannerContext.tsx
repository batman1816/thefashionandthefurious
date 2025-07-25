
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Banner } from '../types/Product';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface BannerContextType {
  banners: Banner[];
  loading: boolean;
  updateBanner: (banner: Banner) => Promise<void>;
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  refreshBanners: () => Promise<void>;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      console.log('Fetching banners from database...');
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching banners:', error);
        throw error;
      }

      console.log('Banners fetched successfully:', data);
      // Map the data to include all new fields
      const mappedBanners = (data || []).map(banner => ({
        ...banner,
        media_type: (banner as any).media_type || 'image' as 'image' | 'video',
        video_url: (banner as any).video_url || undefined,
        category: (banner as any).category || 'home',
        title: (banner as any).title || undefined,
        description: (banner as any).description || undefined
      }));
      setBanners(mappedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    
    // Set up real-time subscription for banner changes
    const subscription = supabase
      .channel('banners')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'banners' },
        (payload) => {
          console.log('Banner change detected:', payload);
          fetchBanners(); // Refresh banners on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateBanner = async (updatedBanner: Banner) => {
    try {
      console.log('Updating banner:', updatedBanner);
      const { error } = await supabase
        .from('banners')
        .update({
          image_url: updatedBanner.image_url,
          video_url: updatedBanner.video_url,
          media_type: updatedBanner.media_type,
          button_text: updatedBanner.button_text,
          button_link: updatedBanner.button_link,
          is_active: updatedBanner.is_active,
          category: updatedBanner.category,
          title: updatedBanner.title,
          description: updatedBanner.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedBanner.id);

      if (error) {
        console.error('Error updating banner:', error);
        throw error;
      }

      setBanners(prev => prev.map(b => b.id === updatedBanner.id ? updatedBanner : b));
      console.log('Banner updated successfully');
      // Refresh banners from database to ensure consistency
      await fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Failed to update banner');
      throw error;
    }
  };

  const addBanner = async (newBanner: Omit<Banner, 'id'>) => {
    try {
      console.log('Adding new banner:', newBanner);
      const { data, error } = await supabase
        .from('banners')
        .insert({
          image_url: newBanner.image_url,
          video_url: newBanner.video_url,
          media_type: newBanner.media_type,
          button_text: newBanner.button_text,
          button_link: newBanner.button_link,
          is_active: newBanner.is_active,
          category: newBanner.category,
          title: newBanner.title,
          description: newBanner.description
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding banner:', error);
        throw error;
      }

      const mappedBanner: Banner = {
        ...data,
        media_type: newBanner.media_type || 'image',
        video_url: newBanner.video_url || undefined,
        category: newBanner.category || 'home',
        title: newBanner.title || undefined,
        description: newBanner.description || undefined
      };
      setBanners(prev => [mappedBanner, ...prev]);
      console.log('Banner added successfully:', data);
    } catch (error) {
      console.error('Error adding banner:', error);
      toast.error('Failed to add banner');
      throw error;
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      console.log('Deleting banner:', id);
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting banner:', error);
        throw error;
      }

      setBanners(prev => prev.filter(b => b.id !== id));
      console.log('Banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
      throw error;
    }
  };

  const refreshBanners = async () => {
    await fetchBanners();
  };

  return (
    <BannerContext.Provider value={{ 
      banners, 
      loading, 
      updateBanner, 
      addBanner, 
      deleteBanner, 
      refreshBanners 
    }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanners = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBanners must be used within a BannerProvider');
  }
  return context;
};
