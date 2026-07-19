import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../Features/themeSlice';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ variant = 'default' }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

  if (variant === 'sidebar') {
    return (
      <button 
        onClick={() => dispatch(toggleDarkMode())}
        className="admin-nav-item theme-toggle"
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          background: 'var(--admin-bg)',
          border: '1px solid var(--admin-border)',
          color: 'var(--admin-text)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'var(--transition)',
          marginBottom: '10px'
        }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: darkMode ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {darkMode ? <Sun size={18} color="#85f242" /> : <Moon size={18} color="#64748b" />}
        </motion.div>
        <span style={{ whiteSpace: 'nowrap' }}>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => dispatch(toggleDarkMode())}
      style={{
        background: 'rgba(223, 169, 116, 0.1)',
        border: '1px solid var(--sona-border)',
        borderRadius: '50px',
        padding: '8px 16px',
        cursor: 'pointer',
        color: 'var(--sona-gold)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        fontWeight: '700',
        transition: 'var(--transition)'
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 360 : 0, scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </motion.div>
      <span>{darkMode ? 'LIGHT' : 'DARK'}</span>
    </motion.button>
  );
};

export default ThemeToggle;
