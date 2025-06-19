
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface SiteAnalytics {
  total_orders: number;
  total_revenue: number;
  total_visitors: number;
  total_products: number;
}

export const useSiteSettings = () => {
  const [analytics, setAnalytics] = useState<SiteAnalytics>({
    total_orders: 0,
    total_revenue: 0,
    total_visitors: 0,
    total_products: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Fetch site settings for stored analytics
      const { data: settings } = await supabase
        .from('site_settings')
        .select('total_orders, total_revenue, total_visitors')
        .single();

      // Fetch current orders count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total');

      // Fetch products count
      const { data: products } = await supabase
        .from('products')
        .select('id');

      const currentTotalOrders = orders?.length || 0;
      const currentTotalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0) || 0;
      const totalProducts = products?.length || 0;

      setAnalytics({
        total_orders: currentTotalOrders,
        total_revenue: currentTotalRevenue,
        total_visitors: settings?.total_visitors || 0,
        total_products: totalProducts
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics
  };
};
