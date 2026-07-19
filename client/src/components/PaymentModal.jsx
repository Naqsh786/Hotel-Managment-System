import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, X, ShieldCheck, Lock, Zap } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onConfirm, totalAmount }) => {


  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolder: ''
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Basic formatting for card number
    if (name === 'cardNumber') {
      const digits = value.replace(/\D/g, '');
      formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }
    
    if (name === 'cvv' && value.length > 4) return;

    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleConfirm = () => {
    onConfirm(cardDetails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="payment-modal-overlay">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="payment-modal-content"
        >
          <div className="payment-modal-header">
            <div className="flex items-center gap-12">
              <div className="payment-icon-badge">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="serif">Secure Payment</h3>
                <p className="text-muted" style={{fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Credit or Debit Card</p>
              </div>
            </div>
            <button onClick={onClose} className="close-modal-btn"><X size={20} /></button>
          </div>

          <div className="payment-modal-body">
            <div className="amount-display">
              <span className="label">Amount to Pay</span>
              <span className="value">${totalAmount.toFixed(2)}</span>
            </div>

            <div className="card-form-grid">
              <div className="admin-input-group span-3">
                <label>Cardholder Name</label>
                <input 
                  name="cardHolder"
                  value={cardDetails.cardHolder}
                  onChange={handleInputChange}
                  placeholder="John Doe" 
                  className="admin-input-field" 
                />
              </div>
              <div className="admin-input-group span-3">
                <label>Card Number</label>
                <div className="input-with-icon">
                  <input 
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000" 
                    className="admin-input-field" 
                    style={{paddingLeft: '45px'}}
                  />
                  <CreditCard size={18} className="input-icon-left" />
                </div>
              </div>
              <div className="admin-input-group">
                <label style={{ whiteSpace: 'nowrap' }}>Expiry Month</label>
                <select 
                  name="expiryMonth"
                  value={cardDetails.expiryMonth || ''}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiryMonth: e.target.value }))}
                  className="admin-input-field"
                >
                  <option value="" disabled>MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-input-group">
                <label style={{ whiteSpace: 'nowrap' }}>Expiry Year</label>
                <select 
                  name="expiryYear"
                  value={cardDetails.expiryYear || ''}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiryYear: e.target.value }))}
                  className="admin-input-field"
                >
                  <option value="" disabled>YY</option>
                  {Array.from({ length: 11 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={String(year).slice(-2)}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="admin-input-group">
                <label style={{ whiteSpace: 'nowrap' }}><Lock size={12} /> CVV</label>
                <div className="input-with-icon">
                  <input 
                    name="cvv"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="***" 
                    className="admin-input-field" 
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <Lock size={14} className="input-icon-right" />
                </div>
              </div>
            </div>

            <div className="payment-security-notice">
              <ShieldCheck size={14} color="#10b981" />
              <span>Your payment information is encrypted and secure.</span>
            </div>
          </div>

          <div className="payment-modal-footer">
            <button 
              type="button" 
              onClick={handleConfirm} 
              className="btn-book-now"
              style={{ width: '100%' }}
            >
              <Zap size={18} /> Book Now
            </button>
          </div>
        </motion.div>

        <style>{`
          .admin-input-field {
            width: 100%;
            height: 48px; /* Fixed height for consistency */
            padding: 12px 15px;
            background: var(--admin-bg, #f8fafc);
            border: 1.5px solid var(--admin-border, #e2e8f0);
            border-radius: 12px;
            color: var(--admin-text, #1e293b);
            font-size: 14px;
            outline: none;
            transition: 0.3s;
            display: flex;
            align-items: center;
          }
          .admin-input-field:focus {
            border-color: #0ea5e9;
            box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
          }
          .admin-input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .admin-input-group label {
            font-size: 10px; /* Slightly smaller to fit */
            font-weight: 800;
            color: var(--admin-text-muted, #64748b);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 6px;
            min-height: 20px; /* Ensure labels have same height */
            white-space: nowrap;
          }

          .admin-input-group label svg {
            color: inherit;
            opacity: 0.7;
          }

          .payment-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .payment-modal-content {
            background: var(--admin-sidebar, #fff);
            width: 100%;
            max-width: 450px;
            border-radius: 28px;
            border: 1px solid var(--admin-border, #eee);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            color: var(--admin-text, #1e293b);
          }
          .payment-modal-header {
            padding: 25px 30px;
            border-bottom: 1px solid var(--admin-border, #eee);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .payment-icon-badge {
            width: 40px;
            height: 40px;
            background: rgba(14, 165, 233, 0.1);
            color: #0ea5e9;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .close-modal-btn {
            background: none;
            border: none;
            color: var(--admin-text-muted, #64748b);
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: 0.2s;
          }
          .close-modal-btn:hover {
            background: rgba(0,0,0,0.05);
            color: #ef4444;
          }
          .payment-modal-body {
            padding: 30px;
          }
          .amount-display {
            background: var(--admin-bg, #f8fafc);
            padding: 20px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
            border: 1px solid var(--admin-border, #eee);
          }
          .amount-display .label {
            font-size: 11px;
            font-weight: 800;
            color: var(--admin-text-muted, #64748b);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .amount-display .value {
            font-size: 32px;
            font-weight: 900;
            color: #0ea5e9;
          }
          .card-form-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          .span-3 { grid-column: span 3; }
          .span-2 { grid-column: span 2; }
          
          .input-with-icon {
            position: relative;
            width: 100%;
          }
          
          .input-icon-right {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.5;
            pointer-events: none;
          }
          
          .input-icon-left {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.5;
            pointer-events: none;
          }

          .payment-security-notice {
            margin-top: 25px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 700;
            color: var(--admin-text-muted, #64748b);
            justify-content: center;
          }
          .payment-modal-footer {
            padding: 20px 30px 30px;
            display: flex;
            gap: 12px;
          }
          .btn-save-card {
            flex: 1;
            padding: 14px;
            background: #1e293b;
            color: white;
            border: none;
            border-radius: 14px;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: 0.2s;
          }
          .btn-save-card:hover { background: #0f172a; transform: translateY(-2px); }
          
          .btn-book-now {
            flex: 1;
            padding: 14px;
            background: #0ea5e9;
            color: white;
            border: none;
            border-radius: 14px;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: 0.2s;
            box-shadow: 0 10px 20px rgba(14, 165, 233, 0.2);
          }
          .btn-book-now:hover { background: #0284c7; transform: translateY(-2px); box-shadow: 0 15px 25px rgba(14, 165, 233, 0.3); }

          @media (max-width: 480px) {
            .payment-modal-footer {
              flex-direction: column;
            }
            .card-form-grid {
              grid-template-columns: 1fr;
            }
            .card-form-grid > * {
              grid-column: span 1;
            }
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
