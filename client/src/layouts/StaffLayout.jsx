import { useEffect, useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import * as Lucide from 'lucide-react';
import { 
  LayoutDashboard, CalendarDays, Key, ClipboardList, LogOut, 
  Users, AlertCircle, CheckSquare, UserPlus, FileText, Shield,
  Menu, X, UtensilsCrossed
} from 'lucide-react';
import { logout } from '../Features/authSlice';
import { fetchAllBookings } from '../Features/bookingSlice';
import { fetchAllRooms } from '../Features/roomSlice';
import { fetchAllServiceRequests } from '../Features/serviceRequestSlice';

import ThemeToggle from '../components/ThemeToggle';

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, token, loading: authLoading } = useSelector((state) => state.auth);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { bookings } = useSelector((state) => state.bookings);
  const { rooms } = useSelector((state) => state.rooms);
  const { requests } = useSelector((state) => state.serviceRequests);
  const { unreadCount: chatUnreadCount } = useSelector((state) => state.chat);
  
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchAllBookings());
      dispatch(fetchAllRooms());
      dispatch(fetchAllServiceRequests());
    }
  }, [dispatch, token]);
  
  if (authLoading && !user) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--admin-bg)'}}>
        <div className="flex-col-center gap-20">
          <div style={{width: '60px', height: '60px', border: '5px solid var(--admin-border)', borderTopColor: 'var(--sona-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
          <p style={{fontWeight: '700', color: 'var(--admin-text)', letterSpacing: '1px'}}>VERIFYING SESSION...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!token || user?.role !== 'staff') {
    return <Navigate to="/login" replace />;
  }

  const isManager = user?.responsibility === 'Manager';
  const isReceptionist = user?.responsibility === 'Receptionist';
  const isSecurity = user?.responsibility === 'Security';

  const managerMenu = [
    { name: 'Ops Dashboard', icon: <LayoutDashboard size={20} />, path: '/staff/dashboard' },
    { name: 'Staff Monitor', icon: <Users size={20} />, path: '/staff/monitor' },
    { name: 'Food Stock', icon: <UtensilsCrossed size={20} />, path: '/staff/food-inventory' },
    { name: 'Complaints', icon: <AlertCircle size={20} />, path: '/staff/complaints', badge: requests.filter(r => r.type === 'Maintenance' && r.status === 'Pending').length },
    { name: 'Approvals', icon: <CheckSquare size={20} />, path: '/staff/approvals', badge: requests.filter(r => r.type !== 'Maintenance' && r.status === 'Pending').length },
    { name: 'Live Chat', icon: <Lucide.MessageCircle size={20} />, path: '/staff/chat', badge: chatUnreadCount },
    { name: 'Inventory', icon: <Key size={20} />, path: '/staff/inventory' },
  ];

  const receptionistMenu = [
    { name: 'Front Desk', icon: <LayoutDashboard size={20} />, path: '/staff/dashboard' },
    { name: 'Walk-in Booking', icon: <UserPlus size={20} />, path: '/staff/walk-in' },
    { name: 'Guest List', icon: <Users size={20} />, path: '/staff/guests' },
    { name: 'Room Status', icon: <Key size={20} />, path: '/staff/rooms', badge: rooms.filter(r => r.status === 'dirty').length },
    { name: 'Live Chat', icon: <Lucide.MessageCircle size={20} />, path: '/staff/chat', badge: chatUnreadCount },
    { name: 'Billing/Invoices', icon: <FileText size={20} />, path: '/staff/billing' },
  ];

  const securityMenu = [
    { name: 'Command Center', icon: <Shield size={20} />, path: '/staff/dashboard' },
    { name: 'Site Surveillance', icon: <Lucide.Camera size={20} />, path: '/staff/monitor' },
    { name: 'Incident Center', icon: <Lucide.AlertCircle size={20} />, path: '/staff/complaints', badge: requests.filter(r => r.status === 'Pending').length },
    { name: 'Duty Roster', icon: <Lucide.CalendarDays size={20} />, path: '/staff/schedule' },
  ];

  const menuItems = isManager ? managerMenu : (isReceptionist ? receptionistMenu : (isSecurity ? securityMenu : [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/staff/dashboard' },
    { name: 'My Tasks', icon: <ClipboardList size={20} />, path: '/staff/tasks', badge: 3 },
    { name: 'Room Service', icon: <Key size={20} />, path: '/staff/room-service', badge: requests.filter(r => r.status === 'Pending').length },
    { name: 'Live Chat', icon: <Lucide.MessageCircle size={20} />, path: '/staff/chat', badge: chatUnreadCount },
    { name: 'Schedule', icon: <CalendarDays size={20} />, path: '/staff/schedule' },
  ]));

  const brandColor = isManager ? '#dfa974' : (isReceptionist ? '#38bdf8' : (isSecurity ? '#dfa974' : '#85f242'));

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-wrapper" style={{background: 'var(--admin-bg)'}}>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle-btn" 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 2500,
          background: brandColor,
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '8px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${brandColor}44`
        }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {sidebarOpen && <div className="dashboard-overlay" onClick={closeSidebar}></div>}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease' }}>
         <div className="admin-sidebar-header" style={{ borderBottom: '1px solid var(--admin-border)' }}>
        <div className="brand-logo-mini flex gap-1">
           <div style={{width: '8px', height: '8px', background: brandColor, borderRadius: '2px'}}></div>
           <div style={{width: '8px', height: '8px', background: 'var(--admin-text-muted)', borderRadius: '2px', opacity: 0.5}}></div>
        </div>
        <span style={{fontSize: '20px', fontWeight: '800', color: 'var(--admin-text)'}}>
           {isManager ? 'Manager' : (isReceptionist ? 'Receptionist' : (isSecurity ? 'Security HQ' : 'Staff'))}
        </span>
        <button className="mobile-only" onClick={closeSidebar} style={{marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--admin-text-muted)'}}>
            <X size={20} />
        </button>
     </div>

        <div style={{padding: '30px 20px 20px', textAlign: 'center'}}>
           {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} style={{width: '80px', height: '80px', borderRadius: '50%', border: `3px solid ${brandColor}`, justifySelf: 'center', margin: '0 auto', objectFit: 'cover'}} />
           ) : (
              <div style={{width: '80px', height: '80px', borderRadius: '50%', background: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'var(--admin-text)', fontSize: '24px', fontWeight: '800', border: `2px solid ${brandColor}`}}>
                 {user?.name?.charAt(0)}
              </div>
           )}
           <p style={{color: 'var(--admin-text)', fontWeight: '700', marginTop: '15px'}}>{user?.name}</p>
           <p style={{fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '5px'}}>{user?.email}</p>
        </div>

        <nav className="admin-sidebar-nav" style={{marginTop: '10px'}}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
                style={{ 
                  color: isActive ? brandColor : 'var(--admin-text-muted)',
                  background: isActive ? 'var(--admin-hover)' : 'transparent'
                }}
              >
                <span className="admin-nav-icon" style={{color: isActive ? brandColor : 'inherit'}}>{item.icon}</span>
                <span className="admin-nav-text">{item.name}</span>
                {item.badge > 0 && (
                  <span style={{ 
                    marginLeft: 'auto', 
                    background: item.name === 'Complaints' || item.name === 'Room Status' ? '#ef4444' : brandColor, 
                    color: 'white', 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontWeight: '900' 
                  }}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <style>{`
                    .admin-nav-item.active::before { background: ${brandColor} !important; }
                  `}</style>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{padding: '10px 20px', borderTop: '1px solid var(--admin-border)'}}>
           <ThemeToggle variant="sidebar" />
           <button 
             onClick={() => dispatch(logout())} 
             className="admin-nav-item" 
             style={{
               background: 'rgba(239, 68, 68, 0.1)', 
               color: '#ef4444', 
               border: '1px solid rgba(239, 68, 68, 0.2)', 
               width: '100%', 
               cursor: 'pointer', 
               textAlign: 'left',
               fontWeight: '700'
             }}
           >
              <span className="admin-nav-icon"><LogOut size={18} /></span>
              <span className="admin-nav-text">Sign Out</span>
           </button>
        </div>
      </aside>
      <Outlet />

      <style>{`
        @media (max-width: 991px) {
          .mobile-toggle-btn { display: flex !important; }
          .admin-sidebar .mobile-only { display: block !important; }
        }
        .admin-sidebar .mobile-only { display: none; }
      `}</style>
    </div>
  );
};

export default StaffLayout;
