import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'confirmed': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'shipped': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'delivered': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'cancelled': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-widest uppercase">Orders</h1>
        <p className="text-gray-500 font-light mt-1">Manage customer orders and update their shipping status.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[#D4AF37]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-[#111111] p-8 rounded-sm border border-[#D4AF37]/30 text-center text-gray-500">
          No orders have been placed yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 overflow-hidden">
              {/* Order Header */}
              <div className="bg-[#0a0a0a] px-6 py-4 border-b border-gray-800 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Tracking ID</div>
                  <div className="font-bold text-[#D4AF37]">{order.tracking_id || `ALN-${order.id}`}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Date</div>
                  <div className="font-medium text-gray-300">{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total</div>
                  <div className="font-bold text-white">${Number(order.total_amount).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 border rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-700 rounded-sm p-2 text-sm bg-[#111111] text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-[#D4AF37] mb-3 uppercase tracking-widest border-b border-gray-800 pb-2">Customer Details</h3>
                  <p className="text-sm text-gray-400 mb-1"><span className="text-gray-500">Name:</span> {order.customer_name}</p>
                  <p className="text-sm text-gray-400 mb-1"><span className="text-gray-500">Email:</span> {order.customer_email}</p>
                  <p className="text-sm text-gray-400"><span className="text-gray-500">Phone:</span> {order.customer_phone}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#D4AF37] mb-3 uppercase tracking-widest border-b border-gray-800 pb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">{order.customer_address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}