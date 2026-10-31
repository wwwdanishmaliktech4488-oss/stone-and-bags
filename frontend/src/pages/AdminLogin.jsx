import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState('/logo.png'); 
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/settings').then(res => {
      if (res.data.site_logo) setLogo(`http://localhost:5000${res.data.site_logo}`);
    }).catch(err => console.error(err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminName', response.data.admin.name);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
      
      <div className="relative z-10 max-w-md w-full bg-[#111111] border border-[#D4AF37]/30 rounded-sm shadow-2xl p-10 flex flex-col items-center">
        
        {/* LOGO - Made larger h-32 */}
        <Link to="/" className="mb-8 flex flex-col items-center">
          <img 
            src={logo} 
            alt="Al Najwah" 
            className="h-32 w-auto object-contain mb-4" 
            onError={(e) => { e.target.src = '/logo.png'; }}
          />
          <p className="text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase">Admin Portal</p>
        </Link>

        {error && <div className="w-full bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-sm mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="admin@alnajwah.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black py-3 px-4 text-sm font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors disabled:bg-gray-700 disabled:text-gray-400 mt-4">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}