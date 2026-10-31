import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Marquee from '../components/Marquee';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchFromUrl = queryParams.get('search');
    if (searchFromUrl) setSearchQuery(searchFromUrl);
  }, [location.search]);

  useEffect(() => {
    API.get('/products').then(res => {
      const active = res.data.filter(p => p.is_active === 1);
      setProducts(active); setFilteredProducts(active);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Marquee />
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-serif text-[#D4AF37] tracking-widest uppercase">All Collections</h1>
        </div>

        {loading ? (
          <div className="text-center text-[#D4AF37] py-20 font-serif tracking-widest text-xl">LOADING...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="md:!grid-cols-3 lg:!grid-cols-4 md:!gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
              const discountPercent = hasDiscount 
                ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100) 
                : 0;

              return (
                <div key={product.id} className="group bg-[#111111] rounded-xl border border-[#D4AF37]/20 overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-2xl transition-all duration-300 flex flex-col relative">
                  
                  {/* FIXED BADGES - Gold for discount, Red for Sale */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 right-2 flex justify-between z-10">
                      <span className="bg-[#D4AF37] text-black text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        ★ -{discountPercent}%
                      </span>
                      <span className="bg-[#7a1a24] text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                        Sale
                      </span>
                    </div>
                  )}

                  {/* SMALLER IMAGE BOX */}
                  <Link to={`/product/${product.id}`} className="w-full aspect-[4/3] bg-[#050505] overflow-hidden block">
                    <img 
                      src={`http://localhost:5000${product.image_url}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>
                  
                  {/* DETAILS */}
                  <div className="p-3 flex flex-col justify-between flex-grow bg-[#111111]">
                    <div>
                      <p className="text-[#D4AF37] text-[8px] font-bold tracking-wider uppercase mb-1">{product.category}</p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-xs md:text-sm font-serif text-white leading-tight mb-2 line-clamp-2">{product.name}</h3>
                      </Link>
                    </div>
                    
                    <div className="mt-auto">
                      {hasDiscount ? (
                        <div className="flex flex-col mb-2">
                          <span className="text-gray-500 text-[9px] md:text-[10px] line-through">PKR {Number(product.price).toFixed(0)}</span>
                          <span className="text-[#D4AF37] font-bold text-xs md:text-sm">PKR {Number(product.discount_price).toFixed(0)}</span>
                        </div>
                      ) : (
                        <div className="mb-2">
                          <span className="text-white font-bold text-xs md:text-sm">PKR {Number(product.price).toFixed(0)}</span>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => {
                          let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                          const existing = cart.find(item => item.id === product.id);
                          const finalPrice = hasDiscount ? product.discount_price : product.price;
                          if (existing) existing.quantity += 1;
                          else cart.push({ ...product, price: finalPrice, quantity: 1 });
                          localStorage.setItem('cart', JSON.stringify(cart));
                          window.dispatchEvent(new Event('cartUpdated'));
                        }}
                        className="w-full bg-[#1a1a1a] border border-gray-700 text-white py-1.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <WhatsAppButton />
      <Footer />
    </div>
  );
}