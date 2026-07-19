import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomById } from '../Features/roomSlice';
import { makeBooking, resetBookingState } from '../Features/bookingSlice';
import { fetchAmenities } from '../Features/amenitySlice';
import { Calendar, Mail, Phone, User, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import PaymentModal from '../components/PaymentModal';
import { useToast } from '../context/ToastContext';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';



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
  return <span style={{ fontSize: '48px', fontWeight: '900', color: 'var(--sona-gold)', display: 'block', margin: '10px 0' }}>${count.toFixed(0)}</span>;
};

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentRoom: room, loading: roomLoading } = useSelector((state) => state.rooms);
  const { user } = useSelector((state) => state.auth);
  const { loading: bookingLoading, success, error } = useSelector((state) => state.bookings);
  const { amenities } = useSelector((state) => state.amenities);
  const { toast } = useToast();

  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      paymentMethod: 'Card',
      partialPayment: false
    }
  });

  const watchAll = watch();

  useEffect(() => {
    dispatch(fetchRoomById(roomId));
    dispatch(fetchAmenities());
  }, [dispatch, roomId]);


  const toggleAmenity = (amenity) => {
    if (selectedAmenities.find(a => a._id === amenity._id)) {
      setSelectedAmenities(selectedAmenities.filter(a => a._id !== amenity._id));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Price Calculation Logic
  useEffect(() => {
    let finalPrice = 0;
    const start = watchAll.checkIn ? new Date(watchAll.checkIn) : null;
    const end = watchAll.checkOut ? new Date(watchAll.checkOut) : null;
    let computedDays = 0;

    if (start && end && end > start) {
      computedDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
      setDays(computedDays);
    } else {
      setDays(0);
    }

    const amenitiesTotal = selectedAmenities.reduce((sum, item) => {
      return sum + (item.price || 0); // Flat fee, perNight logic removed as it's not in the db model
    }, 0);

    if (computedDays > 0 && room) {
      finalPrice = (computedDays * room.price) + amenitiesTotal;
    } else {
      finalPrice = amenitiesTotal;
    }
    
    setTotalPrice(finalPrice * (1 - discount));
  }, [watchAll.checkIn, watchAll.checkOut, room, selectedAmenities, discount]);

  const onBookingSubmit = (data) => {
    if (days <= 0) return;
    if (data.paymentMethod === 'Card') {
      setShowPaymentModal(true);
      return;
    }
    
    if (data.paymentMethod === 'Stripe') {
      processBooking(data, true);
      return;
    }
    processBooking(data);
  };

  const handleStripeRedirect = async (booking) => {
    try {
      setIsProcessing(true);
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      
      const response = await axios.post('/api/payment/create-checkout-session', {
        roomName: room.name,
        price: watchAll.partialPayment ? totalPrice / 2 : totalPrice,
        quantity: 1,
        bookingId: booking._id
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("Stripe Redirect Error:", err);
      toast.error("Payment Error", err.response?.data?.message || "Could not redirect to Stripe");
      setIsProcessing(false);
    }
  };

  const processBooking = (data, isStripe = false) => {
    setIsProcessing(true);
    setTimeout(() => {
      dispatch(makeBooking({
        room: roomId,
        ...data,
        totalPrice,
        amenities: selectedAmenities.map(a => a.name)
      })).unwrap()
        .then((res) => {
          if (isStripe) {
            handleStripeRedirect(res);
          } else {
            toast.success("Reservation Received", "Your booking has been successfully processed");
          }
        })
        .catch(err => toast.error("Booking Failed", err));
      setIsProcessing(false);
    }, 1000);
  };

  if (roomLoading) return <div className="flex-center" style={{height: '80vh'}}><Loader2 className="animate-spin" size={40} /></div>;
  if (!room) return <div className="flex-center" style={{height: '80vh'}}>Room not found</div>;

  if (success) {
    return (
      <div className="flex-center" style={{height: '80vh', padding: '20px'}}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="premium-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ background: 'var(--sona-gold)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
            <CheckCircle2 color="white" size={45} />
          </div>
          <PriceCounter target={watchAll.partialPayment ? totalPrice / 2 : totalPrice} />
          <h1>Booking Confirmed!</h1>
          <p style={{ color: 'var(--sona-text-muted)', marginBottom: '35px' }}>Thank you for choosing Sona. Room **{room.name}** has been reserved.</p>
          <button onClick={() => { dispatch(resetBookingState()); navigate('/dashboard'); }} className="btn-sona-primary w-full">View My Bookings</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 20px 80px', background: 'var(--sona-bg)' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} className="flex gap-10 m-b-30" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}><ArrowLeft size={18} /> BACK</button>

        <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
          <div className="booking-summary-col">
            <h2 style={{ fontSize: '28px', marginBottom: '25px' }}>Summary</h2>
            <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
              <img src={room.images?.[0]} alt={room.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '22px' }}>{room.name}</h3>
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--sona-border)', paddingTop: '20px' }}>
                  <div className="flex-between"><span>Rate / Night</span><span style={{fontWeight: '800'}}>${room.price}</span></div>
                  <div className="flex-between"><span>Days</span><span style={{fontWeight: '800'}}>{days} Nights</span></div>
                  <div className="flex-between" style={{ borderTop: '1px solid var(--sona-border)', marginTop: '15px', paddingTop: '15px' }}>
                     <span style={{ fontSize: '18px', fontWeight: '800' }}>Total</span>
                     <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--sona-gold)' }}>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-form-col">
             <div className="premium-card" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '30px' }}>Reservation Form</h3>
                <form onSubmit={handleSubmit(onBookingSubmit)} className="flex-col gap-25">
                   <div className="input-group-sona">
                      <label><User size={14} /> Full Name</label>
                      <input {...register("name", { required: "Name is required" })} style={{borderColor: errors.name ? '#ef4444' : 'var(--sona-border)'}} />
                      {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.name.message}</p>}
                   </div>
                   <div className="grid-2" style={{ gap: '20px' }}>
                      <div className="input-group-sona">
                         <label><Mail size={14} /> Email</label>
                         <input {...register("email", { required: "Email required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" } })} style={{borderColor: errors.email ? '#ef4444' : 'var(--sona-border)'}} />
                         {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.email.message}</p>}
                      </div>
                      <div className="input-group-sona">
                         <label><Phone size={14} /> Phone</label>
                         <input {...register("phone", { required: "Phone required" })} style={{borderColor: errors.phone ? '#ef4444' : 'var(--sona-border)'}} />
                         {errors.phone && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.phone.message}</p>}
                      </div>
                   </div>
                   <div className="grid-2" style={{ gap: '20px' }}>
                      <div className="input-group-sona">
                         <label><Calendar size={14} /> Check-In</label>
                         <input type="date" {...register("checkIn", { required: "Required" })} min={new Date().toISOString().split('T')[0]} style={{borderColor: errors.checkIn ? '#ef4444' : 'var(--sona-border)'}} />
                         {errors.checkIn && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.checkIn.message}</p>}
                      </div>
                      <div className="input-group-sona">
                         <label><Calendar size={14} /> Check-Out</label>
                         <input type="date" {...register("checkOut", { required: "Required" })} min={watchAll.checkIn || new Date().toISOString().split('T')[0]} style={{borderColor: errors.checkOut ? '#ef4444' : 'var(--sona-border)'}} />
                         {errors.checkOut && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.checkOut.message}</p>}
                      </div>
                   </div>
                   
                   <div>
                      <p style={{fontSize: '13px', fontWeight: '800', marginBottom: '15px'}}>ADD AMENITIES</p>
                      <div className="grid-2" style={{ gap: '10px' }}>
                         {amenities?.map(item => (
                            <div key={item._id} onClick={() => toggleAmenity(item)} style={{ padding: '12px', border: `2px solid ${selectedAmenities.find(a => a._id === item._id) ? 'var(--sona-gold)' : 'var(--sona-border)'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', background: 'var(--sona-bg)', transition: 'all 0.3s ease' }}>
                               <span style={{fontSize: '12px', fontWeight: '700'}}>{item.name}</span>
                               <span style={{fontSize: '12px', fontWeight: '800'}}>${item.price || 0}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div style={{ padding: '15px', background: 'var(--sona-bg-alt)', borderRadius: '15px' }}>
                      <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Payment Method</h4>
                      <div className="flex gap-10">
                         {['Card', 'Stripe'].map(m => (
                             <button 
                               type="button" 
                               key={m} 
                               onClick={() => setValue("paymentMethod", m)} 
                               style={{ 
                                 flex: 1, 
                                 padding: '12px', 
                                 borderRadius: '10px', 
                                 border: `2px solid ${watchAll.paymentMethod === m ? 'var(--sona-gold)' : 'var(--sona-border)'}`, 
                                 background: watchAll.paymentMethod === m ? 'var(--sona-gold)' : 'transparent', 
                                 color: watchAll.paymentMethod === m ? 'white' : 'var(--sona-text)',
                                 fontWeight: '700',
                                 transition: 'all 0.3s ease'
                               }}
                             >
                               {m}
                             </button>
                         ))}
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', cursor: 'pointer' }}>
                        <input type="checkbox" {...register("partialPayment")} style={{accentColor: 'var(--sona-gold)'}} />
                        <span style={{fontSize: '13px', fontWeight: '600'}}>Pay 50% upfront</span>
                      </label>
                   </div>

                   {error && <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '700' }}>{error}</p>}
                   <button type="submit" disabled={bookingLoading || isProcessing} className="btn-sona-primary w-full" style={{ padding: '20px', fontSize: '16px' }}>
                      {(bookingLoading || isProcessing) ? <Loader2 className="animate-spin" /> : `CONFIRM FOR $${watchAll.partialPayment ? (totalPrice/2).toFixed(2) : totalPrice.toFixed(2)}`}
                   </button>
                </form>
             </div>
          </div>
       </div>
       <PaymentModal 
         isOpen={showPaymentModal}
         onClose={() => setShowPaymentModal(false)}
         totalAmount={watchAll.partialPayment ? totalPrice / 2 : totalPrice}
         onConfirm={() => processBooking(watchAll)}
       />
     </div>
    </div>
  );
};

export default BookingPage;
