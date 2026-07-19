import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Star, Edit3, Camera, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '../Features/authSlice';
import { useToast } from '../context/ToastContext';


const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      cnic: user?.cnic || '',
      address: user?.address || ''
    }
  });



  // Keep form in sync with user state
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        cnic: user.cnic || '',
        address: user.address || ''
      });
    }
  }, [user, reset]);

  const onUpdate = async (data) => {
    await dispatch(updateUserProfile(data)).unwrap();
    toast.success("Profile Updated", "Your personal details have been saved.");
    setIsEditing(false);
  };



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File excessively large", "Image must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        await dispatch(updateUserProfile({ profileImage: base64Image })).unwrap();
        toast.success("Image Uploaded", "Your profile picture has been updated.");
      } catch (error) {
        toast.error("Upload Failed", typeof error === 'string' ? error : "Could not upload image.");
      }
    };
  };

  return (
      <div style={{ width: '100%', padding: '0' }}>
         <div className="grid-2" style={{ gap: '40px', alignItems: 'start', gridTemplateColumns: '1fr 2fr' }}>
            
            {/* Left Column: Avatar & Summary */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="premium-card text-center" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(135deg, var(--sona-gold) 0%, #e8c69f 100%)', opacity: 0.1 }}></div>
                  
                  <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '50%', border: '4px solid var(--sona-border)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'var(--sona-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                     ) : (
                        <span style={{ fontSize: '40px', fontWeight: '800', color: 'var(--sona-gold)' }}>{user?.name?.[0]}</span>
                     )}
                     <input type="file" id="profileImageUpload" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                     <label htmlFor="profileImageUpload" style={{ position: 'absolute', bottom: '0', right: '0', width: '35px', height: '35px', borderRadius: '50%', background: 'var(--sona-bg-alt)', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sona-gold)', cursor: 'pointer', transition: '0.3s' }} className="hover-lift">
                        <Camera size={16} />
                     </label>
                  </div>
                  
                  <h3 className="serif" style={{ fontSize: '24px', marginBottom: '5px', color: 'var(--admin-text)' }}>{user?.name}</h3>
                  <span style={{ padding: '5px 12px', background: 'rgba(223, 169, 116, 0.1)', color: 'var(--sona-gold)', borderRadius: '50px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Silver Member</span>
                  
                  <div className="flex-col gap-15 m-t-30" style={{ marginTop: '30px', textAlign: 'left', borderTop: '1px solid var(--admin-border)', paddingTop: '30px' }}>
                     <div className="flex gap-15" style={{ alignItems: 'center' }}>
                        <div style={{ padding: '10px', background: 'var(--sona-bg-alt)', borderRadius: '10px', color: 'var(--sona-gold)' }}><Mail size={18} /></div>
                        <div><p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Email</p><p style={{ fontSize: '13px', fontWeight: '700' }}>{user?.email}</p></div>
                     </div>
                     <div className="flex gap-15" style={{ alignItems: 'center' }}>
                        <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '10px' }}><Star size={18} /></div>
                        <div><p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Loyalty Points</p><p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)' }}>{user?.loyaltyPoints || 0} Points</p></div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Right Column: Full Details & Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="premium-card" style={{ padding: '40px' }}>
                  <div className="card-header-flex m-b-30">
                     <h3 className="serif" style={{ fontSize: '24px', color: 'var(--admin-text)' }}>Personal Details</h3>
                     <button 
                        onClick={() => setIsEditing(!isEditing)} 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isEditing ? 'rgba(239, 68, 68, 0.1)' : 'var(--sona-bg)', border: isEditing ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--admin-border)', padding: '10px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', color: isEditing ? '#ef4444' : 'var(--admin-text)' }}
                     >
                        <Edit3 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                     </button>
                  </div>

                  <form onSubmit={handleSubmit(onUpdate)} className="grid-2" style={{ gap: '25px' }}>
                     <div className="input-group-sona">
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                           <User size={18} color={errors.name ? "#ef4444" : "#94a3b8"} style={{ position: 'absolute', top: '15px', left: '15px' }} />
                           <input 
                              type="text" 
                              {...register("name", { required: "Name is required" })}
                              disabled={!isEditing} 
                              style={{ paddingLeft: '45px', background: isEditing ? 'var(--sona-bg)' : 'var(--sona-bg-alt)', borderColor: isEditing ? 'var(--sona-gold)' : 'var(--sona-border)' }} 
                           />
                        </div>
                        {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.name.message}</p>}
                     </div>
                     
                     <div className="input-group-sona">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                           <Mail size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '15px' }} />
                           <input type="email" {...register("email")} disabled style={{ paddingLeft: '45px', background: 'var(--sona-bg-alt)', color: 'var(--admin-text-muted)' }} />
                        </div>
                     </div>
                     
                     <div className="input-group-sona">
                        <label>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                           <Phone size={18} color={errors.phoneNumber ? "#ef4444" : "#94a3b8"} style={{ position: 'absolute', top: '15px', left: '15px' }} />
                           <input 
                              type="text" 
                              {...register("phoneNumber", { required: "Phone number required" })}
                              disabled={!isEditing} 
                              style={{ paddingLeft: '45px', background: isEditing ? 'var(--sona-bg)' : 'var(--sona-bg-alt)', borderColor: errors.phoneNumber ? '#ef4444' : (isEditing ? 'var(--sona-gold)' : 'var(--admin-border)'), color: 'var(--admin-text)' }} 
                           />
                        </div>
                        {errors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.phoneNumber.message}</p>}
                     </div>
                     
                     <div className="input-group-sona">
                        <label>Government ID / CNIC</label>
                        <div style={{ position: 'relative' }}>
                           <Shield size={18} color={errors.cnic ? "#ef4444" : "#94a3b8"} style={{ position: 'absolute', top: '15px', left: '15px' }} />
                           <input 
                              type="text" 
                              {...register("cnic", { 
                                 pattern: { value: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/, message: "Format: 00000-0000000-0" } 
                              })}
                              disabled={!isEditing} 
                              style={{ paddingLeft: '45px', background: isEditing ? 'var(--sona-bg)' : 'var(--sona-bg-alt)', borderColor: errors.cnic ? '#ef4444' : (isEditing ? 'var(--sona-gold)' : 'var(--admin-border)'), color: 'var(--admin-text)' }} 
                           />
                        </div>
                        {errors.cnic && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '5px' }}>{errors.cnic.message}</p>}
                     </div>
                     
                     <div className="input-group-sona" style={{ gridColumn: 'span 2' }}>
                        <label>Residential Address</label>
                        <div style={{ position: 'relative' }}>
                           <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', top: '15px', left: '15px' }} />
                           <textarea 
                              {...register("address")}
                              disabled={!isEditing} 
                              style={{ paddingLeft: '45px', background: isEditing ? 'var(--sona-bg)' : 'var(--sona-bg-alt)', borderColor: isEditing ? 'var(--sona-gold)' : 'var(--admin-border)', width: '100%', padding: '15px 15px 15px 45px', borderRadius: '15px', minHeight: '100px', color: 'var(--admin-text)' }} 
                           />
                        </div>
                     </div>

                     {isEditing && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                           <button type="submit" disabled={loading} className="btn-sona-primary w-full" style={{ width: '100%', padding: '15px', fontSize: '16px', letterSpacing: '1px', display: 'flex', justifyContent: 'center' }}>
                              {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                           </button>
                        </motion.div>
                     )}
                  </form>
               </div>
            </motion.div>
          </div>


       </div>
  );
};

export default ProfilePage;
