import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDropdown = ({ label, options, value, onChange, placeholder = "Select option", variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const isAdmin = variant === 'admin';

  return (
    <div className={`custom-dropdown-wrapper ${isAdmin ? 'dropdown-admin' : 'dropdown-default'}`} ref={dropdownRef}>
      {label && <label className="dropdown-label">{label}</label>}
      <div className="custom-dropdown">
        <button
          type="button"
          className={`dropdown-header ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={`dropdown-selected-text ${!value ? 'dropdown-placeholder' : ''}`}>
            {value || placeholder}
          </span>
          <motion.span
            className="dropdown-chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="dropdown-list-container"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              role="listbox"
            >
              <ul className="dropdown-list">
                {options.map((option, index) => (
                  <motion.li
                    key={index}
                    className={`dropdown-item ${value === option ? 'selected' : ''}`}
                    onClick={() => handleSelect(option)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    role="option"
                    aria-selected={value === option}
                  >
                    <span className="dropdown-item-text">{option}</span>
                    {value === option && (
                      <span className="dropdown-check">
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomDropdown;
