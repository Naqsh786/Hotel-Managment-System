import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeSettings, updateHomeSettings, clearAdminState } from '../../Features/adminSlice';
import { 
  Plus, Trash2, Eye, EyeOff, 
  Edit, X, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const AdminHomeSettings = () => {
  const dispatch = useDispatch();
  const { homeSettings, loading, success } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState('slider'); 
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [editIndex, setEditIndex] = useState(null);
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState({ open: false, index: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    dispatch(fetchHomeSettings());
    return () => dispatch(clearAdminState());
  }, [dispatch]);

  useEffect(() => {
    if (homeSettings) {
      setSlides(homeSettings.heroSlides || []);
      setCategories(homeSettings.visibleCategories || []);
    }
  }, [homeSettings]);

  useEffect(() => {
    if (success) {
      toast.success("Success", "Home settings updated");
      setIsModalOpen(false);
      reset();
      dispatch(clearAdminState());
    }
  }, [success, reset, dispatch, toast]);

  const handleOpenModal = (mode, index = null) => {
    setModalMode(mode);
    setEditIndex(index);
    if (mode === 'edit' && index !== null) {
      const item = activeTab === 'slider' ? slides[index] : categories[index];
      reset({ ...item });
    } else {
      reset({ title: '', subtitle: '', desc: '', image: '', link: '', isVisible: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset({ title: '', subtitle: '', desc: '', image: '', link: '', isVisible: true });
  };

  const onSettingsSubmit = (data) => {
    if (activeTab === 'slider') {
      let newSlides = [...slides];
      if (modalMode === 'edit') newSlides[editIndex] = data;
      else newSlides.push(data);
      dispatch(updateHomeSettings({ heroSlides: newSlides, visibleCategories: categories }));
    } else {
      let newCats = [...categories];
      if (modalMode === 'edit') newCats[editIndex] = data;
      else newCats.push(data);
      dispatch(updateHomeSettings({ heroSlides: slides, visibleCategories: newCats }));
    }
  };

  const handleDelete = (index) => {
    setConfirmDelete({ open: true, index });
  };

  const executeDelete = (index) => {
    if (activeTab === 'slider') {
      const newSlides = slides.filter((_, i) => i !== index);
      dispatch(updateHomeSettings({ heroSlides: newSlides, visibleCategories: categories }));
    } else {
      const newCats = categories.filter((_, i) => i !== index);
      dispatch(updateHomeSettings({ heroSlides: slides, visibleCategories: newCats }));
    }
  };

  const toggleVisibility = (index) => {
    if (activeTab === 'slider') {
      let newSlides = [...slides];
      newSlides[index] = { ...newSlides[index], isVisible: !newSlides[index].isVisible };
      dispatch(updateHomeSettings({ heroSlides: newSlides, visibleCategories: categories }));
    } else {
      let newCats = [...categories];
      newCats[index] = { ...newCats[index], isVisible: !newCats[index].isVisible };
      dispatch(updateHomeSettings({ heroSlides: slides, visibleCategories: newCats }));
    }
  };

  return (
    <div className="admin-main-content">
       <header className="admin-top-header">
         <div className="admin-search-bar" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
            <span style={{ color: 'var(--admin-text-muted)', fontSize: '14px', fontWeight: '600' }}>Storefront Management</span>
         </div>
      </header>

      <div className="admin-dashboard-view">
        <header className="flex-between m-b-40">
          <div>
            <h1 style={{fontSize: '28px', color: 'var(--admin-text)'}}>Storefront Manager</h1>
            <p style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>Dynamic content control center for your hotel homepage.</p>
          </div>
          <div className="tab-switcher" style={{background: 'var(--admin-sidebar)', padding: '5px', borderRadius: '15px', display: 'flex', gap: '5px'}}>
             <button onClick={() => setActiveTab('slider')} style={{padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'slider' ? '#10b981' : 'transparent', color: activeTab === 'slider' ? 'white' : 'var(--admin-text-muted)', fontWeight: '800', cursor: 'pointer'}}>Slider</button>
             <button onClick={() => setActiveTab('categories')} style={{padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'categories' ? '#10b981' : 'transparent', color: activeTab === 'categories' ? 'white' : 'var(--admin-text-muted)', fontWeight: '800', cursor: 'pointer'}}>Categories</button>
          </div>
        </header>

        <div className="premium-card">
           <div className="flex-between m-b-20" style={{padding: '10px 20px', borderBottom: '1px solid var(--admin-border)'}}>
              <h3 style={{margin: 0, color: 'var(--admin-text)'}}>{activeTab === 'slider' ? 'Hero Slides' : 'Featured Categories'}</h3>
              <button onClick={() => handleOpenModal('add')} className="btn-sona-primary flex-center gap-10 hover-lift" style={{background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '800', cursor: 'pointer'}}><Plus size={18} /> Add New</button>
           </div>

           <table className="premium-table">
              <thead>
                 <tr><th>Content</th><th>Info</th><th>Status</th><th style={{textAlign:'right', paddingRight: '20px'}}>Actions</th></tr>
              </thead>
              <tbody>
                 {(activeTab === 'slider' ? slides : categories).map((item, index) => (
                    <tr key={index}>
                       <td style={{padding: '15px 20px'}}>
                          <div className="flex gap-15" style={{alignItems: 'center'}}>
                             <img src={item.image} style={{width:'45px', height:'45px', borderRadius:'10px', objectFit:'cover', border: '2px solid var(--admin-border)'}} alt={item.title} />
                             <span style={{fontWeight:'700', color: 'var(--admin-text)'}}>{item.title}</span>
                          </div>
                       </td>
                       <td><span style={{fontSize:'12px', color: 'var(--admin-text-muted)'}}>{activeTab === 'slider' ? item.subtitle : item.desc}</span></td>
                       <td>
                          <span className="status-pill" style={{background: item.isVisible !== false ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: item.isVisible !== false ? '#22c55e' : '#ef4444'}}>
                             {item.isVisible !== false ? 'VISIBLE' : 'HIDDEN'}
                          </span>
                       </td>
                       <td style={{textAlign:'right', paddingRight: '20px'}}>
                          <div className="flex gap-10" style={{justifyContent: 'flex-end'}}>
                             <button onClick={() => toggleVisibility(index)} className="action-btn view" title="Toggle Visibility">
                                {item.isVisible !== false ? <Eye size={16}/> : <EyeOff size={16} color="#ef4444" />}
                             </button>
                             <button onClick={() => handleOpenModal('edit', index)} className="action-btn edit" title="Edit"><Edit size={16}/></button>
                             <button onClick={() => handleDelete(index)} className="action-btn delete" title="Delete" style={{ color: '#ef4444' }}><Trash2 size={16}/></button>
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
          <div className="modal-overlay" style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(4px)'}}>
             <motion.div initial={{scale: 0.95, opacity:0}} animate={{scale: 1, opacity:1}} style={{background:'var(--admin-sidebar)', width:'100%', maxWidth:'600px', borderRadius:'24px', overflow:'hidden', border: '1px solid var(--admin-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}}>
                <div style={{padding:'20px 30px', borderBottom:'1px solid var(--admin-border)', display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                   <h2 style={{ color: 'var(--admin-text)', margin: 0, fontSize: '20px' }}>{modalMode === 'add' ? 'Add' : 'Edit'} Content</h2>
                   <X size={24} color="var(--admin-text-muted)" onClick={handleCloseModal} style={{cursor:'pointer'}} />
                </div>
                <form onSubmit={handleSubmit(onSettingsSubmit)} style={{padding:'30px'}}>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                      <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'slider' ? '1fr 1fr' : '1fr', gap: '20px' }}>
                        <div className="input-group-sona">
                           <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Title</label>
                           <input {...register("title", { required: "Title is required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                           {errors.title && <p style={{color:'#ef4444', fontSize:'11px', marginTop: '5px'}}><AlertCircle size={12}/> {errors.title.message}</p>}
                        </div>
                        {activeTab === 'slider' && (
                           <div className="input-group-sona">
                              <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Subtitle</label>
                              <input {...register("subtitle")} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                           </div>
                        )}
                      </div>

                      {activeTab === 'categories' && (
                        <div className="input-group-sona">
                           <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Description</label>
                           <textarea {...register("desc", { required: "Description required" })} rows={2} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width:'100%', resize: 'none' }} />
                        </div>
                      )}

                      <div className="input-group-sona">
                         <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Image URL</label>
                         <input {...register("image", { required: "Image URL required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                      </div>

                      <div className="input-group-sona">
                         <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Redirect Link</label>
                         <input {...register("link")} placeholder="/rooms" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                      </div>
                   </div>

                   <div className="flex gap-15" style={{marginTop:'30px'}}>
                      <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                      <button type="submit" disabled={loading} style={{ flex: 2, background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '800', cursor: 'pointer' }}>
                         {loading ? <Loader2 className="animate-spin" /> : "SAVE CONTENT"}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Delete Content"
        message="Are you sure you want to delete this storefront item? This will be updated immediately on the live site."
        onCancel={() => setConfirmDelete({ open: false, index: null })}
        onConfirm={() => {
          executeDelete(confirmDelete.index);
          setConfirmDelete({ open: false, index: null });
        }}
      />
    </div>
  );
};

export default AdminHomeSettings;
