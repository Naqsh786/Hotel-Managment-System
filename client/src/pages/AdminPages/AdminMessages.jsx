import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminMessages, deleteMessage } from '../../Features/messageSlice';
import { Search, Loader2, Trash, Mail, ChevronLeft, ChevronRight, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { messages, totalMessages, totalPages, loading } = useSelector((state) => state.messages);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', action: null, type: 'confirm' });

  useEffect(() => {
    dispatch(fetchAdminMessages({ page, search }));
  }, [page, search, dispatch]);

  const handleDelete = (id) => {
    setConfirmModal({
      open: true,
      title: 'Delete Inquiry',
      message: 'Are you sure you want to permanently delete this inquiry? This cannot be undone.',
      type: 'confirm',
      action: () => {
        dispatch(deleteMessage(id))
          .unwrap()
          .then(() => toast.success("Deleted", "Inquiry removed successfully"))
          .catch(err => toast.error("Error", err));
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-main-content">
      <header className="admin-top-header">
         <div className="admin-search-bar" style={{ background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)' }}>
           <Search size={18} color="var(--admin-text-muted)" />
           <input 
             type="text" 
             placeholder="Search by name, email or subject..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', outline: 'none' }}
           />
         </div>
      </header>

      <div className="admin-dashboard-view">
        <div className="dashboard-header m-b-40 card-header-flex">
           <div className="flex-col">
              <h1 className="dashboard-title" style={{fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px'}}>Customer Inquiries</h1>
              <p className="dashboard-subtitle text-muted" style={{fontSize: '13px'}}>Manage all messages sent from the public contact form.</p>
           </div>
           <div className="dashboard-actions">
              <div style={{background: '#85f242', color: '#1a2e05', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <MessageSquareText size={18} /> {totalMessages} Total Messages
              </div>
           </div>
        </div>

        <div className="premium-card">
           <div className="premium-table-wrapper">
              <table className="premium-table">
              <thead>
                 <tr>
                    <th style={{paddingLeft: '20px'}}>Sender</th>
                    <th>Subject</th>
                    <th>Message Snippet</th>
                    <th>Date Received</th>
                    <th style={{textAlign: 'right', paddingRight: '20px'}}>Action</th>
                 </tr>
              </thead>
              <tbody>
                 {loading ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '50px'}}><Loader2 className="animate-spin" size={30} color="#85f242" /></td></tr>
                 ) : messages.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '50px', color: 'var(--admin-text-muted)'}}>No messages found.</td></tr>
                 ) : (
                    messages.map((msg) => (
                      <motion.tr key={msg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                         <td style={{paddingLeft: '20px'}}>
                            <div className="flex-col">
                               <span style={{fontWeight: '700', fontSize: '14px', color: 'var(--admin-text)'}}>{msg.name}</span>
                               <span style={{fontSize: '11px', color: 'var(--admin-text-muted)'}}>{msg.email}</span>
                            </div>
                         </td>
                         <td>
                            <span style={{fontWeight: '600', fontSize: '13px', color: 'var(--admin-text)'}}>{msg.subject}</span>
                         </td>
                         <td>
                            <p style={{fontSize: '12px', color: 'var(--admin-text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                               {msg.message}
                            </p>
                         </td>
                         <td>
                            <span style={{fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)'}}>{formatDate(msg.createdAt)}</span>
                         </td>
                         <td style={{textAlign: 'right', paddingRight: '20px'}}>
                            <div className="flex gap-10" style={{justifyContent: 'flex-end'}}>
                               <button 
                                 onClick={() => {
                                    setConfirmModal({
                                      open: true,
                                      title: `From: ${msg.name}`,
                                      message: msg.message,
                                      type: 'info',
                                      action: null
                                    });
                                 }}
                                 className="action-btn view"
                                 title="View Message"
                               >
                                  <Mail size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDelete(msg._id)} 
                                 className="action-btn delete"
                                 title="Delete Message"
                               >
                                  <Trash size={16} />
                               </button>
                            </div>
                         </td>
                      </motion.tr>
                    ))
                 )}
              </tbody>
           </table>

           {/* Pagination */}
           {totalPages > 1 && (
             <div className="flex-between" style={{marginTop: '30px', padding: '0 10px'}}>
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)} 
                  style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === 1 ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}
                >
                   <ChevronLeft size={16} /> Previous
                </button>
                <div className="flex gap-10">
                   {[...Array(totalPages)].map((_, i) => (
                     <button 
                       key={i} 
                       onClick={() => setPage(i + 1)} 
                       style={{width: '35px', height: '35px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: page === i + 1 ? '#85f242' : 'var(--admin-sidebar)', color: page === i + 1 ? '#1a2e05' : 'var(--admin-text)', fontWeight: '700', cursor: 'pointer'}}
                     >
                        {i + 1}
                     </button>
                   ))}
                </div>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(page + 1)} 
                  style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === totalPages ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}
                >
                   Next <ChevronRight size={16} />
                </button>
             </div>
           )}
        </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onCancel={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={() => {
          if (confirmModal.action) confirmModal.action();
          setConfirmModal({ ...confirmModal, open: false });
        }}
      />
    </div>
  );
};

export default AdminMessages;
