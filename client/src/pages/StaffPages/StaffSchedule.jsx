import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, 
  ChevronRight, Bookmark, Shield
} from 'lucide-react';

const StaffSchedule = () => {
   const { user } = useSelector(state => state.auth);
   const [currentWeekStart, setCurrentWeekStart] = useState(() => {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
      const monday = new Date(today.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      return monday;
   });
   
   const getShiftTimes = (shift) => {
      switch(shift) {
         case 'Morning': return '08:00 AM - 04:00 PM';
         case 'Evening': return '04:00 PM - 12:00 AM';
         case 'Night': return '12:00 AM - 08:00 AM';
         default: return 'OFF';
      }
   };

   const weekDays = useMemo(() => {
      const days = [];
      for (let i = 0; i < 7; i++) {
         const date = new Date(currentWeekStart);
         date.setDate(currentWeekStart.getDate() + i);
         
         const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
         const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
         
         const isOff = user?.shift === 'OFF' || 
                       (user?.shift === 'Morning' && i > 4) || 
                       (user?.shift === 'Night' && i < 2);

         days.push({
            id: i + 1,
            day: dayName,
            date: formattedDate,
            time: isOff ? 'OFF' : getShiftTimes(user?.shift),
            role: isOff ? '-' : `${user?.shift} Shift`,
            location: isOff ? '-' : (user?.workArea || 'General'),
            status: isOff ? 'Rest Day' : 'Confirmed'
         });
      }
      return days;
   }, [currentWeekStart, user]);

   const weekRangeText = useMemo(() => {
      const start = new Date(currentWeekStart);
      const end = new Date(currentWeekStart);
      end.setDate(start.getDate() + 6);
      
      const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
      const year = start.getFullYear();
      
      if (startMonth === endMonth) {
         return `${startMonth} ${start.getDate()} — ${end.getDate()}, ${year}`;
      } else {
         return `${startMonth} ${start.getDate()} — ${endMonth} ${end.getDate()}, ${year}`;
      }
   }, [currentWeekStart]);

   const handlePrevWeek = () => {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentWeekStart(newDate);
   };

   const handleNextWeek = () => {
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentWeekStart(newDate);
   };

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            {/* Page Header */}
            <header className="dashboard-header m-b-40">
               <div className="flex-col">
                  <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                     <div style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Workforce Roster</div>
                  </div>
                  <h1 className="serif dashboard-title" style={{ fontSize: '38px', color: 'var(--admin-text)' }}>Duty Schedule</h1>
               </div>
               
               <div className="dashboard-actions flex gap-15">
                  <div className="flex gap-10">
                     <button 
                        onClick={handlePrevWeek}
                        className="hover-lift" 
                        style={{ padding: '12px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)', borderRadius: '14px', color: 'var(--admin-text)', cursor: 'pointer' }}
                     >
                        <ChevronLeft size={20} />
                     </button>
                     <div style={{ background: 'var(--admin-sidebar)', padding: '10px 25px', borderRadius: '14px', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', fontWeight: '900', color: 'var(--admin-text)', fontSize: '14px', minWidth: '220px', justifyContent: 'center' }}>
                        {weekRangeText}
                     </div>
                     <button 
                        onClick={handleNextWeek}
                        className="hover-lift" 
                        style={{ padding: '12px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)', borderRadius: '14px', color: 'var(--admin-text)', cursor: 'pointer' }}
                     >
                        <ChevronRight size={20} />
                     </button>
                  </div>
               </div>
            </header>

            <div className="grid-12" style={{ gap: '30px' }}>
               
               {/* Shift Summary Sidebar */}
               <div className="span-4 flex-col gap-25">
                  <div className="premium-card" style={{ padding: '30px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
                     <h3 className="serif" style={{ fontSize: '22px', marginBottom: '25px' }}>Shift Overview</h3>
                     <div className="flex-col gap-20">
                        <div className="flex-between" style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                           <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Active Hours</span>
                           <span style={{ fontSize: '18px', fontWeight: '900' }}>40.0 Hrs</span>
                        </div>
                        <div className="flex-between" style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                           <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Work Days</span>
                           <span style={{ fontSize: '18px', fontWeight: '900' }}>5 Days</span>
                        </div>
                        <div className="flex-between">
                           <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Primary Role</span>
                           <span style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>{user?.responsibility || 'Service Expert'}</span>
                        </div>
                     </div>
                     <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '15px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <p style={{ fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={14} color="#38bdf8" /> CURRENT STATUS</p>
                        <p style={{ fontSize: '13px', marginTop: '5px', opacity: 0.8 }}>{user?.shift} Shift - {user?.workArea || 'General'}</p>
                     </div>
                  </div>

                  <div className="premium-card" style={{ padding: '30px' }}>
                     <h4 className="serif" style={{ fontSize: '18px', marginBottom: '20px' }}>Roster Notes</h4>
                     <div className="flex-col gap-15">
                        {[
                           'Uniform audit scheduled for Tuesday morning.',
                           'Please review new guest safety protocols.',
                           'Bi-weekly team sync on Friday @ 3:00 PM.'
                        ].map((note, i) => (
                           <div key={i} className="flex gap-15 items-start">
                              <div style={{ padding: '6px', background: 'var(--admin-bg)', borderRadius: '8px', marginTop: '2px' }}><Bookmark size={14} color="#0ea5e9" /></div>
                              <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: '600', lineHeight: '1.5' }}>{note}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Main Roster Table */}
               <div className="span-8">
                  <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                     <div style={{ overflowX: 'auto' }}>
                        <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                           <thead style={{ background: 'var(--admin-bg)' }}>
                              <tr>
                                 <th style={{ padding: '25px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>Calendar Date</th>
                                 <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>Shift Window</th>
                                 <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>Role & Locale</th>
                                 <th style={{ padding: '20px 25px', textAlign: 'right', fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>State</th>
                              </tr>
                           </thead>
                           <tbody>
                              {weekDays.map((shift, idx) => (
                                 <motion.tr 
                                    key={shift.id} 
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ borderBottom: '1px solid var(--admin-border)', transition: '0.2s' }}
                                    className="hover-lift"
                                 >
                                    <td style={{ padding: '25px' }}>
                                       <div className="flex gap-15 items-center">
                                          <div style={{ padding: '12px', background: 'var(--admin-bg)', borderRadius: '12px', color: '#0ea5e9' }}><CalendarIcon size={18}/></div>
                                          <div className="flex-col">
                                             <div style={{ fontWeight: '900', color: 'var(--admin-text)', fontSize: '15px' }}>{shift.day}</div>
                                             <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>{shift.date}</div>
                                          </div>
                                       </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                       <div className="flex items-center gap-10" style={{ color: shift.time === 'OFF' ? 'var(--admin-text-muted)' : 'var(--admin-text)', fontWeight: '800', fontSize: '14px' }}>
                                          <Clock size={16} color="var(--admin-text-muted)" /> {shift.time}
                                       </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                       <div className="flex-col">
                                          <div style={{ fontWeight: '800', color: 'var(--admin-text)', fontSize: '14px' }}>{shift.role}</div>
                                          <div className="flex items-center gap-6" style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '700' }}><MapPin size={12} /> {shift.location}</div>
                                       </div>
                                    </td>
                                    <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                       <span style={{ 
                                          fontSize: '10px', 
                                          fontWeight: '900', 
                                          padding: '5px 15px',
                                          borderRadius: '20px',
                                          background: shift.status === 'Rest Day' ? 'rgba(0,0,0,0.05)' : 'rgba(16, 185, 129, 0.1)',
                                          color: shift.status === 'Rest Day' ? 'var(--admin-text-muted)' : '#10b981',
                                          border: `1px solid ${shift.status === 'Rest Day' ? 'var(--admin-border)' : 'rgba(16, 185, 129, 0.2)'}`,
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.5px'
                                       }}>
                                          {shift.status}
                                       </span>
                                    </td>
                                 </motion.tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
};

export default StaffSchedule;
