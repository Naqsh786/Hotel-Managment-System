import { useSelector } from 'react-redux';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingList = () => {
   const { bookings, loading } = useSelector((state) => state.bookings);

   if (loading) {
      return (
         <div style={{ padding: '60px', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--sona-gold)', borderRadius: '50%' }}></div>
         </div>
      );
   }

   if (!bookings || bookings.length === 0) {
      return (
         <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '14px' }}>You have no active or past reservations.</p>
         </div>
      );
   }

   const getStatusStyle = (status) => {
      switch (status) {
         case 'confirmed': return { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
         case 'cancelled': return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
         case 'checked-in': return { background: 'rgba(56, 189, 248, 0.1)', color: '#0ea5e9' };
         default: return { background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' };
      }
   };

   return (
      <div className="booking-list-container">
         <div className="premium-table-wrapper">
            <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--admin-border)' }}>
                     <th style={{ padding: '20px 30px', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Room Details</th>
                     <th style={{ padding: '20px 0', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Check In - Out</th>
                     <th style={{ padding: '20px 0', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Status</th>
                     <th style={{ padding: '20px 30px', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', textAlign: 'right' }}>Total Price</th>
                  </tr>
               </thead>
               <tbody>
                  {bookings.map((booking, idx) => (
                     <motion.tr 
                        key={booking._id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{ borderBottom: '1px solid var(--admin-border)', transition: '0.2s' }}
                        className="hover-row"
                     >
                        <td style={{ padding: '25px 30px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', background: 'var(--sona-bg-alt)' }}>
                                 <img src={booking.room?.images?.[0] || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Room" />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                 <span style={{ fontWeight: '700', fontSize: '15px' }}>{booking.room?.name || 'Room Name'}</span>
                                 <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={10} /> {booking.room?.location || 'Main Building'}
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding: '25px 0' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                 <span style={{ fontSize: '13px', fontWeight: '600' }}>{new Date(booking.checkIn).toLocaleDateString()}</span>
                                 <span style={{ fontSize: '11px', color: '#94a3b8' }}>Arrival</span>
                              </div>
                              <ArrowRight size={14} color="var(--admin-border)" />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                 <span style={{ fontSize: '13px', fontWeight: '600' }}>{new Date(booking.checkOut).toLocaleDateString()}</span>
                                 <span style={{ fontSize: '11px', color: '#94a3b8' }}>Departure</span>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding: '25px 0' }}>
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
                        <td style={{ padding: '25px 30px', textAlign: 'right' }}>
                           <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--sona-gold)' }}>${booking.totalPrice}</span>
                           <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{booking.guests} Guests</p>
                        </td>
                     </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default BookingList;
