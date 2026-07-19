import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BedDouble, CheckCircle, AlertTriangle, RefreshCcw, 
  Search, Home, Layers
} from 'lucide-react';
import { fetchAllRooms, updateRoom } from '../../Features/roomSlice';
import CustomDropdown from '../../components/CustomDropdown';

const RoomStatusPage = () => {
   const dispatch = useDispatch();
   const { rooms, loading } = useSelector(state => state.rooms);
   const [search, setSearch] = useState('');
   const [filterMode, setFilterMode] = useState('All');

   useEffect(() => {
      dispatch(fetchAllRooms());
   }, [dispatch]);

   const handleStatusChange = (id, newStatus) => {
      const data = new FormData();
      data.append('status', newStatus);
      dispatch(updateRoom({ id, formData: data })).then(() => {
         dispatch(fetchAllRooms());
      });
   };

   const filteredRooms = (rooms || []).filter(r => {
      const matchesSearch = r.name?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterMode === 'All' || r.status?.toLowerCase() === filterMode.toLowerCase();
      return matchesSearch && matchesFilter;
   });

   const getStatusStyles = (status) => {
      const s = status?.toLowerCase();
      if (s === 'available') return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'AVAILABLE' };
      if (s === 'occupied' || s === 'booked') return { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', label: 'OCCUPIED' };
      if (s === 'maintenance') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'MAINTENANCE' };
      if (s === 'dirty' || s === 'cleaning') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'HOUSEKEEPING' };
      return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', label: s?.toUpperCase() || 'UNKNOWN' };
   };

   const capitalizeFirst = (s) => s ? s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : 'Available';

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            {/* Page Header */}
            <header className="dashboard-header m-b-40">
               <div className="flex-col">
                  <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                     <div style={{ padding: '4px 12px', background: 'rgba(0, 0, 0, 0.05)', color: 'var(--admin-text)', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Inventory Intelligence</div>
                  </div>
                  <h1 className="serif dashboard-title" style={{ color: 'var(--admin-text)' }}>Room State Control</h1>
                  <p className="dashboard-subtitle text-muted" style={{fontSize: '13px'}}>Monitor and update live availability across all suites.</p>
               </div>
               
               <div className="dashboard-actions">
                  <div className="admin-search-bar" style={{ flex: 1 }}>
                     <Search size={18} color="var(--admin-text-muted)" />
                     <input 
                        placeholder="Filter room..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                     />
                  </div>
                  <button onClick={() => dispatch(fetchAllRooms())} className="hover-lift" style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'white', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text)', cursor: 'pointer' }}>
                     <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                  </button>
               </div>
            </header>

            {/* Inventory Quick Stats */}
            <div className="grid-4" style={{ gap: '20px', marginBottom: '40px' }}>
               {[
                  { label: 'Available Keys', count: rooms.filter(r => r.status?.toLowerCase() === 'available').length, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle size={20}/> },
                  { label: 'Live Occupancy', count: rooms.filter(r => r.status?.toLowerCase() === 'occupied' || r.status?.toLowerCase() === 'booked').length, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', icon: <Home size={20}/> },
                  { label: 'In Maintenance', count: rooms.filter(r => r.status?.toLowerCase() === 'maintenance').length, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <AlertTriangle size={20}/> },
                  { label: 'Pending Cleaning', count: rooms.filter(r => r.status?.toLowerCase() === 'dirty' || r.status?.toLowerCase() === 'cleaning').length, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <Layers size={20}/> }
               ].map((stat, i) => (
                  <motion.div 
                     key={i} 
                     initial={{ opacity: 0, y: 15 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     transition={{ delay: i * 0.1 }}
                     className="premium-card flex items-center gap-15" 
                     style={{ padding: '25px', borderBottom: `3px solid ${stat.color}` }}
                  >
                     <div style={{ padding: '12px', background: stat.bg, color: stat.color, borderRadius: '12px' }}>{stat.icon}</div>
                     <div>
                        <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--admin-text)' }}>{stat.count}</h3>
                        <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Room Filters */}
            <div className="flex gap-10 m-b-30">
               {['All', 'Available', 'Occupied', 'Maintenance', 'Cleaning'].map(mode => (
                  <button 
                     key={mode} 
                     onClick={() => setFilterMode(mode)}
                     style={{ 
                        padding: '8px 18px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--admin-border)', 
                        background: filterMode === mode ? '#1e293b' : 'white', 
                        color: filterMode === mode ? 'white' : 'var(--admin-text-muted)', 
                        fontSize: '12px', 
                        fontWeight: '800', 
                        cursor: 'pointer',
                        transition: '0.2s'
                     }}
                  >
                     {mode}
                  </button>
               ))}
            </div>

            {/* Room Grid */}
            <div className="grid-3" style={{ gap: '24px' }}>
               <AnimatePresence mode="popLayout">
                  {filteredRooms.map((room, idx) => {
                     const style = getStatusStyles(room.status);
                     return (
                        <motion.div 
                           key={room._id} 
                           layout
                           initial={{ opacity: 0, scale: 0.95 }} 
                           animate={{ opacity: 1, scale: 1 }} 
                           exit={{ opacity: 0, scale: 0.9 }}
                           transition={{ duration: 0.2, delay: idx * 0.05 }}
                           className="premium-card" 
                           style={{ padding: '0', position: 'relative', zIndex: 1000 - idx }}
                        >
                           {/* Status Banner */}
                           <div style={{ background: style.bg, padding: '18px 25px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
                              <div className="flex gap-10 items-center">
                                 <div style={{ color: style.color }}><BedDouble size={20}/></div>
                                 <span style={{ fontWeight: '900', color: style.color, fontSize: '11px', letterSpacing: '1px' }}>{style.label}</span>
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--admin-text-muted)', background: 'var(--admin-bg)', padding: '3px 10px', borderRadius: '20px', border: '1px solid var(--admin-border)' }}>FL {room.floor || 1}</span>
                           </div>

                           <div style={{ padding: '25px' }}>
                              <div className="flex-between m-b-15">
                                 <div>
                                    <h3 style={{ fontWeight: '900', fontSize: '20px', color: 'var(--admin-text)', marginBottom: '4px' }}>{room.name}</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>{room.type} Suite</p>
                                 </div>
                                 <div className="flex-col items-end">
                                    <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--admin-text)' }}>${room.price}</span>
                                    <span style={{ fontSize: '10px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>per night</span>
                                 </div>
                              </div>

                              <div style={{ height: '1px', background: 'var(--admin-border)', margin: '20px 0' }}></div>

                              <div className="flex-col gap-15">
                                 <div className="flex-col gap-8">
                                    <label style={{ fontSize: '10px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Management Control</label>
                                    <CustomDropdown 
                                       options={['Available', 'Occupied', 'Maintenance', 'Cleaning', 'Booked']}
                                       value={capitalizeFirst(room.status) === 'Unavailable' ? 'Not Available' : capitalizeFirst(room.status)}
                                       onChange={(val) => handleStatusChange(room._id, val)}
                                    />
                                 </div>
                                 <button 
                                    className="hover-lift"
                                    onClick={() => window.location.href=`/rooms/${room._id}`} 
                                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: 'var(--admin-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', fontWeight: '900', transition: '0.2s' }}
                                 >
                                    <Search size={14} /> Full Room Audit
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     );
                  })}
               </AnimatePresence>
            </div>
         </div>
      </div>
   );
};

export default RoomStatusPage;
