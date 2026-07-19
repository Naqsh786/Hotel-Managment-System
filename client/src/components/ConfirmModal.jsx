import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            background: 'var(--admin-sidebar)',
            border: '1px solid var(--admin-border)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '450px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'rgba(245, 158, 11, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onCancel}
              style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 24px 30px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--admin-text)', margin: '0 0 10px' }}>{title}</h3>
            <p style={{ fontSize: '15px', color: 'var(--admin-text-muted)', lineHeight: '1.6', margin: 0 }}>{message}</p>
          </div>

          {/* Actions */}
          <div style={{ 
            padding: '20px 24px', 
            background: 'var(--admin-bg)', 
            borderTop: '1px solid var(--admin-border)',
            display: 'flex',
            gap: '12px'
          }}>
            <button 
              onClick={onCancel}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '12px', 
                border: '1px solid var(--admin-border)', 
                background: 'transparent',
                color: 'var(--admin-text)',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '12px', 
                border: 'none', 
                background: '#dfa974',
                color: 'white',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
