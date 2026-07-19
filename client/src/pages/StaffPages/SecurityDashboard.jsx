import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Camera, Bell, Activity, Loader2, Radio,
  Terminal, HardDrive, Wifi, X
} from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAllServiceRequests, createServiceRequest } from '../../Features/serviceRequestSlice';
import { fetchStaff } from '../../Features/adminSlice';
import { useNavigate } from 'react-router-dom';

const TerminalFeed = () => {
   const [logs, setLogs] = useState([
      "> Initializing SONA Security Layer...",
      "> Establishing Encrypted Uplink...",
      "> Parsing Site Metadata...",
      "> System Ready. All sensors nominal."
   ]);

   useEffect(() => {
      const messages = [
         "Package scanned at South Foyer.",
         "Signal strength fluctuation in Room 402.",
         "Patrol Unit heartbeat detected.",
         "Analyzing environmental data...",
         "Asset location updated: Lobby",
         "Protocol Alpha-9 engaged.",
         "Encryption keys rotated.",
         "Scanning for unauthorized signals...",
         "Database handshake successful."
      ];
      
      const interval = setInterval(() => {
         const msg = "> " + messages[Math.floor(Math.random() * messages.length)];
         setLogs(prev => [...prev.slice(-8), msg]);
      }, 4000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="terminal-text" style={{ fontSize: '10px', height: '180px', overflow: 'hidden' }}>
         {logs.map((log, i) => (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i}>{log}</motion.div>
         ))}
      </div>
   );
};

const SecurityDashboard = ({ user }) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { requests, loading: requestsLoading } = useSelector(state => state.serviceRequests);
   const { staff } = useSelector(state => state.admin);
   
   const [activePatrol, setActivePatrol] = useState(false);
   const [currentTime, setCurrentTime] = useState(new Date());
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [incidentData, setIncidentData] = useState({ roomName: '', notes: '', type: 'Maintenance' });

   const [patrolLocation, setPatrolLocation] = useState("Station 1");

   useEffect(() => {
      dispatch(fetchAllServiceRequests());
      dispatch(fetchStaff());
      
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      const poll = setInterval(() => {
         dispatch(fetchAllServiceRequests());
         dispatch(fetchStaff());
      }, 5000); // Faster polling for 'proper' console feel

      const patrolInterval = setInterval(() => {
         const locations = ["South Wing", "Lobby", "Parking Level 1", "Roof Access", "Kitchen", "Guest Corridors"];
         setPatrolLocation(locations[Math.floor(Math.random() * locations.length)]);
      }, 8000);

      return () => {
         clearInterval(timer);
         clearInterval(poll);
         clearInterval(patrolInterval);
      };
   }, [dispatch]);

   const incidents = requests
      .filter(r => r.type === 'Maintenance' || r.type === 'Cleaning' || r.status === 'Pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
   // eslint-disable-next-line unused-imports/no-unused-vars
   const securityTeam = staff.filter(s => s.responsibility === 'Security');
   const openIncidents = incidents.filter(i => i.status === 'Pending').length;
   
   const siteStatus = openIncidents > 5 ? 'High Alert' : (openIncidents > 0 ? 'Reviewing' : 'Secure');
   const siteColor = siteStatus === 'High Alert' ? '#ef4444' : (siteStatus === 'Reviewing' ? '#f59e0b' : '#10b981');

   if (requestsLoading && requests.length === 0) {
      return (
         <div className="admin-main-content flex-center" style={{ background: '#0a0c10', color: '#dfa974', height: '100vh' }}>
            <div className="flex-col-center gap-20">
               <Loader2 className="animate-spin" size={48} />
               <p style={{ letterSpacing: '4px', fontSize: '12px', fontWeight: '900' }}>INITIALIZING SECURITY PROTOCOLS...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="admin-main-content security-console-wrapper scanline-effect" style={{ background: '#0a0c10', color: '#f8fafc', minHeight: '100vh', overflowY: 'auto', position: 'relative' }}>
         <div className="vignette-overlay"></div>
         <div className="admin-dashboard-view" style={{ padding: '30px', position: 'relative', zIndex: 10 }}>
            
            {/* Tactical Top Bar */}
            <header className="dashboard-header m-b-40 card-header-flex" style={{ borderBottom: '1px solid rgba(223, 169, 116, 0.15)', paddingBottom: '25px' }}>
               <div className="flex-col">
                  <div className="flex items-center gap-10 m-b-10">
                     <div className="animate-pulse" style={{ width: '8px', height: '8px', background: siteColor, borderRadius: '50%', boxShadow: `0 0 10px ${siteColor}` }}></div>
                     <span style={{ fontSize: '11px', fontWeight: '900', color: '#dfa974', letterSpacing: '3px', textTransform: 'uppercase' }}>Command Center • {siteStatus}</span>
                  </div>
                  <h1 className="serif dashboard-title" style={{ color: 'white' }}>Security Console</h1>
               </div>

               <div className="flex gap-20 items-center dashboard-actions">
                  <div className="network-status" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                     <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Network Status</p>
                     <div className="flex-center gap-5">
                        <Wifi size={12} color="#10b981" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>Encrypted</span>
                     </div>
                  </div>
                  <div className="time-display" style={{ textAlign: 'right' }}>
                     <p style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '1px' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                     <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
               </div>
            </header>

            {/* Site Status Dashboard */}
            <div className="dashboard-grid-12" style={{ marginBottom: '30px' }}>
               
               {/* Left Controls & Status */}
               <div className="span-3 flex-col gap-25">
                  
                  {/* Unit Identification */}
                  <div className="premium-card glow-gold" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(223,169,116,0.2)', position: 'relative' }}>
                     <div className="hud-bracket hud-bracket-tl"></div>
                     <div className="hud-bracket hud-bracket-tr"></div>
                     <div className="hud-bracket hud-bracket-bl"></div>
                     <div className="hud-bracket hud-bracket-br"></div>
                     <div className="flex-center gap-15" style={{ justifyContent: 'flex-start' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '14px', border: '2px solid #dfa974', padding: '3px' }}>
                           <img src={user?.profileImage || "https://i.pravatar.cc/150?u=security"} style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                        </div>
                        <div className="flex-col">
                           <h4 style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '1px' }}>{user?.name?.toUpperCase() || 'UNIT_01'}</h4>
                           <span style={{ fontSize: '10px', color: '#dfa974', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>Security Marshal</span>
                        </div>
                     </div>
                     <div className="m-t-20 flex-col gap-10">
                        <div className="flex-between" style={{fontSize:'10px', color:'#64748b'}}><span>AUTH_STATE</span><span style={{color:'#10b981'}}>VERIFIED</span></div>
                        <div className="status-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px', padding: '8px' }}>SYSTEM_STATUS: NOMINAL</div>
                     </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="premium-card" style={{ padding: '30px', background: 'linear-gradient(180deg, rgba(223, 169, 116, 0.05) 0%, rgba(0,0,0,0) 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div className="flex-between m-b-20">
                        <h3 className="serif" style={{ fontSize: '18px', color: '#dfa974' }}>Operations</h3>
                        <Activity size={16} color="#dfa974" className="animate-pulse" />
                     </div>
                     <div className="flex-col gap-15">
                        <button 
                           onClick={() => setActivePatrol(!activePatrol)}
                           style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: activePatrol ? '#ef4444' : '#dfa974', color: activePatrol ? 'white' : '#1a1d23', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s' }}
                        >
                           <Radio size={18} /> {activePatrol ? "ABORT PATROL" : "BEGIN PATROL"}
                        </button>
                        {activePatrol && (
                           <div className="flex-col gap-5" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                              <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '900' }}>CURRENT_LOC</span>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#dfa974' }}>{patrolLocation}</span>
                              <div style={{ height: '2px', background: 'rgba(223,169,116,0.1)', width: '100%', borderRadius: '1px', marginTop: '5px' }}>
                                 <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 8, repeat: Infinity }} style={{ height: '100%', background: '#dfa974' }}></motion.div>
                              </div>
                           </div>
                        )}
                        <button 
                           onClick={() => setIsModalOpen(true)}
                           style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                        >
                           Report Incident
                        </button>
                     </div>
                  </div>

                  {/* System Logs */}
                  <div className="premium-card" style={{ padding: '25px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', flex: 1 }}>
                     <div className="flex-between m-b-15">
                        <p style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', letterSpacing: '1px' }}>SYSTEM_LOG_FEED</p>
                        <Terminal size={12} color="#64748b" />
                     </div>
                     <TerminalFeed />
                  </div>
               </div>

               {/* Center Surveillance Feed */}
               <div className="span-6">
                  <div className="premium-card" style={{ padding: '0', background: '#000', border: '2px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                     <div className="flex-between" style={{ padding: '15px 25px', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="flex gap-10 items-center">
                           <Camera size={18} color="#dfa974" />
                           <span style={{ fontSize: '13px', fontWeight: '800' }}>FEED: SOUTH FOYER GATE 02</span>
                        </div>
                        <div className="flex gap-10">
                           <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '10px', fontWeight: '900' }}>LIVE</motion.span>
                           <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#64748b', fontSize: '10px', fontWeight: '900' }}>ISO 800</span>
                        </div>
                     </div>
                     <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                        
                        {/* HUD Grid Overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}></div>
                        
                        <div className="hud-bracket hud-bracket-tl"></div>
                        <div className="hud-bracket hud-bracket-tr"></div>
                        <div className="hud-bracket hud-bracket-bl"></div>
                        <div className="hud-bracket hud-bracket-br"></div>
                        
                        {/* Coordinate Overlay */}
                        <div style={{ position: 'absolute', top: '15px', right: '15px', textAlign: 'right', fontFamily: 'monospace', fontSize: '10px', color: '#dfa974', textShadow: '0 0 5px rgba(223,169,116,0.3)' }}>
                           <p>COORD: 24.8607° N</p>
                           <p>67.0011° E</p>
                        </div>

                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid rgba(223,169,116,0.2)', width: '120px', height: '120px', borderRadius: '50%' }}></div>
                        
                        {/* Tracking UI */}
                        <motion.div 
                           animate={{ x: [20, 300, 20], y: [40, 150, 40] }}
                           transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                           style={{ position: 'absolute', width: '90px', height: '90px', border: '1px solid #ef4444', color: '#ef4444', fontSize: '8px', padding: '5px', background: 'rgba(239, 68, 68, 0.05)', backdropFilter: 'blur(1px)' }}
                        >
                           <p style={{fontWeight:'900'}}>O_NON_BIO</p>
                           <p>DETECTED</p>
                           <div style={{position:'absolute', bottom:'5px', right:'5px', width:'4px', height:'4px', background:'#ef4444'}}></div>
                        </motion.div>
                     </div>
                     <div className="grid-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
                        {[1, 2, 3, 4].map(id => (
                           <div key={id} style={{ aspectRatio: '16/9', background: '#000', position: 'relative', overflow: 'hidden' }}>
                              <img src={`https://images.unsplash.com/photo-${id === 2 ? '1566073771259-6a8506099945' : (id === 3 ? '1520250497591-112f2f40a3f4' : '1514362545857-3bc16c4c7d1b')}?auto=format&fit=crop&w=400&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                              <div style={{ position: 'absolute', bottom: '5px', left: '8px', fontSize: '8px', fontWeight: '900', color: 'rgba(255,255,255,0.4)' }}>CAM_0{id+10}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Event Queue */}
               <div className="span-3 flex-col gap-25">
                  <div className="premium-card" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                     <div className="flex-between m-b-20">
                        <h4 className="serif">Incident Log</h4>
                        <Bell size={16} color="#dfa974" />
                     </div>
                     <div className="flex-col gap-15">
                        {incidents.length > 0 ? incidents.slice(0, 8).map(incident => (
                           <div key={incident._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `3px solid ${incident.type === 'Cleaning' ? '#38bdf8' : (incident.status === 'Pending' ? '#ef4444' : '#dfa974')}` }}>
                              <div className="flex-between m-b-5">
                                 <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '900' }}>{new Date(incident.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} • {incident.type}</span>
                                 <span style={{ fontSize: '10px', color: incident.type === 'Cleaning' ? '#38bdf8' : (incident.status === 'Pending' ? '#ef4444' : '#dfa974'), fontWeight: '900' }}>{incident.status}</span>
                              </div>
                              <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{incident.room?.name || incident.roomName || 'General Area'}</p>
                              <p style={{ fontSize: '11px', color: '#64748b' }}>{incident.notes || 'Routine task flagged in system.'}</p>
                           </div>
                        )) : (
                           <div style={{textAlign:'center', padding:'20px', color:'#64748b', fontSize:'12px'}}>No active incidents or cleaning tasks.</div>
                        )}
                     </div>
                     <button className="m-t-20" onClick={() => navigate('/staff/complaints')} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>View All Logs</button>
                  </div>
               </div>
            </div>

             {/* Tactical Environment Readout */}
             <div className="grid-4" style={{ gap: '25px' }}>
                {[
                   { label: 'Tactical Signal', value: '4/4 Bars', icon: <Wifi size={20} />, trend: 'Stable' },
                   { label: 'Terminal State', value: `V4.8_SEC`, icon: <HardDrive size={20} />, trend: 'Nominal' },
                   { label: 'Sync Latency', value: '14ms', icon: <Activity size={20} />, trend: 'Optimal' },
                   { label: 'Active Matrix', value: 'SONA-ALPHA', icon: <Shield size={20} />, trend: 'Locked' },
                ].map((stat, i) => (
                   <div key={i} className="premium-card flex items-center gap-20" style={{ padding: '20px 25px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(223,169,116,0.1)' }}>
                      <div style={{ color: '#dfa974', background: 'rgba(223,169,116,0.1)', padding: '12px', borderRadius: '12px' }}>{stat.icon}</div>
                      <div>
                         <p style={{ fontSize: '10px', color: '#64748b', fontWeight: '900', textTransform: 'uppercase' }}>{stat.label}</p>
                         <p style={{ fontSize: '18px', fontWeight: '900', letterSpacing:'1px' }}>{stat.value}</p>
                      </div>
                   </div>
                ))}
             </div>

            {/* Incident Modal */}
            <AnimatePresence>
               {isModalOpen && (
                  <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#1e293b', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', border: '1px solid #dfa974' }}>
                        <div className="flex-between m-b-30">
                           <h2 className="serif" style={{ color: 'white' }}>Flag Incident</h2>
                           <X size={24} color="#64748b" onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="flex-col gap-20">
                           <div className="input-group-sona">
                              <label style={{ color: '#94a3b8' }}>Location / Room</label>
                              <input 
                                 style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', color: 'white' }} 
                                 placeholder="Lobby, Suite 204, etc."
                                 value={incidentData.roomName}
                                 onChange={(e) => setIncidentData({...incidentData, roomName: e.target.value})}
                              />
                           </div>
                           <div className="input-group-sona">
                              <label style={{ color: '#94a3b8' }}>Event Description</label>
                              <textarea 
                                 style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #334155', color: 'white', minHeight: '100px', padding: '15px', borderRadius: '12px', width: '100%', resize: 'none' }} 
                                 placeholder="Provide specific details of the incident..."
                                 value={incidentData.notes}
                                 onChange={(e) => setIncidentData({...incidentData, notes: e.target.value})}
                              />
                           </div>
                           <button 
                              onClick={() => {
                                 dispatch(createServiceRequest(incidentData));
                                 setIsModalOpen(false);
                                 setIncidentData({ roomName: '', notes: '', type: 'Maintenance' });
                              }}
                              className="btn-sona-primary w-full" style={{ background: '#dfa974', color: '#1a1d23' }}
                           >
                              SUBMIT TO COMMAND
                           </button>
                        </div>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
};

export default SecurityDashboard;
