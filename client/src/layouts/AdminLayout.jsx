import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  const { user, token, loading } = useSelector((state) => state.auth);
  
  if (loading && !user) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--admin-bg)'}}>
        <div className="flex-col-center gap-20">
          <div style={{width: '60px', height: '60px', border: '5px solid var(--admin-border)', borderTopColor: '#85f242', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
          <p style={{fontWeight: '700', color: 'var(--admin-text)', letterSpacing: '1px'}}>VERIFYING SESSION...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }


  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
