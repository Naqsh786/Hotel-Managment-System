import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Printer, Download, Mail, Phone, Receipt
} from 'lucide-react';
import { fetchAllBookings } from '../../Features/bookingSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '../../context/ToastContext';

const BillingPage = () => {
   const dispatch = useDispatch();
   const { bookings } = useSelector(state => state.bookings);
   const [selectedBooking, setSelectedBooking] = useState(null);
   const [search, setSearch] = useState('');
   const { toast } = useToast();

   useEffect(() => {
      dispatch(fetchAllBookings());
   }, [dispatch]);

   const filteredBookings = (bookings || []).filter(b => 
      b.name?.toLowerCase().includes(search.toLowerCase()) || 
      b._id.includes(search)
   );

   const handleDownload = async () => {
      const element = document.getElementById('invoice-content');
      if (!element) return;

      try {
         const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: (clonedDoc) => {
               // Ensure the cloned invoice is visible and has light theme for PDF
               const clonedElement = clonedDoc.getElementById('invoice-content');
               clonedElement.style.color = '#000000';
               clonedElement.style.background = '#ffffff';
               const texts = clonedElement.querySelectorAll('p, span, h2, h3, th, td');
               texts.forEach(t => t.style.color = '#000000');
            }
         });
         
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF('p', 'mm', 'a4');
         const imgProps = pdf.getImageProperties(imgData);
         const pdfWidth = pdf.internal.pageSize.getWidth();
         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
         
         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
         pdf.save(`SONA_Invoice_${selectedBooking._id.slice(-6).toUpperCase()}.pdf`);
         toast.success("Invoice Exported", "The financial document has been downloaded successfully.");
      } catch (error) {
         console.error("PDF Generation Error:", error);
         toast.error("Export Failed", "Could not generate PDF. Please try the Print option.");
      }
   };

   const calculateNights = (checkIn, checkOut) => {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diffTime = Math.abs(outDate - inDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
   };

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            {/* Page Header */}
            <header className="dashboard-header m-b-40">
               <div className="flex-col">
                  <div className="flex-center gap-10" style={{justifyContent: 'flex-start', marginBottom: '8px'}}>
                     <div style={{ padding: '4px 12px', background: 'rgba(56, 189, 248, 0.1)', color: '#0ea5e9', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Financial Terminal</div>
                  </div>
                  <h1 className="serif dashboard-title" style={{ color: 'var(--admin-text)' }}>Billing & Folio</h1>
                  <p className="dashboard-subtitle text-muted" style={{fontSize: '13px'}}>Generate and manage guest invoices and financial settlements.</p>
               </div>
               
               <div className="dashboard-actions">
                  <div className="flex items-center" style={{ background: 'var(--admin-sidebar)', padding: '10px 20px', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                     <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--admin-text)' }}>{filteredBookings.length} Bookings Found</span>
                  </div>
               </div>
            </header>

            <div className="dashboard-grid-12">
               
               {/* Left Sidebar: Booking Selection */}
               <div className="span-4 flex-col gap-25">
                  <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                     <div style={{ padding: '25px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg)' }}>
                        <div className="admin-search-bar" style={{width: '100%'}}>
                           <Search size={16} color="var(--admin-text-muted)" />
                           <input 
                              placeholder="Guest name or ID..." 
                              value={search} 
                              onChange={(e) => setSearch(e.target.value)} 
                           />
                        </div>
                     </div>
                     
                     <div className="flex-col" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', padding: '15px' }}>
                        <AnimatePresence>
                           {filteredBookings.map(b => (
                              <motion.div 
                                 key={b._id} 
                                 initial={{ opacity: 0, y: 5 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 onClick={() => setSelectedBooking(selectedBooking?._id === b._id ? null : b)}
                                 className="hover-lift"
                                 style={{ 
                                    padding: '12px 18px', 
                                    background: selectedBooking?._id === b._id ? '#0ea5e9' : 'var(--admin-sidebar)', 
                                    borderRadius: '16px', 
                                    cursor: 'pointer', 
                                    border: selectedBooking?._id === b._id ? '1.5px solid #38bdf8' : '1.5px solid var(--admin-border)',
                                    marginBottom: '12px',
                                    transition: '0.2s',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: selectedBooking?._id === b._id ? '0 10px 20px rgba(14, 165, 233, 0.2)' : 'none'
                                 }}
                              >
                                 <div className="flex-between" style={{ alignItems: 'center' }}>
                                    <div className="flex-col gap-5">
                                       <p style={{ fontWeight: '800', fontSize: '15px', color: selectedBooking?._id === b._id ? 'white' : 'var(--admin-text)', margin: 0 }}>{b.name}</p>
                                       <span style={{ fontSize: '12px', color: selectedBooking?._id === b._id ? 'rgba(255,255,255,0.9)' : 'var(--admin-text-muted)', fontWeight: '600' }}>{new Date(b.checkIn).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex-col gap-5" style={{ alignItems: 'flex-end' }}>
                                       <span style={{ fontSize: '12px', color: selectedBooking?._id === b._id ? 'rgba(255,255,255,0.8)' : 'var(--admin-text-muted)', fontWeight: '900', letterSpacing: '1px' }}>#{b._id.slice(-6).toUpperCase()}</span>
                                       <span style={{ fontSize: '18px', fontWeight: '900', color: selectedBooking?._id === b._id ? 'white' : '#0ea5e9' }}>${b.totalPrice}</span>
                                    </div>
                                 </div>
                              </motion.div>
                           ))}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>

               {/* Right Side: Invoice Generation */}
               <div className="span-8">
                  {selectedBooking ? (
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="premium-card" 
                        style={{ padding: '0', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)', background: 'var(--sona-bg)' }}
                     >
                        {/* Invoice Content */}
                        <div id="invoice-content" style={{ padding: '60px' }}>
                           <div className="flex-between m-b-40" style={{ borderBottom: '2px solid var(--admin-border)', paddingBottom: '30px', marginBottom: '40px' }}>
                              <div className="flex gap-15 items-center">
                                 <div style={{ width: '60px', height: '60px', background: '#dfa974', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={30} /></div>
                                 <div>
                                    <h2 className="serif" style={{ color: 'var(--sona-gold)', fontSize: '30px', margin: '0' }}>SONA HOTEL</h2>
                                    <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Royal Experience Center</p>
                                 </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                 <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--admin-text)', margin: '0' }}>TAX INVOICE</h3>
                                 <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700', marginTop: '5px' }}>REFERENCE: {selectedBooking._id.toUpperCase()}</p>
                                 <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>ISSUED: {new Date().toLocaleDateString()}</p>
                              </div>
                           </div>

                           <div className="grid-2 m-b-40" style={{ gap: '60px', marginBottom: '50px' }}>
                              <div style={{ background: 'var(--admin-bg)', padding: '25px', borderRadius: '20px', border: '1px solid var(--admin-border)' }}>
                                 <p style={{ fontSize: '10px', color: 'var(--admin-text-muted)', fontWeight: '900', letterSpacing: '1px', marginBottom: '15px' }}>GUEST INFORMATION</p>
                                 <p style={{ fontWeight: '900', fontSize: '18px', color: 'var(--admin-text)', marginBottom: '10px' }}>{selectedBooking.name}</p>
                                 <div className="flex-col gap-8">
                                    <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14}/> {selectedBooking.email}</span>
                                    <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14}/> {selectedBooking.phone || '+44 20 7946 0958'}</span>
                                 </div>
                              </div>
                              <div style={{ padding: '25px' }}>
                                 <p style={{ fontSize: '10px', color: 'var(--admin-text-muted)', fontWeight: '900', letterSpacing: '1px', marginBottom: '15px' }}>RESERVATION DETAILS</p>
                                 <div className="flex-col gap-10">
                                    <div className="flex-between">
                                       <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text-muted)' }}>Status</span>
                                       <span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981', background: '#ecfdf5', padding: '4px 12px', borderRadius: '15px' }}>{selectedBooking.status?.toUpperCase()}</span>
                                    </div>
                                    <div className="flex-between">
                                       <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text-muted)' }}>Check-in</span>
                                       <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--admin-text)' }}>{new Date(selectedBooking.checkIn).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex-between">
                                       <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text-muted)' }}>Check-out</span>
                                       <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--admin-text)' }}>{new Date(selectedBooking.checkOut).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex-between">
                                       <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text-muted)' }}>Room</span>
                                       <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--admin-text)' }}>{selectedBooking.roomName || 'Premium Room'}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="premium-table-wrapper">
                              <table className="premium-table" style={{ marginBottom: '40px', width: '100%' }}>
                                 <thead style={{ background: 'var(--admin-bg)' }}>
                                    <tr>
                                       <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '900', color: 'var(--admin-text-muted)', fontSize: '11px', borderBottom: '2px solid var(--admin-border)' }}>SERVICE DESCRIPTION</th>
                                       <th style={{ padding: '15px 20px', textAlign: 'center', fontWeight: '900', color: 'var(--admin-text-muted)', fontSize: '11px', borderBottom: '2px solid var(--admin-border)' }}>UNIT</th>
                                       <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: '900', color: 'var(--admin-text-muted)', fontSize: '11px', borderBottom: '2px solid var(--admin-border)' }}>BASE PRICE</th>
                                       <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: '900', color: 'var(--admin-text-muted)', fontSize: '11px', borderBottom: '2px solid var(--admin-border)' }}>TOTAL</th>
                                    </tr>
                                 </thead>
                              <tbody>
                                 <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                    <td style={{ padding: '20px', color: 'var(--admin-text)', fontWeight: '700' }}>
                                       Accommodation - {selectedBooking.roomName || 'Suite'}
                                       <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>Base room rate for {calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} nights</p>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text)', fontWeight: '700' }}>{calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} Days</td>
                                    <td style={{ padding: '20px', textAlign: 'right', color: 'var(--admin-text)', fontWeight: '700' }}>${(selectedBooking.totalPrice / calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)).toFixed(2)}</td>
                                    <td style={{ padding: '20px', textAlign: 'right', color: 'var(--admin-text)', fontWeight: '900' }}>${selectedBooking.totalPrice}</td>
                                 </tr>
                                 {selectedBooking.extraServices?.map((s, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                       <td style={{ padding: '20px', color: 'var(--admin-text)', fontWeight: '700' }}>
                                          Premium Add-on: {s.service || s}
                                       </td>
                                       <td style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text)', fontWeight: '700' }}>1</td>
                                       <td style={{ padding: '20px', textAlign: 'right', color: 'var(--admin-text)', fontWeight: '700' }}>${s.price || 0}</td>
                                       <td style={{ padding: '20px', textAlign: 'right', color: 'var(--admin-text)', fontWeight: '900' }}>${s.price || 0}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                         </div>

                           <div className="flex gap-60 items-start m-t-40" style={{ borderTop: '2px solid var(--admin-text)', paddingTop: '30px', justifyContent: 'flex-end' }}>
                              <div className="flex-col gap-15" style={{ minWidth: '250px' }}>
                                 <div className="flex-between">
                                    <span style={{ fontSize: '14px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>Subtotal</span>
                                    <span style={{ fontSize: '14px', color: 'var(--admin-text)', fontWeight: '900' }}>${selectedBooking.totalPrice}</span>
                                 </div>
                                 <div className="flex-between">
                                    <span style={{ fontSize: '14px', color: 'var(--admin-text-muted)', fontWeight: '700' }}>VAT (0%)</span>
                                    <span style={{ fontSize: '14px', color: 'var(--admin-text)', fontWeight: '900' }}>$0.00</span>
                                 </div>
                                 <div className="flex-between" style={{ padding: '15px 0', borderTop: '1px dashed var(--admin-border)', marginTop: '5px' }}>
                                    <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--admin-text)' }}>GRAND TOTAL</span>
                                    <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--sona-gold)' }}>${selectedBooking.totalPrice}</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div style={{ marginTop: '60px', padding: '30px', background: '#f8fafc', borderRadius: '15px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>Thank you for choosing Sona Hotel. We hope to serve you again soon.</p>
                           </div>
                        </div>

                        {/* Control Actions */}
                        <div style={{ padding: '25px 40px', background: 'var(--admin-sidebar)', borderTop: '1px solid var(--admin-border)', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                           <button onClick={handleDownload} className="btn-sona-primary flex-center gap-10" style={{ background: '#1e293b', border: 'none', padding: '12px 25px', borderRadius: '12px', cursor: 'pointer' }}>
                              <Printer size={18} /> Print Official Invoice
                           </button>
                           <button onClick={handleDownload} className="btn-sona-primary flex-center gap-10" style={{ background: '#0ea5e9', border: 'none', padding: '12px 25px', borderRadius: '12px', cursor: 'pointer' }}>
                              <Download size={18} /> Export as PDF
                           </button>
                        </div>
                     </motion.div>
                  ) : (
                     <div className="premium-card flex-center" style={{ height: '100%', minHeight: '600px', flexDirection: 'column', color: 'var(--admin-text-muted)', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', border: '1px dashed var(--admin-border)' }}>
                        <div style={{ padding: '30px', background: 'var(--admin-bg)', borderRadius: '50%', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                           <Receipt size={40} color="#0ea5e9" />
                        </div>
                        <h3 className="serif" style={{ fontSize: '22px', color: 'var(--admin-text)', marginBottom: '5px' }}>Financial Folio Terminal</h3>
                        <p style={{ fontSize: '14px', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Select a guest reservation to generate a detailed financial breakdown.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default BillingPage;
