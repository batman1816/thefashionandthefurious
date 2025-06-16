
import { useState } from 'react';
import { Check, Clock, Eye } from 'lucide-react';
import { Order } from '../../types/Product';

const OrderManagement = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 555-0123',
        address: '123 Racing Street, Monaco City, Monaco 98000'
      },
      items: [
        {
          product: {
            id: '1',
            name: 'Lewis Hamilton Championship Tee',
            description: '',
            price: 45,
            image: '',
            category: 'drivers',
            sizes: [],
            stock: 0
          },
          size: 'L',
          quantity: 2
        }
      ],
      total: 100,
      date: new Date('2024-01-15'),
      status: 'pending'
    },
    {
      id: '1002',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1 555-0456',
        address: '456 Speed Avenue, Barcelona, Spain 08001'
      },
      items: [
        {
          product: {
            id: '3',
            name: 'Ferrari Scuderia Heritage Tee',
            description: '',
            price: 40,
            image: '',
            category: 'teams',
            sizes: [],
            stock: 0
          },
          size: 'M',
          quantity: 1
        }
      ],
      total: 50,
      date: new Date('2024-01-14'),
      status: 'fulfilled'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'fulfilled':
        return 'text-green-400';
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
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Order Management</h2>
        <div className="text-gray-400">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{order.customer.name}</div>
                    <div className="text-sm text-gray-400">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {order.date.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      ${order.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center gap-1 text-sm ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <div className="bg-gray-700 p-4 rounded">
                  <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.customer.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Summary</h4>
                <div className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${(selectedOrder.total - 10).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Order Status</h4>
                <div className="flex gap-3">
                  <button
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedOrder.status === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-600 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    Mark as Pending
                  </button>
                  <button
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedOrder.status === 'fulfilled'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 hover:bg-green-600 text-white'
                    }`}
                  >
                    Mark as Fulfilled
                  </button>
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
