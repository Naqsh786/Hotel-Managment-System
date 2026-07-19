import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, Luggage, Loader2, CheckCircle, 
  Clock, MapPin, Sparkles
} from 'lucide-react';
import { fetchAllServiceRequests, updateServiceStatus } from '../../Features/serviceRequestSlice';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const RoomService = () => {
   const dispatch = useDispatch();
   const { requests, loading } = useSelector(state => state.serviceRequests);
   const { toast } = useToast();
   const [confirmModal, setConfirmModal] = useState({ open: false, id: null });

   useEffect(() => {
      dispatch(fetchAllServiceRequests());
      const interval = setInterval(() => dispatch(fetchAllServiceRequests()), 30000);
      return () => clearInterval(interval);
   }, [dispatch]);

   const handleComplete = (id) => {
      setConfirmModal({ open: true, id });
   };

   const activeRequests = requests.filter(r => r.status?.toLowerCase() === 'pending' || r.status?.toLowerCase() === 'in progress');

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            {/* Page Header */}
            <header className="flex-between m-b-40" style={{ alignItems: 'flex-start' }}>
               <div className="flex-col">
                  <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                     <div style={{ padding: '4px 12px', background: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Service Console</div>
                  </div>
                  <h1 className="serif" style={{ fontSize: '38px', color: 'var(--admin-text)' }}>Room Service Queue</h1>
               </div>
               
               <div className="flex gap-15 items-center">
                  <div className="flex-center gap-10" style={{ fontSize: '12px', color: '#ca8a04', background: 'rgba(234, 179, 8, 0.05)', padding: '10px 20px', borderRadius: '14px', border: '1px solid rgba(234, 179, 8, 0.1)' }}>
                     <motion.div 
                       animate={{ opacity: [1, 0.4, 1] }} 
                       transition={{ repeat: Infinity, duration: 2 }}
                       style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ca8a04' }}
                     ></motion.div>
                     <span style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Request Tracker</span>
                  </div>
               </div>
            </header>

            {loading && activeRequests.length === 0 ? (
               <div className="flex-center" style={{ height: '50vh' }}><Loader2 className="animate-spin" size={40} color="#ca8a04" /></div>
            ) : activeRequests.length === 0 ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-center" style={{ height: '60vh', flexDirection: 'column', textAlign: 'center' }}>
                  <div style={{ padding: '40px', background: 'var(--admin-bg)', borderRadius: '50%', marginBottom: '25px', border: '2px dashed var(--admin-border)' }}>
                     <Sparkles size={60} color="#10b981" opacity={0.3} />
                  </div>
                  <h3 className="serif" style={{ fontSize: '28px', color: 'var(--admin-text)' }}>Quiet Terminal</h3>
                  <p style={{ color: 'var(--admin-text-muted)', fontWeight: '600', maxWidth: '400px', marginTop: '10px' }}>Your service queue is clear. Guests are currently enjoying their stay without pending requests.</p>
               </motion.div>
            ) : (
               <div className="grid-2" style={{ gap: '25px' }}>
                  <AnimatePresence mode="popLayout">
                     {activeRequests.map((req, idx) => (
                        <motion.div 
                           key={req._id} 
                           layout
                           initial={{ opacity: 0, scale: 0.9 }} 
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ delay: idx * 0.05 }}
                           className="premium-card hover-lift" 
                           style={{ padding: '0', overflow: 'hidden', borderLeft: `6px solid ${req.type === 'Food' ? '#ca8a04' : '#0ea5e9'}` }}
                        >
                           <div style={{ padding: '30px' }}>
                              <div className="flex-between m-b-20">
                                 <div className="flex-center gap-15" style={{justifyContent: 'flex-start'}}>
                                    <div style={{ padding: '12px', background: req.type === 'Food' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(14, 165, 233, 0.1)', color: req.type === 'Food' ? '#ca8a04' : '#0ea5e9', borderRadius: '14px' }}>
                                       {req.type === 'Food' ? <Utensils size={22} /> : <Luggage size={22} />}
                                    </div>
                                    <div className="flex-col">
                                       <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>Service Call</span>
                                       <h4 style={{ fontWeight: '900', color: 'var(--admin-text)', fontSize: '20px' }}>Room {req.room?.name || 'N/A'}</h4>
                                    </div>
                                 </div>
                                 <div className="flex-col items-end">
                                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)', padding: '5px 15px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                                       {req.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                 </div>
                              </div>
                              
                              <div style={{ background: 'var(--admin-bg)', padding: '20px', borderRadius: '18px', border: '1px solid var(--admin-border)', marginBottom: '25px' }}>
                                 <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '600', lineHeight: '1.6' }}>
                                    {req.notes || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No specific instructions provided by guest.</span>}
                                 </p>
                              </div>

                              <div className="flex-between items-center">
                                 <div className="flex gap-15">
                                    <div className="flex items-center gap-6" style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>
                                       <Clock size={14} /> {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ width: '1px', height: '12px', background: 'var(--admin-border)' }}></div>
                                    <div className="flex items-center gap-6" style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>
                                       <MapPin size={14} /> Level {req.room?.floor || '1'}
                                    </div>
                                 </div>
                                 
                                 <button 
                                    onClick={() => handleComplete(req._id)} 
                                    className="hover-lift"
                                    style={{ padding: '12px 25px', borderRadius: '14px', border: 'none', background: '#1e293b', color: 'white', fontWeight: '900', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}
                                 >
                                    <CheckCircle size={16} /> Mark Fulfilled
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            )}

            <ConfirmModal 
               isOpen={confirmModal.open}
               title="Fulfill Request"
               message="Are you sure you want to mark this service request as fulfilled? This will remove it from the active queue."
               onCancel={() => setConfirmModal({ open: false, id: null })}
               onConfirm={() => {
                  dispatch(updateServiceStatus({ id: confirmModal.id, status: 'Completed' }));
                  toast.success("Service Fulfilled", "Request has been successfully processed and archived.");
                  setConfirmModal({ open: false, id: null });
               }}
            />
         </div>
      </div>
   );
};

export default RoomService;
