import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Features/authSlice';
import ThemeToggle from './ThemeToggle';
import { Phone, Mail, Facebook, Twitter, Instagram, Menu, X, LogOut, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, token, loading } = useSelector((state) => state.auth);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

   const navigate = useNavigate();
   const handleBooking = () => {
      if (token && user) {
         navigate('/rooms');
      } else {
         navigate('/login');
      }
      setIsOpen(false);
   };

   return (
     <>
       <div className="top-bar">
          <div className="container-sona flex-between">
             <div className="flex gap-20">
                <span className="flex-center gap-10"><Phone size={14} color="#dfa974" /> (12) 345 67890</span>
                <span className="flex-center gap-10"><Mail size={14} color="#dfa974" /> info@sonahotel.com</span>
             </div>
             <div className="flex-center gap-20">
                <div className="flex-center gap-10 text-muted">
                   <Facebook size={16} /> <Twitter size={16} /> <Instagram size={16} />
                </div>
             </div>
          </div>
       </div>

       <nav className="main-navbar">
          <div className="container-sona flex-between" style={{height: '100%'}}>
             <Link to="/" className="logo-sona" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>Sona<span>.</span></Link>
             
             <div className="nav-links desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/">Home</Link>
                <Link to="/rooms">Rooms</Link>
                <Link to="/gallery">Gallery</Link>
                <Link to="/about">About</Link>
                <Link to="/news">News</Link>
                <Link to="/contact">Contact</Link>
                {token && user && (
                   user?.role === 'admin' ? (
                      <Link to="/admin/dashboard" style={{color: 'var(--sona-gold)', fontWeight: '800'}}>Dashboard</Link>
                   ) : user?.role === 'staff' ? (
                      <Link to="/staff/dashboard" style={{color: 'var(--sona-gold)', fontWeight: '800'}}>Dashboard</Link>
                   ) : (
                      <Link to="/dashboard" style={{color: 'var(--sona-gold)', fontWeight: '800'}}>Dashboard</Link>
                   )
                )}
             </div>

             <div className="flex-center gap-20">
                <div className="desktop-only flex-center gap-20">
                   {loading && token ? (
                      <div style={{width: '20px', height: '20px', border: '2px solid #f1f5f9', borderTopColor: '#dfa974', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                   ) : (token && user) ? (
                       <div className="flex-center gap-10">
                          <Link to="/profile" style={{textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
                             <span className="hover-lift" style={{fontSize: '13px', fontWeight: '700', color: '#dfa974', background: 'rgba(223, 169, 116, 0.1)', padding: '6px 14px', borderRadius: '20px', whiteSpace: 'nowrap'}}>
                                {user?.name?.split(' ')[0]}
                             </span>
                          </Link>
                          <button onClick={() => dispatch(logout())} className="nav-icon-btn hover-lift flex-center" title="Logout" style={{color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%'}}>
                             <LogOut size={16} />
                          </button>
                       </div>
                   ) : (
                      <Link to="/login" className="premium-nav-link">Login</Link>
                   )}
                   <div style={{width: '1px', height: '25px', background: 'var(--sona-border)', margin: '0'}}></div>
                   <button onClick={handleBooking} className="btn-sona-primary" style={{padding: '8px 20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <Calendar size={14} /> Book Now
                   </button>
                </div>

                <ThemeToggle />

                <button className="mobile-toggle-btn" onClick={() => setIsOpen(!isOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sona-text)'}}>
                   {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
             </div>
          </div>
       </nav>

       {/* Mobile Menu Overlay */}
       <div className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header flex-between container-sona" style={{height: '90px', flexShrink: 0}}>
             <Link to="/" className="logo-sona" onClick={() => setIsOpen(false)} style={{color: 'white'}}>Sona<span>.</span></Link>
             <button onClick={() => setIsOpen(false)} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
                <X size={32} />
             </button>
          </div>
          
          <div className="mobile-nav-content container-sona" style={{flex: 1, overflowY: 'auto', paddingTop: '20px'}}>
             {[
               { name: 'Home', path: '/' },
               { name: 'Rooms', path: '/rooms' },
               { name: 'Gallery', path: '/gallery' },
               { name: 'About', path: '/about' },
               { name: 'News', path: '/news' },
               { name: 'Contact', path: '/contact' }
             ].map((link, i) => (
                <Link 
                  key={i} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'block', fontSize: '18px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', fontWeight: '500' }}
                >
                   {link.name}
                </Link>
             ))}
             
             <div className="mobile-nav-auth" style={{marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', paddingBottom: '40px'}}>
                {loading && token ? (
                   <div style={{width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#dfa974', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                ) : (token && user) ? (
                   <div className="flex-col gap-20">
                      <div className="flex items-center gap-15">
                         <div style={{width: '45px', height: '45px', borderRadius: '15px', background: 'var(--sona-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px'}}>{user?.name?.[0]}</div>
                         <div style={{textAlign: 'left'}}>
                            <p style={{fontSize: '16px', fontWeight: '700', color: 'white', margin: 0}}>{user?.name}</p>
                            <p style={{fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0}}>Verified Member</p>
                         </div>
                      </div>

                      <div className="flex-col gap-10">
                          {user?.role === 'admin' ? (
                             <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="btn-sona-outline" style={{padding: '12px', textAlign: 'center', fontSize: '14px', borderRadius: '10px'}}>Admin Panel</Link>
                          ) : user?.role === 'staff' ? (
                             <Link to="/staff/dashboard" onClick={() => setIsOpen(false)} className="btn-sona-outline" style={{padding: '12px', textAlign: 'center', fontSize: '14px', borderRadius: '10px'}}>Staff Panel</Link>
                          ) : (
                             <Link to="/dashboard" onClick={() => setIsOpen(false)} className="btn-sona-outline" style={{padding: '12px', textAlign: 'center', fontSize: '14px', borderRadius: '10px'}}>Guest Panel</Link>
                          )}
                          <Link to="/profile" onClick={() => setIsOpen(false)} className="btn-sona-outline" style={{padding: '12px', textAlign: 'center', fontSize: '14px', borderRadius: '10px'}}>My Profile</Link>
                       </div>

                      <button onClick={() => { dispatch(logout()); setIsOpen(false); }} className="mobile-logout-btn">
                         <LogOut size={18} /> Sign Out
                      </button>
                   </div>
                ) : (
                   <Link to="/login" onClick={() => setIsOpen(false)} className="btn-sona-outline" style={{display: 'block', textAlign: 'center', padding: '15px', color: 'var(--sona-gold)', border: '1px solid var(--sona-gold)', borderRadius: '12px'}}>Login / Register</Link>
                )}

                <button onClick={handleBooking} className="btn-sona-primary w-full" style={{marginTop: '30px', padding: '18px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
                   <Calendar size={20} /> Reserve A Room
                </button>
             </div>
          </div>
       </div>
    </>
  );
};

export default Navbar;
