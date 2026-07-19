import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastItem = ({ id, type, title, message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const icons = {
    success: <CheckCircle className="toast-icon" size={20} color="#dfa974" />,
    error: <XCircle className="toast-icon" size={20} color="#ef4444" />,
    info: <Info className="toast-icon" size={20} color="#0ea5e9" />,
    warning: <AlertTriangle className="toast-icon" size={20} color="#f59e0b" />,
  };

  const colors = {
    success: 'var(--admin-border)',
    error: '#ef4444',
    info: '#0ea5e9',
    warning: '#f59e0b',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: 20 }}
      className="custom-toast-item"
      style={{
        background: 'var(--admin-sidebar)',
        border: `1px solid ${type === 'success' ? 'var(--admin-border)' : colors[type]}`,
        borderLeft: `4px solid ${type === 'success' ? '#dfa974' : colors[type]}`,
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '320px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '10px'
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ marginTop: '2px' }}>{icons[type]}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--admin-text)' }}>{title}</h4>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--admin-text-muted)', lineHeight: '1.4' }}>{message}</p>
        </div>
        <button 
          onClick={() => onRemove(id)}
          style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: 0, height: '20px' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: 4, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: type === 'success' ? '#dfa974' : colors[type],
          opacity: 0.6
        }}
      />
    </motion.div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div 
      className="toast-container"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column-reverse', // Newest at bottom
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
