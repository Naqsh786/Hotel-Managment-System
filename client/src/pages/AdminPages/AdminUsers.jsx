import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserStatus, deleteUser, clearAdminState } from '../../Features/adminSlice';
import { User, ShieldAlert, Loader2, Search } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Newest First');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Success", "Operation completed successfully");
      dispatch(clearAdminState());
    }
    if (error) {
      toast.error("Error", error);
      dispatch(clearAdminState());
    }
  }, [success, error, dispatch, toast]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateUserStatus({ id, status: newStatus }));
  };

  const handleDeleteUser = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const filteredUsers = (users || []).filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortOption === 'Newest First') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortOption === 'Oldest First') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortOption === 'Name (A-Z)') return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="admin-main-content">
      <div className="admin-dashboard-view">
        <div className="dashboard-header m-b-40 card-header-flex">
          <div className="flex-col">
            <h1 className="dashboard-title" style={{ fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px' }}>User Management</h1>
            <p className="dashboard-subtitle text-muted" style={{ fontSize: '13px' }}>View and manage registered users and their access.</p>
          </div>
          <div className="dashboard-actions flex gap-10" style={{ alignItems: 'flex-end' }}>
            <div className="admin-search-bar" style={{ width: '250px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)' }}>
              <Search size={18} color="var(--admin-text-muted)" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', outline: 'none' }}
              />
            </div>
            <div style={{ width: '180px' }}>
              <CustomDropdown 
                options={['Newest First', 'Oldest First', 'Name (A-Z)']}
                value={sortOption}
                onChange={setSortOption}
                variant="admin"
              />
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>User Info</th>
                  <th>Email Address</th>
                  <th>User Role</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="animate-spin" size={30} color="#85f242" /></td></tr>
                ) : (
                  displayedUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex-center gap-10" style={{ justifyContent: 'flex-start' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={18} color="var(--admin-text-muted)" />
                          </div>
                          <div className="flex-col">
                            <div className="flex-center gap-5" style={{justifyContent: 'flex-start'}}>
                              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--admin-text)' }}>{user.name}</span>
                              {user.isOnline && <div style={{width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', border: '2px solid var(--admin-sidebar)'}} title="Online Now"></div>}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>{user.email}</td>
                      <td>
                        <span style={{ 
                          padding: '5px 10px', 
                          borderRadius: '8px', 
                          fontSize: '11px', 
                          fontWeight: '800',
                          background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: user.role === 'admin' ? '#ef4444' : '#3b82f6',
                          textTransform: 'uppercase'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className="status-pill" style={{ 
                          backgroundColor: (user.status === 'Active' || !user.status) ? 'rgba(34, 197, 94, 0.1)' : user.status === 'Pending' ? 'rgba(234, 179, 8, 0.1)' : user.status === 'Suspended' ? 'rgba(239, 68, 68, 0.1)' : 'var(--admin-bg)', 
                          color: (user.status === 'Active' || !user.status) ? '#22c55e' : user.status === 'Pending' ? '#eab308' : user.status === 'Suspended' ? '#ef4444' : 'var(--admin-text-muted)',
                          fontWeight: '700'
                        }}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        {user.role !== 'admin' && (
                          <div className="flex gap-10" style={{ justifyContent: 'flex-end' }}>
                             <select
                               value={user.status || 'Active'}
                               onChange={(e) => handleStatusChange(user._id, e.target.value)}
                               style={{ width: '120px', background: 'var(--admin-sidebar)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '5px' }}
                             >
                               <option value="Active">Active</option>
                               <option value="Inactive">Inactive</option>
                               <option value="Suspended">Suspended</option>
                               <option value="Pending">Pending</option>
                             </select>
                             <button 
                               onClick={() => handleDeleteUser(user._id)}
                               title="Delete User"
                               style={{ 
                                 background: 'var(--admin-sidebar)',
                                 color: '#ef4444',
                                 border: '1px solid rgba(239, 68, 68, 0.2)',
                                 width: '36px',
                                 height: '36px',
                                 borderRadius: '10px',
                                 cursor: 'pointer',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 transition: '0.2s'
                               }}
                               className="hover-delete"
                             >
                               <ShieldAlert size={18} />
                             </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>No users found.</div>
          )}
          
          {totalPages > 1 && (
             <div className="flex-between" style={{marginTop: '30px', padding: '0 10px'}}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === 1 ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}>Previous</button>
                <div className="flex gap-10">
                   {[...Array(totalPages)].map((_, i) => (
                     <button key={i} onClick={() => setPage(i + 1)} style={{width: '35px', height: '35px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: page === i + 1 ? '#85f242' : 'var(--admin-sidebar)', color: page === i + 1 ? '#1a2e05' : 'var(--admin-text)', fontWeight: '700', cursor: 'pointer'}}>{i + 1}</button>
                   ))}
                </div>
                <button disabled={totalPages === 0 || page === totalPages} onClick={() => setPage(page + 1)} style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === totalPages ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}>Next</button>
             </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Delete User"
        message="Are you sure you want to permanently delete this user? This action cannot be undone."
        onCancel={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={() => {
          dispatch(deleteUser(confirmDelete.id));
          setConfirmDelete({ open: false, id: null });
        }}
      />
    </div>
  );
};

export default AdminUsers;
