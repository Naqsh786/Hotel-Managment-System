import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Loader2, Search,
  User, AlertTriangle, Zap, Coffee, Car
} from 'lucide-react';
import { fetchAllServiceRequests, updateServiceStatus } from '../../Features/serviceRequestSlice';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const ComplaintsApprovals = () => {
   const dispatch = useDispatch();
   const location = useLocation();
   const navigate = useNavigate();
   const { user } = useSelector(state => state.auth);
   const { requests, loading } = useSelector(state => state.serviceRequests);
   const isSecurity = user?.responsibility === 'Security';
   const [searchTerm, setSearchTerm] = useState('');
   const { toast } = useToast();
   const [confirmAction, setConfirmAction] = useState({ open: false, id: null, status: '' });
   
   const activeTab = location.pathname.includes('complaints') ? 'complaints' : 'approvals';

   useEffect(() => {
      dispatch(fetchAllServiceRequests());
   }, [dispatch]);

   const handleStatusChange = (id, newStatus) => {
      setConfirmAction({ open: true, id, status: newStatus });
   };


   // Separate Maintenance requests -> Complaints page
   const complaintsList = requests.filter(r => r.type === 'Maintenance');
   // Separate General Services -> Approvals page
   const approvalsList = requests.filter(r => r.type !== 'Maintenance');

   const filteredList = (activeTab === 'complaints' ? complaintsList : approvalsList).filter(r => 
     r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     r.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.room?.name?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const getIcon = (type) => {
      switch(type) {
         case 'Maintenance': return <Wrench size={20} />;
         case 'Food': return <Coffee size={20} />;
         case 'Transport': return <Car size={20} />;
         default: return <Zap size={20} />;
      }
   };

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
             {/* Page Header */}
             <header className="dashboard-header m-b-40">
                <div className="flex-col">
                   <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                      <span style={{ padding: '4px 12px', background: isSecurity ? 'rgba(223, 169, 116, 0.1)' : 'rgba(14, 165, 233, 0.1)', color: isSecurity ? '#dfa974' : '#0ea5e9', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{isSecurity ? 'Tactical Unit' : 'Operational Center'}</span>
                   </div>
                   <h1 className="serif dashboard-title" style={{ color: 'var(--admin-text)' }}>{isSecurity ? 'Security Incident Log' : 'Resolution Hub'}</h1>
                   <p className="dashboard-subtitle text-muted" style={{fontSize: '13px'}}>Manage guest requests, maintenance flags, and site incidents.</p>
                </div>
                
                <div className="dashboard-actions">
                   <div className="flex gap-10 p-5" style={{ background: 'var(--admin-sidebar)', borderRadius: '14px', border: '1px solid var(--admin-border)', width: 'fit-content' }}>
                      <button onClick={() => navigate('/staff/complaints')} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: activeTab === 'complaints' ? 'white' : 'transparent', color: activeTab === 'complaints' ? '#1e293b' : 'var(--admin-text-muted)', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: '0.3s', boxShadow: activeTab === 'complaints' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>Complaints</button>
                      <button onClick={() => navigate('/staff/approvals')} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: activeTab === 'approvals' ? 'white' : 'transparent', color: activeTab === 'approvals' ? '#1e293b' : 'var(--admin-text-muted)', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: '0.3s', boxShadow: activeTab === 'approvals' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>Approvals</button>
                   </div>
                   <div className="admin-search-bar" style={{ flex: 1 }}>
                      <Search size={16} color="var(--admin-text-muted)" />
                      <input 
                         type="text" 
                         placeholder={`Search...`} 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                </div>
             </header>

            <AnimatePresence mode="wait">
               {activeTab === 'complaints' ? (
                  <motion.div 
                     key="complaints" 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     exit={{ opacity: 0, y: -20 }}
                     className="grid-2" 
                     style={{ gap: '20px' }}
                  >
                     {loading ? (
                        <div className="span-2 flex-center p-40" style={{ gridColumn: 'span 2' }}>
                           <Loader2 className="animate-spin" color="#0ea5e9" size={32} />
                        </div>
                     ) : filteredList.length === 0 ? (
                        <div className="span-2 p-40 text-center" style={{ gridColumn: 'span 2', background: 'var(--admin-bg)', borderRadius: '20px', border: '1px dashed var(--admin-border)' }}>
                           <AlertTriangle size={32} color="var(--admin-text-muted)" style={{marginBottom: '15px'}} />
                           <p style={{ color: 'var(--admin-text-muted)', fontWeight: '700' }}>No active maintenance complaints.</p>
                        </div>
                     ) : (
                        filteredList.map((c, idx) => (
                           <motion.div 
                              key={c._id} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="premium-card" 
                              style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: `4px solid ${c.status === 'Pending' ? '#f59e0b' : c.status === 'Completed' ? '#10b981' : '#ef4444'}`, padding: '25px' }}
                           >
                              <div className="flex-between">
                                 <div className="flex gap-15">
                                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', color: '#ef4444' }}><Wrench size={22} /></div>
                                    <div className="flex-col gap-2">
                                       <h4 style={{ fontWeight: '800', color: 'var(--admin-text)', fontSize: '16px' }}>Room {c.roomName || c.room?.name || 'N/A'}</h4>
                                       <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><User size={12}/> {c.user?.name || 'Guest'}</p>
                                    </div>
                                 </div>
                                 <span style={{ 
                                    padding: '6px 14px', 
                                    borderRadius: '20px', 
                                    fontSize: '10px', 
                                    fontWeight: '900', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    background: c.status === 'Completed' ? '#ecfdf5' : c.status === 'Cancelled' ? '#fee2e2' : '#fff7ed',
                                    color: c.status === 'Completed' ? '#10b981' : c.status === 'Cancelled' ? '#ef4444' : '#f59e0b',
                                    border: `1px solid ${c.status === 'Completed' ? '#10b98120' : c.status === 'Cancelled' ? '#ef444420' : '#f59e0b20'}`
                                 }}>
                                    {c.status}
                                 </span>
                              </div>
                              
                              <div style={{ padding: '15px', background: 'var(--admin-bg)', borderRadius: '14px', border: '1px solid var(--admin-border)', fontSize: '13px', color: 'var(--admin-text)', lineHeight: '1.6' }}>
                                 {c.notes || 'Routine maintenance request flagged by guest.'}
                              </div>

                              <div className="flex-between" style={{ alignItems: 'center' }}>
                                 <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Flagged: {new Date(c.createdAt).toLocaleDateString()}</span>
                                 <div className="flex gap-10">
                                    {c.status === 'Pending' ? (
                                       <>
                                          <button onClick={() => handleStatusChange(c._id, 'Completed')} className="btn-sona-primary" style={{ padding: '8px 18px', background: '#10b981', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '12px' }}>Resolve Issue</button>
                                          <button onClick={() => handleStatusChange(c._id, 'Cancelled')} style={{ padding: '8px 18px', background: 'var(--admin-sidebar)', color: '#ef4444', borderRadius: '10px', border: '1px solid #ef444440', fontWeight: '800', fontSize: '12px' }}>Deny</button>
                                       </>
                                    ) : (
                                       <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>Archived</span>
                                    )}
                                 </div>
                              </div>
                           </motion.div>
                        ))
                     )}
                  </motion.div>
               ) : (
                  <motion.div 
                     key="approvals" 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     exit={{ opacity: 0, y: -20 }}
                     className="premium-card" 
                     style={{ padding: '0', overflow: 'hidden' }}
                  >
                     <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="serif" style={{ fontSize: '20px', color: 'var(--admin-text)' }}>Requested Services</h3>
                        <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '800' }}>{approvalsList.length} Total Requests</span>
                     </div>
                      <div className="premium-table-wrapper">
                         <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                           <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
                              <tr>
                                 <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Service Type</th>
                                 <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Guest & Room</th>
                                 <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Details</th>
                                 <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Status</th>
                                 <th style={{ padding: '20px 30px', textAlign: 'right', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Operations</th>
                              </tr>
                           </thead>
                           <tbody>
                              {loading ? (
                                 <tr><td colSpan="5" className="text-center" style={{ padding: '40px' }}><Loader2 className="animate-spin m-auto" color="#0ea5e9" /></td></tr>
                               ) : filteredList.length === 0 ? (
                                 <tr><td colSpan="5" className="text-center" style={{ padding: '40px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>No pending approvals.</td></tr>
                               ) : filteredList.map((r, idx) => (
                                 <motion.tr 
                                    key={r._id} 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ borderBottom: '1px solid var(--admin-border)' }}
                                 >
                                    <td style={{ padding: '20px 30px' }}>
                                       <div className="flex gap-12 items-center">
                                          <div style={{ padding: '8px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '10px', color: '#0ea5e9' }}>{getIcon(r.type)}</div>
                                          <span style={{ fontWeight: '800', color: 'var(--admin-text)', fontSize: '13px' }}>{r.type}</span>
                                       </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                       <div className="flex-col gap-2">
                                          <span style={{ fontWeight: '700', color: 'var(--admin-text)', fontSize: '13px' }}>{r.user?.name || 'Guest'}</span>
                                          <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: '800' }}>Room {r.roomName || r.room?.name || 'N/A'}</span>
                                       </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                       <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.notes || 'No specific requests.'}</p>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                       <span style={{ 
                                          padding: '5px 12px', 
                                          borderRadius: '16px', 
                                          fontSize: '10px', 
                                          fontWeight: '900', 
                                          textTransform: 'uppercase',
                                          background: r.status === 'Completed' ? '#ecfdf5' : r.status === 'Cancelled' ? '#fee2e2' : '#fff7ed',
                                          color: r.status === 'Completed' ? '#10b981' : r.status === 'Cancelled' ? '#ef4444' : '#f97316'
                                       }}>
                                          {r.status === 'Completed' ? 'Approved' : r.status === 'Cancelled' ? 'Denied' : r.status}
                                       </span>
                                    </td>
                                    <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                       {r.status === 'Pending' ? (
                                          <div className="flex gap-10 justify-end">
                                             <button onClick={() => handleStatusChange(r._id, 'Completed')} className="hover-lift" style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>Approve</button>
                                             <button onClick={() => handleStatusChange(r._id, 'Cancelled')} className="hover-lift" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: '#ef4444', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>Deny</button>
                                          </div>
                                       ) : (
                                          <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900' }}>COMPLETED</span>
                                       )}
                                    </td>
                                 </motion.tr>
                              ))}
                           </tbody>
                         </table>
                      </div>
                  </motion.div>
               )}
            </AnimatePresence>
          <ConfirmModal 
            isOpen={confirmAction.open}
            title={`${confirmAction.status === 'Completed' ? 'Approve' : 'Deny'} Request`}
            message={`Are you sure you want to mark this service request as ${confirmAction.status === 'Completed' ? 'resolved' : 'denied'}?`}
            onCancel={() => setConfirmAction({ open: false, id: null, status: '' })}
            onConfirm={async () => {
               try {
                  await dispatch(updateServiceStatus({ id: confirmAction.id, status: confirmAction.status })).unwrap();
                  toast.success("Status Updated", `Request has been successfully ${confirmAction.status === 'Completed' ? 'processed' : 'cancelled'}.`);
               } catch (err) {
                  toast.error("Update Failed", err || "Could not update service status.");
               } finally {
                  setConfirmAction({ open: false, id: null, status: '' });
               }
            }}
          />
       </div>
    </div>
 );
};

export default ComplaintsApprovals;
