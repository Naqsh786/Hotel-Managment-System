import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, clearAdminState } from '../../Features/adminSlice';
import { fetchAllServiceRequests } from '../../Features/serviceRequestSlice';
import { Users, ShieldAlert, Activity, Bell, Search, 
  User, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSecurity = () => {
  const dispatch = useDispatch();
  const { staff } = useSelector((state) => state.admin);
  const { requests } = useSelector((state) => state.serviceRequests);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchAllServiceRequests());
    return () => dispatch(clearAdminState());
  }, [dispatch]);

  const securityStaff = (staff || []).filter(s => s.responsibility === 'Security');
  const activeIncidents = (requests || []).filter(r => r.status === 'Pending' && (r.type === 'Maintenance' || r.type === 'Security'));
  
  const filteredSecurity = securityStaff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Security Force', value: securityStaff.length, sub: 'Active Units', icon: <Users size={20}/>, color: '#dfa974' },
    { label: 'Active Alerts', value: activeIncidents.length, sub: 'Requires Action', icon: <ShieldAlert size={20}/>, color: '#ef4444' },
    { label: 'System Uptime', value: '99.9%', sub: 'Secure Layer', icon: <Zap size={20}/>, color: '#10b981' }
  ];

  return (
    <div className="admin-main-content" style={{ background: 'var(--admin-bg)' }}>
      <header className="admin-top-header">
         <div className="admin-search-bar">
           <Search size={18} color="var(--admin-text-muted)" />
           <input type="text" placeholder="Search security personnel..." value={search} onChange={(e) => setSearch(e.target.value)} />
         </div>
      </header>

      <div className="admin-dashboard-view">
        <div className="flex-between m-b-40">
           <div>
              <h1 className="serif" style={{fontSize: '32px'}}>Security Management</h1>
              <p className="text-muted">Command & Control center for hotel security protocols.</p>
           </div>
           <div className="flex gap-10">
              <button className="btn-sona-secondary"><Activity size={18} /> System Audit</button>
           </div>
        </div>

        {/* Global Security Stats */}
        <div className="grid-3 m-b-40" style={{ gap: '25px' }}>
           {stats.map((stat, i) => (
              <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 20 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 className="premium-card" 
                 style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}
              >
                 <div style={{ padding: '15px', background: `${stat.color}10`, color: stat.color, borderRadius: '14px' }}>{stat.icon}</div>
                 <div>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
                    <p style={{ fontSize: '28px', fontWeight: '900' }}>{stat.value}</p>
                    <p style={{ fontSize: '11px', color: stat.color, fontWeight: '700' }}>{stat.sub}</p>
                 </div>
              </motion.div>
           ))}
        </div>

        <div className="admin-data-grid">
           {/* Personnel Roster */}
           <div className="premium-card span-5" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9' }}>
                 <h3 className="serif">Security Force Roster</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                 <table className="premium-table">
                    <thead>
                       <tr>
                          <th>Personnel</th>
                          <th>Shift</th>
                          <th>Area</th>
                          <th>Status</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filteredSecurity.map(member => (
                          <tr key={member._id}>
                             <td>
                                <div className="flex gap-10 items-center">
                                   <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      {member.profileImage ? <img src={member.profileImage} style={{width:'100%', height:'100%', borderRadius:'10px'}} /> : <User size={16}/>}
                                   </div>
                                   <div className="flex-col">
                                      <span style={{fontWeight:'700', fontSize:'13px'}}>{member.name}</span>
                                      <span style={{fontSize:'10px', color:'var(--admin-text-muted)'}}>{member.email}</span>
                                   </div>
                                </div>
                             </td>
                             <td style={{ fontSize: '12px', fontWeight: '700', color: '#dfa974' }}>{member.shift}</td>
                             <td style={{ fontSize: '12px' }}>{member.workArea || 'Station 1'}</td>
                             <td><span className="status-pill" style={{ background: '#ecfdf5', color: '#10b981' }}>On-Site</span></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Tactical Log */}
           <div className="premium-card span-3" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 className="serif">Tactical Logs</h3>
                 <Bell size={18} color="#dfa974" />
              </div>
              <div className="flex-col p-20 gap-15" style={{maxHeight:'500px', overflowY:'auto'}}>
                 {activeIncidents.length > 0 ? activeIncidents.map(incident => (
                    <div key={incident._id} style={{ padding: '15px', background: 'var(--admin-sidebar)', borderRadius: '12px', borderLeft: '3px solid #ef4444' }}>
                       <div className="flex-between m-b-5">
                          <span style={{fontSize:'10px', fontWeight:'900', color:'#64748b'}}>{new Date(incident.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                          <span style={{fontSize:'10px', fontWeight:'900', color:'#ef4444'}}>PENDING</span>
                       </div>
                       <p style={{fontSize:'13px', fontWeight:'700'}}>{incident.roomName || 'General Area'}</p>
                       <p style={{fontSize:'11px', color:'#64748b', marginTop:'3px'}}>{incident.notes}</p>
                    </div>
                 )) : (
                    <div style={{textAlign:'center', padding:'40px', color:'#64748b', fontSize:'13px'}}>No active threats recorded.</div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSecurity;
