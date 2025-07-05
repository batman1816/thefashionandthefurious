import { useState } from 'react';
import { Check, Clock, Eye, X } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import OrderSearch from './OrderSearch';
import { Order } from '../../types/Order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const OrderManagement = () => {
  const {
    orders,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    updateOrderStatus
  } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'fulfilled':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'fulfilled':
        return <Check size={16} />;
      case 'cancelled':
        return <X size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading orders...</div>
      </div>;
  }

  return <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Order Management</h2>
        <div className="text-gray-400">
          Total Orders: {stats.total_orders} | Pending: {stats.pending_orders} | Fulfilled: {stats.fulfilled_orders}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <OrderSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300 bg-zinc-800">Order ID</TableHead>
              <TableHead className="text-gray-300 bg-zinc-800">Customer</TableHead>
              <TableHead className="text-gray-300 bg-zinc-800">Date</TableHead>
              <TableHead className="text-gray-300 bg-zinc-800">Total</TableHead>
              <TableHead className="text-gray-300 bg-zinc-800">Status</TableHead>
              <TableHead className="text-gray-300 bg-zinc-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => <TableRow key={order.id} className="border-gray-700 hover:bg-gray-700">
                <TableCell className="bg-zinc-800">
                  <div className="text-sm font-medium text-white">#{order.id}</div>
                </TableCell>
                <TableCell className="bg-zinc-800">
                  <div className="text-sm text-white">{order.customer_name}</div>
                  <div className="text-sm text-gray-400">{order.customer_email}</div>
                  <div className="text-sm text-gray-400">{order.customer_phone}</div>
                </TableCell>
                <TableCell className="bg-zinc-800">
                  <div className="text-sm text-gray-300">
                    {formatDate(order.created_at)}
                  </div>
                </TableCell>
                <TableCell className="bg-zinc-800">
                  <div className="text-sm font-medium text-white">
                    TK{parseFloat(order.total.toString()).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="bg-zinc-800">
                  <div className={`flex items-center gap-1 text-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </TableCell>
                <TableCell className="bg-zinc-800">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-400 hover:text-blue-300 mr-3">
                    <Eye size={16} className="bg-transparent" />
                  </button>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>

        {orders.length === 0 && <div className="text-center py-8 text-gray-400">
            {searchTerm ? 'No orders found matching your search.' : 'No orders found.'}
          </div>}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Order #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Customer Information</h4>
                <div className="p-4 rounded bg-zinc-800">
                  <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.customer_address}</p>
                  <p><strong>City:</strong> {selectedOrder.customer_city}</p>
                  <p><strong>ZIP:</strong> {selectedOrder.customer_zip_code}</p>
                </div>
              </div>

              {/* Bkash Payment Details */}
              {(selectedOrder as any).bkash_account && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">Payment Details</h4>
                  <div className="p-4 rounded bg-zinc-800">
                    <p><strong>Bkash Account:</strong> {(selectedOrder as any).bkash_account}</p>
                    <p><strong>Transaction ID:</strong> {(selectedOrder as any).bkash_transaction_id}</p>
                    <p><strong>Payment Method:</strong> Bkash</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {(() => {
                try {
                  const items = typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items;
                  if (Array.isArray(items)) {
                    return items.map((item: any, index: number) => <div key={index} className="p-4 rounded flex justify-between bg-zinc-800">
                            <div>
                              <p className="font-medium">{item.product?.name || item.name}</p>
                              <p className="text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">TK{((item.product?.price || item.price) * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>);
                  } else {
                    return <p className="text-gray-400">No items found</p>;
                  }
                } catch (error) {
                  console.error('Error parsing order items:', error);
                  return <p className="text-gray-400">Error loading items</p>;
                }
              })()}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Summary</h4>
                <div className="p-4 rounded bg-zinc-800">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>TK{parseFloat(selectedOrder.subtotal.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping ({selectedOrder.shipping_option}):</span>
                    <span>TK{parseFloat(selectedOrder.shipping_cost.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                    <span>Total:</span>
                    <span>TK{parseFloat(selectedOrder.total.toString()).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Status</h4>
                <div className="flex gap-3">
                  <button onClick={() => updateOrderStatus(selectedOrder.id, 'pending')} className={`px-4 py-2 rounded transition-colors ${selectedOrder.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-600 hover:bg-yellow-600 text-white'}`}>
                    Mark as Pending
                  </button>
                  <button onClick={() => updateOrderStatus(selectedOrder.id, 'fulfilled')} className={`px-4 py-2 rounded transition-colors ${selectedOrder.status === 'fulfilled' ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-green-600 text-white'}`}>
                    Mark as Fulfilled
                  </button>
                  <button onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')} className={`px-4 py-2 rounded transition-colors ${selectedOrder.status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-600 hover:bg-red-600 text-white'}`}>
                    Mark as Cancelled
                  </button>
                </div>
              </div>

              {/* Order Dates */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Timeline</h4>
                <div className="p-4 rounded bg-zinc-800">
                  <p><strong>Created:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(selectedOrder.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>;
};

export default OrderManagement;
