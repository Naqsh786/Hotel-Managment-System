import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings as SettingsIcon, TrendingUp, TrendingDown, Plus, Loader2, User, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchDashboardStats, fetchStaff } from '../../Features/adminSlice';
import { fetchAllBookings } from '../../Features/bookingSlice';
import { fetchAdminMessages } from '../../Features/messageSlice';
import { useSocket } from '../../context/SocketContext';
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

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { stats, staff, loading: adminLoading } = useSelector((state) => state.admin);
  const { bookings, loading: bookingLoading } = useSelector((state) => state.bookings);
  const { totalMessages } = useSelector((state) => state.messages);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchStaff());
    dispatch(fetchAllBookings());
    dispatch(fetchAdminMessages({ page: 1, search: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      dispatch(fetchDashboardStats());
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
  }, [socket, dispatch]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  const statsData = [
    { 
      title: 'New Bookings', 
      value: stats?.newBookings || '0', 
      trend: `${stats?.bookingsTrend?.value >= 0 ? '+' : ''}${stats?.bookingsTrend?.value || '0'}%`, 
      up: stats?.bookingsTrend?.up ?? true, 
      icon: '📅', 
      color: 'rgba(133, 242, 66, 0.1)' 
    },
    { 
      title: 'Total Staff', 
      value: stats?.totalStaff || '0', 
      trend: `${stats?.staffTrend?.value >= 0 ? '+' : ''}${stats?.staffTrend?.value || '0'}%`, 
      up: stats?.staffTrend?.up ?? true, 
      icon: '👥', 
      color: 'rgba(223, 169, 116, 0.1)' 
    },
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || '0', 
      trend: `${stats?.usersTrend?.value >= 0 ? '+' : ''}${stats?.usersTrend?.value || '0'}%`, 
      up: stats?.usersTrend?.up ?? true, 
      icon: '👤', 
      color: 'rgba(0, 150, 255, 0.1)' 
    },
    { 
      title: 'Total Revenue', 
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`, 
      trend: `${stats?.revenueTrend?.value >= 0 ? '+' : ''}${stats?.revenueTrend?.value || '0'}%`, 
      up: stats?.revenueTrend?.up ?? true, 
      icon: '💰', 
      color: 'rgba(255, 193, 7, 0.1)' 
    },
  ];

  const recentBookings = bookings?.slice(0, 4) || [];
  const activeStaff = staff?.filter(s => s.status !== 'on-leave').slice(0, 3) || [];

  return (
    <div className="admin-main-content">
      <header className="admin-top-header">
        <div className="admin-search-bar" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
          <Search size={18} color="var(--admin-text-muted)" />
          <input type="text" placeholder="Search room, guest, book, etc" style={{ color: 'var(--admin-text)' }} />
        </div>
        <div className="flex-center gap-20">
           <div 
             className="flex-center gap-10" 
             style={{borderRight: '1px solid var(--admin-border)', paddingRight: '20px', cursor: 'pointer', position: 'relative'}}
             onClick={() => setShowProfileDropdown(!showProfileDropdown)}
           >
              <img src={user?.profileImage || user?.avatar || "https://i.pravatar.cc/150?u=admin"} alt="Admin" style={{width: '36px', height: '36px', borderRadius: '50%'}} />
              <div className="flex-col">
                 <span style={{fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)'}}>{user?.name || "Admin User"}</span>
                 <span style={{fontSize: '11px', color: 'var(--admin-text-muted)'}}>{user?.role || "Administrator"}</span>
              </div>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '200px',
                  background: 'var(--admin-sidebar)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div 
                    onClick={() => navigate('/admin/profile')}
                    style={{padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--admin-text)', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid var(--admin-border)'}}
                  >
                    <User size={16} /> Edit Profile
                  </div>
                  <div 
                    onClick={() => navigate('/admin/settings')}
                    style={{padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--admin-text)', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid var(--admin-border)'}}
                  >
                    <SettingsIcon size={16} /> Settings
                  </div>
                  <div 
                    onClick={handleLogout}
                    style={{padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontSize: '13px', fontWeight: '600'}}
                  >
                    <ArrowUpRight size={16} style={{transform: 'rotate(90deg)'}} /> Logout
                  </div>
                </div>
              )}
           </div>
           
           <div style={{position: 'relative', cursor: 'pointer'}} onClick={() => navigate('/admin/messages')}>
              <Bell size={20} color="var(--admin-text-muted)" />
              {totalMessages > 0 && (
                <div style={{
                  position: 'absolute', 
                  top: '-5px', 
                  right: '-5px', 
                  minWidth: '14px', 
                  height: '14px', 
                  background: '#ef4444', 
                  borderRadius: '50%', 
                  border: '2px solid var(--admin-sidebar)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: 'white',
                  fontWeight: '800',
                  padding: '2px'
                }}>
                  {totalMessages > 9 ? '9+' : totalMessages}
                </div>
              )}
           </div>
        </div>
      </header>

      <div className="admin-dashboard-view">
        <div className="dashboard-header m-b-40" style={{marginBottom: '40px'}}>
           <div className="flex-col">
              <h1 className="dashboard-title" style={{fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px'}}>Dashboard</h1>
              <p className="dashboard-subtitle" style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>Welcome back, {user?.name?.split(' ')[0]}! Here&apos;s what&apos;s happening today.</p>
           </div>
           <div className="dashboard-actions flex gap-20">
              <button style={{background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>Last 30 Days</button>
              <button onClick={() => navigate('/admin/bookings')} style={{background: '#85f242', border: 'none', color: '#1a2e05', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                 <Plus size={18} /> Add Booking
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          {adminLoading ? (
            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div>
          ) : (
            statsData.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="stat-card-premium"
              >
                <div className="flex-between" style={{marginBottom: '20px'}}>
                   <span style={{fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: '600'}}>{stat.title}</span>
                   <div style={{width: '32px', height: '32px', borderRadius: '10px', background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'}}>
                      {stat.icon}
                   </div>
                </div>
                <div className="value" style={{fontSize: '28px', fontWeight: '800', marginBottom: '10px', color: 'var(--admin-text)'}}>{stat.value}</div>
                <div className={`trend ${stat.up ? 'up' : 'down'}`} style={{fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px'}}>
                   {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                   {stat.trend} <span style={{color: 'var(--admin-text-muted)', fontWeight: '400', marginLeft: '4px'}}>from last month</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Premium Charts & Bars Section */}
        <div className="admin-data-grid" style={{marginBottom: '30px'}}>
           <div className="premium-card span-6">
              <div className="card-header-flex">
                 <div className="flex-col">
                    <h3 style={{ color: 'var(--admin-text)' }}>Revenue Analytics</h3>
                    <p style={{fontSize: '11px', color: 'var(--admin-text-muted)'}}>Daily earnings for the current week</p>
                 </div>
                 <div className="flex gap-10">
                    <span style={{fontSize: '12px', fontWeight: '600', color: '#85f242'}}>${stats?.totalRevenue?.toLocaleString() || '0'} Total</span>
                 </div>
              </div>
              
              <div style={{ height: '240px', width: '100%', marginTop: '20px' }}>
                 <Bar 
                   data={{
                     labels: stats?.chartLabels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                     datasets: [
                       {
                         label: 'Revenue ($)',
                         data: stats?.revenueChart || [0, 0, 0, 0, 0, 0, 0],
                         backgroundColor: (context) => {
                             if (context.dataIndex === (stats?.revenueChart?.length - 1 || 6)) return '#85f242';
                             return 'var(--admin-border)';
                         },
                         borderRadius: 8,
                         borderWidth: 0,
                         barThickness: 35,
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
                         padding: 10,
                         displayColors: false,
                         callbacks: {
                           label: (context) => `$${context.raw.toLocaleString()}`
                         }
                       }
                     },
                     scales: {
                       y: {
                         display: false,
                         beginAtZero: true,
                       },
                       x: {
                         grid: { display: false, drawBorder: false },
                         ticks: { color: '#888', font: { size: 11, weight: '700' } }
                       }
                     }
                   }}
                 />
              </div>
           </div>

           <div className="premium-card span-2">
              <div className="card-header-flex">
                 <h3 style={{ color: 'var(--admin-text)' }}>Occupancy</h3>
              </div>
              <div className="flex-col flex-center" style={{padding: '20px 0'}}>
                 <div style={{width: '120px', height: '120px', borderRadius: '50%', border: '12px solid #85f242', borderRightColor: 'var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                    <div className="flex-col flex-center">
                       <span style={{fontSize: '24px', fontWeight: '800', color: 'var(--admin-text)'}}>{stats?.occupancyRate || '0'}%</span>
                       <span style={{fontSize: '10px', color: 'var(--admin-text-muted)'}}>Occupied</span>
                    </div>
                 </div>
                 <div className="flex-col w-full gap-10" style={{marginTop: '30px', width: '100%'}}>
                    <div className="flex-between">
                       <span style={{fontSize: '12px', color: 'var(--admin-text-muted)'}}>Active Rooms</span>
                       <span style={{fontSize: '12px', fontWeight: '700', color: 'var(--admin-text)'}}>{stats?.activeRooms || '0'}</span>
                    </div>
                    <div style={{height: '4px', background: 'var(--admin-border)', borderRadius: '2px'}}><div style={{width: `${stats?.occupancyRate || 0}%`, height: '100%', background: '#85f242', borderRadius: '2px'}}></div></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Recent Activity & Table Section */}
        <div className="admin-data-grid">
           <div className="premium-card span-6">
              <div className="card-header-flex">
                 <h3 style={{ color: 'var(--admin-text)' }}>Recent Bookings</h3>
                 <button onClick={() => navigate('/admin/bookings')} style={{fontSize: '12px', fontWeight: '700', color: '#85f242', background: 'none', border: 'none', cursor: 'pointer'}}>View All</button>
              </div>
              <div className="premium-table-wrapper">
                 <table className="premium-table">
                    <thead>
                       <tr>
                          <th>ID</th>
                          <th>Guest</th>
                          <th>Room</th>
                          <th>Check In</th>
                          <th>Status</th>
                       </tr>
                    </thead>
                    <tbody>
                       {bookingLoading ? (
                         <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}><Loader2 className="animate-spin" /></td></tr>
                       ) : recentBookings.length === 0 ? (
                         <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--admin-text-muted)' }}>No recent bookings</td></tr>
                       ) : (
                         recentBookings.map((row) => (
                           <tr key={row._id}>
                              <td style={{color: 'var(--admin-text-muted)', fontWeight: '700'}}>#{row._id?.slice(-4)}</td>
                              <td style={{fontWeight: '700', color: 'var(--admin-text)'}}>{row.name}</td>
                              <td style={{color: 'var(--admin-text-muted)'}}>{row.room?.name || 'Room'}</td>
                              <td style={{fontSize: '13px', color: 'var(--admin-text)'}}>{new Date(row.checkIn).toLocaleDateString()}</td>
                              <td><span className="status-pill" style={{
                                backgroundColor: row.status === 'confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)', 
                                color: row.status === 'confirmed' ? '#2e7d32' : '#b45309'
                              }}>{row.status}</span></td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="premium-card span-2">
              <div className="card-header-flex">
                 <h3 style={{ color: 'var(--admin-text)' }}>Active Staff</h3>
              </div>
              <div className="flex-col gap-20">
                 {activeStaff.length === 0 ? (
                   <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', textAlign: 'center' }}>No active staff</p>
                 ) : (
                   activeStaff.map((staff) => (
                      <div key={staff._id} className="flex-center gap-10" style={{justifyContent: 'flex-start'}}>
                         <img src={staff.image || `https://i.pravatar.cc/150?u=${staff._id}`} alt={staff.name} style={{width: '32px', height: '32px', borderRadius: '50%'}} />
                         <div className="flex-col">
                            <span style={{fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)'}}>{staff.name}</span>
                            <span style={{fontSize: '11px', color: 'var(--admin-text-muted)'}}>{staff.designation || 'Staff'}</span>
                         </div>
                         <div style={{marginLeft: 'auto', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%'}}></div>
                      </div>
                   ))
                 )}
                 <button onClick={() => navigate('/admin/staff')} style={{marginTop: '10px', width: '100%', padding: '10px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: '10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer'}}>
                    Manage All Staff
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
