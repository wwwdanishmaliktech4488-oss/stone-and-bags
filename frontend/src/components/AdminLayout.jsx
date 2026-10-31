import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const [logo, setLogo] = useState('/logo.png');

  useEffect(() => {
    API.get('/settings').then(res => {
      if (res.data.site_logo) setLogo(`http://localhost:5000${res.data.site_logo}`);
    }).catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { path: '/admin/pages', label: 'Pages', icon: '📝' },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] font-sans">
      <aside className="w-64 bg-[#111111] border-r border-[#D4AF37]/20 flex flex-col">
        
        {/* LOGO - Made larger h-20 */}
        <div className="h-28 flex items-center justify-center px-4 border-b border-[#D4AF37]/20">
          <Link to="/admin/dashboard">
            <img 
              src={logo} 
              alt="Al Najwah" 
              className="h-20 w-auto object-contain" 
              onError={(e) => { e.target.src = '/logo.png'; }}
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${location.pathname === item.path ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37] font-medium' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200'}`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 bg-red-900/10 rounded-sm hover:bg-red-900/30 transition-colors text-sm font-medium uppercase tracking-wider">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-[#111111] border-b border-[#D4AF37]/20 flex items-center justify-between px-8">
          <h2 className="text-lg font-serif text-gray-200 tracking-widest uppercase">{location.pathname.split('/').pop().replace('-', ' ')}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Admin:</span>
            <span className="font-medium text-[#D4AF37]">{adminName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">{children}</main>
      </div>
    </div>
  );
}