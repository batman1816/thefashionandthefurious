
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface Sale {
  id: string;
  product_id: string;
  original_price: number;
  sale_price: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BundleDeal {
  id: string;
  name: string;
  description?: string;
  deal_type: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  discount_percentage: number;
  minimum_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface SalesSettings {
  id: string;
  global_sale_active: boolean;
  global_sale_title?: string;
  global_sale_start?: string;
  global_sale_end?: string;
  created_at: string;
  updated_at: string;
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [bundleDeals, setBundleDeals] = useState<BundleDeal[]>([]);
  const [salesSettings, setSalesSettings] = useState<SalesSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to fetch sales');
    }
  };

  const fetchBundleDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('bundle_deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBundleDeals(data || []);
    } catch (error) {
      console.error('Error fetching bundle deals:', error);
      toast.error('Failed to fetch bundle deals');
    }
  };

  const fetchSalesSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSalesSettings(data);
    } catch (error) {
      console.error('Error fetching sales settings:', error);
      toast.error('Failed to fetch sales settings');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSales(), fetchBundleDeals(), fetchSalesSettings()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const createSale = async (saleData: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single();

      if (error) throw error;

      setSales(prev => [data, ...prev]);
      toast.success('Sale created successfully');
      return data;
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Failed to create sale');
      throw error;
    }
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSales(prev => prev.map(sale => sale.id === id ? data : sale));
      toast.success('Sale updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Failed to update sale');
      throw error;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSales(prev => prev.filter(sale => sale.id !== id));
      toast.success('Sale deleted successfully');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale');
      throw error;
    }
  };

  const createBundleDeal = async (bundleData: Omit<BundleDeal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('bundle_deals')
        .insert(bundleData)
        .select()
        .single();

      if (error) throw error;

      setBundleDeals(prev => [data, ...prev]);
      toast.success('Bundle deal created successfully');
      return data;
    } catch (error) {
      console.error('Error creating bundle deal:', error);
      toast.error('Failed to create bundle deal');
      throw error;
    }
  };

  const updateBundleDeal = async (id: string, updates: Partial<BundleDeal>) => {
    try {
      const { data, error } = await supabase
        .from('bundle_deals')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBundleDeals(prev => prev.map(deal => deal.id === id ? data : deal));
      toast.success('Bundle deal updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating bundle deal:', error);
      toast.error('Failed to update bundle deal');
      throw error;
    }
  };

  const updateSalesSettings = async (updates: Partial<SalesSettings>) => {
    try {
      const { data, error } = await supabase
        .from('sales_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', salesSettings?.id)
        .select()
        .single();

      if (error) throw error;

      setSalesSettings(data);
      toast.success('Sales settings updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating sales settings:', error);
      toast.error('Failed to update sales settings');
      throw error;
    }
  };

  return {
    sales,
    bundleDeals,
    salesSettings,
    loading,
    createSale,
    updateSale,
    deleteSale,
    createBundleDeal,
    updateBundleDeal,
    updateSalesSettings,
    refetch: async () => {
      await Promise.all([fetchSales(), fetchBundleDeals(), fetchSalesSettings()]);
    }
  };
};
