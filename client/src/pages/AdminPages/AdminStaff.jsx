import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, addStaff, updateStaff, deleteStaff, clearAdminState } from '../../Features/adminSlice';
import { Search, Plus, Loader2, Edit, Trash, X, Upload, User, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import CustomDropdown from '../../components/CustomDropdown';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const AdminStaff = () => {
  const dispatch = useDispatch();
  const { staff, loading, success, error } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const itemsPerPage = 8;
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "", email: "", password: "", phoneNumber: "", address: "", status: "Active", responsibility: "Housekeeping", shift: "Morning", workArea: "General"
    }
  });

  const watchStatus = watch("status");
  const watchResponsibility = watch("responsibility");
  const watchShift = watch("shift");

  useEffect(() => {
    dispatch(fetchStaff());
    return () => dispatch(clearAdminState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Success", isEditMode ? "Staff member updated" : "Staff member registered");
      handleCloseModal();
      dispatch(fetchStaff());
      dispatch(clearAdminState());
    }
    if (error) {
      toast.error("Error", error);
      dispatch(clearAdminState());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, dispatch, toast]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setPreviewImage(null);
    setImageFile(null);
    setShowPassword(false);
    reset();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleEdit = (member) => {
    setIsEditMode(true);
    setEditingId(member._id);
    reset({
      name: member.name,
      email: member.email,
      phoneNumber: member.phoneNumber || "",
      address: member.address || "",
      status: member.status || "Active",
      responsibility: member.responsibility || "Housekeeping",
      shift: member.shift || "Morning",
      workArea: member.workArea || "General",
      password: "" 
    });
    setPreviewImage(member.profileImage || null);
    setIsModalOpen(true);
  };

  const onStaffSubmit = (data) => {
    if (!isEditMode && !data.password) {
      toast.warning("Missing Password", "Please provide a temporary password");
      return;
    }
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (imageFile) formData.append('image', imageFile);

    if (isEditMode) {
      dispatch(updateStaff({ id: editingId, formData }));
    } else {
      dispatch(addStaff(formData));
    }
  };

  const filteredStaff = (staff || []).filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  
  const displayedStaff = filteredStaff.slice(0, itemsPerPage);

  return (
    <div className="admin-main-content">
      <header className="admin-top-header">
         <div className="admin-search-bar">
           <Search size={18} color="var(--admin-text-muted)" />
           <input type="text" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} />
         </div>
      </header>

      <div className="admin-dashboard-view">
        <div className="dashboard-header m-b-40 card-header-flex">
          <div className="flex-col">
              <h1 className="dashboard-title" style={{fontSize: '28px', color: 'var(--admin-text)', marginBottom: '5px' }}>Staff Management</h1>
              <p className="dashboard-subtitle text-muted" style={{fontSize: '13px'}}>Manage system access and duty shifts for all employees.</p>
           </div>
           <div className="dashboard-actions">
              <button onClick={() => { reset(); setIsEditMode(false); setIsModalOpen(true); }} className="btn-sona-primary flex-center gap-10 hover-lift" style={{background: '#10b981', color: '#ffffff', border: '1px solid #059669', borderRadius: '10px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)', textTransform: 'none', letterSpacing: '0.5px', padding: '10px 20px'}}>
                 <Plus size={18} /> Add Staff
              </button>
           </div>
        </div>
 
        <div className="premium-card">
           <div className="premium-table-wrapper">
              <table className="premium-table">
                 <thead>
                    <tr>
                       <th style={{paddingLeft: '20px'}}>Staff Member</th>
                       <th>Role / Shift</th>
                       <th>Area</th>
                       <th>Status</th>
                       <th style={{textAlign: 'right', paddingRight: '20px'}}>Action</th>
                    </tr>
                 </thead>
              <tbody>
                 {displayedStaff.map((member) => (
                    <tr key={member._id}>
                       <td style={{paddingLeft: '20px'}}>
                          <div className="flex gap-15">
                             {member.profileImage ? <img src={member.profileImage} style={{width:'45px', height:'45px', borderRadius:'12px', objectFit:'cover'}} /> : <div style={{width:'45px', height:'45px', borderRadius:'12px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center'}}><User size={20}/></div>}
                             <div className="flex-col">
                                <span style={{fontWeight:'700'}}>{member.name}</span>
                                <span style={{fontSize:'12px', color:'var(--admin-text-muted)'}}>{member.responsibility}</span>
                             </div>
                          </div>
                       </td>
                       <td><div className="flex-col"><span>{member.responsibility}</span><span style={{fontSize:'11px', color:'#dfa974', fontWeight:'bold'}}>{member.shift}</span></div></td>
                       <td><span style={{fontSize:'13px', fontWeight:'600'}}>{member.workArea || 'General'}</span></td>
                       <td><span className="status-pill" style={{background: member.status === 'Active' ? '#ecfdf5' : '#fef2f2', color: member.status === 'Active' ? '#22c55e' : '#ef4444'}}>{member.status}</span></td>
                       <td style={{textAlign: 'right', paddingRight: '20px'}}>
                          <div className="flex gap-10" style={{justifyContent: 'flex-end'}}>
                             <button onClick={() => handleEdit(member)} className="action-btn edit" title="Edit"><Edit size={16}/></button>
                             <button onClick={() => setConfirmDelete({ open: true, id: member._id })} className="action-btn delete" title="Delete"><Trash size={16}/></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay">
             <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="admin-modal-content">
                <div className="admin-modal-header">
                    <h2 className="serif" style={{ fontSize: '24px' }}>{isEditMode ? "Update" : "Register"} Staff Member</h2>
                    <button onClick={handleCloseModal} style={{ background: 'var(--admin-bg)', border: 'none', color: 'var(--admin-text-muted)', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>
                       <X size={20} />
                    </button>
                 </div>
                 
                 <form onSubmit={handleSubmit(onStaffSubmit)} className="admin-modal-body">
                    <div style={{display:'flex', gap:'20px', marginBottom:'25px', alignItems:'center', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '15px', border: '1px solid var(--admin-border)'}}>
                       <div style={{position:'relative', width:'80px', height:'80px', flexShrink:0}}>
                          <input type="file" onChange={handleFileChange} style={{position:'absolute', inset:0, opacity:0, zIndex:2, cursor:'pointer'}} />
                          {previewImage ? <img src={previewImage} style={{width:'100%', height:'100%', borderRadius:'12px', objectFit:'cover', border:'2px solid var(--admin-primary)'}} /> : <div style={{width:'100%', height:'100%', borderRadius:'12px', background:'var(--admin-bg)', border:'2px dashed var(--admin-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--admin-text-muted)'}}><Upload size={20}/></div>}
                       </div>
                       <div style={{flex: 1}}>
                          <h4 style={{marginBottom: '2px', fontSize: '14px'}}>Staff Avatar</h4>
                          <p style={{fontSize: '11px', color: 'var(--admin-text-muted)'}}>Upload a professional profile picture.</p>
                       </div>
                    </div>

                    <div className="grid-2" style={{gap:'20px', marginBottom:'20px'}}>
                        <div className="admin-input-group">
                           <label>Full Name</label>
                           <input placeholder="John Doe" {...register("name", { required: "Name is required" })} />
                           {errors.name && <p style={{color: '#ef4444', fontSize: '11px', marginTop: '4px'}}>{errors.name.message}</p>}
                        </div>
                        <div className="admin-input-group">
                           <label>Email Address</label>
                           <input placeholder="john@sonahotel.com" {...register("email", { required: "Email required" })} />
                           {errors.email && <p style={{color: '#ef4444', fontSize: '11px', marginTop: '4px'}}>{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="grid-2" style={{gap:'20px', marginBottom:'20px'}}>
                        <div className="admin-input-group">
                           <label>Phone Number</label>
                           <input placeholder="+1 234 567 890" {...register("phoneNumber")} />
                        </div>
                        <div className="admin-input-group">
                           <CustomDropdown 
                              label="Current Status"
                              options={['Active', 'Inactive']} 
                              value={watchStatus} 
                              onChange={val => setValue("status", val)} 
                              variant="admin"
                           />
                        </div>
                    </div>

                    <div className="grid-3" style={{gap:'15px', marginBottom:'20px'}}>
                        <div className="admin-input-group">
                           <CustomDropdown 
                              label="Role"
                              options={['Housekeeping', 'Receptionist', 'Manager', 'Security', 'Other']} 
                              value={watchResponsibility} 
                              onChange={val => setValue("responsibility", val)} 
                              variant="admin"
                           />
                        </div>
                        <div className="admin-input-group">
                           <CustomDropdown 
                              label="Shift"
                              options={['Morning', 'Evening', 'Night', 'OFF']} 
                              value={watchShift} 
                              onChange={val => setValue("shift", val)} 
                              variant="admin"
                           />
                        </div>
                        <div className="admin-input-group">
                           <label>Work Area</label>
                           <input placeholder="Floor 2" {...register("workArea")} />
                        </div>
                    </div>

                    <div className="admin-input-group" style={{marginBottom: '20px'}}>
                       <label>Residential Address</label>
                       <input placeholder="123 Luxury Ave..." {...register("address", { required: "Address required" })} />
                    </div>

                    <div className="admin-input-group" style={{marginBottom: '30px'}}>
                       <label>{isEditMode ? "Reset Password" : "Security Password"}</label>
                       <div style={{ position: 'relative' }}>
                          <input type={showPassword ? "text" : "password"} {...register("password", { required: !isEditMode ? "Password required" : false })} placeholder="Minimum 6 characters" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                             {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                       </div>
                    </div>

                    <div className="flex gap-15">
                       <button type="button" onClick={handleCloseModal} className="btn-sona-secondary" style={{flex:1, padding:'12px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--admin-border)', color: 'var(--admin-text)'}}>Cancel</button>
                       <button type="submit" disabled={loading} className="btn-admin-success" style={{flex:2}}>
                          {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? "Update" : "Register")}
                       </button>
                    </div>
                 </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Remove Staff"
        message="Are you sure you want to remove this staff member? This will revoke their access immediately."
        onCancel={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={() => {
          dispatch(deleteStaff(confirmDelete.id));
          setConfirmDelete({ open: false, id: null });
        }}
      />
    </div>
  );
};

export default AdminStaff;
