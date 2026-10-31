import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Marquee from '../components/Marquee';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
    const finalPrice = hasDiscount ? product.discount_price : product.price;
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, price: finalPrice, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-serif text-2xl tracking-widest text-[#D4AF37]">LOADING...</div>;
  if (!product) return null;

  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  const discountPercent = hasDiscount 
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Marquee />
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="mb-8 text-[10px] md:text-xs text-gray-400 font-light tracking-widest uppercase flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <span className="text-gray-600">/</span>
          <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#D4AF37]">{product.name}</span>
        </div>

        <div className="bg-[#111111] rounded-xl border border-[#D4AF37]/20 overflow-hidden flex flex-col md:flex-row mb-12 relative">
          
          {hasDiscount && (
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10 md:right-auto md:w-1/2 md:pr-8">
              <span className="bg-[#D4AF37] text-black text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-sm">★ -{discountPercent}%</span>
              <span className="bg-[#7a1a24] text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-sm uppercase">Sale</span>
            </div>
          )}

          <div className="w-full md:w-1/2 bg-[#050505] flex items-center justify-center p-6 md:p-12">
            <img src={`http://localhost:5000${product.image_url}`} alt={product.name} className="w-full h-auto max-h-[400px] md:max-h-[600px] object-contain drop-shadow-2xl" />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
            <p className="text-[#D4AF37] text-[10px] md:text-xs tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="text-2xl md:text-4xl font-serif text-white mb-4 capitalize">{product.name}</h1>
            
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm line-through">PKR {Number(product.price).toFixed(0)}</span>
                  <span className="text-[#D4AF37] text-3xl md:text-4xl font-bold">PKR {Number(product.discount_price).toFixed(0)}</span>
                </div>
              ) : (
                <span className="text-white text-2xl md:text-3xl font-bold">PKR {Number(product.price).toFixed(0)}</span>
              )}
            </div>
            
            <div className="text-sm text-gray-400 mb-8 leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-700 rounded-full w-full sm:w-auto overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">-</button>
                <span className="px-4 py-3 font-medium w-12 text-center text-white bg-[#0a0a0a]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">+</button>
              </div>
              
              <button 
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`w-full sm:flex-1 py-3 px-6 text-xs md:text-sm font-bold tracking-widest uppercase rounded-full transition-colors border ${
                  product.stock === 0 
                  ? 'bg-gray-800 text-gray-500 border-transparent cursor-not-allowed' 
                  : 'bg-[#1a1a1a] text-white border-gray-700 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]'
                }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="text-xs md:text-sm text-gray-500 border-t border-[#D4AF37]/20 pt-6 space-y-2">
              <p>✓ Free complimentary shipping</p>
              <p>✓ Authentic premium quality</p>
            </div>
          </div>
        </div>
      </div>
      
      <WhatsAppButton />
      <Footer />
    </div>
  );
}