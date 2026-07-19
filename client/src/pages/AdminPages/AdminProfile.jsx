import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Camera, Loader2, Save, X, Settings as SettingsIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '../../Features/authSlice';
import { useToast } from '../../context/ToastContext';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setPreviewImage(base64String); // Show preview immediately
        try {
          await dispatch(updateUserProfile({ profileImage: base64String })).unwrap();
          toast.success("Profile Image Updated", "Your profile picture has been successfully changed");
        } catch (error) {
          toast.error("Update Failed", "Failed to update profile image");
          setPreviewImage(null); // Revert on error
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      address: user?.address || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  }, [user, reset]);

  const onUpdate = async (data) => {
    await dispatch(updateUserProfile(data)).unwrap();
    toast.success("Profile Updated", "Your information has been successfully changed");
    setIsEditing(false);
  };

  return (
    <div className="admin-main-content">
      <div className="admin-dashboard-view">
        <header className="flex-between m-b-40">
           <div className="flex-col">
              <h1 style={{fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px'}}>Admin Profile</h1>
              <p style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>Manage your personal information and security settings.</p>
           </div>
           {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                style={{background: '#85f242', border: 'none', color: '#1a2e05', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}
              >
                 <User size={18} /> Edit Profile
              </button>
           ) : (
              <button 
                onClick={() => setIsEditing(false)}
                style={{background: 'var(--admin-sidebar)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}
              >
                 <X size={18} /> Cancel
              </button>
           )}
        </header>

        <div className="admin-data-grid">
           {/* Left Info Card */}
           <div className="premium-card span-3" style={{padding: '40px', textAlign: 'center'}}>
              <div 
                 style={{position: 'relative', width: '120px', height: '120px', margin: '0 auto 25px', borderRadius: '50%', border: '4px solid var(--admin-sidebar)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', cursor: isEditing ? 'pointer' : 'default'}}
                 onClick={() => isEditing && fileInputRef.current?.click()}
                 title={isEditing ? "Click to change profile image" : ""}
              >
                 <img 
                    src={previewImage || user?.profileImage || user?.avatar || "https://i.pravatar.cc/150?u=admin"} 
                    alt="Profile" 
                    style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} 
                 />
                 {isEditing && (
                   <div style={{position: 'absolute', bottom: '5px', right: '5px', background: '#85f242', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--admin-sidebar)', color: '#1a2e05', cursor: 'pointer'}}>
                      <Camera size={14} />
                   </div>
                 )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
              <h2 style={{color: 'var(--admin-text)', marginBottom: '5px'}}>{user?.name}</h2>
              <p style={{color: 'var(--admin-text-muted)', fontSize: '14px', marginBottom: '20px'}}>{user?.role?.toUpperCase()} ACCOUNT</p>
              
              <div className="flex-col gap-15" style={{textAlign: 'left', borderTop: '1px solid var(--admin-border)', paddingTop: '20px', marginTop: '20px'}}>
                 <div className="flex items-center gap-10">
                    <Mail size={16} color="var(--admin-text-muted)" />
                    <span style={{fontSize: '13px', color: 'var(--admin-text)'}}>{user?.email}</span>
                 </div>
                 <div className="flex items-center gap-10">
                    <Shield size={16} color="var(--admin-text-muted)" />
                    <span style={{fontSize: '13px', color: 'var(--admin-text)'}}>Security Status: High</span>
                 </div>
              </div>
           </div>

           {/* Right Form Card */}
           <div className="premium-card span-5" style={{padding: '40px'}}>
              <h3 style={{color: 'var(--admin-text)', marginBottom: '30px'}}>Personal Information</h3>
              
              <form onSubmit={handleSubmit(onUpdate)} className="flex-col gap-25">
                 <div className="grid-2 gap-20">
                    <div className="input-group-sona">
                       <label style={{color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold'}}>FULL NAME</label>
                       <input 
                          {...register("name", { required: "Name is required" })}
                          disabled={!isEditing}
                          style={{
                             background: isEditing ? 'var(--admin-bg)' : 'var(--admin-sidebar)',
                             border: '1px solid var(--admin-border)',
                             color: 'var(--admin-text)',
                             padding: '12px 15px',
                             borderRadius: '10px',
                             width: '100%',
                             marginTop: '8px'
                          }}
                       />
                       {errors.name && <p style={{color: '#ef4444', fontSize: '11px', marginTop: '5px'}}>{errors.name.message}</p>}
                    </div>
                    <div className="input-group-sona">
                       <label style={{color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold'}}>EMAIL ADDRESS</label>
                       <input 
                          {...register("email")}
                          disabled
                          style={{
                             background: 'var(--admin-sidebar)',
                             border: '1px solid var(--admin-border)',
                             color: 'var(--admin-text-muted)',
                             padding: '12px 15px',
                             borderRadius: '10px',
                             width: '100%',
                             marginTop: '8px',
                             cursor: 'not-allowed'
                          }}
                       />
                    </div>
                 </div>

                 <div className="input-group-sona">
                    <label style={{color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold'}}>PHONE NUMBER</label>
                    <input 
                       {...register("phoneNumber")}
                       disabled={!isEditing}
                       placeholder="+1 (555) 000-0000"
                       style={{
                          background: isEditing ? 'var(--admin-bg)' : 'var(--admin-sidebar)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text)',
                          padding: '12px 15px',
                          borderRadius: '10px',
                          width: '100%',
                          marginTop: '8px'
                       }}
                    />
                 </div>

                 <div className="input-group-sona">
                    <label style={{color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: 'bold'}}>ADDRESS</label>
                    <textarea 
                       {...register("address")}
                       disabled={!isEditing}
                       rows={3}
                       style={{
                          background: isEditing ? 'var(--admin-bg)' : 'var(--admin-sidebar)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text)',
                          padding: '12px 15px',
                          borderRadius: '10px',
                          width: '100%',
                          marginTop: '8px',
                          resize: 'none'
                       }}
                    />
                 </div>

                 {isEditing && (
                    <div className="flex gap-15 m-t-20">
                       <button 
                         type="submit" 
                         disabled={loading}
                         style={{background: '#85f242', border: 'none', color: '#1a2e05', padding: '12px 30px', borderRadius: '10px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}
                       >
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                       </button>
                    </div>
                 )}
              </form>
           </div>
        </div>

        {/* Security / Account Tabs */}
        <div className="premium-card m-t-30" style={{padding: '30px', marginTop: '30px'}}>
           <div className="flex items-center gap-15" style={{color: 'var(--admin-text)'}}>
              <SettingsIcon size={20} />
              <h3 style={{margin: 0}}>Account Security</h3>
           </div>
           <p style={{color: 'var(--admin-text-muted)', fontSize: '13px', marginTop: '10px'}}>Want to change your password or enable 2FA? Visit the security dashboard.</p>
           <button style={{marginTop: '20px', background: 'transparent', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700'}}>Configure Security</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
