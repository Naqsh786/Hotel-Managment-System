import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminRooms, addRoom, deleteRoom, clearRoomSuccess, updateRoom } from '../../Features/roomSlice';
import { Search, Plus, Loader2, Edit, Trash, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import CustomDropdown from '../../components/CustomDropdown';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';

const AdminRooms = () => {
  const dispatch = useDispatch();
  const { rooms, loading, success, error } = useSelector((state) => state.rooms);

  const [page] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "", maxPerson: 2, location: "", price: "", type: "Standard", status: "Available", description: ""
    }
  });

  const watchType = watch("type");
  const watchStatus = watch("status");

  useEffect(() => {
    dispatch(fetchAdminRooms({ page, search, type: typeFilter }));
  }, [page, search, typeFilter, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Success", isEditMode ? "Room updated successfully" : "Room added successfully");
      handleCloseModal();
      dispatch(clearRoomSuccess());
      dispatch(fetchAdminRooms({ page, search, type: typeFilter }));
    }
    if (error) {
      toast.error("Error", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, dispatch]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setPreviewImages([]);
    setUploadedFiles([]);
    reset({
      name: "", maxPerson: 2, location: "", price: "", type: "Standard", status: "Available", description: ""
    });
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setPreviewImages([]);
    setUploadedFiles([]);
    reset({
      name: "", maxPerson: 2, location: "", price: "", type: "Standard", status: "Available", description: ""
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (uploadedFiles.length + newFiles.length > 10) {
      toast.warning("Limit Exceeded", "Max 10 images allowed");
      return;
    }
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeImage = (index) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleEdit = (room) => {
    setIsEditMode(true);
    setEditingId(room._id);
    reset({
      name: room.name,
      maxPerson: room.maxPerson,
      location: room.location,
      price: room.price,
      type: room.type,
      status: room.status || "Available",
      description: room.description || ""
    });
    setPreviewImages(room.images);
    setIsModalOpen(true);
  };

  const onFormSubmit = (data) => {
    if (!isEditMode && uploadedFiles.length < 4) {
      toast.warning("Incomplete Data", "Please upload at least 4 images");
      return;
    }
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    uploadedFiles.forEach(file => formData.append('images', file));

    if (isEditMode) {
      dispatch(updateRoom({ id: editingId, formData }));
    } else {
      dispatch(addRoom(formData));
    }
  };

  return (
    <div className="admin-main-content">
      <header className="admin-top-header">
         <div className="admin-search-bar" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
            <Search size={18} color="var(--admin-text-muted)" />
            <input type="text" placeholder="Search rooms..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ color: 'var(--admin-text)' }} />
         </div>
      </header>

      <div className="admin-dashboard-view">
        <div className="dashboard-header m-b-40 card-header-flex">
           <div>
              <h1 className="dashboard-title" style={{fontSize: '28px', color: 'var(--admin-text)'}}>Room Inventory</h1>
              <p className="dashboard-subtitle" style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>Manage hotel suites and live availability.</p>
           </div>
           <div className="dashboard-actions">
              <button onClick={handleOpenAddModal} className="btn-sona-primary flex-center gap-10 hover-lift" style={{background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '800', cursor: 'pointer'}}>
                 <Plus size={18} /> Add New Room
              </button>
           </div>
        </div>

        <div className="premium-card">
           <div className="premium-table-wrapper">
              <table className="premium-table">
                 <thead>
                    <tr>
                       <th style={{paddingLeft: '20px'}}>Room Info</th>
                       <th>Type</th>
                       <th>Status</th>
                       <th>Price</th>
                       <th style={{textAlign: 'right', paddingRight: '20px'}}>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loading && rooms.length === 0 ? (
                       <tr><td colSpan="5" style={{textAlign: 'center', padding: '50px'}}><Loader2 className="animate-spin" color="#10b981" /></td></tr>
                    ) : (
                       rooms.map((room) => (
                         <tr key={room._id}>
                            <td style={{paddingLeft: '20px'}}>
                               <div className="flex gap-15" style={{alignItems: 'center'}}>
                                  <img src={room.images[0]} style={{width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '2px solid var(--admin-border)'}} alt={room.name} />
                                  <div className="flex-col">
                                     <span style={{fontWeight: '700', color: 'var(--admin-text)'}}>{room.name}</span>
                                     <span style={{fontSize: '11px', color: 'var(--admin-text-muted)'}}>{room.location}</span>
                                  </div>
                               </div>
                            </td>
                            <td><span className="status-pill" style={{background: 'rgba(56, 189, 248, 0.1)', color: '#0ea5e9'}}>{room.type}</span></td>
                            <td><span className="status-pill" style={{background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e'}}>{room.status}</span></td>
                            <td style={{fontWeight: '800', color: '#10b981'}}>${room.price}</td>
                            <td style={{textAlign: 'right', paddingRight: '20px'}}>
                                <div className="flex gap-10" style={{justifyContent: 'flex-end'}}>
                                   <button onClick={() => handleEdit(room)} className="action-btn edit" title="Edit"><Edit size={16} /></button>
                                   <button onClick={() => setConfirmDelete({ open: true, id: room._id })} className="action-btn delete" title="Delete" style={{ color: '#ef4444' }}><Trash size={16} /></button>
                                </div>
                            </td>
                         </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(4px)'}}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{background: 'var(--admin-sidebar)', width: '100%', maxWidth: '800px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--admin-border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}}>
               <div style={{padding: '20px 30px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h2 style={{ color: 'var(--admin-text)', margin: 0, fontSize: '20px' }}>{isEditMode ? "Update Room" : "Register Room"}</h2>
                  <X size={24} color="var(--admin-text-muted)" onClick={handleCloseModal} style={{cursor: 'pointer'}} />
               </div>

               <form onSubmit={handleSubmit(onFormSubmit)} style={{padding: '30px'}}>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                     <div className="input-group-sona">
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Room Name</label>
                        <input placeholder="Suite 404" {...register("name", { required: "Required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                     </div>
                     <div className="input-group-sona">
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Location</label>
                        <input placeholder="North Wing" {...register("location", { required: "Required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                     </div>
                     <div className="input-group-sona">
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Price ($)</label>
                        <input type="number" {...register("price", { required: "Required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                     </div>
                     <div className="input-group-sona">
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Capacity</label>
                        <input type="number" {...register("maxPerson", { required: "Required" })} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%' }} />
                     </div>
                     <div className="input-group-sona">
                        <CustomDropdown label="Type" options={['Standard', 'Deluxe', 'Suite', 'Royal']} value={watchType} onChange={val => setValue("type", val)} variant="admin" />
                     </div>
                     <div className="input-group-sona">
                        <CustomDropdown label="Status" options={['Available', 'Maintenance', 'Cleaning']} value={watchStatus} onChange={val => setValue("status", val)} variant="admin" />
                     </div>
                     <div className="input-group-sona" style={{gridColumn: 'span 2'}}>
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Description</label>
                        <textarea {...register("description")} rows={2} style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', padding: '12px', borderRadius: '12px', width: '100%', resize: 'none' }} />
                     </div>
                  </div>

                  <div style={{marginBottom: '30px'}}>
                     <label style={{display: 'block', marginBottom: '10px', fontSize: '12px', fontWeight: '700', color: 'var(--admin-text-muted)'}}>Photos</label>
                     <div style={{border: '2px dashed var(--admin-border)', padding: '30px', textAlign: 'center', borderRadius: '15px', position: 'relative', background: 'rgba(255,255,255,0.02)'}}>
                        <input type="file" multiple onChange={handleFileChange} style={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'}} />
                        <Upload size={24} color="#10b981" style={{marginBottom: '10px'}} />
                        <p style={{fontSize: '13px', color: 'var(--admin-text-muted)'}}>Click to upload room photos</p>
                     </div>
                     <div className="flex gap-10 m-t-20" style={{flexWrap: 'wrap', marginTop: '20px'}}>
                        {previewImages.map((src, i) => (
                           <div key={i} style={{position: 'relative', width: '80px', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--admin-border)'}}>
                              <img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="preview" />
                              <button type="button" onClick={() => removeImage(i)} style={{position: 'absolute', top: '2px', right: '2px', background: '#ef4444', color: 'white', borderRadius: '50%', border: 'none', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}><X size={10}/></button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex gap-15">
                     <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--admin-border)', color: 'var(--admin-text)', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                     <button type="submit" disabled={loading} style={{ flex: 2, background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '800', cursor: 'pointer' }}>
                        {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? "UPDATE ROOM" : "CREATE ROOM")}
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmDelete.open}
        title="Delete Room"
        message="Are you sure you want to permanently delete this room? This action cannot be undone."
        onCancel={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={() => {
          dispatch(deleteRoom(confirmDelete.id));
          setConfirmDelete({ open: false, id: null });
          toast.success("Deleted", "Room has been removed from inventory");
        }}
      />
    </div>
  );
};

export default AdminRooms;
