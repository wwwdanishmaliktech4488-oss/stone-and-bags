import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Marquee from '../components/Marquee';

export default function Home() {
  const [page, setPage] = useState({ title: '', content: '' });
  const [products, setProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#shop') {
      const element = document.getElementById('shop');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, prodRes, heroRes, revRes] = await Promise.all([
          API.get('/pages/home'),
          API.get('/products'),
          API.get('/hero'),
          API.get('/reviews')
        ]);
        setPage(pageRes.data);
        setProducts(prodRes.data.filter(p => p.is_active === 1).slice(0, 6));
        setHeroSlides(heroRes.data);
        setReviews(revRes.data.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(interval);
  }, [heroSlides]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#D4AF37] font-serif tracking-widest text-2xl">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Marquee />
      <Navbar />
      
      {/* Hero Slider */}
      <div className="relative w-full h-[400px] md:h-[600px] bg-[#050505] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={`http://localhost:5000${slide.desktop_image}`} className="hidden md:block w-full h-full object-cover" alt="Hero" />
            <img src={`http://localhost:5000${slide.mobile_image}`} className="block md:hidden w-full h-full object-cover" alt="Hero Mobile" />
          </div>
        ))}
      </div>

      <div className="flex-grow max-w-7xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-serif text-[#D4AF37] tracking-widest mb-4">{page.title}</h1>
          <p className="text-gray-400 font-light text-sm md:text-lg whitespace-pre-wrap">{page.content}</p>
        </div>

        <div id="shop" className="scroll-mt-24 mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 border-b border-[#D4AF37]/30 pb-4 gap-4">
            <h2 className="text-xl md:text-2xl font-serif text-white tracking-widest text-center md:text-left">FEATURED COLLECTION</h2>
            <Link to="/shop" className="text-xs md:text-sm text-[#D4AF37] hover:text-white font-medium tracking-wider uppercase transition-colors">
              View All Products &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="md:!grid-cols-3 md:!gap-6">
            {products.map((product) => {
              const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
              const discountPercent = hasDiscount 
                ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100) 
                : 0;

              return (
                <div key={product.id} className="group bg-[#111111] rounded-xl border border-[#D4AF37]/20 overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-2xl transition-all duration-300 flex flex-col relative">
                  
                  {/* FIXED BADGES - Gold for discount, Red for Sale */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 right-2 flex justify-between z-10">
                      <span className="bg-[#D4AF37] text-black text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">★ -{discountPercent}%</span>
                      <span className="bg-[#7a1a24] text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">Sale</span>
                    </div>
                  )}

                  <Link to={`/product/${product.id}`} className="w-full aspect-[4/3] bg-[#050505] overflow-hidden block">
                    <img src={`http://localhost:5000${product.image_url}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  
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
        </div>
      </div>
      
      <WhatsAppButton />
      <Footer />
    </div>
  );
}