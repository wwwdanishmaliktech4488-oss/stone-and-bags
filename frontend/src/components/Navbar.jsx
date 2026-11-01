import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [logo, setLogo] = useState('/logo.png');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/settings').then(res => {
      if (res.data.site_logo) {
        setLogo(res.data.site_logo.startsWith('http') ? res.data.site_logo : `https://stone-and-bags.vercel.app${res.data.site_logo}`);
      }
    }).catch(err => console.error(err));

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };
    
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <nav className="bg-[#0a0a0a] border-b border-[#D4AF37]/30 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24 items-center">
          
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AL NAJWAH" className="h-16 md:h-20 w-auto object-contain" onError={(e) => { e.target.src = '/logo.png'; }} />
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`font-medium tracking-widest uppercase text-xs transition-colors ${location.pathname === link.path ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-[#D4AF37]'}`}>
                {link.name}
              </Link>
            ))}
            
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-400 hover:text-[#D4AF37] transition-colors p-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-[#D4AF37] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#0a0a0a]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-400 hover:text-[#D4AF37] p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link to="/cart" className="relative p-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-[#0a0a0a]">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-[#D4AF37] p-2">
              {isMobileMenuOpen ? (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="bg-[#111111] border-t border-[#D4AF37]/20 p-4 absolute w-full shadow-lg z-40">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative flex items-center">
            <input type="text" placeholder="Search for stones, bags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 pl-10 focus:outline-none focus:border-[#D4AF37]" autoFocus />
            <svg className="w-5 h-5 text-gray-500 absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <button type="submit" className="absolute right-2 bg-[#D4AF37] text-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-yellow-600 transition-colors">Search</button>
          </form>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-[#D4AF37]/20">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`block px-4 py-3 text-sm font-medium tracking-widest uppercase rounded-sm transition-colors ${location.pathname === link.path ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200'}`}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}