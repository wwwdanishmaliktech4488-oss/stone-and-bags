import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await API.get('/dashboard');
        setStats(statsRes.data);
        const ordersRes = await API.get('/orders');
        setRecentOrders(ordersRes.data.slice(0, 5)); 
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 border-yellow-500/30';
      case 'confirmed': return 'text-blue-400 border-blue-400/30';
      case 'shipped': return 'text-purple-400 border-purple-400/30';
      case 'delivered': return 'text-green-400 border-green-400/30';
      case 'cancelled': return 'text-red-400 border-red-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-white tracking-widest mb-2">Overview</h1>
        <p className="text-gray-500 font-light">Here is what is happening in your store today.</p>
      </div>

      {loading ? (
        <div className="text-[#D4AF37]">Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 p-8 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Total Revenue</div>
                <div className="text-3xl font-serif text-[#D4AF37]">${Number(stats.totalRevenue).toFixed(2)}</div>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
            
            <div className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 p-8 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Total Orders</div>
                <div className="text-3xl font-serif text-white">{stats.totalOrders}</div>
              </div>
              <div className="text-4xl opacity-80">🛒</div>
            </div>
            
            <div className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 p-8 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Total Products</div>
                <div className="text-3xl font-serif text-white">{stats.totalProducts}</div>
              </div>
              <div className="text-4xl opacity-80">📦</div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-800">
              <h3 className="text-lg font-serif text-[#D4AF37] tracking-widest">RECENT ORDERS</h3>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a] text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-6 font-medium">Order ID</th>
                  <th className="p-6 font-medium">Customer</th>
                  <th className="p-6 font-medium">Total</th>
                  <th className="p-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 font-light">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-6 font-medium text-[#D4AF37]">#{order.tracking_id}</td>
                      <td className="p-6 text-gray-300">{order.customer_name}</td>
                      <td className="p-6 text-white font-medium">${Number(order.total_amount).toFixed(2)}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 border rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}