import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError, clearSuccess } from "../Features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Eye, EyeOff, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useToast } from "../context/ToastContext";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange"
  });

  const userEmail = watch("email");

  useEffect(() => {
    if (success) {
      toast.success("Account Created", "Registration successful! Please verify your email.");
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate(`/verify-otp?email=${userEmail}`);
      }, 2000);
    }
    if (error) {
      toast.error("Registration Error", typeof error === 'string' ? error : (error?.message || "Registration failed"));
      dispatch(clearError());
    }
  }, [success, error, navigate, userEmail, dispatch, toast]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card"
        style={{maxWidth: '600px'}}
      >
        <div style={{marginBottom: '40px'}}>
           <h2 className="serif" style={{fontSize: '32px', color: 'var(--sona-text)'}}>Create Account</h2>
           <p className="text-muted" style={{marginTop: '10px'}}>Join Sona Hotel to manage your luxury stay and reservations.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid-12" style={{textAlign: 'left', rowGap: '10px', columnGap: '20px'}}>
          <div className="input-group-sona span-12">
            <label>Full Name</label>
            <input 
              type="text" 
              {...register("name", { required: "Full name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
              placeholder="Your full name"
              style={{ borderColor: errors.name ? '#ef4444' : 'var(--sona-border)' }}
            />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.name.message}</p>}
          </div>

          <div className="input-group-sona span-6">
            <label>Email Address</label>
            <input 
              type="email" 
              {...register("email", { 
                required: "Email is required", 
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } 
              })}
              placeholder="example@domain.com"
              style={{ borderColor: errors.email ? '#ef4444' : 'var(--sona-border)' }}
            />
            {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.email.message}</p>}
          </div>

          <div className="input-group-sona span-6">
            <label>Phone Number</label>
            <input 
              type="text" 
              {...register("phoneNumber", { required: "Phone number is required" })}
              placeholder="+92 XXX XXXXXXX" 
              style={{ borderColor: errors.phoneNumber ? '#ef4444' : 'var(--sona-border)' }}
            />
            {errors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.phoneNumber.message}</p>}
          </div>

          <div className="input-group-sona span-12">
            <label>CNIC</label>
            <input 
              type="text" 
              {...register("cnic", { 
                required: "CNIC is required",
                pattern: { value: /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/, message: "Format: 12345-1234567-1" }
              })}
              placeholder="XXXXX-XXXXXXX-X" 
              style={{ borderColor: errors.cnic ? '#ef4444' : 'var(--sona-border)' }}
            />
            {errors.cnic && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.cnic.message}</p>}
          </div>

          <div className="input-group-sona span-12">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 6, message: "Password must be at least 6 characters" } 
                })}
                placeholder="Min 6 characters"
                style={{ borderColor: errors.password ? '#ef4444' : 'var(--sona-border)', width: '100%', paddingRight: '45px' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {errors.password.message}</p>}
          </div>

          <div className="input-group-sona span-12">
            <label>Address</label>
            <textarea 
              {...register("address")}
              rows={2} 
              placeholder="Home or work address (Optional)" 
            />
          </div>


          <div className="span-12">
             
             <button type="submit" className="btn-premium-auth" disabled={loading}>
               {loading ? <Loader2 className="animate-spin" size={20} /> : (
                 <>
                   <UserPlus size={20} /> Join Sona Hotel
                 </>
               )}
             </button>
             
             <p style={{marginTop: '30px', fontSize: '14px', color: 'var(--sona-text-muted)', textAlign: 'center'}}>
                Already have an account? <Link to="/login" style={{color: '#dfa974', fontWeight: '700', textDecoration: 'none'}}>Login Here</Link>
             </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
