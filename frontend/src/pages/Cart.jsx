import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-4xl font-serif tracking-widest text-black mb-12 text-center">YOUR COLLECTION</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-16 rounded-sm shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
            <div className="text-4xl mb-6">🛍️</div>
            <p className="text-gray-500 mb-8 font-light tracking-wide text-lg">Your shopping bag is currently empty.</p>
            <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#C5A059] transition-colors">
              Discover The Collection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                  <img 
                    src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/100'} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-sm border border-gray-100"
                  />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-serif text-black text-xl mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm">${Number(item.price).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-3 border border-gray-200 rounded-sm p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 text-gray-500 hover:text-black transition-colors">-</button>
                    <span className="w-8 text-center text-black font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 text-gray-500 hover:text-black transition-colors">+</button>
                  </div>

                  <div className="font-serif text-xl text-black w-24 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-96">
              <div className="bg-[#111111] p-8 rounded-sm shadow-xl border border-[#D4AF37]/30 sticky top-28 text-white">
                <h2 className="text-xl font-serif text-[#D4AF37] mb-6 border-b border-gray-800 pb-4 tracking-widest">ORDER SUMMARY</h2>
                <div className="flex justify-between mb-3 text-gray-400 font-light">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6 text-gray-400 font-light">
                  <span>Shipping</span>
                  <span className="text-[#D4AF37]">Complimentary</span>
                </div>
                <div className="border-t border-gray-800 pt-6 flex justify-between font-medium text-xl text-[#D4AF37] mb-8">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#D4AF37] text-black py-4 px-4 text-sm font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}