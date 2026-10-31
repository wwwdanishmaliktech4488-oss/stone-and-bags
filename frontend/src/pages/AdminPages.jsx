import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api';

export default function AdminPages() {
  const [activeTab, setActiveTab] = useState('home');
  const [pages, setPages] = useState({
    home: { title: '', content: '' },
    about: { title: '', content: '' },
    track_order: { title: '', content: '' }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const [home, about, track] = await Promise.all([
        API.get('/pages/home'),
        API.get('/pages/about'),
        API.get('/pages/track_order')
      ]);
      setPages({ home: home.data, about: about.data, track_order: track.data });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.put(`/pages/${activeTab}`, pages[activeTab]);
      setMessage('Page updated successfully!');
    } catch (error) {
      setMessage('Failed to update page.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPages({ ...pages, [activeTab]: { ...pages[activeTab], [e.target.name]: e.target.value } });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-widest uppercase">Manage Pages</h1>
        <p className="text-gray-500 font-light mt-1">Customize the text content for your website pages.</p>
      </div>

      {message && <div className="bg-green-900/20 border border-green-500/50 text-green-400 p-4 rounded-sm mb-6">{message}</div>}

      <div className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-[#0a0a0a]">
          {['home', 'about', 'track_order'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab ? 'bg-[#111111] text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8">
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Page Title</label>
            <input 
              type="text" name="title" value={pages[activeTab].title} onChange={handleChange} 
              className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]" 
            />
          </div>
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Page Content</label>
            <textarea 
              name="content" value={pages[activeTab].content} onChange={handleChange} rows="8"
              className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]"
            ></textarea>
          </div>
          <button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-yellow-600 text-black px-8 py-3 rounded-sm font-bold uppercase tracking-wider transition-colors">
            {loading ? 'Saving...' : 'Save Page Content'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}