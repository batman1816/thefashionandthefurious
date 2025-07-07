
import React, { createContext, useContext, ReactNode } from 'react';
import { useActiveSales } from '../hooks/useActiveSales';

interface SalesContextType {
  activeSales: any[];
  activeBundleDeals: any[];
  globalSaleActive: boolean;
  globalSaleInfo: any;
  loading: boolean;
  getSaleForProduct: (productId: string) => any;
  getActiveBundleDeal: () => any;
  isProductOnSale: (productId: string) => boolean;
  refetch: () => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const salesData = useActiveSales();

  return (
    <SalesContext.Provider value={salesData}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext must be used within a SalesProvider');
  }
  return context;
};
