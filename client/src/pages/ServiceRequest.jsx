import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Waves, Brush, Settings, Clock, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createServiceRequest, fetchMyServiceRequests } from '../Features/serviceRequestSlice';
import { useToast } from '../context/ToastContext';

const ServiceRequest = () => {
   const dispatch = useDispatch();
   const { requests, loading } = useSelector(state => state.serviceRequests);
   const { bookings } = useSelector(state => state.bookings);
   const { toast } = useToast();
   
   const [activeTab, setActiveTab] = useState('new');
   const [selectedService, setSelectedService] = useState(null);
   
   const activeBooking = bookings.find(b => b.status === 'confirmed');

   const {
      register,
      handleSubmit,
      reset,
      // eslint-disable-next-line unused-imports/no-unused-vars
      setValue,
      formState: { errors }
   } = useForm({
      mode: "onChange"
   });

   const services = [
      { id: 'Cleaning', title: 'Room Cleaning', icon: <Brush size={24} />, desc: 'Standard room makeup and towel refresh.' },
      { id: 'Laundry', title: 'Laundry Service', icon: <Waves size={24} />, desc: 'Wash, dry, and iron your garments.' },
      { id: 'Food', title: 'In-Room Dining', icon: <Utensils size={24} />, desc: 'Order from our premium food menu.' },
      { id: 'Maintenance', title: 'Maintenance', icon: <Settings size={24} />, desc: 'Report any technical or plumbing issues.' }
   ];

   const onSubmitRequest = async (data) => {
      if(!selectedService) return toast.warning('Service Type Required', 'Please select a service category before placing a request.');
      if(!activeBooking) return toast.error('Access Denied', 'Service requests are only available for guests with active bookings.');
      
      const newReq = {
         room: activeBooking.room?._id || activeBooking.room,
         booking: activeBooking._id,
         type: selectedService.id,
         notes: data.notes
      };
      
      await dispatch(createServiceRequest(newReq)).unwrap()
         .then(() => toast.success("Request Placed", `Your ${selectedService.title} request has been logged and assigned.`))
         .catch(err => toast.error("Request Failed", err));
         
      dispatch(fetchMyServiceRequests());
      setSelectedService(null);
      reset();
      setActiveTab('history');
   };

   return (
      <div style={{ padding: '0' }}>
         <div className="card-header-flex m-b-30">
            <p className="text-muted" style={{ margin: 0 }}>Select a service below to enhance your stay.</p>
            <div className="flex gap-10" style={{ background: 'var(--sona-bg-alt)', padding: '5px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
               <button onClick={() => setActiveTab('new')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'new' ? 'var(--sona-gold)' : 'transparent', color: activeTab === 'new' ? 'white' : 'var(--admin-text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>New Request</button>
               <button onClick={() => setActiveTab('history')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'history' ? 'var(--sona-gold)' : 'transparent', color: activeTab === 'history' ? 'white' : 'var(--admin-text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>History</button>
            </div>
         </div>

         {activeTab === 'new' ? (
            <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
               <div className="grid-2" style={{ gap: '20px' }}>
                  {services.map(s => (
                     <motion.div 
                        key={s.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedService(s)}
                        style={{ 
                           padding: '25px', borderRadius: '20px', cursor: 'pointer',
                           border: `2px solid ${selectedService?.id === s.id ? 'var(--sona-gold)' : 'var(--admin-border)'}`,
                           background: 'var(--sona-bg-alt)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }}
                     >
                        <div style={{ color: selectedService?.id === s.id ? 'var(--sona-gold)' : '#64748b', marginBottom: '15px' }}>{s.icon}</div>
                        <h4 style={{ fontWeight: '800', color: 'var(--admin-text)' }}>{s.title}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--sona-text-muted)' }}>{s.desc}</p>
                     </motion.div>
                  ))}
               </div>

               <div className="premium-card" style={{ padding: '30px' }}>
                  <h3 style={{ marginBottom: '20px', color: 'var(--admin-text)' }}>Request Details</h3>
                  <form onSubmit={handleSubmit(onSubmitRequest)}>
                     <div className="input-group-sona" style={{ marginBottom: '20px' }}>
                        <label>Selected Service</label>
                        <input readOnly value={selectedService?.title || 'None Selected'} style={{ background: 'var(--sona-bg-alt)', color: 'var(--admin-text-muted)', borderColor: 'var(--admin-border)' }} />
                     </div>
                     <div className="input-group-sona" style={{ marginBottom: '20px' }}>
                        <label>Special Instructions</label>
                        <textarea 
                           {...register("notes", { required: "Please provide some details" })}
                           placeholder="Tell us what you need..." 
                           style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid var(--admin-border)', minHeight: '120px', borderColor: errors.notes ? '#ef4444' : 'var(--admin-border)', background: 'var(--sona-bg)', color: 'var(--admin-text)' }}
                        ></textarea>
                        {errors.notes && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.notes.message}</p>}
                     </div>
                     <button type="submit" disabled={loading} className="btn-sona-primary w-full">
                        {loading ? <Loader2 className="animate-spin" /> : "Place Request"}
                     </button>
                  </form>
               </div>
            </div>
         ) : (
            <div className="premium-card" style={{ padding: '30px' }}>
               {requests.length === 0 ? <div style={{textAlign:'center', padding:'40px', color: 'var(--admin-text-muted)' }}>No records found.</div> : requests.map(req => (
                  <div key={req._id} className="flex-between" style={{ padding: '20px 0', borderBottom: '1px solid var(--admin-border)' }}>
                     <div className="flex gap-20">
                        <Clock size={20} color="var(--sona-gold)" />
                        <div>
                           <h4 style={{fontWeight:'800', color: 'var(--admin-text)'}}>{req.type}</h4>
                           <p style={{fontSize:'13px', color: 'var(--admin-text-muted)'}}>{req.notes}</p>
                        </div>
                     </div>
                     <span className="status-pill" style={{ background: req.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)', color: req.status === 'Completed' ? '#10b981' : '#f97316', border: `1px solid ${req.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(249, 115, 22, 0.2)'}` }}>{req.status}</span>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default ServiceRequest;
