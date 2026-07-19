import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddons, addAddon, updateAddon, deleteAddon, clearAddonStatus } from '../../Features/addonSlice';
import { fetchAmenities, addAmenity, updateAmenity, deleteAmenity, clearAmenityStatus } from '../../Features/amenitySlice';
import { Search, Plus, Loader2, Edit, Trash, X, Box, Wifi, Coffee, Tv, Wind, ShieldCheck, Car, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const IconMap = {
  Box, Wifi, Coffee, Tv, Wind, ShieldCheck, Car, Smartphone
};

const AdminAddons = () => {
  const dispatch = useDispatch();
  const { addons, loading: addonsLoading, success: addonsSuccess, error: addonsError } = useSelector((state) => state.addons);
  const { amenities, loading: amenitiesLoading, success: amenitiesSuccess, error: amenitiesError } = useSelector((state) => state.amenities);

  const [activeTab, setActiveTab] = useState('addons'); 
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, type: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    dispatch(fetchAddons());
    dispatch(fetchAmenities());
  }, [dispatch]);

  useEffect(() => {
    if (addonsSuccess || amenitiesSuccess) {
      toast.success("Success", `${activeTab === 'addons' ? 'Add-on' : 'Amenity'} updated successfully`);
      handleCloseModal();
      dispatch(clearAddonStatus());
      dispatch(clearAmenityStatus());
    }
    if (addonsError || amenitiesError) {
      toast.error("Error", addonsError || amenitiesError);
      dispatch(clearAddonStatus());
      dispatch(clearAmenityStatus());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addonsSuccess, amenitiesSuccess, addonsError, amenitiesError, dispatch, toast]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    reset({
      name: "",
      price: 0,
      icon: "Box",
      description: ""
    });
    dispatch(clearAddonStatus());
    dispatch(clearAmenityStatus());
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    reset({
      name: "",
      price: 0,
      icon: "Box",
      description: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditingId(item._id);
    reset({
      name: item.name,
      price: item.price || 0,
      icon: item.icon || "Box",
      description: item.description || ""
    });
    setIsModalOpen(true);
  };

  const onFormSubmit = (data) => {
    if (activeTab === 'addons') {
      if (isEditMode) {
        dispatch(updateAddon({ id: editingId, addonData: data }));
      } else {
        dispatch(addAddon(data));
      }
    } else {
      if (isEditMode) {
        dispatch(updateAmenity({ id: editingId, amenityData: data }));
      } else {
        dispatch(addAmenity(data));
      }
    }
  };

  const currentList = activeTab === 'addons' ? addons : amenities;
  const loading = activeTab === 'addons' ? addonsLoading : amenitiesLoading;
  const error = activeTab === 'addons' ? addonsError : amenitiesError;

  const filteredList = (currentList || []).filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderIcon = (iconName) => {
    const IconComponent = IconMap[iconName] || Box;
    return <IconComponent size={18} />;
  };

  return (
    <div className="admin-main-content">
       <header className="admin-top-header">
         <div className="admin-search-bar" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'addons' ? 'add-ons' : 'amenities'}...`} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ color: 'var(--admin-text)' }}
            />
         </div>
      </header>

      <div className="admin-dashboard-view">
        <header className="flex-between m-b-40">
          <div>
            <h1 style={{fontSize: '28px', color: 'var(--admin-text)'}}>{activeTab === 'addons' ? 'Premium Add-ons' : 'Hotel Amenities'}</h1>
            <p style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>Manage your hotel&apos;s {activeTab} and extra services.</p>
          </div>
          <div className="tab-switcher" style={{background: 'var(--admin-sidebar)', padding: '5px', borderRadius: '15px', display: 'flex', gap: '5px'}}>
             <button onClick={() => setActiveTab('addons')} style={{padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'addons' ? '#10b981' : 'transparent', color: activeTab === 'addons' ? 'white' : 'var(--admin-text-muted)', fontWeight: '800', cursor: 'pointer'}}>Add-ons</button>
             <button onClick={() => setActiveTab('amenities')} style={{padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'amenities' ? '#10b981' : 'transparent', color: activeTab === 'amenities' ? 'white' : 'var(--admin-text-muted)', fontWeight: '800', cursor: 'pointer'}}>Amenities</button>
          </div>
        </header>

        <div className="premium-card">
           <div className="flex-between m-b-20" style={{padding: '10px 20px', borderBottom: '1px solid var(--admin-border)'}}>
              <h3 style={{margin: 0, color: 'var(--admin-text)'}}>{activeTab === 'addons' ? 'Add-on Services' : 'Available Amenities'}</h3>
              <button onClick={handleOpenAddModal} className="btn-sona-primary flex-center gap-10 hover-lift" style={{background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '800', cursor: 'pointer'}}><Plus size={18} /> Add New</button>
           </div>

           <table className="premium-table">
              <thead>
                 <tr>
                    <th style={{paddingLeft: '20px'}}>Content</th>
                    <th>Info (Price)</th>
                    <th style={{textAlign:'right', paddingRight: '20px'}}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {loading && (!currentList || currentList.length === 0) ? (
                    <tr><td colSpan="3" style={{textAlign: 'center', padding: '50px'}}><Loader2 className="animate-spin" color="#10b981" /></td></tr>
                 ) : filteredList.length === 0 ? (
                    <tr><td colSpan="3" style={{textAlign: 'center', padding: '50px', color: 'var(--admin-text-muted)'}}>No {activeTab} found.</td></tr>
                 ) : (
                    filteredList.map((item) => (
                      <tr key={item._id}>
                         <td style={{padding: '15px 20px'}}>
                            <div className="flex gap-15" style={{alignItems: 'center'}}>
                               <div style={{width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                  {renderIcon(item.icon)}
                               </div>
                               <span style={{fontWeight: '700', color: 'var(--admin-text)'}}>{item.name}</span>
                            </div>
                         </td>
                         <td><span style={{fontWeight: '900', color: '#10b981', fontSize: '15px'}}>${item.price || 0}</span></td>
                         <td style={{textAlign: 'right', paddingRight: '20px'}}>
                            <div className="flex gap-10" style={{justifyContent: 'flex-end'}}>
                               <button onClick={() => handleEdit(item)} className="action-btn edit" title="Edit"><Edit size={16} /></button>
                               <button onClick={() => setConfirmDelete({ open: true, id: item._id, type: activeTab })} className="action-btn delete" title="Delete" style={{ color: '#ef4444' }}><Trash size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{background: 'var(--admin-sidebar)', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--admin-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}}>
               <div style={{padding: '20px 30px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h2 style={{ color: 'var(--admin-text)', margin: 0, fontSize: '20px' }}>{isEditMode ? 'Edit' : 'Add'} {activeTab === 'addons' ? 'Add-on' : 'Amenity'}</h2>
                  <X size={24} color="var(--admin-text-muted)" onClick={handleCloseModal} style={{cursor: 'pointer'}} />
               </div>

               <form onSubmit={handleSubmit(onFormSubmit)} style={{padding: '30px'}}>

                  <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                     <div className="input-group-sona">
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Name</label>
                        <input {...register("name", { required: "Name is required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                     </div>
                     
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="input-group-sona">
                           <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Price ($)</label>
                           <input type="number" {...register("price", { required: "Price is required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                        </div>
                        <div className="input-group-sona">
                           <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Icon Name</label>
                           <input {...register("icon")} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                        </div>
                     </div>

                     <div className="input-group-sona">
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Description</label>
                        <textarea {...register("description")} rows={2} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%', resize: 'none' }} />
                     </div>
                  </div>

                  <div className="flex gap-15" style={{marginTop: '30px'}}>
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
        title={`Delete ${confirmDelete.type === 'addons' ? 'Add-on' : 'Amenity'}`}
        message={`Are you sure you want to delete this ${confirmDelete.type === 'addons' ? 'add-on' : 'amenity'}?`}
        onCancel={() => setConfirmDelete({ open: false, id: null, type: '' })}
        onConfirm={() => {
          if (confirmDelete.type === 'addons') dispatch(deleteAddon(confirmDelete.id));
          else dispatch(deleteAmenity(confirmDelete.id));
          setConfirmDelete({ open: false, id: null, type: '' });
        }}
      />
    </div>
  );
};

export default AdminAddons;
