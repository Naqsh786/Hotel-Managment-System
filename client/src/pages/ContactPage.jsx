import { useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, clearStatus } from '../Features/messageSlice';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '../context/ToastContext';

const ContactPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector((state) => state.messages);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: ''
    }
  });

  useEffect(() => {
    if (success) {
      toast.success("Message Received", "Thank you for reaching out! Our team will get back to you shortly.");
      reset({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
      dispatch(clearStatus());
    }
    if (error) {
      toast.error("Message Failed", typeof error === 'string' ? error : "Something went wrong while sending your message.");
      dispatch(clearStatus());
    }
  }, [success, error, dispatch, reset, user, toast]);

  const onSubmit = (data) => {
    if (!user) return;
    dispatch(sendMessage(data));
  };

  return (
    <div className="contact-page">
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '120px 0 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2,
        }} />
        <div className="container-sona" style={{ position: 'relative', zIndex: 2 }}>
           <h1 className="serif" style={{fontSize: '56px', marginBottom: '15px', color: '#fff'}}>Contact Us</h1>
           <p className="text-muted" style={{fontSize: '16px', maxWidth: '600px', margin: '0 auto 20px', color: 'rgba(255,255,255,0.7)'}}>
              Our team is here to help you around the clock. Reach out to us for bookings, inquiries, or feedback.
           </p>
           <div className="flex-center gap-10" style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)'}}>
              <span style={{color: '#fff', fontWeight: '700'}}>Home</span> / <span>Contact</span>
           </div>
        </div>
      </section>

      <section className="section-padding">
         <div className="container-sona">
            <div className="grid-2" style={{gap: '60px'}}>
               <div className="contact-info-box">
                  <span className="text-primary" style={{letterSpacing: '3px', fontWeight: '700', fontSize: '13px'}}>GET IN TOUCH</span>
                  <h2 className="serif" style={{fontSize: '36px', margin: '15px 0'}}>Contact Details</h2>
                  <p className="text-muted" style={{marginBottom: '30px', fontSize: '15px'}}>
                     Our team is here to help you around the clock. Reach out to us for bookings, inquiries, or feedback.
                  </p>
                  <div className="flex-col gap-20">
                     <div className="flex-center gap-20" style={{justifyContent: 'flex-start'}}>
                        <div style={{width: '50px', height: '50px', background: 'var(--sona-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sona-gold)', borderRadius: '12px'}}>
                           <MapPin size={24} />
                        </div>
                        <div>
                           <h4 style={{fontSize: '15px', fontWeight: '700'}}>Location</h4>
                           <p style={{fontSize: '13px', color: 'var(--sona-text-muted)'}}>123 Luxury Avenue, Gold Coast, CA</p>
                        </div>
                     </div>
                     <div className="flex-center gap-20" style={{justifyContent: 'flex-start'}}>
                        <div style={{width: '50px', height: '50px', background: 'var(--sona-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sona-gold)', borderRadius: '12px'}}>
                           <Phone size={24} />
                        </div>
                        <div>
                           <h4 style={{fontSize: '15px', fontWeight: '700'}}>Call Us</h4>
                           <p style={{fontSize: '13px', color: 'var(--sona-text-muted)'}}>(123) 456-7890</p>
                        </div>
                     </div>
                     <div className="flex-center gap-20" style={{justifyContent: 'flex-start'}}>
                        <div style={{width: '50px', height: '50px', background: 'var(--sona-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sona-gold)', borderRadius: '12px'}}>
                           <Mail size={24} />
                        </div>
                        <div>
                           <h4 style={{fontSize: '15px', fontWeight: '700'}}>Email</h4>
                           <p style={{fontSize: '13px', color: 'var(--sona-text-muted)'}}>info@sonahotel.com</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="contact-form-card" style={{background: 'var(--sona-bg)', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--sona-border)', alignSelf: 'flex-start', position: 'relative', overflow: 'hidden'}}>
                  
                  {!user && (
                    <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', zIndex: 10, backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px'}}>
                        <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#dfa974'}}>
                           <Lock size={28} />
                        </div>
                        <h3 className="serif" style={{marginBottom: '10px'}}>Authentication Required</h3>
                        <p className="text-muted" style={{fontSize: '14px', marginBottom: '25px'}}>Please log in to your account to send us a message.</p>
                        <Link to="/login" className="btn-sona-primary" style={{textDecoration: 'none', padding: '12px 30px', background: '#19191a'}}>LOGIN TO CONTINUE</Link>
                    </div>
                  )}



                  <form className="flex-col gap-20" onSubmit={handleSubmit(onSubmit)}>
                     <div className="input-group-sona">
                        <label>Full Name</label>
                        <input 
                           type="text" 
                           {...register("name", { required: "Name is required" })}
                           placeholder="Your Name" 
                           style={{ borderColor: errors.name ? '#ef4444' : 'var(--sona-border)' }}
                        />
                        {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.name.message}</p>}
                     </div>
                     <div className="input-group-sona">
                        <label>Email Address</label>
                        <input 
                           type="email" 
                           {...register("email", { 
                              required: "Email is required",
                              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                           })}
                           placeholder="Your Email" 
                           style={{ borderColor: errors.email ? '#ef4444' : 'var(--sona-border)' }}
                        />
                        {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.email.message}</p>}
                     </div>
                     <div className="input-group-sona">
                        <label>Subject</label>
                        <input 
                           type="text" 
                           {...register("subject", { required: "Subject is required", minLength: { value: 5, message: "Subject too short" } })}
                           placeholder="How can we help?" 
                           style={{ borderColor: errors.subject ? '#ef4444' : 'var(--sona-border)' }}
                        />
                        {errors.subject && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.subject.message}</p>}
                     </div>
                     <div className="input-group-sona">
                        <label>Message</label>
                        <textarea 
                           rows={5} 
                           {...register("message", { required: "Message is required", minLength: { value: 10, message: "Message must be at least 10 characters" } })}
                           placeholder="Write your message here..." 
                           style={{ borderColor: errors.message ? '#ef4444' : 'var(--sona-border)' }}
                        ></textarea>
                        {errors.message && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.message.message}</p>}
                     </div>
                     


                     <button type="submit" disabled={loading || !user} className="btn-sona-primary w-full" style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: user ? '#dfa974' : '#ccc'}}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <>Send Message <Send size={18} /></>}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      <section style={{height: '500px', width: '100%', overflow: 'hidden', borderTop: '1px solid var(--sona-border)'}}>
         <iframe 
            title="Sona Hotel Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.565735111111!2d-118.4025!3d33.9425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU2JzMzLjAiTiAxMTjCsDI0JzA5LjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
            style={{width: '100%', height: '100%', border: 0}}
            allowFullScreen="" 
            loading="lazy"
         ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;
