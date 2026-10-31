import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await API.get('/reviews/admin');
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await API.put(`/reviews/${id}/approve`, { is_approved: currentStatus ? 0 : 1 });
      fetchReviews();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await API.delete(`/reviews/${id}`);
        fetchReviews();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white tracking-widest uppercase">Customer Reviews</h1>
        <p className="text-gray-500 font-light mt-1">Approve or delete reviews submitted by customers.</p>
      </div>

      <div className="bg-[#111111] rounded-sm border border-[#D4AF37]/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
              <th className="p-6 font-medium">Customer</th>
              <th className="p-6 font-medium">Rating</th>
              <th className="p-6 font-medium">Comment</th>
              <th className="p-6 font-medium">Status</th>
              <th className="p-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-[#D4AF37]">Loading reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-light">No reviews found.</td></tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-6 font-medium text-gray-200">{review.customer_name}</td>
                  <td className="p-6 text-[#D4AF37]">{'★'.repeat(review.rating)}</td>
                  <td className="p-6 text-gray-400 max-w-xs truncate">{review.comment}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 border rounded-sm text-xs font-bold uppercase tracking-wider ${
                      review.is_approved 
                        ? 'text-green-400 border-green-400/30 bg-green-400/10' 
                        : 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10'
                    }`}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-6 space-x-4">
                    <button 
                      onClick={() => handleToggleApproval(review.id, review.is_approved)} 
                      className={`text-sm font-medium transition-colors ${
                        review.is_approved 
                          ? 'text-yellow-500 hover:text-yellow-400' 
                          : 'text-green-400 hover:text-green-300'
                      }`}
                    >
                      {review.is_approved ? 'Unapprove' : 'Approve'}
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)} 
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}