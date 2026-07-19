import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const SuccessPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const bookingId = searchParams.get('booking_id');

    useEffect(() => {
        if (bookingId && sessionId) {
            axios.post('/api/payment/confirm-booking', { bookingId }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            .then(() => {
                toast.success("Payment Verified", "Your booking has been finalized");
            })
            .catch(err => {
                console.error("Booking Finalization Error:", err);
                toast.error("Booking Error", "Payment was successful but booking status update failed. Please contact support.");
            });
        }
    }, [sessionId, bookingId, toast]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--sona-bg)' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card" 
                style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '60px 40px' }}
            >
                <div style={{ background: '#22c55e', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.3)' }}>
                    <CheckCircle color="white" size={45} />
                </div>
                
                <h1 style={{ fontSize: '32px', marginBottom: '15px' }}>Payment Successful!</h1>
                <p style={{ color: 'var(--sona-text-muted)', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6' }}>
                    Your transaction has been completed successfully. Your booking is now confirmed. We&apos;ve sent the details to your email.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn-sona-primary w-full" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        Go to Dashboard <ArrowRight size={18} />
                    </button>
                    <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--sona-text)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Home size={18} /> Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SuccessPage;
