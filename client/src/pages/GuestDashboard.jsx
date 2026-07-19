import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updatePassword } from '../Features/authSlice';
import { fetchMyBookings } from '../Features/bookingSlice';
import { fetchMyServiceRequests } from '../Features/serviceRequestSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, Bell, Shield, Home, Menu, X,
  TrendingUp, Star, Utensils, Eye, EyeOff
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import BookingList from '../components/BookingList';
import ProfilePage from './ProfilePage';
import FoodMenu from './FoodMenu';
import ServiceRequest from './ServiceRequest';
import AddReviewForm from './AddReviewForm';
import { useToast } from '../context/ToastContext';

const GuestDashboard = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { user, token } = useSelector(state => state.auth);
   const { bookings } = useSelector(state => state.bookings);
   const { requests } = useSelector(state => state.serviceRequests);
   const { toast } = useToast();

   useEffect(() => {
      if (!token) {
         navigate('/login');
      }
   }, [token, navigate]);

   useEffect(() => {
      if (token) {
         dispatch(fetchMyBookings());
         dispatch(fetchMyServiceRequests());
      }
   }, [dispatch, token]);

   const [activeTab, setActiveTab] = useState('overview');
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [isNotifyOpen, setIsNotifyOpen] = useState(false);
   const [showCurrent, setShowCurrent] = useState(false);
   const [showNew, setShowNew] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);

   // Password Update Form
   const {
      register,
      handleSubmit,
      reset,
      watch,
      setError,
      formState: { errors }
   } = useForm({ mode: "onChange" });

   const onPasswordUpdate = async (data) => {
      if (data.newPassword !== data.confirmPassword) {
         toast.error("Validation Error", "Passwords do not match!");
         return;
      }
      
      try {
         const resultAction = await dispatch(updatePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
         }));

         if (updatePassword.fulfilled.match(resultAction)) {
            toast.success("Security Updated", "Your account password has been successfully changed.");
            reset();
         } else {
            // Check if the error is related to the current password
            const errorMsg = resultAction.payload || "Failed to update password";
            if (errorMsg.toLowerCase().includes("current password")) {
               setError("currentPassword", { type: "manual", message: errorMsg });
            } else {
               toast.error("Update Failed", errorMsg);
            }
         }
      } catch (error) {
         toast.error("System Error", "An unexpected error occurred while updating your credentials.");
      }
   };

   const activeReservations = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in');

   const totalSpent = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0) +
      requests.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

   // Derive notifications
   const notifications = [
      ...bookings.filter(b => b.status !== 'pending').map(b => ({
         id: `b-${b._id}`,
         title: 'Booking Update',
         message: `Your booking for ${b.room?.name || 'Room'} is now ${b.status}.`,
         time: b.updatedAt,
         type: 'booking'
      })),
      ...requests.filter(r => r.status !== 'Pending').map(r => ({
         id: `r-${r._id}`,
         title: 'Service Update',
         message: `Your ${r.type} request is now ${r.status}.`,
         time: r.updatedAt,
         type: 'service'
      }))
   ].sort((a, b) => new Date(b.time) - new Date(a.time));

   return (
      <div className="admin-wrapper" style={{ background: 'var(--admin-bg)' }}>
         {/* Overlay */}
         {sidebarOpen && <div className="dashboard-overlay" onClick={() => setSidebarOpen(false)}></div>}

         {/* Mobile Toggle Button */}
         <button 
            className="mobile-toggle-btn" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
               position: 'fixed',
               top: '20px',
               left: '20px',
               zIndex: 2500,
               background: 'var(--sona-gold)',
               color: 'white',
               border: 'none',
               padding: '12px',
               borderRadius: '12px',
               display: 'none', // Controlled by global CSS
               alignItems: 'center',
               justifyContent: 'center',
               boxShadow: '0 8px 20px rgba(223, 169, 116, 0.4)'
            }}
         >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
         </button>

         <aside className={`admin-sidebar guest-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="admin-sidebar-header">
               <div className="brand-logo-mini flex gap-1">
                  <div style={{width: '8px', height: '8px', background: 'var(--sona-gold)', borderRadius: '2px'}}></div>
                  <div style={{width: '8px', height: '8px', background: 'var(--admin-text-muted)', borderRadius: '2px', opacity: 0.5}}></div>
               </div>
               <span style={{fontSize: '20px', fontWeight: '800', color: 'var(--admin-text)'}}>SONA</span>
               <button className="mobile-only" onClick={() => setSidebarOpen(false)} style={{marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--admin-text-muted)'}}>
                  <X size={20} />
               </button>
            </div>

            <nav className="admin-sidebar-nav" style={{ flex: 1, marginTop: '20px' }}>
               {[
                  { id: 'overview', label: 'Dashboard', icon: <Home size={18} /> },
                  { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
                  { id: 'services', label: 'Room Service', icon: <Utensils size={18} /> },
                  { id: 'dining', label: 'Food Menu', icon: <TrendingUp size={18} /> },
                  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
                  { id: 'reviews', label: 'Feedback', icon: <Star size={18} /> }
               ].map(item => (
                  <button 
                     key={item.id}
                     onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                     className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                     style={{ 
                        width: '100%',
                        border: 'none',
                        background: activeTab === item.id ? 'var(--admin-hover)' : 'transparent', 
                        color: activeTab === item.id ? 'var(--sona-gold)' : 'var(--admin-text-muted)', 
                        cursor: 'pointer',
                        justifyContent: 'flex-start',
                        gap: '15px'
                     }}
                  >
                     <span className="admin-nav-icon" style={{ color: activeTab === item.id ? 'var(--sona-gold)' : 'inherit' }}>{item.icon}</span>
                     <span className="admin-nav-text">{item.label}</span>
                  </button>
               ))}
            </nav>

            <div style={{ padding: '20px', borderTop: '1px solid var(--admin-border)' }}>
               <button 
                  onClick={() => dispatch(logout())} 
                  className="admin-nav-item logout-btn-premium"
                  style={{ 
                     width: '100%',
                     background: 'rgba(239, 68, 68, 0.08)', 
                     color: '#ef4444', 
                     border: '1px solid rgba(239, 68, 68, 0.15)',
                     cursor: 'pointer',
                     justifyContent: 'flex-start',
                     gap: '15px',
                     padding: '12px 18px',
                     borderRadius: '12px',
                     transition: 'all 0.3s'
                  }}
               >
                  <span className="admin-nav-icon"><LogOut size={18} /></span>
                  <span className="admin-nav-text" style={{fontWeight: '800'}}>Sign Out</span>
               </button>
            </div>
         </aside>

         <main className="admin-main-content" style={{ padding: '30px', minHeight: '100vh' }}>
            <style>{`
               .dashboard-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 40px;
                  gap: 20px;
               }
               @media (max-width: 991px) {
                  .mobile-toggle-btn { display: flex !important; }
                  .dashboard-header {
                     display: flex !important;
                     flex-direction: column !important;
                     align-items: flex-start !important;
                     margin-top: 50px;
                     gap: 15px;
                  }
               }
               
               .user-avatar {
                  width: 45px !important;
                  height: 45px !important;
                  flex: none !important;
                  border-radius: 12px !important;
               }
               .admin-nav-item.active {
                  color: var(--sona-gold) !important;
               }
               .admin-nav-item.active::before {
                  background: var(--sona-gold) !important;
               }
               
               .logout-btn-premium:hover {
                  background: #ef4444 !important;
                  color: white !important;
                  transform: translateY(-2px);
                  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
               }
               .logout-btn-premium:hover .admin-nav-icon {
                  color: white !important;
               }
               
               .custom-scrollbar::-webkit-scrollbar { width: 4px; }
               .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
               .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>

            <header className="dashboard-header">
               <div className="flex-col">
                  <h1 className="serif dashboard-title" style={{ fontSize: '32px', color: 'var(--admin-text)' }}>
                     {activeTab === 'overview' && `Welcome back, ${user?.name?.split(' ')[0]}`}
                     {activeTab === 'profile' && 'Profile Settings'}
                     {activeTab === 'services' && 'Concierge Services'}
                     {activeTab === 'dining' && 'In-Room Dining'}
                     {activeTab === 'security' && 'Security Settings'}
                     {activeTab === 'reviews' && 'Service Feedback'}
                  </h1>
                  <p className="dashboard-subtitle text-muted">Manage your luxury stay and preferences.</p>
               </div>
               <div className="dashboard-actions" style={{ display: 'flex', alignItems: 'center', gap: '25px', justifyContent: 'flex-end' }}>
                    <div 
                       className="notification-bell" 
                       onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                       style={{ 
                          color: isNotifyOpen ? 'var(--sona-gold)' : '#64748b',
                          position: 'relative',
                          width: '50px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'end',
                          cursor: 'pointer',
                          flex: 'none'
                       }}
                    >
                       <Bell size={20} />
                       {notifications.length > 0 && (
                          <span style={{ 
                             position: 'relative', top: '-9px', right: '5px', 
                             background: '#ef4444', color: 'white', fontSize: '10px', 
                             padding: '2px 6px', borderRadius: '10px', fontWeight: '800',
                             zIndex: 5,
                             lineHeight: '1',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             minWidth: '16px',
                             height: '16px'
                          }}>
                             {notifications.length}
                          </span>
                       )}

                       <AnimatePresence>
                          {isNotifyOpen && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="notification-dropdown custom-scrollbar"
                                style={{ 
                                   position: 'absolute', 
                                   top: '55px', 
                                   right: '0', 
                                   width: '350px',
                                   maxWidth: 'calc(100vw - 60px)',
                                   minWidth: '280px', // Prevent the pill look
                                   background: 'var(--admin-sidebar)', 
                                   borderRadius: '24px', 
                                   boxShadow: '0 25px 60px rgba(0,0,0,0.5)', 
                                   border: '1px solid var(--admin-border)',
                                   zIndex: 1000, 
                                   padding: '25px',
                                   cursor: 'default',
                                   display: 'flex',
                                   flexDirection: 'column'
                                }}
                                onClick={(e) => e.stopPropagation()}
                             >
                                <div className="flex-between m-b-20" style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '15px' }}>
                                   <div className="flex items-center gap-10">
                                      <Bell size={18} color="var(--sona-gold)" />
                                      <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--admin-text)', fontSize: '16px' }}>Notifications</h4>
                                   </div>
                                   <button 
                                      onClick={() => setIsNotifyOpen(false)} 
                                      style={{ 
                                         background: 'rgba(223, 169, 116, 0.1)', 
                                         border: 'none', 
                                         color: 'var(--sona-gold)', 
                                         padding: '5px 12px', 
                                         borderRadius: '20px', 
                                         cursor: 'pointer', 
                                         fontSize: '11px', 
                                         fontWeight: '800' 
                                      }}
                                   >
                                      Dismiss
                                   </button>
                                </div>
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
                                   {notifications.length === 0 ? (
                                      <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--admin-text-muted)', fontSize: '14px' }}>
                                         <p>No new alerts at the moment.</p>
                                      </div>
                                   ) : notifications.slice(0, 8).map(n => (
                                      <div key={n.id} style={{ padding: '15px 0', borderBottom: '1px solid var(--admin-border)' }}>
                                         <div className="flex-between m-b-8" style={{ alignItems: 'flex-start', gap: '15px' }}>
                                            <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--admin-text)', lineHeight: '1.4' }}>{n.title}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                         </div>
                                         <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0, lineHeight: '1.6' }}>{n.message}</p>
                                      </div>
                                   ))}
                                </div>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                    <div className="user-avatar" style={{ width: '45px', height: '45px', borderRadius: '15px', background: 'var(--sona-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', cursor: 'pointer' }}>{user?.name?.[0]}</div>
                 </div>
            </header>

            <AnimatePresence mode="wait">
               {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <div className="grid-3" style={{ gap: '25px', marginBottom: '40px' }}>
                        <div className="premium-card" style={{ padding: '30px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
                           <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: '700', textTransform: 'uppercase' }}>Active Reservations</span>
                           <h2 style={{ fontSize: '36px', marginTop: '10px' }}>{activeReservations.length}</h2>
                           <div className="m-t-20 flex gap-10" style={{ alignItems: 'center', fontSize: '12px', color: '#85f242' }}><TrendingUp size={14} /> <span>Live Booking</span></div>
                        </div>
                        <div className="premium-card" style={{ padding: '30px' }}>
                           <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Loyalty Points</span>
                           <h2 style={{ fontSize: '36px', marginTop: '10px', color: 'var(--sona-gold)' }}>{user?.loyaltyPoints || 120}</h2>
                           <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>Silver Tier Member</p>
                        </div>
                        <div className="premium-card" style={{ padding: '30px' }}>
                           <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Spent</span>
                           <h2 style={{ fontSize: '36px', marginTop: '10px' }}>
                              ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </h2>
                           <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>Lifetime luxury experience</p>
                        </div>
                     </div>

                     <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div className="card-header-flex" style={{ padding: '25px 30px', borderBottom: '1px solid var(--admin-border)' }}>
                           <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--admin-text)', margin: 0 }}>Your Reservations</h3>
                           <button onClick={() => navigate('/rooms')} className="btn-sona-primary" style={{ padding: '8px 20px', fontSize: '12px', whiteSpace: 'nowrap' }}>Book New Room</button>
                        </div>
                        <BookingList />
                     </div>
                  </motion.div>
               )}

               {activeTab === 'services' && <ServiceRequest />}

               {activeTab === 'profile' && <ProfilePage />}

               {activeTab === 'dining' && <FoodMenu />}

               {activeTab === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px' }}>
                     <div className="premium-card" style={{ padding: '40px' }}>
                        <div className="flex gap-15 m-b-30" style={{ alignItems: 'center' }}>
                           <div style={{ padding:'12px', background:'var(--sona-bg-alt)', borderRadius:'12px', color:'var(--sona-gold)' }}><Shield size={24}/></div>
                           <h3 style={{ fontSize: '20px', margin:0, color: 'var(--admin-text)' }}>Update Security</h3>
                        </div>
                        <form onSubmit={handleSubmit(onPasswordUpdate)} className="flex-col gap-20">
                           <div className="input-group-sona">
                              <label>Current Password</label>
                              <div style={{ position: 'relative' }}>
                                 <input type={showCurrent ? "text" : "password"} {...register("currentPassword", { required: "Required" })} style={{borderColor: errors.currentPassword ? '#ef4444' : 'var(--admin-border)', width: '100%', paddingRight: '45px', background: 'var(--sona-bg)', color: 'var(--admin-text)'}} />
                                 <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}>
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                 </button>
                              </div>
                              {errors.currentPassword && <p style={{color:'#ef4444', fontSize:'11px'}}>{errors.currentPassword.message}</p>}
                           </div>
                           <div className="input-group-sona">
                              <label>New Password</label>
                              <div style={{ position: 'relative' }}>
                                 <input type={showNew ? "text" : "password"} {...register("newPassword", { required: "Required", minLength: { value: 6, message: "Min 6 chars"} })} style={{borderColor: errors.newPassword ? '#ef4444' : 'var(--admin-border)', width: '100%', paddingRight: '45px', background: 'var(--sona-bg)', color: 'var(--admin-text)'}} />
                                 <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}>
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                 </button>
                              </div>
                              {errors.newPassword && <p style={{color:'#ef4444', fontSize:'11px'}}>{errors.newPassword.message}</p>}
                           </div>
                           <div className="input-group-sona">
                              <label>Confirm New Password</label>
                              <div style={{ position: 'relative' }}>
                                 <input 
                                    type={showConfirm ? "text" : "password"} 
                                    {...register("confirmPassword", { 
                                       required: "Required",
                                       validate: (value) => value === watch("newPassword") || "Passwords do not match"
                                    })} 
                                    style={{borderColor: errors.confirmPassword ? '#ef4444' : 'var(--admin-border)', width: '100%', paddingRight: '45px', background: 'var(--sona-bg)', color: 'var(--admin-text)'}} 
                                 />
                                 <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}>
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                 </button>
                              </div>
                              {errors.confirmPassword && <p style={{color:'#ef4444', fontSize:'11px', marginTop: '5px'}}>{errors.confirmPassword.message}</p>}
                           </div>
                           <button type="submit" className="btn-sona-primary w-full m-t-10">Save New Password</button>
                        </form>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'reviews' && (
                  <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px' }}>
                     <AddReviewForm bookings={bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')} />
                  </motion.div>
               )}
            </AnimatePresence>

         </main>
      </div>
   );
};

export default GuestDashboard;
