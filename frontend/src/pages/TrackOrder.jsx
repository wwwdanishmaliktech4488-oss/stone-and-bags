import { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TrackOrder() {
  const [page, setPage] = useState({ title: 'Track Your Order', content: 'Enter your Tracking ID below.' });
  const [trackingId, setTrackingId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/pages/track_order').then(res => setPage(res.data)).catch(() => {});
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderData(null);
    try {
      const response = await API.get(`/orders/track/${trackingId}`);
      setOrderData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-[#D4AF37] tracking-widest mb-4">{page.title}</h1>
          <p className="text-gray-400 font-light text-sm md:text-base">{page.content}</p>
        </div>
        
        <form onSubmit={handleTrack} className="bg-[#111111] p-6 md:p-8 rounded-sm border border-[#D4AF37]/30 mb-8">
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 text-left">Tracking ID</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="e.g. ALN-12345" className="flex-1 bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]" required />
            <button type="submit" disabled={loading} className="bg-[#D4AF37] text-black px-8 py-3 font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors">
              {loading ? '...' : 'Track'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-4 text-left">{error}</p>}
        </form>

        {orderData && (
          <div className="bg-[#111111] p-6 md:p-8 rounded-sm border border-[#D4AF37]/30 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Tracking ID</p>
                <p className="text-xl font-bold text-[#D4AF37]">{orderData.order.tracking_id}</p>
              </div>
              <div>
                <span className={`px-4 py-2 border rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(orderData.order.status)}`}>
                  {orderData.order.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-[#D4AF37] mb-2 text-xs uppercase tracking-widest">Customer Info</h3>
              <p className="text-sm text-gray-300 mb-1">{orderData.order.customer_name}</p>
              <p className="text-sm text-gray-400 mb-1">{orderData.order.customer_phone}</p>
              <p className="text-sm text-gray-400">{orderData.order.customer_address}</p>
            </div>

            <div>
              <h3 className="font-medium text-[#D4AF37] mb-2 text-xs uppercase tracking-widest">Items Ordered</h3>
              <ul className="space-y-2">
                {orderData.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm border-b border-gray-800 pb-2">
                    <span className="text-gray-400">{item.quantity} x {item.product_name}</span>
                    <span className="text-white font-medium">${Number(item.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-800 text-[#D4AF37]">
                <span>Total</span>
                <span>${Number(orderData.order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}