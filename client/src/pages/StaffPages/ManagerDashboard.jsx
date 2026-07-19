import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, 
  BarChart3, Activity, Loader2,
  Calendar, Download, Clock, Layers, Zap,
  ChevronRight, Globe, ShieldCheck, UtensilsCrossed
} from 'lucide-react';
import { fetchAllServiceRequests } from '../../Features/serviceRequestSlice';
import { fetchAllBookings } from '../../Features/bookingSlice';
import { fetchAllRooms } from '../../Features/roomSlice';
import { fetchStaff } from '../../Features/adminSlice';
import CustomDropdown from '../../components/CustomDropdown';
import jsPDF from 'jspdf';
import { useToast } from '../../context/ToastContext';

const ManagerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { requests, loading: requestsLoading } = useSelector(state => state.serviceRequests);
  const { bookings, loading: bookingsLoading } = useSelector(state => state.bookings);
  const { rooms, loading: roomsLoading } = useSelector(state => state.rooms);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { staff, loading: staffLoading } = useSelector(state => state.admin);
  const [filter, setFilter] = useState('All');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllServiceRequests());
    dispatch(fetchAllBookings());
    dispatch(fetchAllRooms());
    dispatch(fetchStaff());

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const loading = requestsLoading || bookingsLoading || roomsLoading;

  // Analytics Calculations
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed' || b.status === 'active' || b.status === 'checked-in')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const activeReservations = bookings.filter(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'checked-in').length;
  const occupancyRate = rooms.length > 0 ? Math.min(Math.round((activeReservations / rooms.length) * 100), 100) : 0;
  
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const criticalComplaints = requests.filter(r => r.type === 'Maintenance' && r.status === 'Pending').length;

  const handleExecutiveReport = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    toast.info("Report Progress", 'Initializing executive report generation...');

    // Artificial delay for premium feel and to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const doc = new jsPDF();
      const primaryColor = [30, 41, 59];
      const accentColor = [14, 165, 233];
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('SONA HOTEL', 20, 20);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('EXECUTIVE PERFORMANCE REPORT', 20, 30);
      
      doc.setFontSize(10);
      doc.text(`Generated: ${currentTime.toLocaleString()}`, 140, 25);
      
      // Summary Section
      doc.setTextColor(...primaryColor);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Operational Summary', 20, 60);
      
      doc.setDrawColor(...accentColor);
      doc.setLineWidth(1);
      doc.line(20, 65, 70, 65);
      
      // Stats Table
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Metric', 20, 80);
      doc.text('Current Value', 140, 80);
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 83, 190, 83);
      
      const metrics = [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
        { label: 'Occupancy Rate', value: `${occupancyRate}%` },
        { label: 'Active Reservations', value: activeReservations.toString() },
        { label: 'Total Staff Count', value: staff.length.toString() },
        { label: 'Pending Service Requests', value: pendingRequests.length.toString() }
      ];
      
      let yPos = 95;
      doc.setFont('helvetica', 'normal');
      metrics.forEach(m => {
        doc.text(m.label, 20, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(m.value, 140, yPos);
        doc.setFont('helvetica', 'normal');
        doc.line(20, yPos + 3, 190, yPos + 3);
        yPos += 15;
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This document is strictly confidential and intended for management only.', 105, 285, { align: 'center' });
      
      doc.save(`Sona_Executive_Report_${new Date().getTime()}.pdf`);
      toast.success("Success", 'Executive Report downloaded successfully!');
    } catch (error) {
      console.error("Report Generation Error:", error);
      toast.error("Error", 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = [
    { label: 'Revenue Pulse', value: `$${totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: <TrendingUp />, color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
    { label: 'Live Occupancy', value: `${occupancyRate}%`, trend: '+4.2%', icon: <Globe />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Active Guests', value: activeReservations, trend: 'Steady', icon: <Users />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Pending Tasks', value: pendingRequests.length, trend: criticalComplaints > 0 ? 'Urgent' : 'Normal', icon: <Zap />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  ];

  return (
    <div className="admin-main-content">
      <div className="admin-dashboard-view">
        
        {/* Header with Glass Effect */}
        <header className="dashboard-header m-b-40 card-header-flex" style={{ marginBottom: '40px' }}>
          <div className="flex-col">
            <div className="flex-center gap-10" style={{justifyContent: 'flex-start'}}>
                <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--admin-border)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="#0ea5e9" />
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '1px' }}>Executive Management System</span>
                </div>
            </div>
            <h1 className="serif dashboard-title" style={{ color: 'var(--admin-text)', marginTop: '12px' }}>Managerial Oversight</h1>
            <p className="dashboard-subtitle" style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: '600', marginTop: '5px' }}>Welcome back, {user?.name}. Manage site performance and strategy.</p>
          </div>
          
          <div className="dashboard-actions flex gap-20 items-center">
             <div className="flex-col items-end time-display" style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--admin-text)' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: '600' }}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
             </div>
             <button 
                onClick={handleExecutiveReport}
                disabled={isGenerating}
                className="btn-sona-primary report-btn" 
                style={{ 
                  background: isGenerating ? '#475569' : '#1e293b', 
                  color: 'white', 
                  border: 'none', 
                  padding: '14px 24px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  boxShadow: '0 10px 25px rgba(30, 41, 59, 0.15)',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  transition: '0.3s'
                }}
             >
               {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
               {isGenerating ? 'Generating...' : 'Executive Report'}
             </button>
          </div>
        </header>

        {/* Dynamic Analytics Grid */}
        <div className="grid-4 stats-grid" style={{ gap: '20px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: i * 0.1 }}
               className="premium-card" 
               style={{ padding: '28px', position: 'relative', overflow: 'hidden', borderBottom: `4px solid ${stat.color}` }}
            >
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: stat.bg, borderRadius: '50%', filter: 'blur(40px)', opacity: 0.6 }}></div>
              <div className="flex-between m-b-20" style={{ position: 'relative' }}>
                <div style={{ padding: '12px', background: stat.bg, color: stat.color, borderRadius: '14px' }}>{stat.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: stat.trend.includes('+') ? '#dcfce7' : '#f1f5f9', color: stat.trend.includes('+') ? '#16a34a' : '#64748b', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                   {stat.trend.includes('+') ? <TrendingUp size={12}/> : <Activity size={12}/>} {stat.trend}
                </div>
              </div>
              <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--admin-text)', marginBottom: '5px' }}>{loading ? <Loader2 size={24} className="animate-spin" /> : stat.value}</h3>
              <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-grid-2">
          
          {/* Recent Operations Hub */}
          <div className="flex-col gap-30">
            
            {/* Live Activity Feed */}
            <div className="premium-card" style={{ padding: '0' }}>
               <div style={{ padding: '30px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="flex gap-15 items-center">
                     <div style={{ color: '#0ea5e9' }}><Activity size={24}/></div>
                     <h3 className="serif" style={{ fontSize: '22px', color: 'var(--admin-text)' }}>Operations Pulse</h3>
                  </div>
                  <div style={{ width: '160px' }}>
                  <CustomDropdown
                     options={['All', 'Bookings', 'Requests']}
                     value={filter}
                     onChange={setFilter}
                     variant="admin"
                  />
               </div>
               </div>
               
               <div style={{ padding: '20px' }}>
                  <div className="flex-col gap-10">
                     {loading ? (
                        <div className="flex-center p-40"><Loader2 className="animate-spin" color="#0ea5e9" size={32} /></div>
                     ) : [...bookings, ...requests]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .filter(item => {
                           if (filter === 'Bookings') return item.totalPrice;
                           if (filter === 'Requests') return !item.totalPrice;
                           return true;
                        })
                        .slice(0, 7)
                        .map((item, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-between p-15" 
                            style={{ background: 'var(--admin-bg)', borderRadius: '16px', border: '1px solid var(--admin-border)', transition: '0.3s' }}
                        >
                           <div className="flex gap-15 items-center">
                              <div style={{ width: '45px', height: '45px', background: item.totalPrice ? 'rgba(14, 165, 233, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: item.totalPrice ? '#0ea5e9' : '#f59e0b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 {item.totalPrice ? <Calendar size={20}/> : <Zap size={20}/>}
                              </div>
                              <div className="flex-col gap-2">
                                 <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--admin-text)' }}>
                                    {item.totalPrice ? `New Registration: ${item.name}` : `${item.type} Request - Room ${item.roomName || 'N/A'}`}
                                 </h4>
                                 <div className="flex gap-10 items-center">
                                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '600' }}><Clock size={10} style={{marginRight: '4px'}}/> {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span style={{ fontSize: '11px', color: item.status?.toLowerCase() === 'pending' ? '#ef4444' : '#10b981', fontWeight: '900', textTransform: 'uppercase' }}>• {item.status}</span>
                                 </div>
                              </div>
                           </div>
                           {item.totalPrice && <span style={{ fontWeight: '900', fontSize: '16px', color: 'var(--admin-text)' }}>${item.totalPrice}</span>}
                           {!item.totalPrice && <button className="btn-sona-primary" style={{ padding: '6px 14px', fontSize: '11px', background: 'var(--admin-sidebar)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)' }}>View</button>}
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>

          </div>

          {/* Managerial Strategy Section */}
          <div className="flex-col gap-30">
            
            {/* Inventory Distribution */}
            <div className="premium-card" style={{ padding: '30px' }}>
               <h3 className="serif" style={{ fontSize: '20px', color: 'var(--admin-text)', marginBottom: '25px' }}>Inventory Insights</h3>
               
               <div className="flex-col gap-20">
                  {[
                    { label: 'Available Suites', count: rooms.filter(r => r.status?.toLowerCase() === 'available').length, total: rooms.length, color: '#10b981' },
                    { label: 'Occupied Units', count: rooms.filter(r => r.status?.toLowerCase() === 'occupied').length, total: rooms.length, color: '#0ea5e9' },
                    { label: 'Under Maintenance', count: rooms.filter(r => r.status?.toLowerCase() === 'maintenance' || r.status?.toLowerCase() === 'dirty').length, total: rooms.length, color: '#ef4444' }
                  ].map((item, i) => (
                      <div key={i} className="flex-col gap-8">
                         <div className="flex-between">
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)' }}>{item.label}</span>
                            <span style={{ fontWeight: '900', color: item.color }}>{item.count} <span style={{ color: 'var(--admin-text-muted)', fontSize: '11px' }}>/ {item.total}</span></span>
                         </div>
                         <div style={{ height: '6px', background: 'var(--admin-border)', borderRadius: '10px', overflow: 'hidden' }}>
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(item.count / item.total) * 100}%` }}
                               transition={{ duration: 1, delay: 0.5 }}
                               style={{ height: '100%', background: item.color, borderRadius: '10px' }}
                            />
                         </div>
                      </div>
                  ))}
               </div>
            </div>
               
             {/* Shift Distribution */}
            <div className="premium-card" style={{ padding: '30px' }}>
               <h3 className="serif" style={{ fontSize: '20px', color: 'var(--admin-text)', marginBottom: '25px' }}>Shift Allocation</h3>
               <div className="flex-col gap-15">
                  {['Morning', 'Evening', 'Night', 'OFF'].map((sName, i) => {
                     const count = staff.filter(m => (m.shift || 'Morning') === sName).length;
                     const percentage = Math.round((count / (staff.length || 1)) * 100);
                     const colors = { Morning: '#0ea5e9', Evening: '#f59e0b', Night: '#8b5cf6', OFF: '#64748b' };
                     return (
                        <div key={i} className="flex-between items-center">
                           <div className="flex gap-12 items-center">
                              <div style={{ width: '12px', height: '12px', background: colors[sName], borderRadius: '3px' }}></div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--admin-text)' }}>{sName}</span>
                           </div>
                           <div className="flex gap-15 items-center">
                              <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--admin-text)' }}>{count} <span style={{ color: 'var(--admin-text-muted)', fontSize: '11px' }}>({percentage}%)</span></span>
                              <ChevronRight size={16} color="var(--admin-border)"/>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

             {/* Strategic Shortcuts */}
            <div className="premium-card" style={{ padding: '30px' }}>
               <h3 className="serif" style={{ fontSize: '20px', color: 'var(--admin-text)', marginBottom: '25px' }}>Strategic Links</h3>
               <div className="grid-2" style={{ gap: '12px' }}>
                  {[
                     { label: 'Staff Roster', icon: <Users size={18}/>, link: '/staff/schedule', color: '#6366f1' },
                     { label: 'Financials', icon: <BarChart3 size={18}/>, link: '/admin/financials', color: '#0ea5e9' },
                     { label: 'Inventory', icon: <Layers size={18}/>, link: '/staff/room-status', color: '#f59e0b' },
                     { label: 'Food Stock', icon: <UtensilsCrossed size={18}/>, link: '/staff/food-inventory', color: '#dfa974' },
                     { label: 'Audit Log', icon: <ShieldCheck size={18}/>, link: '/admin/settings', color: '#10b981' }
                  ].map((act, i) => (
                     <button 
                        key={i} 
                        onClick={() => navigate(act.link)}
                        style={{ padding: '18px 12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', cursor: 'pointer', transition: '0.2s', marginTop: '12px' }} 
                        className="hover-lift"
                     >
                        <div style={{ color: act.color, background: `${act.color}15`, padding: '10px', borderRadius: '12px' }}>{act.icon}</div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text)' }}>{act.label}</span>
                     </button>
                  ))}
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
