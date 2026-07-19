import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ThemeToggle from './ThemeToggle';
import * as Lucide from 'lucide-react';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const dispatch = useDispatch();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { darkMode } = useSelector((state) => state.theme);
  const { totalMessages } = useSelector((state) => state.messages);
  const { unreadCount: chatUnreadCount } = useSelector((state) => state.chat);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  
  const menuItems = [
    { name: 'Dashboard', icon: <Lucide.LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Reservation', icon: <Lucide.CalendarDays size={20} />, path: '/admin/reservations' },
    { name: 'Rooms', icon: <Lucide.BedDouble size={20} />, path: '/admin/rooms' },
    { name: 'Add-ons', icon: <Lucide.Plus size={20} />, path: '/admin/addons' },
    { name: 'Live Chat', icon: <Lucide.MessageCircle size={20} />, path: '/admin/chat', badge: chatUnreadCount },
    { name: 'Messages', icon: <Lucide.MessageSquare size={20} />, path: '/admin/messages', badge: totalMessages },
    { name: 'Users', icon: <Lucide.Users size={20} />, path: '/admin/users' },
    { name: 'Staff', icon: <Lucide.UserSquare size={20} />, path: '/admin/staff' },
    { name: 'Security HQ', icon: <Lucide.Shield size={20} />, path: '/admin/security' },
    { name: 'Financials', icon: <Lucide.DollarSign size={20} />, path: '/admin/financials' },
    { name: 'Reviews', icon: <Lucide.Star size={20} />, path: '/admin/reviews' },
    { name: 'Home Settings', icon: <Lucide.Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle-btn" 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 2500,
          background: 'var(--sona-gold)',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '8px',
          display: 'none', // Controlled by CSS media queries
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(223, 169, 116, 0.4)'
        }}
      >
        {isOpen ? <Lucide.X size={24} /> : <Lucide.Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="dashboard-overlay" onClick={closeSidebar}></div>}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} style={{ transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease' }}>
        <div className="admin-sidebar-header">
           <div className="brand-logo-mini flex gap-1">
              <div style={{width: '8px', height: '8px', background: '#85f242', borderRadius: '2px'}}></div>
              <div style={{width: '8px', height: '8px', background: 'var(--admin-text-muted)', borderRadius: '2px', opacity: 0.5}}></div>
           </div>
           <span style={{fontSize: '20px', fontWeight: '800', color: 'var(--admin-text)'}}>Lodgify</span>
           <button className="mobile-only" onClick={closeSidebar} style={{marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--admin-text-muted)'}}>
              <Lucide.X size={20} />
           </button>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-text">{item.name}</span>
              {item.badge && <span className="link-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div style={{padding: '15px 20px', borderTop: '1px solid var(--admin-border)'}}>
           <ThemeToggle variant="sidebar" />
           <Link to="/" className="admin-nav-item" style={{background: 'var(--sona-gold)', color: 'white', justifyContent: 'center'}}>
              <span className="admin-nav-icon" style={{marginRight: '10px'}}><Lucide.Star size={18} /></span>
              <span className="admin-nav-text">View Website</span>
           </Link>
        </div>
      </aside>
      
      <style>{`
        @media (max-width: 991px) {
          .mobile-toggle-btn { display: flex !important; }
          .admin-sidebar .mobile-only { display: block !important; }
        }
        .admin-sidebar .mobile-only { display: none; }
      `}</style>
    </>
  );
};

export default AdminSidebar;
