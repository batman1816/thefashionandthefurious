
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async (page = 1) => {
    try {
      const start = (page - 1) * ordersPerPage;
      const end = start + ordersPerPage - 1;

      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      // Cast the data to Order[] type
      const ordersData = (data || []) as Order[];
      setOrders(ordersData);

      // Calculate total pages
      const totalCount = count || 0;
      setTotalPages(Math.ceil(totalCount / ordersPerPage));

      // Calculate stats (from all orders, not just current page)
      const { data: allOrdersData, error: statsError } = await supabase
        .from('orders')
        .select('*');

      if (!statsError && allOrdersData) {
        const allOrders = allOrdersData as Order[];
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
        const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
        const fulfilledOrders = allOrders.filter(order => order.status === 'fulfilled').length;

        setStats({
          total_orders: totalOrders,
          total_revenue: totalRevenue,
          pending_orders: pendingOrders,
          fulfilled_orders: fulfilledOrders
        });
      }
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
      fetchOrders(currentPage); // Refresh the current page
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

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page);
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, []);

  return {
    orders: filteredOrders,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    updateOrderStatus,
    refetch: () => fetchOrders(currentPage),
    currentPage,
    totalPages,
    goToPage
  };
};
