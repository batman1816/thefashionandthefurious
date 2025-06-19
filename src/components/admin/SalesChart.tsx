import { useState, useEffect } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
type TimePeriod = 'week' | 'month' | 'year';
interface SalesData {
  period: string;
  sales: number;
  orders: number;
}
const SalesChart = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSalesData();
  }, [timePeriod]);
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      let dateFilter = '';
      let groupBy = '';
      switch (timePeriod) {
        case 'week':
          dateFilter = "created_at >= NOW() - INTERVAL '7 days'";
          groupBy = "DATE(created_at)";
          break;
        case 'month':
          dateFilter = "created_at >= NOW() - INTERVAL '30 days'";
          groupBy = "DATE(created_at)";
          break;
        case 'year':
          dateFilter = "created_at >= NOW() - INTERVAL '365 days'";
          groupBy = "DATE_TRUNC('month', created_at)";
          break;
      }
      const {
        data,
        error
      } = await supabase.from('orders').select('created_at, total').gte('created_at', getStartDate(timePeriod));
      if (error) throw error;

      // Process the data based on time period
      const processedData = processOrdersData(data || [], timePeriod);
      setSalesData(processedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };
  const getStartDate = (period: TimePeriod): string => {
    const now = new Date();
    switch (period) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    }
  };
  const processOrdersData = (orders: any[], period: TimePeriod): SalesData[] => {
    const dataMap = new Map<string, {
      sales: number;
      orders: number;
    }>();
    orders.forEach(order => {
      let key = '';
      const date = new Date(order.created_at);
      switch (period) {
        case 'week':
        case 'month':
          key = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          break;
        case 'year':
          key = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });
          break;
      }
      if (!dataMap.has(key)) {
        dataMap.set(key, {
          sales: 0,
          orders: 0
        });
      }
      const existing = dataMap.get(key)!;
      existing.sales += parseFloat(order.total.toString());
      existing.orders += 1;
    });
    return Array.from(dataMap.entries()).map(([period, data]) => ({
      period,
      sales: data.sales,
      orders: data.orders
    })).sort((a, b) => a.period.localeCompare(b.period));
  };
  const chartConfig = {
    sales: {
      label: "Sales (TK)",
      color: "#ef4444"
    },
    orders: {
      label: "Orders",
      color: "#3b82f6"
    }
  };
  return <div className="space-y-4">
      {/* Time Period Selector */}
      <div className="flex gap-2">
        <button onClick={() => setTimePeriod('week')} className="bg-zinc-950 hover:bg-zinc-800">
          Last Week
        </button>
        <button onClick={() => setTimePeriod('month')} className="bg-zinc-950 hover:bg-zinc-800">
          Last Month
        </button>
        <button onClick={() => setTimePeriod('year')} className="bg-zinc-950 hover:bg-zinc-800 rounded-sm">
          Last Year
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        {loading ? <div className="flex items-center justify-center h-full text-gray-400">
            Loading chart data...
          </div> : salesData.length === 0 ? <div className="flex items-center justify-center h-full text-gray-400">
            No sales data available for the selected period
          </div> : <ChartContainer config={chartConfig}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} dot={{
            fill: "#ef4444",
            strokeWidth: 2
          }} />
            </LineChart>
          </ChartContainer>}
      </div>

      {/* Summary */}
      {!loading && salesData.length > 0 && <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded text-center bg-zinc-900">
            <div className="text-lg font-bold text-red-400">
              TK{salesData.reduce((sum, item) => sum + item.sales, 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">Total Sales</div>
          </div>
          <div className="p-3 rounded text-center bg-zinc-900">
            <div className="text-lg font-bold text-blue-400">
              {salesData.reduce((sum, item) => sum + item.orders, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Orders</div>
          </div>
        </div>}
    </div>;
};
export default SalesChart;