
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useSales } from './useSales';

export interface ActiveSale {
  product_id: string;
  original_price: number;
  sale_price: number;
  savings: number;
  percentage_off: number;
}

export const useActiveSales = () => {
  const [activeSales, setActiveSales] = useState<ActiveSale[]>([]);
  const [activeBundleDeals, setActiveBundleDeals] = useState<any[]>([]);
  const [globalSaleActive, setGlobalSaleActive] = useState(false);
  const [globalSaleInfo, setGlobalSaleInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveSales = async () => {
    try {
      // Fetch active individual product sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('is_active', true);

      if (salesError) throw salesError;

      const processedSales = (salesData || []).map(sale => ({
        product_id: sale.product_id,
        original_price: sale.original_price,
        sale_price: sale.sale_price,
        savings: sale.original_price - sale.sale_price,
        percentage_off: Math.round(((sale.original_price - sale.sale_price) / sale.original_price) * 100)
      }));

      setActiveSales(processedSales);

      // Fetch active bundle deals
      const { data: bundleData, error: bundleError } = await supabase
        .from('bundle_deals')
        .select('*')
        .eq('is_active', true);

      if (bundleError) throw bundleError;
      setActiveBundleDeals(bundleData || []);

      // Fetch global sale settings
      const { data: globalData, error: globalError } = await supabase
        .from('sales_settings')
        .select('*')
        .single();

      if (globalError) throw globalError;

      setGlobalSaleActive(globalData?.global_sale_active || false);
      setGlobalSaleInfo(globalData);

    } catch (error) {
      console.error('Error fetching active sales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSales();

    // Set up real-time listener for sales changes
    const salesChannel = supabase
      .channel('sales-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales' }, 
        () => fetchActiveSales()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bundle_deals' }, 
        () => fetchActiveSales()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales_settings' }, 
        () => fetchActiveSales()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salesChannel);
    };
  }, []);

  const getSaleForProduct = (productId: string): ActiveSale | null => {
    return activeSales.find(sale => sale.product_id === productId) || null;
  };

  const getActiveBundleDeal = () => {
    return activeBundleDeals.find(deal => deal.is_active) || null;
  };

  const isProductOnSale = (productId: string): boolean => {
    return activeSales.some(sale => sale.product_id === productId);
  };

  return {
    activeSales,
    activeBundleDeals,
    globalSaleActive,
    globalSaleInfo,
    loading,
    getSaleForProduct,
    getActiveBundleDeal,
    isProductOnSale,
    refetch: fetchActiveSales
  };
};
