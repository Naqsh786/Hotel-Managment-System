import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed, Plus, Pencil, Trash2, X, Loader2,
  Search, CheckCircle, XCircle, ChevronDown
} from 'lucide-react';
import { fetchAllFoods, addFood, updateFood, deleteFood, clearFoodSuccess } from '../../Features/foodSlice';

const CATEGORIES = ['Breakfast', 'Main Course', 'Salads', 'Quick Bites', 'Dessert', 'Beverages'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Main Course',
  status: 'Available',
  image: ''
};

const FoodInventory = () => {
  const dispatch = useDispatch();
   const { foods, loading, error, success } = useSelector(state => state.foods);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchAllFoods());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowModal(false);
      setEditItem(null);
      setForm(emptyForm);
      dispatch(clearFoodSuccess());
    }
  }, [success, dispatch]);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      status: item.status,
      image: item.image || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editItem) {
      dispatch(updateFood({ id: editItem._id, foodData: payload }));
    } else {
      dispatch(addFood(payload));
    }
  };

  const filtered = foods.filter(f => {
    const matchSearch = f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || f.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-main-content">
      {error && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 3000, background: '#fee2e2', color: '#ef4444', padding: '15px 25px', borderRadius: '12px', border: '1px solid #fecaca', fontWeight: '700', boxShadow: '0 10px 25px rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}
      <div className="admin-dashboard-view">

        {/* Header */}
        <header className="dashboard-header m-b-40" style={{ marginBottom: '40px' }}>
          <div className="flex-col">
            <div className="flex-center gap-10" style={{ justifyContent: 'flex-start' }}>
              <div style={{ padding: '6px 12px', background: 'rgba(223, 169, 116, 0.15)', border: '1px solid rgba(223,169,116,0.3)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UtensilsCrossed size={14} color="#dfa974" />
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#dfa974', textTransform: 'uppercase', letterSpacing: '1px' }}>Food Inventory</span>
              </div>
            </div>
            <h1 className="serif dashboard-title" style={{ color: 'var(--admin-text)', marginTop: '12px' }}>Menu Management</h1>
            <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: '600', marginTop: '5px' }}>
              Add, edit and manage the guest-facing food menu.
            </p>
          </div>

          <div className="dashboard-actions flex gap-20 items-center">
            <button
              onClick={openAdd}
              className="btn-sona-primary"
              style={{ background: '#dfa974', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px rgba(223,169,116,0.3)' }}
            >
              <Plus size={18} /> Add Food Item
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-15 items-center" style={{ marginBottom: '28px', flexWrap: 'wrap' }}>
          <div className="admin-search-bar" style={{ flex: 1, minWidth: '200px', maxWidth: '340px' }}>
            <Search size={16} color="var(--admin-text-muted)" />
            <input
              placeholder="Search food items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                style={{
                  padding: '8px 18px', borderRadius: '20px', border: '1px solid var(--admin-border)', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                  background: filterCat === cat ? '#dfa974' : 'var(--admin-sidebar)',
                  color: filterCat === cat ? 'white' : 'var(--admin-text)',
                  transition: '0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid-4 stats-grid" style={{ gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Items', value: foods.length, color: '#0ea5e9' },
            { label: 'Available', value: foods.filter(f => f.status === 'Available').length, color: '#10b981' },
            { label: 'Unavailable', value: foods.filter(f => f.status === 'Unavailable').length, color: '#ef4444' },
            { label: 'Categories', value: CATEGORIES.length, color: '#dfa974' }
          ].map((s, i) => (
            <div key={i} className="premium-card" style={{ padding: '22px 28px', borderBottom: `4px solid ${s.color}` }}>
              <p style={{ fontSize: '32px', fontWeight: '900', color: 'var(--admin-text)', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Food Cards Grid */}
        {loading ? (
          <div className="flex-center p-40">
            <Loader2 size={40} className="animate-spin" color="#dfa974" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="premium-card flex-center" style={{ flexDirection: 'column', padding: '80px 40px', gap: '16px' }}>
            <UtensilsCrossed size={48} color="#dfa974" style={{ opacity: 0.5 }} />
            <p style={{ color: 'var(--admin-text-muted)', fontWeight: '700', fontSize: '16px' }}>No food items found</p>
          </div>
        ) : (
          <div className="grid-4" style={{ gap: '20px' }}>
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="premium-card"
                  style={{ padding: '0', overflow: 'hidden' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300&fit=crop'}
                      alt={item.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: item.status === 'Unavailable' ? 'blur(4px) grayscale(0.5)' : 'none',
                        transition: '0.3s'
                      }}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300&fit=crop'; }}
                    />
                    {item.status === 'Unavailable' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ background: '#ef4444', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Currently Unavailable</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: item.status === 'Available' ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
                      color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      {item.status === 'Available' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {item.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px' }}>
                    <span style={{ fontSize: '10px', color: '#dfa974', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--admin-text)', margin: '6px 0 4px' }}>{item.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontWeight: '600', margin: '0 0 14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>

                    <div className="flex-between" style={{ alignItems: 'center' }}>
                      <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--admin-text)' }}>${item.price}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEdit(item)}
                          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700' }}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item)}
                          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  position: 'relative', zIndex: 1001, width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
                  background: 'var(--admin-sidebar)', borderRadius: '24px', border: '1px solid var(--admin-border)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.3)'
                }}
              >
                {/* Modal Header */}
                <div style={{ padding: '30px 30px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="serif" style={{ fontSize: '22px', color: 'var(--admin-text)', margin: 0 }}>
                      {editItem ? 'Edit Food Item' : 'Add New Food Item'}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '4px', fontWeight: '600' }}>
                      {editItem ? 'Update the details below.' : 'Fill in the details to add to the menu.'}
                    </p>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)', padding: '6px' }}>
                    <X size={22} />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Name */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Food Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Grilled Salmon"
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Brief description of the food item..."
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', fontSize: '14px', fontWeight: '600', resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>

                    {/* Price & Category */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Price ($) *</label>
                        <input
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={e => setForm({ ...form, price: e.target.value })}
                          placeholder="0.00"
                          style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Category *</label>
                        <div style={{ position: 'relative' }}>
                          <select
                            required
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            style={{ width: '100%', padding: '14px 40px 14px 16px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', pointerEvents: 'none' }} />
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Status</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {['Available', 'Unavailable'].map(s => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setForm({ ...form, status: s })}
                            style={{
                              flex: 1, padding: '12px', borderRadius: '12px', border: `2px solid ${form.status === s ? (s === 'Available' ? '#10b981' : '#ef4444') : 'var(--admin-border)'}`,
                              background: form.status === s ? (s === 'Available' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') : 'var(--admin-bg)',
                              color: form.status === s ? (s === 'Available' ? '#10b981' : '#ef4444') : 'var(--admin-text-muted)',
                              fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }}
                          >
                            {s === 'Available' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Image URL <span style={{ fontWeight: '600', textTransform: 'none', color: 'var(--admin-text-muted)', fontSize: '11px' }}>(optional)</span></label>
                      <input
                        value={form.image}
                        onChange={e => setForm({ ...form, image: e.target.value })}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box', outline: 'none' }}
                      />
                      {form.image && (
                        <img src={form.image} alt="preview" style={{ marginTop: '10px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--admin-border)' }} onError={e => e.target.style.display = 'none'} />
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ padding: '16px', background: '#dfa974', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(223,169,116,0.3)', marginTop: '4px' }}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : (editItem ? 'Update Food Item' : 'Add Food Item')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteConfirm && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirm(null)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                style={{ position: 'relative', zIndex: 1001, width: '100%', maxWidth: '400px', background: 'var(--admin-sidebar)', borderRadius: '20px', padding: '36px', border: '1px solid var(--admin-border)', textAlign: 'center' }}
              >
                <div style={{ width: '64px', height: '64px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Trash2 size={28} color="#ef4444" />
                </div>
                <h3 className="serif" style={{ fontSize: '20px', color: 'var(--admin-text)', marginBottom: '8px' }}>Delete Food Item?</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '28px' }}>
                  Are you sure you want to delete <strong style={{ color: 'var(--admin-text)' }}>{deleteConfirm.name}</strong>? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { dispatch(deleteFood(deleteConfirm._id)); setDeleteConfirm(null); }}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '800', cursor: 'pointer' }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default FoodInventory;
