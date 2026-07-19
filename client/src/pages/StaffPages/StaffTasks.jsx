import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, CheckCircle2, Clock, Loader2, Utensils, Wrench, Bath, Activity, 
  ArrowRight, Zap, Info
} from 'lucide-react';
import { fetchAllRooms, updateRoom } from '../../Features/roomSlice';
import { fetchAllServiceRequests, updateServiceStatus } from '../../Features/serviceRequestSlice';

const StaffTasks = () => {
   const dispatch = useDispatch();
   const { rooms, loading: roomsLoading } = useSelector(state => state.rooms);
   const { requests, loading: requestsLoading } = useSelector(state => state.serviceRequests);
   const [filterMode, setFilterMode] = useState('All');

   useEffect(() => {
      const fetchData = () => {
         dispatch(fetchAllRooms());
         dispatch(fetchAllServiceRequests());
      };

      fetchData(); 
      const interval = setInterval(fetchData, 30000); // Poll every 30s for real-time updates
      return () => clearInterval(interval);
   }, [dispatch]);

   const isToday = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
   };

   // Aggregate tasks
   const roomTasks = (rooms || [])
      .filter(r => ['cleaning', 'maintenance', 'dirty', 'cleaning progress', 'maintenance progress'].includes(r.status?.toLowerCase()))
      .map(r => {
         const s = r.status.toLowerCase();
         const isInProgress = s.includes('progress');
         return {
            id: `room-${r._id}`,
            type: 'Inventory',
            title: `${s.includes('maintenance') ? 'Heavy Maintenance' : 'Cleaning Prep'}`,
            roomName: r.name,
            priority: s.includes('maintenance') ? 'High' : 'Medium',
            status: isInProgress ? 'In Progress' : 'Pending',
            originalStatus: r.status,
            roomId: r._id,
            time: new Date(r.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: s.includes('maintenance') ? <Wrench size={20} /> : <Bath size={20} />
         };
      });

   const guestTasks = (requests || [])
      .filter(req => ['pending', 'in progress'].includes(req.status?.toLowerCase()))
      .map(req => ({
         id: `req-${req._id}`,
         type: 'Guest Service',
         title: `${req.type} Dispatch`,
         roomName: req.room?.name || 'N/A',
         priority: req.type === 'Food' || req.type === 'Maintenance' ? 'High' : 'Medium',
         status: req.status === 'Pending' ? 'Pending' : 'In Progress',
         originalStatus: req.status,
         requestId: req._id,
         time: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         icon: req.type === 'Food' ? <Utensils size={20} /> : <Info size={20} />
      }));

   const allTasks = [...roomTasks, ...guestTasks].sort((a, b) => {
      if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
      if (a.status !== 'In Progress' && b.status === 'In Progress') return 1;
      return b.priority === 'High' ? -1 : 1;
   });

   const filteredTasks = allTasks.filter(t => 
      filterMode === 'All' || t.type === filterMode || (filterMode === 'In Progress' && t.status === 'In Progress')
   );

   const completedTodayCount = (requests?.filter(r => r.status === 'Completed' && isToday(r.updatedAt)).length || 0) + 
                                (rooms?.filter(r => r.status === 'Available' && isToday(r.updatedAt)).length || 0);

   const handleAction = async (task) => {
      if (task.type === 'Inventory') {
         const data = new FormData();
         if (task.status === 'Pending') {
            const nextStatus = task.originalStatus.toLowerCase().includes('maintenance') ? 'Maintenance Progress' : 'Cleaning Progress';
            data.append('status', nextStatus);
         } else {
            data.append('status', 'Available');
         }
         await dispatch(updateRoom({ id: task.roomId, formData: data }));
         dispatch(fetchAllRooms());
      } else {
         if (task.status === 'Pending') {
            await dispatch(updateServiceStatus({ id: task.requestId, status: 'In Progress' }));
         } else {
            await dispatch(updateServiceStatus({ id: task.requestId, status: 'Completed' }));
         }
         dispatch(fetchAllServiceRequests());
      }
   };

   if (roomsLoading || requestsLoading) {
      return (
         <div className="flex-center" style={{ height: '80vh' }}>
            <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
         </div>
      );
   }

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            {/* Page Header */}
            <header className="dashboard-header m-b-40">
               <div className="flex-col">
                  <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                     <div style={{ padding: '4px 12px', background: 'rgba(0, 0, 0, 0.05)', color: 'var(--admin-text)', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Engine</div>
                  </div>
                  <h1 className="serif dashboard-title" style={{ fontSize: '38px', color: 'var(--admin-text)' }}>Operations Board</h1>
               </div>
               
               <div className="dashboard-actions flex gap-15 items-center">
                  <div className="flex-center gap-10" style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)', padding: '10px 20px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                     <motion.div 
                       animate={{ opacity: [1, 0.4, 1] }} 
                       transition={{ repeat: Infinity, duration: 2 }}
                       style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}
                     ></motion.div>
                     <span className="dashboard-subtitle" style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Coordination Sync</span>
                  </div>
               </div>
            </header>

            {/* Metrics Dashboard */}
            <div className="grid-3" style={{ gap: '24px', marginBottom: '40px' }}>
               <motion.div 
                  initial={false}
                  className="premium-card" 
                  style={{ borderBottom: '4px solid #0ea5e9', padding: '30px' }}
               >
                  <div className="flex-between m-b-15">
                     <div style={{ padding: '10px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '12px' }}><Zap size={22} /></div>
                     <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900' }}>QUEUED</span>
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--admin-text)', marginBottom: '5px' }}>{allTasks.filter(t => t.status === 'Pending').length}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>Active Assignments</p>
               </motion.div>
               
               <div className="premium-card" style={{ borderBottom: '4px solid #f59e0b', padding: '30px' }}>
                  <div className="flex-between m-b-15">
                     <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}><Activity size={22} /></div>
                     <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900' }}>ONGOING</span>
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--admin-text)', marginBottom: '5px' }}>{allTasks.filter(t => t.status === 'In Progress').length}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>Processing Now</p>
               </div>
               
               <div className="premium-card" style={{ borderBottom: '4px solid #10b981', padding: '30px' }}>
                  <div className="flex-between m-b-15">
                     <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}><CheckCircle2 size={22} /></div>
                     <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900' }}>RESOLVED</span>
                  </div>
                  <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--admin-text)', marginBottom: '5px' }}>{completedTodayCount}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>Completed Today</p>
               </div>
            </div>

            {/* Filters */}
            <div className="flex gap-10 m-b-30">
               {['All', 'Guest Service', 'Inventory', 'In Progress'].map(f => (
                  <button 
                     key={f}
                     onClick={() => setFilterMode(f)}
                     style={{ 
                        padding: '8px 20px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--admin-border)', 
                        background: filterMode === f ? '#1e293b' : 'white', 
                        color: filterMode === f ? 'white' : 'var(--admin-text-muted)', 
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

            {/* Task List */}
            <div className="flex-col gap-20">
               <AnimatePresence mode="popLayout">
                  {filteredTasks.length === 0 ? (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '100px', color: 'var(--admin-text-muted)', border: '2px dashed var(--admin-border)', borderRadius: '30px' }}>
                        <ClipboardList size={50} style={{ marginBottom: '20px', opacity: 0.1 }} />
                        <h3 className="serif" style={{ fontSize: '24px', color: 'var(--admin-text)' }}>Registry Clear</h3>
                        <p style={{ fontWeight: '600' }}>No active tasks found matching your criteria.</p>
                     </motion.div>
                  ) : (
                     filteredTasks.map((task, idx) => (
                        <motion.div 
                           key={task.id} 
                           layout
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ delay: idx * 0.05 }}
                           className="premium-card hover-lift" 
                           style={{ padding: '0', overflow: 'hidden', borderLeft: `6px solid ${task.status === 'In Progress' ? '#f59e0b' : '#0ea5e9'}` }}
                        >
                           <div className="flex-between p-25" style={{ background: task.status === 'In Progress' ? 'rgba(245, 158, 11, 0.02)' : 'white' }}>
                              <div className="flex gap-20 items-center">
                                 <div style={{ padding: '15px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '16px', color: '#0ea5e9' }}>
                                    {task.status === 'In Progress' ? <Loader2 className="animate-spin" size={24} /> : task.icon}
                                 </div>
                                 <div className="flex-col gap-5">
                                    <div className="flex items-center gap-10">
                                       <h4 style={{ fontWeight: '900', fontSize: '18px', color: 'var(--admin-text)' }}>{task.title}</h4>
                                       <span style={{ fontSize: '10px', color: 'white', background: task.priority === 'High' ? '#ef4444' : '#94a3b8', padding: '2px 10px', borderRadius: '15px', fontWeight: '900' }}>{task.priority}</span>
                                    </div>
                                    <div className="flex gap-15 items-center">
                                       <span style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: '900' }}>Room {task.roomName}</span>
                                       <div style={{ width: '1px', height: '12px', background: 'var(--admin-border)' }}></div>
                                       <span className="flex-center gap-5" style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}><Clock size={14} /> Created {task.time}</span>
                                       <div style={{ width: '1px', height: '12px', background: 'var(--admin-border)' }}></div>
                                       <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>{task.type}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-15">
                                 <button 
                                    onClick={() => handleAction(task)}
                                    className="hover-lift"
                                    style={{ 
                                       padding: '12px 30px', 
                                       borderRadius: '14px', 
                                       border: 'none', 
                                       background: task.status === 'In Progress' ? '#10b981' : '#1e293b', 
                                       color: 'white', 
                                       fontSize: '13px', 
                                       fontWeight: '900', 
                                       cursor: 'pointer',
                                       boxShadow: task.status === 'In Progress' ? '0 8px 20px rgba(16, 185, 129, 0.2)' : '0 8px 20px rgba(0,0,0,0.1)',
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: '10px'
                                    }}
                                 >
                                    {task.status === 'Pending' ? (
                                       <>Activate Task <ArrowRight size={16}/></>
                                    ) : (
                                       <>Mark as Complete <CheckCircle2 size={16}/></>
                                    )}
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     ))
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
   );
};

export default StaffTasks;
