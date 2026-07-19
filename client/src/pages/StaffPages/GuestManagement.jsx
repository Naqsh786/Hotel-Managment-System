import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, 
  FileText,
  Mail,
  Calendar
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';
import { fetchAllBookings, updateBookingStatus } from '../../Features/bookingSlice';

const GuestManagement = () => {
   const dispatch = useDispatch();
   const { bookings, loading } = useSelector(state => state.bookings);
   const [search, setSearch] = useState('');
   const [activeFilter, setActiveFilter] = useState('All');
   const { toast } = useToast();
   const [confirmModal, setConfirmModal] = useState({ open: false, id: null, status: '' });

   useEffect(() => {
      dispatch(fetchAllBookings());
   }, [dispatch]);

   const handleStatusUpdate = (id, status) => {
      setConfirmModal({ open: true, id, status });
   };

   const filteredDetails = (bookings || []).filter(b => {
      const matchesSearch = b.name?.toLowerCase().includes(search.toLowerCase()) || 
                          b.email?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' || b.source?.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
   });

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            {/* Page Header */}
            <header className="dashboard-header m-b-40">
               <div className="flex-col">
                  <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                     <div style={{ padding: '4px 12px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Guest Intelligence</div>
                  </div>
                  <h1 className="serif dashboard-title" style={{ fontSize: '38px', color: 'var(--admin-text)' }}>Manifest & Identity</h1>
               </div>
               
               <div className="dashboard-actions">
                  <div className="admin-search-bar" style={{ width: '300px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)' }}>
                     <Search size={18} color="var(--admin-text-muted)" />
                     <input 
                        placeholder="Search guest record..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', outline: 'none' }}
                     />
                  </div>
               </div>
            </header>

            {/* List Controls */}
            <div className="flex-between m-b-30">
               <div className="flex gap-10">
                  {['All', 'Online', 'Walk-in'].map(f => (
                     <button 
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        style={{ 
                           padding: '8px 18px', 
                           borderRadius: '12px', 
                           border: '1px solid var(--admin-border)', 
                           background: activeFilter === f ? '#1e293b' : 'white', 
                           color: activeFilter === f ? 'white' : 'var(--admin-text-muted)', 
                           fontSize: '12px', 
                           fontWeight: '800', 
                           cursor: 'pointer',
                           transition: '0.2s'
                        }}
                     >
                        {f}
                     </button>
                  ))}
               </div>
               <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>
                  Showing {filteredDetails.length} guest records
               </div>
            </div>

            {/* Guest Table */}
            <div className="premium-card">
               <div className="premium-table-wrapper">
                  <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <thead style={{ background: 'var(--admin-bg)' }}>
                        <tr>
                            <th style={{ padding: '20px 25px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '900' }}>Guest Identity</th>
                            <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '900' }}>Registry & Room</th>
                            <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '900' }}>Schedule</th>
                            <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '900' }}>Channel</th>
                            <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '900' }}>Finance</th>
                            <th style={{ padding: '20px 25px', textAlign: 'right', fontSize: '11px', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '900' }}>Verification</th>
                        </tr>
                     </thead>
                     <tbody>
                        <AnimatePresence mode="popLayout">
                           {filteredDetails.map((b, idx) => (
                              <motion.tr 
                                 key={b._id} 
                                 layout
                                 initial={{ opacity: 0 }} 
                                 animate={{ opacity: 1 }}
                                 transition={{ delay: idx * 0.05 }}
                                 style={{ borderBottom: '1px solid var(--admin-border)', transition: '0.2s' }}
                                 className="hover-lift"
                              >
                                 <td style={{ padding: '20px 25px' }}>
                                    <div className="flex gap-15 items-center">
                                       <div style={{ width: '45px', height: '45px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#0ea5e9' }}>
                                          {b.name?.[0].toUpperCase()}
                                       </div>
                                       <div className="flex-col">
                                          <div style={{ fontWeight: '800', color: 'var(--admin-text)', fontSize: '14px' }}>{b.name}</div>
                                          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={10}/> {b.email}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td style={{ padding: '20px' }}>
                                    <div className="flex-col">
                                       <div style={{ fontWeight: '800', color: '#0ea5e9', fontSize: '13px' }}>{b.roomName || b.room?.name || 'FRONT DESK'}</div>
                                       <div style={{ fontSize: '10px', color: 'var(--admin-text-muted)', fontWeight: '800' }}>ID: {b._id.slice(-6).toUpperCase()}</div>
                                    </div>
                                 </td>
                                 <td style={{ padding: '20px' }}>
                                     <div className="flex-col gap-4">
                                        <div className="flex items-center gap-6" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--admin-text)' }}>
                                           <Calendar size={12} color="var(--admin-text-muted)" /> {new Date(b.checkIn).toLocaleDateString()}
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--admin-text-muted)', fontWeight: '800' }}>CHECK-IN READY</div>
                                     </div>
                                 </td>
                                 <td>
                                    <span style={{ 
                                       padding: '5px 12px', 
                                       borderRadius: '15px', 
                                       fontSize: '10px', 
                                       fontWeight: '900', 
                                       textTransform: 'uppercase',
                                       background: b.source === 'walk-in' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(223, 169, 116, 0.05)',
                                       color: b.source === 'walk-in' ? '#10b981' : '#dfa974',
                                       border: `1px solid ${b.source === 'walk-in' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(223, 169, 116, 0.1)'}`
                                    }}>
                                       {b.source || 'ONLINE'}
                                    </span>
                                 </td>
                                 <td>
                                    <div className="flex-col">
                                       <span style={{ fontSize: '12px', fontWeight: '900', color: b.partialPayment ? '#f59e0b' : '#10b981' }}>
                                          {b.partialPayment ? 'PARTIAL FOLIO' : 'FOLIO SETTLED'}
                                       </span>
                                       <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>${b.totalPrice} TOTAL</span>
                                    </div>
                                 </td>
                                 <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                    <div className="flex gap-10 justify-end">
                                       {b.status === 'confirmed' && (
                                          <button onClick={() => handleStatusUpdate(b._id, 'checked-in')} className="hover-lift" style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: '900', fontSize: '11px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.2)' }}>CHECK-IN</button>
                                       )}
                                       {b.status === 'checked-in' && (
                                          <button onClick={() => handleStatusUpdate(b._id, 'completed')} className="hover-lift" style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontWeight: '900', fontSize: '11px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>CHECK-OUT</button>
                                       )}
                                       {b.status === 'completed' && (
                                          <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--admin-text-muted)', padding: '5px 12px', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>COMPLETED</span>
                                       )}
                                       <button className="hover-lift" style={{ padding: '8px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: 'var(--admin-text-muted)', cursor: 'pointer' }}><FileText size={16} /></button>
                                    </div>
                                 </td>
                              </motion.tr>
                           ))}
                        </AnimatePresence>
                     </tbody>
                  </table>
               </div>
            </div>
            <ConfirmModal 
               isOpen={confirmModal.open}
               title={`Confirm ${confirmModal.status?.replace('-', ' ')}`}
               message={`Are you sure you want to update this guest's status to ${confirmModal.status?.replace('-', ' ')}?`}
               onCancel={() => setConfirmModal({ open: false, id: null, status: '' })}
               onConfirm={async () => {
                  try {
                     await dispatch(updateBookingStatus({ id: confirmModal.id, status: confirmModal.status })).unwrap();
                     toast.success("Manifest Updated", `Guest status has been changed to ${confirmModal.status}.`);
                  } catch (err) {
                     toast.error("Operation Failed", err || "Could not update guest status.");
                  } finally {
                     setConfirmModal({ open: false, id: null, status: '' });
                  }
               }}
            />
         </div>
      </div>
   );
};

export default GuestManagement;
