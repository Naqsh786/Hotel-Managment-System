import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserIcon, Shield, Activity, MapPin, Search, Timer, MoreVertical
} from 'lucide-react';
import { fetchStaff, updateStaff } from '../../Features/adminSlice';
import { useToast } from '../../context/ToastContext';
// Removed react-hot-toast dependency

import CustomDropdown from '../../components/CustomDropdown';

const StaffMonitor = () => {
   const dispatch = useDispatch();
   const { staff, loading } = useSelector(state => state.admin);
   const [searchTerm, setSearchTerm] = useState('');
   const { toast } = useToast();

   useEffect(() => {
      dispatch(fetchStaff());
   }, [dispatch]);

   const filteredStaff = staff.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.responsibility.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleShiftUpdate = (id, field, value) => {
      const formData = { [field]: value };
      dispatch(updateStaff({ id, formData })).unwrap()
         .then(() => {
            toast.success("Assignment Updated", "Staff member's operational details have been synchronized.");
         })
         .catch((err) => toast.error("Update Failed", err));
   };

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            {/* Header Area */}
            <header className="dashboard-header m-b-40">
               <div className="flex-col">
                  <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                     <span style={{ padding: '4px 12px', background: 'rgba(223, 169, 116, 0.1)', color: '#dfa974', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Workforce Management</span>
                  </div>
                  <h1 className="serif dashboard-title" style={{ fontSize: '36px', color: 'var(--admin-text)' }}>Staff Operations</h1>
               </div>
               <div className="dashboard-actions">
                  <div className="admin-search-bar" style={{ width: '300px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)' }}>
                     <Search size={18} color="var(--admin-text-muted)" />
                     <input 
                        type="text" 
                        placeholder="Search team member..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', outline: 'none' }}
                     />
                  </div>
               </div>
            </header>
            
            {/* Workforce Key Metrics */}
            <div className="grid-3" style={{ gap: '24px', marginBottom: '40px' }}>
               {[
                  { label: 'Total Workforce', value: staff.length, icon: <Users />, color: '#0ea5e9' },
                  { label: 'Active Depts', value: [...new Set(staff.map(s => s.responsibility))].length, icon: <Shield />, color: '#dfa974' },
                  { label: 'Average Shift', value: '8.5h', icon: <Timer />, color: '#10b981' }
               ].map((stat, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="premium-card" 
                     style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}
                  >
                     <div style={{ padding: '15px', background: `${stat.color}15`, color: stat.color, borderRadius: '15px' }}>{stat.icon}</div>
                     <div>
                        <p style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                        <p style={{ fontSize: '28px', fontWeight: '900', color: 'var(--admin-text)' }}>{stat.value}</p>
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Staff Roster Table */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="premium-card" 
               style={{ padding: '0' }}
            >
               <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg)' }}>
                  <h3 className="serif" style={{ fontSize: '20px', color: 'var(--admin-text)' }}>Team Roster</h3>
               </div>
               
               {loading ? (
                  <div className="flex-center p-40"><Activity className="animate-spin" color="#0ea5e9" size={32} /></div>
               ) : (
                  <div style={{ overflowX: 'auto' }}>
                     <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
                           <tr>
                              <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Team Member</th>
                              <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Role / Dept</th>
                              <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Status</th>
                              <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Duty Shift</th>
                              <th style={{ padding: '20px', textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Work Area</th>
                              <th style={{ padding: '20px 30px', textAlign: 'right', fontSize: '12px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           <AnimatePresence>
                              {filteredStaff.map((s, idx) => (
                                 <motion.tr 
                                    key={s._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ borderBottom: '1px solid var(--admin-border)', transition: '0.2s' }}
                                    className="hover-row"
                                 >
                                    <td style={{ padding: '20px 30px' }}>
                                       <div className="flex gap-15 items-center">
                                          <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text)', overflow: 'hidden' }}>
                                             {s.profileImage ? <img src={s.profileImage} alt={s.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <UserIcon size={18} />}
                                          </div>
                                          <div className="flex-col">
                                             <p style={{ fontWeight: '800', color: 'var(--admin-text)', fontSize: '14px' }}>{s.name}</p>
                                             <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{s.email}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td style={{ padding: '20px', minWidth: '180px' }}>
                                       <CustomDropdown 
                                          options={["Housekeeping", "Receptionist", "Manager", "Security", "Maintenance", "Room Service", "Other"]}
                                          value={s.responsibility || 'Other'}
                                          onChange={(val) => handleShiftUpdate(s._id, 'responsibility', val)}
                                          variant="admin"
                                       />
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                       <span className="status-pill" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900' }}>
                                          <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div> Active
                                       </span>
                                    </td>
                                    <td style={{ padding: '20px', minWidth: '150px' }}>
                                       <CustomDropdown 
                                          options={["Morning", "Evening", "Night", "OFF"]}
                                          value={s.shift || 'Morning'}
                                          onChange={(val) => handleShiftUpdate(s._id, 'shift', val)}
                                          variant="admin"
                                       />
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                       <div className="flex gap-10 items-center">
                                          <MapPin size={14} color="var(--admin-text-muted)" />
                                          <input 
                                             defaultValue={s.workArea || 'General'}
                                             onBlur={(e) => handleShiftUpdate(s._id, 'workArea', e.target.value)}
                                             style={{ 
                                                width: '100px',
                                                background: 'transparent',
                                                border: 'none',
                                                fontSize: '13px',
                                                color: 'var(--admin-text)',
                                                fontWeight: '600'
                                             }}
                                          />
                                       </div>
                                    </td>
                                    <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                       <button style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                                          <MoreVertical size={18} />
                                       </button>
                                    </td>
                                 </motion.tr>
                              ))}
                           </AnimatePresence>
                        </tbody>
                     </table>
                  </div>
               )}
            </motion.div>
         </div>
      </div>
   );
};

export default StaffMonitor;
