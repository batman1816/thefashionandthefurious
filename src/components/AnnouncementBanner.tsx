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
        .maybeSingle();

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
    <div className="bg-red-600 text-white py-2 overflow-hidden relative font-poppins">
      <div className="flex animate-scroll-continuous-mobile md:animate-scroll-continuous">
        {/* Create a seamless loop by duplicating the content */}
        <div className="flex whitespace-nowrap">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={`first-${i}`}
              className="inline-block px-8 text-sm font-semibold tracking-wide"
            >
              {bannerData.text}
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={`second-${i}`}
              className="inline-block px-8 text-sm font-semibold tracking-wide"
            >
              {bannerData.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;