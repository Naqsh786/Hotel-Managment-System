import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, CalendarCheck, DoorOpen, 
  Search, Bell, UserCheck, Key, Loader2, ArrowUpRight, 
  Clock, Printer, Wallet, CheckCircle, Info, Activity, Shield
} from 'lucide-react';
import { fetchAllBookings, updateBookingStatus, resetBookingState } from '../../Features/bookingSlice';
import { fetchAllRooms } from '../../Features/roomSlice';
import CustomDropdown from '../../components/CustomDropdown';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const ReceptionistDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, loading: bookingsLoading, success } = useSelector(state => state.bookings);
  const { rooms, loading: roomsLoading } = useSelector(state => state.rooms);
  const [search, setSearch] = useState('');
  const [arrivalFilter, setArrivalFilter] = useState('All Arrivals');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', action: null });

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchAllRooms());
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
        clearInterval(timer);
        dispatch(resetBookingState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
        dispatch(fetchAllBookings());
        dispatch(fetchAllRooms());
        dispatch(resetBookingState());
    }
  }, [success, dispatch]);

  const loading = bookingsLoading || roomsLoading;

  const arrivals = bookings.filter(b => b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'pending');
  const inHouse = bookings.filter(b => b.status?.toLowerCase() === 'active' || b.status?.toLowerCase() === 'checked-in');
  
  const handleCheckIn = (id) => {
    setConfirmModal({
      open: true,
      title: 'Guest Check-In',
      message: 'Confirm guest check-in and issue digital room key?',
      action: () => {
        dispatch(updateBookingStatus({ id, status: 'checked-in' }))
          .unwrap()
          .then(() => toast.success("Checked-In", "Guest has been checked in successfully"))
          .catch(err => toast.error("Error", err));
      }
    });
  };

  const handleCheckOut = (id) => {
    setConfirmModal({
      open: true,
      title: 'Guest Check-Out',
      message: 'Complete check-out and settle billing folios?',
      action: () => {
        dispatch(updateBookingStatus({ id, status: 'completed' }))
          .unwrap()
          .then(() => toast.success("Checked-Out", "Guest folio has been settled and checked out"))
          .catch(err => toast.error("Error", err));
      }
    });
  };

  const filteredArrivals = arrivals.filter(b => {
    const matchesSearch = b.name?.toLowerCase().includes(search.toLowerCase()) || 
      b.roomName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      arrivalFilter === 'All Arrivals' ||
      (arrivalFilter === 'Confirmed' && b.status?.toLowerCase() === 'confirmed') ||
      (arrivalFilter === 'Pending' && b.status?.toLowerCase() === 'pending');
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Expected Arrivals', value: arrivals.length, icon: <CalendarCheck />, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
    { label: 'In-House Guests', value: inHouse.length, icon: <Key />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Pending Cleaning', value: rooms.filter(r => r.status?.toLowerCase() === 'dirty').length, icon: <Activity />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    { label: 'Available Keys', value: rooms.filter(r => r.status?.toLowerCase() === 'available').length, icon: <Shield />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  ];

  return (
    <div className="admin-main-content">
      <div className="admin-dashboard-view">
        
        {/* Dynamic Header */}
        <header className="m-b-40 dashboard-header card-header-flex" style={{ alignItems: 'flex-start' }}>
          <div className="flex-col">
            <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)' }}></div>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#0ea5e9', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Front Desk Intelligence Active</span>
            </div>
            <h1 className="serif dashboard-title" style={{ color: 'var(--admin-text)', lineHeight: '1' }}>Concierge Hub</h1>
            <p className="dashboard-subtitle" style={{ marginTop: '10px', color: 'var(--admin-text-muted)', fontWeight: '600', fontSize: '14px' }}>Welcome back, {user?.name}. Manage guest transitions and room states.</p>
          </div>
          
          <div className="flex gap-25 items-center dashboard-actions">
             <div className="flex-col items-end time-display" style={{ textAlign: 'right', background: 'var(--admin-sidebar)', padding: '10px 20px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--admin-text)', letterSpacing: '1px' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
             </div>
             <button 
               onClick={() => navigate('/staff/walk-in')}
               className="hover-lift action-btn-main"
               style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '18px', fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.3)' }}
             >
               <UserPlus size={20} /> Quick Walk-in
             </button>
          </div>
        </header>

        {/* High-Fidelity Stats */}
        <div className="grid-4 stats-grid" style={{ gap: '24px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: i * 0.1 }}
               className="premium-card hover-lift" 
               style={{ padding: '25px', borderBottom: `4px solid ${stat.color}` }}
            >
              <div className="flex-between m-b-20">
                <div style={{ padding: '12px', background: stat.bg, color: stat.color, borderRadius: '14px' }}>{stat.icon}</div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--admin-border)' }}>
                    <ArrowUpRight size={14} color="var(--admin-text-muted)" />
                </div>
              </div>
              <h3 style={{ fontSize: '36px', fontWeight: '900', color: 'var(--admin-text)', marginBottom: '4px' }}>{loading ? <Loader2 size={24} className="animate-spin" /> : (stat.value < 10 ? `0${stat.value}` : stat.value)}</h3>
              <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-grid-12">
          
          {/* Main Content Area */}
          <div className="span-8 flex-col gap-30">
            
            {/* Arrivals Pulse */}
            <div className="premium-card" style={{ padding: '0' }}>
               <div style={{ padding: '30px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--admin-bg)' }}>
                  <div className="flex gap-15 items-center">
                     <div style={{ padding: '10px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '12px' }}><CalendarCheck size={22}/></div>
                     <h3 className="serif" style={{ fontSize: '24px', color: 'var(--admin-text)' }}>Daily Arrivals Progress</h3>
                  </div>
                  <div className="flex gap-10 items-center">
                     <div style={{ width: '160px' }}>
                        <CustomDropdown
                           options={['All Arrivals', 'Confirmed', 'Pending']}
                           value={arrivalFilter}
                           onChange={setArrivalFilter}
                           variant="admin"
                        />
                     </div>
                     <div className="admin-search-bar">
                       <Search size={16} color="var(--admin-text-muted)" />
                       <input placeholder="Filter guest name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                     </div>
                  </div>
               </div>
               
               <div style={{ padding: '25px' }}>
                  <div className="flex-col gap-15">
                     <AnimatePresence mode="popLayout">
                        {loading ? (
                           <div className="flex-center p-60"><Loader2 className="animate-spin" color="#0ea5e9" size={40} /></div>
                        ) : filteredArrivals.length === 0 ? (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px', color: 'var(--admin-text-muted)', background: 'var(--admin-bg)', borderRadius: '25px', border: '2px dashed var(--admin-border)' }}>
                              <Clock size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
                              <h4 style={{ fontWeight: '800', color: 'var(--admin-text)', marginBottom: '5px' }}>Terminal Quiet</h4>
                              <p style={{ fontSize: '13px' }}>No guest arrivals currently in queue for this filter.</p>
                           </motion.div>
                        // eslint-disable-next-line unused-imports/no-unused-vars
                        ) : filteredArrivals.map((b, i) => (
                           <motion.div 
                               key={b._id} 
                               layout
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               className="flex-between p-25 hover-lift" 
                               style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--admin-border)', transition: '0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                           >
                              <div className="flex gap-20">
                                 <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', color: 'white', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '24px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
                                    {b.name?.[0].toUpperCase()}
                                 </div>
                                 <div className="flex-col gap-5">
                                    <h4 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--admin-text)' }}>{b.name}</h4>
                                    <div className="flex gap-15 items-center">
                                       <span style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: '900', background: 'rgba(14, 165, 233, 0.1)', padding: '4px 12px', borderRadius: '8px', letterSpacing: '0.5px' }}>{b.roomName || 'WAITING ASSIGNMENT'}</span>
                                       <div style={{ width: '1px', height: '12px', background: 'var(--admin-border)' }}></div>
                                       <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{b.guests} GUESTS • {b.extraServices?.length || 0} ADD-ONS</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-12">
                                 <button 
                                   onClick={() => handleCheckIn(b._id)}
                                   className="btn-sona-primary"
                                   style={{ padding: '12px 28px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 15px rgba(14, 165, 233, 0.2)', marginTop: '12px' }}
                                 >
                                    Perform Check-in
                                 </button>
                              </div>
                           </motion.div>
                        ))}
                     </AnimatePresence>
                  </div>
               </div>
            </div>

            {/* In-House Pulse */}
            <div className="premium-card" style={{ padding: '35px' }}>
                <div className="flex-between m-b-30">
                  <div className="flex gap-12 items-center">
                     <Activity size={24} color="#10b981" />
                     <h3 className="serif" style={{ fontSize: '24px', color: 'var(--admin-text)' }}>In-House Management</h3>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--admin-text-muted)', background: 'var(--admin-bg)', padding: '5px 15px', borderRadius: '15px' }}>{inHouse.length} ACTIVE FOLIOS</span>
                </div>
                
                <div className="grid-2" style={{ gap: '15px' }}>
                   {inHouse.slice(0, 6).map((b, i) => (
                       <motion.div 
                          key={b._id} 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex-between p-20" 
                          style={{ background: 'var(--admin-sidebar)', borderRadius: '18px', border: '1px solid var(--admin-border)', transition: '0.3s' }}
                       >
                          <div className="flex gap-15 items-center">
                             <div style={{ color: '#10b981', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}><UserCheck size={18}/></div>
                             <div>
                                <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--admin-text)' }}>{b.name.split(' ')[0]}</h4>
                                <p style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: '800' }}>Room {b.roomName || b.room?.name || 'N/A'}</p>
                             </div>
                          </div>
                          <button onClick={() => handleCheckOut(b._id)} className="hover-lift" style={{ color: '#ef4444', background: 'var(--admin-sidebar)', border: '1px solid #ef444440', padding: '8px 16px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>Settle Folio</button>
                       </motion.div>
                   ))}
                   {inHouse.length === 0 && <div className="span-2 text-center p-40" style={{ gridColumn: 'span 2', color: 'var(--admin-text-muted)', background: 'var(--admin-bg)', borderRadius: '20px', border: '1px dashed var(--admin-border)' }}>No guests currently in-house.</div>}
                </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="span-4 flex-col gap-30">
            
            {/* Reception Tools */}
            <div className="premium-card" style={{ padding: '35px', background: 'linear-gradient(135deg, white 0%, #f0f9ff 100%)', border: '1px solid #e0f2fe' }}>
               <h3 className="serif" style={{ fontSize: '22px', color: '#0369a1', marginBottom: '25px' }}>Terminal Operations</h3>
               <div className="grid-2" style={{ gap: '15px' }}>
                  {[
                     { label: 'Issue Digital Key', icon: <Key size={20}/>, color: '#f59e0b', path: '/staff/rooms' },
                     { label: 'Print Folio', icon: <Printer size={20}/>, color: '#0ea5e9', path: '/staff/billing' },
                     { label: 'Process Payment', icon: <Wallet size={20}/>, color: '#10b981', path: '/staff/billing' },
                     { label: 'Guest Messages', icon: <Bell size={20}/>, color: '#ef4444', path: '/staff/complaints' }
                  ].map((act, i) => (
                     <button 
                        key={i} 
                        onClick={() => navigate(act.path)}
                        style={{ padding: '25px 15px', background: 'white', border: '1px solid #e0f2fe', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)' }} 
                        className="hover-lift"
                     >
                        <div style={{ color: act.color, background: `${act.color}15`, padding: '12px', borderRadius: '16px' }}>{act.icon}</div>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{act.label}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Live Inventory Summary */}
            <div className="premium-card" style={{ padding: '35px' }}>
               <div className="flex-between m-b-30">
                  <h3 className="serif" style={{ fontSize: '22px', color: 'var(--admin-text)' }}>Room State</h3>
                  <button onClick={() => navigate('/staff/inventory')} className="hover-lift" style={{ padding: '6px 14px', fontSize: '11px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)', borderRadius: '10px', color: 'var(--admin-text)', fontWeight: '800' }}>Audit Inventory</button>
               </div>
               
               <div className="flex-col gap-12">
                  {[
                    { label: 'Pristine & Ready', count: rooms.filter(r => r.status?.toLowerCase() === 'available').length, color: '#10b981', icon: <CheckCircle size={18}/> },
                    { label: 'Currently In-Use', count: rooms.filter(r => r.status?.toLowerCase() === 'occupied' || r.status?.toLowerCase() === 'booked').length, color: '#0ea5e9', icon: <DoorOpen size={18}/> },
                    { label: 'Cleaning Dept.', count: rooms.filter(r => r.status?.toLowerCase() === 'dirty' || r.status?.toLowerCase() === 'cleaning').length, color: '#ef4444', icon: <Clock size={18}/> },
                    { label: 'Out of Registry', count: rooms.filter(r => r.status?.toLowerCase() === 'maintenance').length, color: '#94a3b8', icon: <Info size={18}/> }
                  ].map((item, i) => (
                      <div key={i} className="flex-between p-18" style={{ background: 'var(--admin-bg)', borderRadius: '18px', border: '1px solid var(--admin-border)' }}>
                         <div className="flex gap-12 items-center">
                            <span style={{ color: item.color, display: 'flex' }}>{item.icon}</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--admin-text)' }}>{item.label}</span>
                         </div>
                         <span style={{ fontWeight: '900', color: item.color, fontSize: '20px', letterSpacing: '-0.5px' }}>{item.count < 10 ? `0${item.count}` : item.count}</span>
                      </div>
                  ))}
               </div>
               
               <div style={{ marginTop: '30px', padding: '25px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>System Occupancy</p>
                  <div className="flex-center gap-15">
                     <h4 style={{ fontSize: '38px', fontWeight: '900', color: '#0ea5e9', margin: '0' }}>{rooms.length > 0 ? Math.round((rooms.filter(r => r.status?.toLowerCase() === 'occupied' || r.status?.toLowerCase() === 'booked').length / rooms.length) * 100) : 0}%</h4>
                     <div style={{ width: '1px', height: '30px', background: 'rgba(14, 165, 233, 0.2)' }}></div>
                     <div className="flex-col items-start">
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '900' }}>+4% Today</span>
                        <span style={{ fontSize: '10px', color: 'var(--admin-text-muted)', fontWeight: '600' }}>vs Yesterday</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>

        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onCancel={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal({ ...confirmModal, open: false });
        }}
      />
    </div>
  );
};

export default ReceptionistDashboard;
