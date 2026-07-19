import { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/Toast/ToastContainer';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', title, message }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => {
      const newToasts = [...prevToasts, { id, type, title, message }];
      if (newToasts.length > 4) {
        return newToasts.slice(1); // Keep only the latest 4
      }
      return newToasts;
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (title, message) => showToast({ type: 'success', title, message }),
    error: (title, message) => showToast({ type: 'error', title, message }),
    info: (title, message) => showToast({ type: 'info', title, message }),
    warning: (title, message) => showToast({ type: 'warning', title, message }),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
