import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, updateBookingStatus, deleteBooking } from '../../Features/bookingSlice';
import { Search, Loader2, Calendar, Trash2, CheckCircle, XCircle, Mail, Phone, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomDropdown from '../../components/CustomDropdown';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Newest First');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const { toast } = useToast();
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', action: null });

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    setConfirmModal({
      open: true,
      title: 'Update Status',
      message: `Are you sure you want to mark this booking as ${status}?`,
      action: () => {
        dispatch(updateBookingStatus({ id, status }))
          .unwrap()
          .then(() => toast.success("Updated", `Booking marked as ${status}`))
          .catch((err) => toast.error("Update Failed", err));
      }
    });
  };

  const handleDelete = (id) => {
    setConfirmModal({
      open: true,
      title: 'Delete Reservation',
      message: 'Permanently delete this reservation? This action cannot be undone.',
      action: () => {
        dispatch(deleteBooking(id))
          .unwrap()
          .then(() => toast.success("Deleted", "Reservation removed successfully"))
          .catch((err) => toast.error("Delete Failed", err));
      }
    });
  };

  const handleExport = () => {
    if (bookings.length === 0) return toast.info("Export Info", "No bookings to export");
    const headers = ["ID", "Guest Name", "Email", "Room", "Price", "Check-In", "Check-Out", "Status"];
    const csvContent = [
      headers.join(","),
      ...bookings.map(b => 
        `"${b._id}","${b.name}","${b.email}","${b.room?.name || 'Room'}","${b.totalPrice}","${new Date(b.checkIn).toLocaleDateString()}","${new Date(b.checkOut).toLocaleDateString()}","${b.status}"`
      )
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.room?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortOption === 'Newest First') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortOption === 'Oldest First') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortOption === 'Price (High - Low)') return (b.totalPrice || 0) - (a.totalPrice || 0);
    return 0;
  });
  
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const displayedBookings = filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
      case 'cancelled': return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      default: return { background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' };
    }
  };

  return (
    <div className="admin-main-content">
      <div className="admin-dashboard-view">
        <div className="dashboard-header m-b-40 card-header-flex">
          <div className="flex-col">
            <h1 className="dashboard-title" style={{ fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px' }}>Reservations</h1>
            <p className="dashboard-subtitle" style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>Monitor and manage all guest bookings in real-time.</p>
          </div>
          
          <div className="dashboard-actions flex-center gap-10">
            <div className="flex gap-10" style={{ flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <div className="admin-search-bar" style={{ width: '250px', background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)' }}>
                <Search size={18} color="var(--admin-text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search reservations..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', outline: 'none' }}
                />
              </div>
              <div style={{ width: '180px' }}>
                <CustomDropdown 
                  options={['Newest First', 'Oldest First', 'Price (High - Low)']}
                  value={sortOption}
                  onChange={setSortOption}
                  variant="admin"
                />
              </div>
              <button 
                onClick={handleExport}
                className="btn-sona-primary flex-center gap-8"
                style={{background: '#85f242', border: 'none', color: '#1a2e05', padding: '12px 24px', borderRadius: '15px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(133, 242, 66, 0.2)'}}
              >
                 <Download size={18} /> Export
              </button>
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="premium-table-wrapper">
            <table className="premium-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '20px' }}>Guest Information</th>
                <th>Room & Dates</th>
                <th>Stay Info</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}><Loader2 className="animate-spin" color="#85f242" /></td></tr>
              ) : displayedBookings.map((booking, index) => (
                <motion.tr key={booking._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                  <td style={{ padding: '15px 20px' }}>
                    <div className="flex-col gap-5">
                      <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--admin-text)' }}>{booking.name}</span>
                      <div className="flex-center gap-5" style={{ justifyContent: 'flex-start', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                        <Mail size={12} /> {booking.email}
                      </div>
                      <div className="flex-center gap-5" style={{ justifyContent: 'flex-start', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                        <Phone size={12} /> {booking.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex-col gap-5">
                      <span style={{ fontWeight: '700', color: '#85f242' }}>{booking.room?.name || 'Deleted Room'}</span>
                      <div className="flex-center gap-5" style={{ justifyContent: 'flex-start', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                        <Calendar size={14} /> 
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex-col gap-5">
                       <span style={{fontWeight: '700', color: 'var(--admin-text)'}}>${booking.totalPrice}</span>
                       <span style={{fontSize: '11px', color: 'var(--admin-text-muted)'}}>{booking.guests} Guests</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      fontSize: '10px', 
                      fontWeight: '800', 
                      textTransform: 'uppercase',
                      ...getStatusStyle(booking.status)
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ paddingRight: '20px' }}>
                    <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
                      {booking.status !== 'confirmed' && booking.status !== 'cancelled' ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')} 
                            className="action-btn confirm"
                            title="Confirm Booking"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')} 
                            className="action-btn delete"
                            title="Cancel Booking"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <span style={{fontSize: '11px', fontWeight: '700', color: 'var(--admin-text-muted)', opacity: 0.5}}>No Actions</span>
                      )}
                      <button 
                        onClick={() => handleDelete(booking._id)} 
                        className="action-btn edit"
                        title="Delete Booking"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredBookings.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No reservations found.</div>
          )}

          {totalPages > 1 && (
             <div className="flex-between" style={{padding: '20px'}}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === 1 ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}>Previous</button>
                <div className="flex gap-10">
                   {[...Array(totalPages)].map((_, i) => (
                     <button key={i} onClick={() => setPage(i + 1)} style={{width: '35px', height: '35px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: page === i + 1 ? '#85f242' : 'var(--admin-sidebar)', color: page === i + 1 ? '#1a2e05' : 'var(--admin-text)', fontWeight: '700', cursor: 'pointer'}}>{i + 1}</button>
                   ))}
                </div>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: page === totalPages ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: 'pointer'}}>Next</button>
             </div>
          )}
        </div>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onCancel={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal({ ...confirmModal, open: false });
        }}
      />
    </div>
  );
};

export default AdminBookings;
