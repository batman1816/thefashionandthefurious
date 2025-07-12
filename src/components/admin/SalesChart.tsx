
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

type TimePeriod = 'week' | 'month' | 'year';

interface SalesData {
  period: string;
  sales: number;
  orders: number;
  date: string; // Add date for better sorting
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
      const startDate = getStartDate(timePeriod);
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });

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
    const dataMap = new Map<string, { sales: number; orders: number; date: Date }>();

    orders.forEach(order => {
      const date = new Date(order.created_at);
      let key = '';
      let mapDate = new Date(date);

      switch (period) {
        case 'week':
          // Group by day for the past week
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          mapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          break;
        case 'month':
          // Group by day for the past month
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          mapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          break;
        case 'year':
          // Group by month for the past year
          key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          mapDate = new Date(date.getFullYear(), date.getMonth(), 1);
          break;
      }

      if (!dataMap.has(key)) {
        dataMap.set(key, { sales: 0, orders: 0, date: mapDate });
      }

      const existing = dataMap.get(key)!;
      existing.sales += parseFloat(order.total.toString());
      existing.orders += 1;
    });

    // Convert to array and sort by date
    const result = Array.from(dataMap.entries())
      .map(([period, data]) => ({
        period,
        sales: Math.round(data.sales * 100) / 100, // Round to 2 decimal places
        orders: data.orders,
        date: data.date.toISOString()
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-red-400">
              Sales: <span className="font-bold">Tk{data.sales.toFixed(2)}</span>
            </p>
            <p className="text-blue-400">
              Orders: <span className="font-bold">{data.orders}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Sales Analytics</h3>
        
        {/* Time Period Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimePeriod('week')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              timePeriod === 'week'
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimePeriod('month')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              timePeriod === 'month'
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimePeriod('year')}
            className={`px-4 py-2 rounded text-sm transition-colors ${
              timePeriod === 'year'
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <div className="h-80 w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          ) : salesData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">No sales data available for the selected period</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="period"
                  stroke="#9ca3af"
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => `Tk${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#ef4444", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {!loading && salesData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg text-center bg-zinc-900">
            <div className="text-2xl font-bold text-white mb-2">
              Tk{salesData.reduce((sum, item) => sum + item.sales, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Total Sales</div>
          </div>
          <div className="p-6 rounded-lg text-center bg-zinc-900">
            <div className="text-2xl font-bold text-white mb-2">
              {salesData.reduce((sum, item) => sum + item.orders, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Orders</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
