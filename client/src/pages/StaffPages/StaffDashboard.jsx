import { useSelector } from 'react-redux';
import ManagerDashboard from './ManagerDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import SecurityDashboard from './SecurityDashboard';
import { fetchAllRooms } from '../../Features/roomSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
const StaffDashboard = () => {
   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.auth);
   const { rooms } = useSelector((state) => state.rooms);

   useEffect(() => {
     if (user?.responsibility !== 'Manager' && user?.responsibility !== 'Receptionist') {
       dispatch(fetchAllRooms());
     }
   }, [dispatch, user]);

   if (user?.responsibility === 'Manager') {
     return <ManagerDashboard user={user} />;
   }

   if (user?.responsibility === 'Receptionist') {
     return <ReceptionistDashboard user={user} />;
   }

   if (user?.responsibility === 'Security') {
     return <SecurityDashboard user={user} />;
   }

  return (
    <div className="admin-main-content">
      {/* Fallback generic staff dashboard */}
      <div className="admin-dashboard-view">
        <div className="card-header-flex m-b-40">
           <div className="flex-col">
              <h1 style={{fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px'}}>Welcome back, {user?.name}!</h1>
              <p style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>Role: {user?.responsibility || 'Staff'}</p>
           </div>
        </div>
         <div className="grid-4 m-t-30" style={{ gap: '20px' }}>
            <div className="premium-card">
               <h4 style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>Available Rooms</h4>
               <p style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{rooms.filter(r => r.status?.toLowerCase() === 'available').length}</p>
            </div>
            <div className="premium-card">
               <h4 style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>Cleaning Needed</h4>
               <p style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444' }}>{rooms.filter(r => r.status?.toLowerCase() === 'dirty').length}</p>
            </div>
             <div className="premium-card">
                <h4 style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>Occupied</h4>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8' }}>{rooms.filter(r => r.status?.toLowerCase() === 'occupied').length}</p>
             </div>
             <div className="premium-card">
                <h4 style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>Not Available</h4>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>{rooms.filter(r => r.status?.toLowerCase() === 'maintenance' || r.status?.toLowerCase() === 'unavailable' || r.status?.toLowerCase() === 'not available').length}</p>
             </div>
          </div>
         <div className="premium-card m-t-20">
            <p className="text-muted">Standard staff view. Specialized dashboards provide more detailed operations for Manager and Receptionist roles.</p>
         </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
