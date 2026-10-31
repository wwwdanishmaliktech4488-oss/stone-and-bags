import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import confetti from 'canvas-confetti';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0 && !isSuccess) {
      navigate('/cart'); 
    }
    setCart(savedCart);
  }, [navigate, isSuccess]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        ...formData,
        total_amount: calculateTotal(),
        items: cart,
      };

      const response = await API.post('/orders', orderData);
      
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      setTrackingId(response.data.trackingId);
      setIsSuccess(true);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#111111', '#FDFBF7']
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-[#111111] p-12 rounded-sm shadow-2xl border border-[#D4AF37]/30 max-w-lg w-full text-center relative z-10">
            <div className="text-6xl mb-6">✨</div>
            <h1 className="text-3xl font-serif text-[#D4AF37] mb-4 tracking-widest">THANK YOU</h1>
            <p className="text-gray-400 mb-8 font-light">Your order has been placed successfully. We are preparing your exclusive items.</p>
            
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm mb-8">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-[0.2em]">Your Tracking ID</p>
              <p className="text-3xl font-serif text-white tracking-widest">{trackingId}</p>
            </div>
            
            <p className="text-sm text-gray-500 mb-8">Please save this ID to track your order.</p>
            
            <button onClick={() => navigate('/')} className="w-full bg-[#D4AF37] text-black py-4 px-6 text-sm font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors">
              Return to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-4xl font-serif tracking-widest text-black mb-12 text-center">SECURE CHECKOUT</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-8 text-center border border-red-100 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="flex-1 bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-xl font-serif text-black mb-8 border-b border-gray-100 pb-4 tracking-widest">SHIPPING DETAILS</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#C5A059] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input required type="email" name="customer_email" value={formData.customer_email} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#C5A059] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input required type="text" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#C5A059] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Shipping Address</label>
                <textarea required name="customer_address" value={formData.customer_address} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#C5A059] transition-colors"></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#C5A059] text-white py-4 px-4 text-sm font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:bg-gray-400 mt-4">
                {loading ? 'PROCESSING...' : `PLACE ORDER - $${calculateTotal().toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-[#111111] p-8 rounded-sm shadow-xl border border-[#D4AF37]/30 sticky top-28">
              <h2 className="text-xl font-serif text-[#D4AF37] mb-6 border-b border-gray-800 pb-4 tracking-widest">YOUR ORDER</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 font-light">{item.quantity} x {item.name}</span>
                    <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-800 pt-4 flex justify-between font-medium text-xl text-[#D4AF37]">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}