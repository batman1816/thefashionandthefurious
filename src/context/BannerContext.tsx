
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Banner {
  id: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
}

interface BannerContextType {
  banners: Banner[];
  updateBanner: (banner: Banner) => void;
  addBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>(() => {
    const savedBanners = localStorage.getItem('fashion-furious-banners');
    if (savedBanners) {
      try {
        return JSON.parse(savedBanners);
      } catch (error) {
        console.error('Error parsing saved banners:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('fashion-furious-banners', JSON.stringify(banners));
  }, [banners]);

  const updateBanner = (updatedBanner: Banner) => {
    setBanners(prev => prev.map(b => b.id === updatedBanner.id ? updatedBanner : b));
  };

  const addBanner = (newBanner: Banner) => {
    setBanners(prev => [...prev, newBanner]);
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BannerContext.Provider value={{ banners, updateBanner, addBanner, deleteBanner }}>
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
