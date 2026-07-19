import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, ArrowUpRight, ArrowDownRight, CreditCard, PieChart, Download, Loader2 } from 'lucide-react';
import { fetchDashboardStats } from '../../Features/adminSlice';
import { fetchAllBookings } from '../../Features/bookingSlice';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminFinancials = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading: adminLoading } = useSelector(state => state.admin);
  const { bookings, loading: bookingLoading } = useSelector(state => state.bookings);
  const socket = useSocket();
  const [activeRange, setActiveRange] = useState('W');
  const [isUpdatingChart, setIsUpdatingChart] = useState(false);
  const { toast } = useToast();

  // Initial load
  useEffect(() => {
    dispatch(fetchDashboardStats(activeRange));
    dispatch(fetchAllBookings());
  }, [dispatch, activeRange]);

  // Range update effect - only fetch stats
  useEffect(() => {
    const updateStats = async () => {
      setIsUpdatingChart(true);
      await dispatch(fetchDashboardStats(activeRange));
      setIsUpdatingChart(false);
    };
    
    // Skip on first mount since initial load handles it
    if (stats) {
      updateStats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, activeRange]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      dispatch(fetchDashboardStats(activeRange));
      dispatch(fetchAllBookings());
    };

    socket.on('statsUpdated', handleUpdate);
    socket.on('newBooking', handleUpdate);
    socket.on('bookingStatusUpdate', handleUpdate);

    return () => {
      socket.off('statsUpdated', handleUpdate);
      socket.off('newBooking', handleUpdate);
      socket.off('bookingStatusUpdate', handleUpdate);
    };
  }, [socket, dispatch, activeRange]);

  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'completed') || [];
  const totalRevenue = stats?.totalRevenue || 0;
  const avgBooking = stats?.avgBookingValue || 0;

  const handleExport = () => {
    if (confirmedBookings.length === 0) return toast.info("Export Info", "No validated transactions to export");
    
    const headers = ["Guest Name", "Room", "Amount", "Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...confirmedBookings.map(b => 
        `"${b.name}","${b.room?.name || 'Room'}","${b.totalPrice}","${new Date(b.createdAt).toLocaleDateString()}","${b.status}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cards = [
    { 
      title: 'Total Revenue', 
      value: `$${totalRevenue.toLocaleString()}`, 
      trend: `${stats?.revenueTrend?.value >= 0 ? '+' : ''}${stats?.revenueTrend?.value || '0'}%`, 
      up: stats?.revenueTrend?.up ?? true, 
      icon: <DollarSign />, 
      color: '#85f242' 
    },
    { 
      title: 'Avg. Booking', 
      value: `$${avgBooking.toLocaleString()}`, 
      trend: `${stats?.bookingsTrend?.value >= 0 ? '+' : ''}${stats?.bookingsTrend?.value || '0'}%`, 
      up: stats?.bookingsTrend?.up ?? true, 
      icon: <CreditCard />, 
      color: '#3b82f6' 
    },
    { 
      title: 'Total Bookings', 
      value: confirmedBookings.length, 
      trend: `${stats?.bookingsTrend?.value >= 0 ? '+' : ''}${stats?.bookingsTrend?.value || '0'}%`, 
      up: stats?.bookingsTrend?.up ?? true, 
      icon: <Calendar />, 
      color: '#f59e0b' 
    },
    { 
      title: 'Revenue Target', 
      value: `${stats?.revenueTarget || 0}%`, 
      trend: `${stats?.revenueTrend?.value >= 0 ? '+' : ''}${stats?.revenueTrend?.value || '0'}%`, 
      up: stats?.revenueTrend?.up ?? true, 
      icon: <PieChart />, 
      color: '#10b981' 
    },
  ];

  return (
    <div className="admin-main-content">
      <div className="admin-dashboard-view">
        <header className="dashboard-header m-b-40">
           <div className="flex-col">
              <h1 className="dashboard-title" style={{fontSize: '32px', fontWeight: '800', color: 'var(--admin-text)', marginBottom: '8px', letterSpacing: '-0.5px'}}>Financial Intelligence</h1>
              <p className="dashboard-subtitle text-muted" style={{fontSize: '14px'}}>In-depth analysis of your revenue streams and booking performance.</p>
           </div>
           <div className="dashboard-actions flex gap-15">
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="action-btn-main"
                style={{background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px 20px', borderRadius: '15px', fontSize: '14px', fontWeight: '700', cursor: 'pointer'}}
              >
                Overview
              </button>
              <button 
                onClick={handleExport}
                className="btn-sona-primary report-btn"
                style={{background: '#85f242', border: 'none', color: '#1a2e05', padding: '12px 24px', borderRadius: '15px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(133, 242, 66, 0.2)'}}
              >
                 <Download size={18} /> Export CSV
              </button>
           </div>
        </header>

        {/* Stats Grid - Premium Glassmorphism */}
        <div className="admin-stats-grid" style={{marginBottom: '40px'}}>
           {adminLoading && !stats ? (
             <div style={{gridColumn: 'span 4', textAlign: 'center', padding: '40px'}}><Loader2 className="animate-spin" color="#85f242" /></div>
           ) : (
             cards.map((card, i) => (
                <motion.div 
                  key={i} 
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{delay: i * 0.1}}
                  className="stat-card-premium"
                  style={{
                    background: 'linear-gradient(135deg, var(--admin-sidebar) 0%, rgba(26, 46, 5, 0.05) 100%)',
                    border: '1px solid var(--admin-border)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                   <div style={{position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: card.color, opacity: 0.05, borderRadius: '50%'}}></div>
                   <div className="flex-between m-b-15">
                      <div style={{background: card.color + '20', color: card.color, padding: '12px', borderRadius: '15px'}}>
                         {card.icon}
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: card.up ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: card.up ? '#22c55e' : '#ef4444', padding: '5px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800'}}>
                         {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                         {card.trend}
                      </div>
                   </div>
                   <h4 style={{color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '15px 0 5px'}}>{card.title}</h4>
                   <div style={{fontSize: '32px', fontWeight: '900', color: 'var(--admin-text)', letterSpacing: '-1px'}}>{card.value}</div>
                </motion.div>
             ))
           )}
        </div>

        {/* Dynamic Analytics & Table */}
        <div className="admin-data-grid m-t-30">
           <div className="premium-card span-8" style={{padding: '30px', position: 'relative'}}>
              {isUpdatingChart && (
                <div style={{position: 'absolute', top: '10px', right: '30px'}}><Loader2 className="animate-spin" size={18} color="#85f242" /></div>
              )}
              <div className="card-header-flex m-b-30" style={{marginBottom: '30px'}}>
                 <div className="flex-col">
                    <h3 style={{fontSize: '20px', fontWeight: '800'}}>Revenue Trend ({activeRange === 'W' ? '7-Day' : activeRange === 'M' ? '30-Day' : 'Annual'})</h3>
                    <p style={{fontSize: '12px', color: 'var(--admin-text-muted)'}}>Aggregated earnings across all room categories.</p>
                 </div>
                 <div className="flex gap-15" style={{background: 'var(--admin-bg)', padding: '5px', borderRadius: '12px'}}>
                    {['W', 'M', 'Y'].map(t => (
                      <button 
                        key={t} 
                        onClick={() => setActiveRange(t)}
                        style={{
                          padding: '5px 12px', 
                          borderRadius: '8px', 
                          border: 'none', 
                          background: t === activeRange ? '#85f242' : 'transparent', 
                          color: t === activeRange ? '#1a2e05' : 'var(--admin-text-muted)', 
                          fontWeight: '700', 
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: '0.2s'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
              </div>
              
              <div style={{ height: '350px', width: '100%', marginTop: '20px', paddingBottom: '20px', opacity: isUpdatingChart ? 0.5 : 1, transition: '0.3s' }}>
                 <Bar 
                   data={{
                     labels: stats?.chartLabels || [],
                     datasets: [
                       {
                         label: 'Revenue ($)',
                         data: stats?.revenueChart || [],
                         backgroundColor: (context) => {
                             const ctx = context.chart.ctx;
                             const gradient = ctx.createLinearGradient(0, 0, 0, 350);
                             gradient.addColorStop(0, 'rgba(133, 242, 66, 0.8)');
                             gradient.addColorStop(1, 'rgba(133, 242, 66, 0.1)');
                             return gradient;
                         },
                         borderRadius: 12,
                         borderWidth: 0,
                         barThickness: activeRange === 'Y' ? 30 : activeRange === 'M' ? 20 : 45,
                       }
                     ]
                   }}
                   options={{
                     responsive: true,
                     maintainAspectRatio: false,
                     plugins: {
                       legend: { display: false },
                       tooltip: {
                         backgroundColor: '#1a2e05',
                         titleColor: '#85f242',
                         bodyColor: 'white',
                         padding: 12,
                         displayColors: false,
                         callbacks: {
                           label: (context) => `$${context.raw.toLocaleString()}`
                         }
                       }
                     },
                     scales: {
                       y: {
                         beginAtZero: true,
                         grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                         ticks: { color: '#888', font: { size: 11, weight: '600' } }
                       },
                       x: {
                         grid: { display: false, drawBorder: false },
                         ticks: { color: '#888', font: { size: 11, weight: '700', letterSpacing: 0.5 } }
                       }
                     }
                   }}
                 />
              </div>
           </div>

           <div className="premium-card span-8" style={{marginTop: '30px', padding: '30px'}}>
              <div className="card-header-flex m-b-30" style={{marginBottom: '30px'}}>
                 <div className="flex-col">
                    <h3 style={{fontSize: '20px', fontWeight: '800'}}>Transaction Audit</h3>
                    <p style={{fontSize: '12px', color: 'var(--admin-text-muted)'}}>Detailed log of confirmed revenue-generating activities.</p>
                 </div>
                 <button 
                  onClick={() => navigate('/admin/bookings')}
                  style={{fontSize: '13px', fontWeight: '700', color: '#85f242', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}
                 >
                  Manage All Bookings
                 </button>
              </div>

              <div className="premium-table-wrapper">
                <table className="premium-table">
                 <thead>
                    <tr>
                       <th style={{padding: '15px 20px'}}>Internal Ref</th>
                       <th>Customer</th>
                       <th>Allocation</th>
                       <th>Captured Amount</th>
                       <th>Completion Date</th>
                       <th style={{textAlign: 'right', paddingRight: '20px'}}>Validation</th>
                    </tr>
                 </thead>
                 <tbody>
                    {bookingLoading ? (
                       <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}><Loader2 className="animate-spin" size={30} color="#85f242" /></td></tr>
                    ) : confirmedBookings.length === 0 ? (
                       <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)'}}>No validated transactions found.</td></tr>
                    ) : (
                       confirmedBookings.map((booking) => (
                          <tr key={booking._id} style={{borderBottom: '1px solid var(--admin-border)'}}>
                             <td style={{padding: '20px', fontWeight: '800', color: 'var(--admin-text-muted)', fontFamily: 'monospace'}}>#TRX-{booking._id?.slice(-6).toUpperCase()}</td>
                             <td style={{fontWeight: '700', color: 'var(--admin-text)'}}>{booking.name}</td>
                             <td style={{color: 'var(--admin-text-muted)', fontSize: '13px'}}>{booking.room?.name || 'Assigned Room'}</td>
                             <td><span style={{fontWeight: '900', color: '#85f242', fontSize: '15px'}}>${booking.totalPrice?.toLocaleString()}</span></td>
                             <td style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>{new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                             <td style={{textAlign: 'right', paddingRight: '20px'}}>
                                <span style={{
                                   background: 'rgba(34, 197, 94, 0.1)', 
                                   color: '#22c55e', 
                                   padding: '6px 12px', 
                                   borderRadius: '10px', 
                                   fontSize: '11px', 
                                   fontWeight: '800',
                                   textTransform: 'uppercase'
                                }}>VERIFIED</span>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancials;
