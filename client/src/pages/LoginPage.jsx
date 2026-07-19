import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, verifyLoginOTP, clearError } from "../Features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useToast } from "../context/ToastContext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, user, requireOtp, emailForOtp } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({ mode: "onChange" });

  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (token && !loading) {
      toast.success("Welcome Back", `Successfully logged in as ${user?.name}`);
      if (user?.role === "admin") navigate("/admin/dashboard");
      else if (user?.role === "staff") navigate("/staff/dashboard");
      else if (user) navigate("/dashboard");
    }
  }, [token, user, loading, navigate, toast]);

  useEffect(() => {
    if (error) {
      toast.error("Auth Error", typeof error === 'string' ? error : (error?.message || "Authentication failed"));
      dispatch(clearError());
    }
  }, [error, dispatch, toast]);

  const onLoginSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const onOtpSubmit = (data) => {
    dispatch(verifyLoginOTP({ email: emailForOtp, otp: data.otp }));
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div style={{marginBottom: '40px'}}>
           <h2 className="serif" style={{fontSize: '32px', color: 'var(--sona-text)'}}>
              {requireOtp ? "Identity Verification" : "Welcome Back"}
           </h2>
           <p className="text-muted" style={{marginTop: '10px'}}>
              {requireOtp ? `A 6-digit code has been sent to ${emailForOtp}` : "Please enter your credentials to access your account."}
           </p>
        </div>

        <AnimatePresence mode="wait">
          {!requireOtp ? (
            <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <div className="input-group-sona">
                <label>Email Address</label>
                <input 
                  type="email" 
                  {...loginRegister("email", { 
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                  })}
                  placeholder="example@mail.com" 
                  style={{ borderColor: loginErrors.email ? '#ef4444' : 'var(--sona-border)' }}
                />
                {loginErrors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {loginErrors.email.message}</p>}
              </div>

              <div className="input-group-sona">
                <div className="flex-between">
                   <label>Password</label>
                   <Link to="#" style={{fontSize: '12px', color: '#dfa974', textDecoration: 'none', fontWeight: '600'}}>Forgot Password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...loginRegister("password", { required: "Password is required" })}
                    placeholder="••••••••" 
                    style={{ borderColor: loginErrors.password ? '#ef4444' : 'var(--sona-border)', width: '100%', paddingRight: '45px' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {loginErrors.password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12}/> {loginErrors.password.message}</p>}
              </div>



              <button type="submit" className="btn-premium-auth" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <LogIn size={20} /> Login Now
                  </>
                )}
              </button>
              
              <p style={{marginTop: '30px', fontSize: '14px', color: 'var(--sona-text-muted)'}}>
                 New to Sona Hotel? <Link to="/register" style={{color: '#dfa974', fontWeight: '700', textDecoration: 'none'}}>Create Account</Link>
              </p>
            </motion.form>
          ) : (
            <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onSubmit={handleOtpSubmit(onOtpSubmit)}>
              <div style={{display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
                 <div style={{padding: '20px', background: 'var(--sona-bg-alt)', borderRadius: '50%'}}>
                    <ShieldCheck size={40} color="#dfa974" />
                 </div>
              </div>
              
              <div className="input-group-sona">
                <input 
                  type="text" 
                  {...otpRegister("otp", { 
                    required: "OTP is required",
                    pattern: { value: /^[0-9]{6}$/, message: "Must be 6 digits" }
                  })}
                  placeholder="000000" maxLength={6}
                  style={{textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: '700', borderColor: otpErrors.otp ? '#ef4444' : 'var(--sona-border)'}}
                />
                {otpErrors.otp && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '10px', textAlign: 'center' }}>{otpErrors.otp.message}</p>}
              </div>



              <button type="submit" className="btn-premium-auth" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <ShieldCheck size={20} /> Verify Identity
                  </>
                )}
              </button>
              
              <button type="button" onClick={() => window.location.reload()} style={{marginTop: '20px', background: 'none', border: 'none', color: 'var(--sona-text-muted)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '20px auto 0'}}>
                 <ArrowLeft size={14} /> Back to Login
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginPage;
