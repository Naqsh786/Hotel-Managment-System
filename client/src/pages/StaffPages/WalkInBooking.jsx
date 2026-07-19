import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, BedDouble,
  ShieldCheck, Sparkles, Receipt, Plus, Calculator, ChevronRight, Loader2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { fetchAllRooms } from '../../Features/roomSlice';
import { makeBooking } from '../../Features/bookingSlice';
import { fetchAddons } from '../../Features/addonSlice';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../../components/PaymentModal';

const PriceCounter = ({ target }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(target);
    if (isNaN(end) || end <= 0) { setCount(0); return; }
    const duration = 1500;
    const timer = setInterval(() => {
      start += end / (duration / 16);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span style={{ fontSize: '42px', fontWeight: '900', color: '#0ea5e9', display: 'block', margin: '15px 0' }}>${count.toFixed(0)}</span>;
};

const WalkInBooking = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { rooms } = useSelector(state => state.rooms);
   const { addons } = useSelector(state => state.addons);
   
   const [step, setStep] = useState(1);
   const [selectedAddons, setSelectedAddons] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showPaymentModal, setShowPaymentModal] = useState(false);
   const { toast } = useToast();

   const {
      register,
      handleSubmit,
      watch,
      setValue,
      trigger,
      formState: { errors }
   } = useForm({
      mode: "onChange",
      defaultValues: {
         name: '', email: '', phone: '', room: '', checkIn: '', checkOut: '', guests: 1, paymentMethod: 'Cash'
      }
   });

   const watchAllFields = watch();
   const selectedRoom = rooms.find(r => r._id === watchAllFields.room);

   useEffect(() => {
      dispatch(fetchAllRooms());
      dispatch(fetchAddons());
   }, [dispatch]);

   const availableRooms = rooms.filter(r => r.status?.toLowerCase() === 'available');

   const calculateNights = () => {
      if (!watchAllFields.checkIn || !watchAllFields.checkOut) return 0;
      const start = new Date(watchAllFields.checkIn);
      const end = new Date(watchAllFields.checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
   };

   const calculateRoomTotal = () => {
      if (!selectedRoom) return 0;
      const nights = calculateNights() || 1;
      return selectedRoom.price * nights;
   };

   const calculateAddonTotal = () => {
      return selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
   };

   const calculateGrandTotal = () => {
      return calculateRoomTotal() + calculateAddonTotal();
   };

   const toggleAddon = (addon) => {
      if (selectedAddons.find(a => a._id === addon._id)) {
         setSelectedAddons(selectedAddons.filter(a => a._id !== addon._id));
      } else {
         setSelectedAddons([...selectedAddons, addon]);
      }
   };

   const onBookingSubmit = (data) => {
      if (data.paymentMethod === 'Card') {
         setShowPaymentModal(true);
         return;
      }
      processBooking(data);
   };

   const processBooking = (data) => {
      setIsSubmitting(true);
      const bookingPayload = {
         ...data,
         totalPrice: calculateGrandTotal(),
         status: 'checked-in',
         source: 'walk-in',
         extraServices: selectedAddons.map(a => ({ service: a.name, price: a.price }))
      };
      
      dispatch(makeBooking(bookingPayload)).unwrap()
         .then(() => {
            setStep(5);
            setIsSubmitting(false);
            toast.success("Check-in Successful", "The guest has been checked into their suite.");
         })
         .catch((err) => {
            toast.error("Reservation Failed", err);
            setIsSubmitting(false);
         });
   };

   const nextStep = async () => {
      let fields = [];
      if (step === 1) fields = ["name", "email", "phone", "checkIn", "checkOut", "guests"];
      if (step === 2) fields = ["room"];
      
      const result = await trigger(fields);
      if (result) setStep(step + 1);
   };

   const renderStepIndicator = () => (
      <div className="step-indicator-wrapper">
         {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
               <div className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                  {step > s ? <CheckCircle size={18} /> : <span>{s}</span>}
                  <p className="step-label">{s === 1 ? 'Guest' : s === 2 ? 'Room' : s === 3 ? 'Add-ons' : 'Confirm'}</p>
               </div>
               {s < 4 && <div className={`step-line ${step > s ? 'completed' : ''}`}></div>}
            </React.Fragment>
         ))}
      </div>
   );

   return (
      <div className="admin-main-content">
         <div className="admin-dashboard-view">
            
            <header className="dashboard-header-premium">
               <div className="flex-col">
                  <div className="badge-premium">Reception Terminal</div>
                  <h1 className="serif dashboard-title">Walk-in Reservation</h1>
                  <p className="dashboard-subtitle">Assign luxury suites to guests immediately upon arrival.</p>
               </div>
               <div className="total-estimate-card">
                  <div className="icon-box"><Calculator size={22} /></div>
                  <div className="flex-col">
                     <span className="label">Live Estimate</span>
                     <span className="value">${calculateGrandTotal()}</span>
                  </div>
               </div>
            </header>

            <div className="reservation-grid-layout">
               <div className="reservation-form-area">
                  <div className="premium-card booking-card-container">
                     {renderStepIndicator()}

                     <form onSubmit={handleSubmit(onBookingSubmit)}>
                        <AnimatePresence mode="wait">
                           {step === 1 && (
                              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                 <h2 className="serif step-title">Guest Profile</h2>
                                 <div className="grid-2-responsive">
                                    <div className="admin-input-group">
                                       <label>Full Name <span className="req">*</span></label>
                                       <input {...register("name", { required: "Name is required" })} placeholder="Guest's Legal Name" className="admin-input-field" />
                                       {errors.name && <span className="error-text">{errors.name.message}</span>}
                                    </div>
                                    <div className="admin-input-group">
                                       <label>Email Address <span className="req">*</span></label>
                                       <input {...register("email", { required: "Email is required" })} placeholder="guest@example.com" className="admin-input-field" />
                                       {errors.email && <span className="error-text">{errors.email.message}</span>}
                                    </div>
                                    <div className="admin-input-group">
                                       <label>Phone Number</label>
                                       <input {...register("phone")} placeholder="+1 (555) 000-0000" className="admin-input-field" />
                                    </div>
                                    <div className="admin-input-group">
                                       <label>Guests</label>
                                       <input type="number" {...register("guests")} min="1" className="admin-input-field" />
                                    </div>
                                    <div className="admin-input-group">
                                       <label>Check-in</label>
                                       <input type="date" {...register("checkIn", { required: true })} className="admin-input-field" />
                                    </div>
                                    <div className="admin-input-group">
                                       <label>Check-out</label>
                                       <input type="date" {...register("checkOut", { required: true })} className="admin-input-field" />
                                    </div>
                                 </div>
                                 <button type="button" onClick={nextStep} className="btn-admin-success w-full m-t-30">
                                    Continue to Rooms <ChevronRight size={20} />
                                 </button>
                              </motion.div>
                           )}

                           {step === 2 && (
                              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                 <div className="flex-between m-b-20">
                                    <h2 className="serif step-title">Select Suite</h2>
                                    <span className="available-badge">{availableRooms.length} Available</span>
                                 </div>
                                 <div className="rooms-selection-scroll">
                                    {availableRooms.map(r => (
                                       <div 
                                          key={r._id} 
                                          onClick={() => setValue("room", r._id)}
                                          className={`room-select-card ${watchAllFields.room === r._id ? 'active' : ''}`}
                                       >
                                          <div className="room-info">
                                             <div className="room-icon"><BedDouble size={22} /></div>
                                             <div className="flex-col">
                                                <h4 className="room-name">{r.name}</h4>
                                                <span className="room-type">{r.type} • Max {r.capacity} Guests</span>
                                             </div>
                                          </div>
                                          <div className="room-price-info">
                                             <span className="price">${r.price}</span>
                                             <span className="per-night">/night</span>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                                 <div className="flex gap-15 m-t-30">
                                    <button type="button" onClick={() => setStep(1)} className="btn-admin-secondary">Back</button>
                                    <button type="button" onClick={nextStep} className="btn-admin-success flex-1">Configure Add-ons</button>
                                 </div>
                              </motion.div>
                           )}

                           {step === 3 && (
                              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                 <h2 className="serif step-title">Extra Amenities</h2>
                                 <div className="addons-grid">
                                    {addons.map(addon => {
                                       const isSelected = selectedAddons.find(a => a._id === addon._id);
                                       return (
                                          <div 
                                             key={addon._id} 
                                             onClick={() => toggleAddon(addon)}
                                             className={`addon-card ${isSelected ? 'active' : ''}`}
                                          >
                                             <div className="addon-icon">
                                                <Sparkles size={20} />
                                             </div>
                                             <span className="addon-name">{addon.name}</span>
                                             <span className="addon-price">${addon.price}</span>
                                          </div>
                                       );
                                    })}
                                 </div>
                                 <div className="flex gap-15 m-t-30">
                                    <button type="button" onClick={() => setStep(2)} className="btn-admin-secondary">Back</button>
                                    <button type="button" onClick={() => setStep(4)} className="btn-admin-success flex-1">Review Folio</button>
                                 </div>
                              </motion.div>
                           )}

                           {step === 4 && (
                              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                 <h2 className="serif step-title">Final Confirmation</h2>
                                 <div className="summary-box">
                                    <div className="summary-row">
                                       <span className="label">Guest</span>
                                       <span className="value">{watchAllFields.name}</span>
                                    </div>
                                    <div className="summary-row">
                                       <span className="label">Stay</span>
                                       <span className="value">{calculateNights()} Nights ({selectedRoom?.name})</span>
                                    </div>
                                    <div className="summary-row">
                                       <span className="label">Settlement</span>
                                       <div className="payment-toggle">
                                          {['Cash', 'Card'].map(m => (
                                             <button 
                                                key={m} 
                                                type="button" 
                                                onClick={() => setValue("paymentMethod", m)}
                                                className={watchAllFields.paymentMethod === m ? 'active' : ''}
                                             >
                                                {m}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex gap-15 m-t-30">
                                    <button type="button" onClick={() => setStep(3)} className="btn-admin-secondary">Modify</button>
                                    <button type="submit" disabled={isSubmitting} className="btn-admin-success flex-1">
                                       {isSubmitting ? <Loader2 className="animate-spin" /> : 'Complete Check-in'}
                                    </button>
                                 </div>
                              </motion.div>
                           )}

                           {step === 5 && (
                              <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="success-view">
                                 <div className="success-icon"><CheckCircle size={50} /></div>
                                 <PriceCounter target={calculateGrandTotal()} />
                                 <h2 className="serif">Check-in Complete</h2>
                                 <p>Reservation for {watchAllFields.name} has been processed successfully.</p>
                                 <div className="flex gap-15 m-t-30">
                                    <button type="button" onClick={() => navigate('/staff/dashboard')} className="btn-admin-secondary">Terminal Home</button>
                                    <button type="button" onClick={() => window.print()} className="btn-admin-success">Print Folio</button>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </form>
                  </div>
               </div>

               <PaymentModal 
                  isOpen={showPaymentModal}
                  onClose={() => setShowPaymentModal(false)}
                  totalAmount={calculateGrandTotal()}
                  onConfirm={() => processBooking(watchAllFields)}
               />

               <div className="reservation-sidebar">
                  <div className="premium-card folio-card">
                     <h3 className="folio-title"><Receipt size={18} /> Live Folio Summary</h3>
                     <div className="folio-items">
                        <div className="folio-item">
                           <span>Accommodation ({calculateNights() || 1} nights)</span>
                           <span>${calculateRoomTotal()}</span>
                        </div>
                        {selectedAddons.map(a => (
                           <div key={a._id} className="folio-item addon">
                              <span><Plus size={12} /> {a.name}</span>
                              <span>${a.price}</span>
                           </div>
                        ))}
                     </div>
                     <div className="folio-total">
                        <div className="flex-between">
                           <span className="total-label">Grand Total</span>
                           <span className="total-value">${calculateGrandTotal()}</span>
                        </div>
                     </div>
                     <div className="folio-notice">
                        <ShieldCheck size={14} /> Official Terminal Generated Folio
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <style>{`
            .dashboard-header-premium {
               display: flex;
               justify-content: space-between;
               align-items: flex-end;
               margin-bottom: 40px;
               flex-wrap: wrap;
               gap: 20px;
            }
            .badge-premium {
               display: inline-block;
               padding: 5px 12px;
               background: rgba(14, 165, 233, 0.1);
               color: #0ea5e9;
               border-radius: 20px;
               font-size: 11px;
               font-weight: 800;
               text-transform: uppercase;
               margin-bottom: 10px;
            }
            .total-estimate-card {
               display: flex;
               align-items: center;
               gap: 15px;
               background: var(--admin-sidebar);
               padding: 15px 25px;
               border-radius: 20px;
               border: 1px solid var(--admin-border);
               box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .total-estimate-card .icon-box {
               width: 45px;
               height: 45px;
               background: #0ea5e9;
               color: white;
               border-radius: 12px;
               display: flex;
               align-items: center;
               justify-content: center;
            }
            .total-estimate-card .label { font-size: 10px; color: var(--admin-text-muted); font-weight: 800; text-transform: uppercase; }
            .total-estimate-card .value { font-size: 24px; font-weight: 900; color: var(--admin-text); }

            .reservation-grid-layout {
               display: grid;
               grid-template-columns: 1fr 380px;
               gap: 30px;
               align-items: flex-start;
            }
            @media (max-width: 1100px) {
               .reservation-grid-layout { grid-template-columns: 1fr; }
               .reservation-sidebar { position: static; width: 100%; }
            }

            .step-indicator-wrapper {
               display: flex;
               align-items: center;
               justify-content: center;
               margin-bottom: 50px;
               gap: 10px;
            }
            .step-dot {
               display: flex;
               flex-direction: column;
               align-items: center;
               position: relative;
               z-index: 2;
            }
            .step-dot span, .step-dot svg {
               width: 32px;
               height: 32px;
               border-radius: 50%;
               background: var(--admin-bg);
               border: 2px solid var(--admin-border);
               display: flex;
               align-items: center;
               justify-content: center;
               font-size: 14px;
               font-weight: 800;
               color: var(--admin-text-muted);
               transition: 0.3s;
            }
            .step-dot.active span { background: #0ea5e9; border-color: #0ea5e9; color: white; box-shadow: 0 0 15px rgba(14, 165, 233, 0.4); }
            .step-dot.completed span, .step-dot.completed svg { background: #10b981; border-color: #10b981; color: white; }
            .step-label { font-size: 10px; font-weight: 800; text-transform: uppercase; margin-top: 8px; color: var(--admin-text-muted); }
            .step-line { flex: 1; max-width: 60px; height: 2px; background: var(--admin-border); margin-top: -18px; }
            .step-line.completed { background: #10b981; }

            .grid-2-responsive { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            @media (max-width: 640px) { .grid-2-responsive { grid-template-columns: 1fr; } }

            .admin-input-field {
               width: 100%;
               padding: 14px 18px;
               background: var(--admin-bg);
               border: 1.5px solid var(--admin-border);
               border-radius: 12px;
               color: var(--admin-text);
               font-size: 14px;
               outline: none;
               transition: 0.3s;
            }
            .admin-input-field:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1); }

            .rooms-selection-scroll {
               display: flex;
               flex-direction: column;
               gap: 12px;
               max-height: 400px;
               overflow-y: auto;
               padding-right: 5px;
            }
            .room-select-card {
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding: 18px 25px;
               background: var(--admin-bg);
               border: 1.5px solid var(--admin-border);
               border-radius: 18px;
               cursor: pointer;
               transition: 0.2s;
            }
            .room-select-card:hover { border-color: #0ea5e9; transform: translateX(5px); }
            .room-select-card.active { background: rgba(14, 165, 233, 0.05); border-color: #0ea5e9; }
            .room-info { display: flex; align-items: center; gap: 15px; }
            .room-icon { color: var(--admin-text-muted); }
            .room-select-card.active .room-icon { color: #0ea5e9; }
            .room-name { font-weight: 800; font-size: 16px; margin-bottom: 2px; }
            .room-type { font-size: 12px; color: var(--admin-text-muted); font-weight: 600; }
            .room-price-info { text-align: right; }
            .room-price-info .price { font-size: 18px; font-weight: 900; color: #0ea5e9; }
            .room-price-info .per-night { font-size: 11px; font-weight: 700; color: var(--admin-text-muted); }

            .addons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
            .addon-card {
               background: var(--admin-bg);
               border: 1.5px solid var(--admin-border);
               padding: 20px 10px;
               border-radius: 18px;
               text-align: center;
               cursor: pointer;
               transition: 0.2s;
               display: flex;
               flex-direction: column;
               align-items: center;
               gap: 10px;
            }
            .addon-card:hover { border-color: #dfa974; transform: translateY(-3px); }
            .addon-card.active { background: rgba(223, 169, 116, 0.05); border-color: #dfa974; }
            .addon-icon { width: 40px; height: 40px; background: var(--admin-sidebar); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--admin-text-muted); }
            .addon-card.active .addon-icon { background: #dfa974; color: white; }
            .addon-name { font-size: 12px; font-weight: 800; }
            .addon-price { font-size: 14px; font-weight: 900; color: #dfa974; }

            .summary-box { background: var(--admin-bg); border: 1.5px solid var(--admin-border); border-radius: 20px; padding: 25px; }
            .summary-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed var(--admin-border); }
            .summary-row:last-child { border: none; }
            .summary-row .label { font-size: 12px; font-weight: 800; color: var(--admin-text-muted); text-transform: uppercase; }
            .summary-row .value { font-weight: 900; font-size: 14px; }
            .payment-toggle { display: flex; gap: 5px; background: var(--admin-sidebar); padding: 4px; border-radius: 10px; }
            .payment-toggle button { padding: 6px 15px; border: none; background: none; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; color: var(--admin-text-muted); }
            .payment-toggle button.active { background: #0ea5e9; color: white; }

            .folio-card { padding: 25px; position: sticky; top: 110px; }
            .folio-title { font-size: 16px; display: flex; align-items: center; gap: 8px; margin-bottom: 25px; color: var(--admin-text); }
            .folio-items { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
            .folio-item { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: var(--admin-text-muted); }
            .folio-item.addon { color: #dfa974; font-size: 12px; }
            .folio-total { padding-top: 20px; border-top: 1px solid var(--admin-border); }
            .total-label { font-weight: 900; font-size: 14px; }
            .total-value { font-size: 26px; font-weight: 900; color: #0ea5e9; }
            .folio-notice { margin-top: 20px; text-align: center; font-size: 10px; font-weight: 800; color: #10b981; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 5px; }

            .success-view { text-align: center; padding: 40px 0; }
            .success-icon { width: 80px; height: 80px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; }
            .btn-admin-secondary { background: var(--admin-bg); color: var(--admin-text); border: 1.5px solid var(--admin-border); border-radius: 14px; padding: 14px 25px; font-weight: 800; cursor: pointer; }
         `}</style>
      </div>
   );
};

export default WalkInBooking;
