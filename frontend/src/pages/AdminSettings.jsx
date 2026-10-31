import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api';

export default function AdminSettings() {
  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState({
    site_logo: '', contact_email: '', contact_phone: '', contact_address: '',
    social_facebook: '', social_instagram: '', social_twitter: '', social_tiktok: '',
    whatsapp_number: '', marquee_text: '', marquee_color: '#D4AF37'
  });
  
  const [logoImage, setLogoImage] = useState(null);
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSlides();
    fetchSettings();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await API.get('/hero');
      setSlides(response.data);
    } catch (error) { console.error('Error fetching hero slides:', error); }
  };

  const fetchSettings = async () => {
    try {
      const response = await API.get('/settings');
      setSettings({
        site_logo: response.data.site_logo || '',
        contact_email: response.data.contact_email || '',
        contact_phone: response.data.contact_phone || '',
        contact_address: response.data.contact_address || '',
        social_facebook: response.data.social_facebook || '',
        social_instagram: response.data.social_instagram || '',
        social_twitter: response.data.social_twitter || '',
        social_tiktok: response.data.social_tiktok || '',
        whatsapp_number: response.data.whatsapp_number || '',
        marquee_text: response.data.marquee_text || '',
        marquee_color: response.data.marquee_color || '#D4AF37'
      });
    } catch (error) { console.error('Error fetching settings:', error); }
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    if (!logoImage) return setMessage('Please select a logo image.');
    setLoading(true);
    const data = new FormData();
    data.append('site_logo', logoImage);
    try {
      await API.put('/settings', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Logo updated successfully!');
      setLogoImage(null);
      fetchSettings();
    } catch (error) { setMessage('Failed to update logo.'); } 
    finally { setLoading(false); }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.put('/settings', settings);
      setMessage('Settings updated!');
      fetchSettings();
    } catch (error) { setMessage('Failed to update settings.'); } 
    finally { setLoading(false); }
  };

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-widest uppercase">Website Settings</h1>
        <p className="text-gray-500 mt-1">Manage your logo, hero images, and contact info.</p>
      </div>

      {message && <div className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37] p-4 rounded-sm mb-6">{message}</div>}

      {/* LOGO SECTION */}
      <div className="bg-[#111111] p-6 rounded-sm border border-[#D4AF37]/30 mb-8">
        <h2 className="text-lg font-bold text-[#D4AF37] mb-4">Site Logo</h2>
        <form onSubmit={handleLogoSubmit} className="space-y-6">
          <div>
            {settings.site_logo ? (
              <img src={`http://localhost:5000${settings.site_logo}`} alt="Logo" className="h-20 object-contain bg-gray-900 p-2 border border-gray-800" />
            ) : <p className="text-gray-500 text-sm italic">No logo uploaded yet.</p>}
          </div>
          <div>
            <input type="file" accept="image/*" onChange={(e) => setLogoImage(e.target.files[0])} className="w-full border border-gray-800 bg-[#0a0a0a] text-white rounded-sm p-2" />
          </div>
          <button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-yellow-600 text-black px-6 py-2 rounded-sm font-bold uppercase tracking-wider transition-colors">
            {loading ? 'Saving...' : 'Update Logo'}
          </button>
        </form>
      </div>

      {/* MAIN SETTINGS SECTION */}
      <div className="bg-[#111111] p-6 rounded-sm border border-[#D4AF37]/30 mb-8">
        <h2 className="text-lg font-bold text-[#D4AF37] mb-4">Footer, Contact & WhatsApp</h2>
        <form onSubmit={handleSettingsSubmit} className="space-y-6">
          
          {/* MARQUEE SETTINGS */}
          <div className="bg-[#0a0a0a] p-4 border border-gray-800 rounded-sm">
            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Top Marquee Bar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Marquee Text</label>
                <input type="text" name="marquee_text" value={settings.marquee_text} onChange={handleSettingsChange} className="w-full border border-gray-800 bg-[#111111] text-white rounded-sm p-2 focus:border-[#D4AF37] focus:outline-none" placeholder="e.g. Free Delivery All Over Pakistan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input type="color" name="marquee_color" value={settings.marquee_color} onChange={handleSettingsChange} className="h-10 w-12 rounded cursor-pointer bg-transparent border border-gray-800" />
                  <input type="text" name="marquee_color" value={settings.marquee_color} onChange={handleSettingsChange} className="flex-1 border border-gray-800 bg-[#111111] text-white rounded-sm p-2" />
                </div>
              </div>
            </div>
          </div>

          {/* WHATSAPP SETTINGS */}
          <div className="bg-[#0a0a0a] p-4 border border-green-900/50 rounded-sm">
            <label className="block text-sm font-bold text-green-500 mb-2 uppercase tracking-wider">WhatsApp Number</label>
            <p className="text-xs text-gray-500 mb-2">Enter with country code, no spaces or plus sign. (e.g. 923001234567)</p>
            <input type="text" name="whatsapp_number" value={settings.whatsapp_number} onChange={handleSettingsChange} className="w-full border border-green-800 bg-[#111111] text-white rounded-sm p-2 focus:border-green-500 focus:outline-none" />
          </div>

          {/* CONTACT SETTINGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
              <input type="text" name="contact_email" value={settings.contact_email} onChange={handleSettingsChange} className="w-full border border-gray-800 bg-[#0a0a0a] text-white rounded-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contact Phone</label>
              <input type="text" name="contact_phone" value={settings.contact_phone} onChange={handleSettingsChange} className="w-full border border-gray-800 bg-[#0a0a0a] text-white rounded-sm p-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Physical Address</label>
              <input type="text" name="contact_address" value={settings.contact_address} onChange={handleSettingsChange} className="w-full border border-gray-800 bg-[#0a0a0a] text-white rounded-sm p-2" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-yellow-600 text-black px-6 py-2 rounded-sm font-bold uppercase tracking-wider transition-colors">
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}