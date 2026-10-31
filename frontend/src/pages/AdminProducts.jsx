import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discount_price: '', category: 'stones', stock: '', is_active: 1,
  });
  const [image, setImage] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) { console.error(error); }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', discount_price: '', category: 'stones', stock: '', is_active: 1 });
    setImage(null); setEditingId(null); setShowForm(false);
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name, description: product.description || '', price: product.price,
      discount_price: product.discount_price || '', category: product.category, stock: product.stock, is_active: product.is_active,
    });
    setEditingId(product.id); setShowForm(true); window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('discount_price', formData.discount_price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('is_active', formData.is_active);
    if (image) data.append('image', image);

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage({ type: 'success', text: 'Product updated!' });
      } else {
        await API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage({ type: 'success', text: 'Product added!' });
      }
      resetForm(); fetchProducts();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save product.' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try { await API.delete(`/products/${id}`); fetchProducts(); } 
      catch (error) { alert('Failed to delete product'); }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white tracking-widest uppercase">Products</h1>
          <p className="text-gray-500 font-light mt-1">Manage your inventory.</p>
        </div>
        <button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} className="bg-[#D4AF37] hover:bg-yellow-600 text-black px-6 py-2 rounded-sm font-bold uppercase tracking-wider transition-colors">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {message.text && <div className={`p-4 mb-6 rounded-sm text-sm border ${message.type === 'success' ? 'bg-green-900/20 border-green-500/50 text-green-400' : 'bg-red-900/20 border-red-500/50 text-red-400'}`}>{message.text}</div>}

      {showForm && (
        <div className="bg-[#111111] p-6 rounded-sm border border-[#D4AF37]/30 mb-8">
          <h2 className="text-lg font-serif text-[#D4AF37] mb-6 tracking-widest uppercase">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Original Price ($)</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#D4AF37] uppercase tracking-wider mb-2">Sale Price ($)</label>
                  <input type="number" step="0.01" name="discount_price" value={formData.discount_price} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-[#D4AF37]/50 text-[#D4AF37] p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="Leave empty for no sale" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]">
                  <option value="stones">Stones</option>
                  <option value="bags">Bags</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Stock Quantity</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white p-3 focus:outline-none focus:border-[#D4AF37]" rows="3"></textarea>
            </div>
            <div className="mb-8">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Product Image {editingId && '(Leave blank to keep current)'}</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-400 p-2" />
            </div>
            <button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-yellow-600 text-black px-8 py-3 rounded-sm font-bold uppercase tracking-wider transition-colors disabled:bg-gray-700">
              {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
            </button>
          </form>
        </div>
      )}

      <div className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
              <th className="p-6 font-medium">Image</th>
              <th className="p-6 font-medium">Product Name</th>
              <th className="p-6 font-medium">Price</th>
              <th className="p-6 font-medium">Stock</th>
              <th className="p-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                <td className="p-6">
                  {product.image_url ? <img src={`http://localhost:5000${product.image_url}`} alt={product.name} className="w-12 h-12 object-cover rounded-sm border border-gray-700" /> : <div className="w-12 h-12 bg-gray-800 rounded-sm" />}
                </td>
                <td className="p-6 font-medium text-gray-200">{product.name}</td>
                <td className="p-6">
                  {product.discount_price ? (
                    <div>
                      <span className="text-gray-500 line-through text-xs mr-2">${Number(product.price).toFixed(2)}</span>
                      <span className="text-[#D4AF37] font-medium">${Number(product.discount_price).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-white font-medium">${Number(product.price).toFixed(2)}</span>
                  )}
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 border rounded-sm text-xs font-bold ${product.stock > 0 ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-red-400 border-red-400/30 bg-red-400/10'}`}>{product.stock}</span>
                </td>
                <td className="p-6 space-x-4">
                  <button onClick={() => handleEditClick(product)} className="text-[#D4AF37] hover:text-yellow-500 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}