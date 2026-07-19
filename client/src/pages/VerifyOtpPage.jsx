import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, clearError, clearSuccess } from "../Features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useToast } from "../context/ToastContext";

const VerifyOtpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  
  const { loading, error, success } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (success) {
      toast.success("Identity Verified", "Email verification successful! Redirecting to login.");
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate("/login");
      }, 2000);
    }
    if (error) {
      toast.error("Verification Error", typeof error === 'string' ? error : (error?.message || "Verification failed"));
      dispatch(clearError());
    }
  }, [success, error, navigate, dispatch, toast]);

  const onVerifySubmit = (data) => {
    if (email) {
      dispatch(verifyOTP({ email, otp: data.otp }));
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card"
        style={{maxWidth: '500px'}}
      >
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
           <div style={{padding: '20px', background: 'var(--sona-bg-alt)', borderRadius: '50%'}}>
              <ShieldCheck size={40} color="#dfa974" />
           </div>
        </div>
        
        <div style={{marginBottom: '40px'}}>
           <h2 className="serif" style={{fontSize: '32px', color: 'var(--sona-text)'}}>Verify Email</h2>
           <p className="text-muted" style={{marginTop: '10px'}}>
             We&apos;ve sent a 6-digit verification code to <br />
             <span style={{fontWeight: '700', color: 'var(--sona-dark)'}}>{email}</span>
           </p>
        </div>

        <form onSubmit={handleSubmit(onVerifySubmit)} className="flex-col gap-20">
          <div className="input-group-sona">
            <input 
              type="text" 
              {...register("otp", { 
                required: "OTP is required", 
                pattern: { value: /^[0-9]{6}$/, message: "Please enter 6 digits" } 
              })}
              placeholder="000000" 
              style={{textAlign: 'center', fontSize: '28px', letterSpacing: '10px', fontWeight: '700', height: '80px', borderColor: errors.otp ? '#ef4444' : 'var(--sona-border)'}}
              maxLength={6}
            />
            {errors.otp && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>{errors.otp.message}</p>}
          </div>



          <button type="submit" className="btn-sona-primary w-full" style={{width: '100%', height: '55px'}} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Account"}
          </button>
        </form>

        <p style={{marginTop: '30px', fontSize: '14px', color: 'var(--sona-text-muted)', textAlign: 'center'}}>
          Didn&apos;t receive the code? <button type="button" style={{background: 'none', border: 'none', color: '#dfa974', fontWeight: '700', cursor: 'pointer', padding: '0 5px'}}>Resend OTP</button>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
