import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviewsAdmin, deleteReview } from '../../Features/reviewSlice';
import { Search, Loader2, Star, Trash2, User, BedDouble } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomDropdown from '../../components/CustomDropdown';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const AdminReviews = () => {
  const dispatch = useDispatch();
  const { adminReviews, loading } = useSelector((state) => state.reviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Newest First');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchAllReviewsAdmin());
  }, [dispatch]);

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const filteredReviews = adminReviews.filter(r => 
    r.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.room?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortOption === 'Newest First') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortOption === 'Highest Rated') return (b.rating || 0) - (a.rating || 0);
    if (sortOption === 'Lowest Rated') return (a.rating || 0) - (b.rating || 0);
    return 0;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const displayedReviews = filteredReviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="admin-main-content">
      <div className="admin-dashboard-view">
        <div className="dashboard-header m-b-40" style={{ marginBottom: '40px' }}>
          <div className="flex-col">
            <h1 className="dashboard-title" style={{ fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px' }}>Guest Reviews</h1>
            <p className="dashboard-subtitle text-muted" style={{ fontSize: '13px' }}>Monitor and manage guest feedback for all rooms.</p>
          </div>
          
          <div className="dashboard-actions flex gap-10" style={{ alignItems: 'flex-end' }}>
            <div className="admin-search-bar" style={{ width: '250px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)' }}>
              <Search size={18} color="var(--admin-text-muted)" />
              <input 
                type="text" 
                placeholder="Search reviews..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', outline: 'none' }}
              />
            </div>
            <div style={{ width: '180px' }}>
              <CustomDropdown 
                options={['Newest First', 'Highest Rated', 'Lowest Rated']}
                value={sortOption}
                onChange={setSortOption}
                variant="admin"
              />
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="premium-table-wrapper">
            <table className="premium-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '20px' }}>Author</th>
                <th>Room</th>
                <th>Review & Rating</th>
                <th>Date</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}><Loader2 className="animate-spin" color="#85f242" /></td></tr>
              ) : displayedReviews.map((review, index) => (
                <motion.tr key={review._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                  <td style={{ padding: '15px 20px' }}>
                    <div className="flex-center gap-10" style={{justifyContent: 'flex-start'}}>
                       <div style={{width: '35px', height: '35px', borderRadius: '10px', background: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <User size={18} color="var(--admin-text-muted)" />
                       </div>
                       <div className="flex-col">
                          <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--admin-text)' }}>{review.user?.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--admin-text-muted)' }}>{review.user?.email}</span>
                       </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex-center gap-8" style={{justifyContent: 'flex-start', color: '#85f242', fontWeight: '700', fontSize: '13px'}}>
                       <BedDouble size={14} />
                       {review.room?.name || 'Unknown Room'}
                    </div>
                  </td>
                  <td>
                    <div className="flex-col gap-10">
                       <div className="flex gap-2">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={12} fill={i < review.rating ? "#85f242" : "none"} color={i < review.rating ? "#85f242" : "var(--admin-border)"} />
                          ))}
                       </div>
                       <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0, maxWidth: '300px', lineHeight: '1.4' }}>
                          &quot;{review.comment}&quot;
                       </p>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td style={{ paddingRight: '20px' }}>
                    <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleDelete(review._id)} 
                        className="action-btn delete"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredReviews.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No reviews collected yet.</div>
          )}

          {totalPages > 1 && (
             <div className="flex-between" style={{padding: '20px'}}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === 1 ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}>Previous</button>
                <div className="flex gap-10">
                   {[...Array(totalPages)].map((_, i) => (
                     <button key={i} onClick={() => setPage(i + 1)} style={{width: '35px', height: '35px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: page === i + 1 ? '#85f242' : 'var(--admin-sidebar)', color: page === i+1 ? '#1a2e05' : 'var(--admin-text)', fontWeight: '700', cursor: 'pointer'}}>{i + 1}</button>
                   ))}
                </div>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === totalPages ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}>Next</button>
             </div>
          )}
        </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Remove Review"
        message="Are you sure you want to remove this review permanently? This action cannot be undone."
        onCancel={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={() => {
          dispatch(deleteReview(confirmDelete.id))
            .unwrap()
            .then(() => toast.success("Deleted", "Review has been removed"))
            .catch((err) => toast.error("Error", err));
          setConfirmDelete({ open: false, id: null });
        }}
      />
    </div>
  );
};

export default AdminReviews;
