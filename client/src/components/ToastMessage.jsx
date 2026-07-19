import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ToastMessage = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          style={{
            position: 'fixed',
            top: '0',
            left: '50%',
            zIndex: 9999,
            background: type === 'error' ? '#fee2e2' : '#dcfce7',
            color: type === 'error' ? '#b91c1c' : '#15803d',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '600',
            fontSize: '14px',
            minWidth: '300px',
            border: type === 'error' ? '1px solid #fca5a5' : '1px solid #86efac'
          }}
        >
          <AlertCircle size={20} />
          <span style={{ flex: 1 }}>{message}</span>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit', padding: 0 }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastMessage;
