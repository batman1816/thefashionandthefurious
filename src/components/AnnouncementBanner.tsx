import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface AnnouncementBannerData {
  id: string;
  text: string;
  is_active: boolean;
}

const AnnouncementBanner = () => {
  const [bannerData, setBannerData] = useState<AnnouncementBannerData | null>(null);

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_banner')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching banner data:', error);
        return;
      }

      setBannerData(data);
    } catch (error) {
      console.error('Error fetching banner data:', error);
    }
  };

  if (!bannerData || !bannerData.is_active) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden relative">
      <div className="whitespace-nowrap flex animate-scroll">
        {/* Repeat the text multiple times to create continuous scroll */}
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="inline-block px-8 text-sm font-semibold tracking-wide"
          >
            {bannerData.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBanner;