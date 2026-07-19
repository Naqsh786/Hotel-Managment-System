import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addReview } from '../Features/reviewSlice';
import { useToast } from '../context/ToastContext';

import CustomDropdown from '../components/CustomDropdown';

const AddReviewForm = ({ bookings }) => {
   const dispatch = useDispatch();
   const { loading } = useSelector(state => state.reviews);
   const [rating, setRating] = useState(5);
   const [hoverRating, setHoverRating] = useState(0);
   const [submitted, setSubmitted] = useState(false);
   const [selectedBooking, setSelectedBooking] = useState("");
   const { toast } = useToast();

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors }
   } = useForm({
      mode: "onChange"
   });

   const onSubmitReview = async (data) => {
      const activeBookingObj = bookings.find(b => b._id === data.bookingId);
      if(!activeBookingObj || !activeBookingObj.room) return toast.error("Booking Error", "Room details not found for this booking.");

      await dispatch(addReview({
         room: activeBookingObj.room._id || activeBookingObj.room,
         rating,
         comment: data.comment
      })).unwrap()
        .then(() => {
          toast.success("Feedback Received", "Your review has been successfully posted.");
          setSubmitted(true);
        })
        .catch(err => toast.error("Submission Failed", err));

      reset();
      setSelectedBooking("");
      setRating(5);
      setTimeout(() => setSubmitted(false), 5000);
   };

   if (submitted) {
      return (
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-center" style={{ padding: '40px', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 color="#10b981" size={40} style={{ marginBottom: '15px' }} />
            <h3 style={{ color: '#10b981' }}>Thank you for your feedback!</h3>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', marginTop: '5px' }}>Your review helps us improve our services.</p>
         </motion.div>
      );
   }

   return (
      <div className="premium-card" style={{ padding: '30px' }}>
         <h3 className="serif" style={{ fontSize: '20px', marginBottom: '25px', color: 'var(--admin-text)' }}>Leave a Review</h3>
         <form onSubmit={handleSubmit(onSubmitReview)} className="flex-col gap-20">
            <div className="input-group-sona">
               <CustomDropdown 
                  label="Select Your Stay"
                  options={bookings.map(b => `${b.room?.name} (${new Date(b.checkIn).toLocaleDateString()})`)}
                  value={selectedBooking}
                  onChange={(val) => {
                     setSelectedBooking(val);
                     const booking = bookings.find(b => `${b.room?.name} (${new Date(b.checkIn).toLocaleDateString()})` === val);
                     setValue("bookingId", booking?._id);
                  }}
                  placeholder="Select a previous stay..."
               />
               <input type="hidden" {...register("bookingId", { required: "Please select a booking" })} />
               {errors.bookingId && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.bookingId.message}</p>}
            </div>

            <div className="flex-col gap-10">
               <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Rating</label>
               <div className="flex gap-5">
                  {[1,2,3,4,5].map(star => (
                     <Star 
                        key={star}
                        size={32}
                        fill={(hoverRating || rating) >= star ? "#dfa974" : "none"}
                        color={(hoverRating || rating) >= star ? "#dfa974" : "var(--admin-border)"}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                     />
                  ))}
               </div>
            </div>

            <div className="input-group-sona">
               <label>Your Experience</label>
               <textarea 
                  {...register("comment", { required: "Please share some feedback", minLength: { value: 10, message: "Comment too short" } })}
                  placeholder="Share your thoughts about the room, service, and hospitality..."
                  style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid var(--admin-border)', minHeight: '120px', borderColor: errors.comment ? '#ef4444' : 'var(--admin-border)', background: 'var(--sona-bg)', color: 'var(--admin-text)' }}
               ></textarea>
               {errors.comment && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.comment.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-sona-primary flex-center gap-10" style={{ width: '100%', padding: '15px' }}>
               {loading ? <Loader2 size={18} className="animate-spin m-auto" /> : <><Send size={18} /> Submit Review</>}
            </button>
         </form>
      </div>
   );
};

export default AddReviewForm;
