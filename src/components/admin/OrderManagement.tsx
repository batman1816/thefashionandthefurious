import { useState } from 'react';
import { Check, Clock, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    updateOrderStatus,
    currentPage,
    totalPages,
    goToPage
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="text-white">
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
              <TableHead className="text-gray-300 bg-zinc-800">bKash Payment</TableHead>
              <TableHead className="text-gray-300 bg-zinc-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id} className="border-gray-700 hover:bg-gray-700">
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
                    Tk{parseFloat(order.total.toString()).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="bg-zinc-800">
                  <div className={`flex items-center gap-1 text-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </TableCell>
                <TableCell className="bg-zinc-800">
                  {order.bkash_transaction_id ? (
                    <div className="text-xs">
                      <div className="text-green-400 font-medium">✅ Paid</div>
                      <div className="text-gray-400">TXN: {order.bkash_transaction_id}</div>
                      <div className="text-gray-400">From: {order.bkash_sender_number}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-red-400">❌ No Payment Info</div>
                  )}
                </TableCell>
                <TableCell className="bg-zinc-800">
                  <button 
                    onClick={() => setSelectedOrder(order)} 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Eye size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? 'No orders found matching your search.' : 'No orders found.'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}

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
              {/* bKash Payment Info Section */}
              {selectedOrder.bkash_transaction_id && (
                <div className="p-4 rounded bg-green-900/20 border border-green-600">
                  <h4 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2">
                    💳 bKash Payment Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-400">Transaction ID:</label>
                      <p className="text-green-400 font-mono text-lg font-bold">{selectedOrder.bkash_transaction_id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">Sender Number:</label>
                      <p className="text-green-400 font-mono text-lg font-bold">{selectedOrder.bkash_sender_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'fulfilled')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      Approve Payment
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Deny Payment
                    </button>
                  </div>
                </div>
              )}

              {!selectedOrder.bkash_transaction_id && (
                <div className="p-4 rounded bg-red-900/20 border border-red-600">
                  <h4 className="text-lg font-semibold mb-2 text-red-400">❌ No Payment Information</h4>
                  <p className="text-gray-300">Customer has not provided bKash payment details yet.</p>
                </div>
              )}

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

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {(() => {
                    try {
                      const items = typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items;
                      if (Array.isArray(items)) {
                        return items.map((item: any, index: number) => (
                          <div key={index} className="p-4 rounded flex justify-between bg-zinc-800">
                            <div>
                              <p className="font-medium">{item.product?.name || item.name}</p>
                              <p className="text-gray-400">
                                {item.color && `Color: ${item.color} | `}
                                Size: {item.size} | Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Tk{((item.product?.price || item.price) * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ));
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
                    <span>Tk{parseFloat(selectedOrder.subtotal.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping ({selectedOrder.shipping_option}):</span>
                    <span>Tk{parseFloat(selectedOrder.shipping_cost.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                    <span>Total:</span>
                    <span>Tk{parseFloat(selectedOrder.total.toString()).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Status</h4>
                <div className="flex gap-3">
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'pending')} 
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedOrder.status === 'pending' 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-600 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    Mark as Pending
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'fulfilled')} 
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedOrder.status === 'fulfilled' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 hover:bg-green-600 text-white'
                    }`}
                  >
                    Mark as Fulfilled
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')} 
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedOrder.status === 'cancelled' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-600 hover:bg-red-600 text-white'
                    }`}
                  >
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
    </div>
  );
};

export default OrderManagement;
