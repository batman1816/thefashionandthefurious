
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Order, OrderStats } from '../types/Order';
import { toast } from 'sonner';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    fulfilled_orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ordersData = data || [];
      setOrders(ordersData);

      // Calculate stats
      const totalOrders = ordersData.length;
      const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
      const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
      const fulfilledOrders = ordersData.filter(order => order.status === 'fulfilled').length;

      setStats({
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        pending_orders: pendingOrders,
        fulfilled_orders: fulfilledOrders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'fulfilled' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Order ${orderId} status updated to ${status}`);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customer_name.toLowerCase().includes(searchLower) ||
      order.customer_email.toLowerCase().includes(searchLower) ||
      order.customer_phone.includes(searchTerm)
    );
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders: filteredOrders,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
