import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

const CancelPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--sona-bg)' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card" 
                style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '60px 40px' }}
            >
                <div style={{ background: '#ef4444', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)' }}>
                    <XCircle color="white" size={45} />
                </div>
                
                <h1 style={{ fontSize: '32px', marginBottom: '15px' }}>Payment Cancelled</h1>
                <p style={{ color: 'var(--sona-text-muted)', marginBottom: '40px', fontSize: '16px', lineHeight: '1.6' }}>
                    The payment process was cancelled. No charges were made to your account. You can try again whenever you&apos;re ready.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} className="btn-sona-primary w-full" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <RefreshCcw size={18} /> Try Again
                    </button>
                    <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--sona-text)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <ArrowLeft size={18} /> Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CancelPage;
