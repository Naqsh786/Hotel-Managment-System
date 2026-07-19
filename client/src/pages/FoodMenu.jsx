import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Loader2 } from 'lucide-react';
import { createServiceRequest } from '../Features/serviceRequestSlice';
import { fetchAllFoods } from '../Features/foodSlice';
import { Utensils } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const FoodMenu = () => {
   const dispatch = useDispatch();
   const { bookings } = useSelector(state => state.bookings);
   const { foods, loading: foodsLoading } = useSelector(state => state.foods);
   const { loading } = useSelector(state => state.serviceRequests);
   const [cart, setCart] = useState([]);
   const [isCartOpen, setIsCartOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState('All');
   const { toast } = useToast();

   useEffect(() => {
      dispatch(fetchAllFoods());
   }, [dispatch]);

   const categories = ['All', 'Breakfast', 'Main Course', 'Salads', 'Quick Bites', 'Dessert', 'Beverages'];

   // Find the first confirmed booking to associate the order with
   const activeBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'checked-in');

   // Filter only available foods for the menu (or show all with blur if preferred)
   // The user asked to show them with red tags and blur like rooms
   const availableFoods = foods; // Show all to apply blur to unavailable ones

   const filteredItems = selectedCategory === 'All' 
      ? availableFoods 
      : availableFoods.filter(item => item.category === selectedCategory);

   const addToCart = (item) => {
      const existing = cart.find(i => i._id === item._id);
      if (existing) {
         setCart(cart.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i));
      } else {
         setCart([...cart, { ...item, qty: 1 }]);
      }
   };

   const removeFromCart = (id) => {
      setCart(cart.filter(i => i._id !== id));
   };

   const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

   return (
      <div style={{ padding: '0' }}>
         <div className="card-header-flex m-b-30">
            <div>
               <h2 className="serif" style={{ fontSize: '32px' }}>In-Room Dining</h2>
               <p className="text-muted">Gourmet flavors delivered right to your door.</p>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{ padding: '12px 25px', borderRadius: '15px', border: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', color: 'var(--admin-text)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
               <ShoppingCart size={18} color="var(--sona-gold)" />
               <span>Cart ({cart.reduce((a, b) => a + b.qty, 0)})</span>
            </button>
         </div>

         <div className="flex gap-10 m-b-30" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
             {categories.map(cat => (
                <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   style={{
                      padding: '8px 20px',
                      borderRadius: '25px',
                      border: '1px solid var(--admin-border)',
                      background: selectedCategory === cat ? 'var(--sona-gold)' : 'var(--admin-sidebar)',
                      color: selectedCategory === cat ? 'white' : 'var(--admin-text)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: '0.3s'
                   }}
                >
                   {cat}
                </button>
             ))}
          </div>

         {foodsLoading ? (
            <div className="flex-center p-40" style={{ height: '300px' }}>
               <Loader2 className="animate-spin" size={40} color="var(--sona-gold)" />
            </div>
         ) : filteredItems.length === 0 ? (
            <div className="flex-center p-40" style={{ flexDirection: 'column', height: '300px', color: 'var(--admin-text-muted)' }}>
               <Utensils size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
               <p style={{ fontWeight: '700' }}>No food items available in this category.</p>
            </div>
         ) : (
            <div className="grid-3" style={{ gap: '25px' }}>
               {filteredItems.map(item => (
                  <motion.div 
                    key={item._id}
                    whileHover={{ y: -5 }}
                    className="premium-card" 
                    style={{ padding: '0', overflow: 'hidden' }}
                  >
                     <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                       <img 
                         src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300&fit=crop'} 
                         alt={item.name} 
                         style={{ 
                           width: '100%', 
                           height: '100%', 
                           objectFit: 'cover',
                           filter: item.status === 'Unavailable' ? 'blur(5px) grayscale(0.4)' : 'none',
                           transition: '0.4s'
                         }} 
                       />
                       {item.status === 'Unavailable' && (
                         <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span style={{ background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '25px', fontSize: '10px', fontWeight: '900', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>UNAVAILABLE</span>
                         </div>
                       )}
                     </div>
                     <div style={{ padding: '20px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--sona-gold)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                        <h4 style={{ fontSize: '16px', margin: '5px 0' }}>{item.name}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '15px' }}>{item.description}</p>
                        <div className="flex-between" style={{ marginTop: 'auto' }}>
                           <span style={{ fontWeight: '800' }}>${item.price}</span>
                           <button 
                             disabled={item.status === 'Unavailable'}
                             onClick={() => addToCart(item)}
                             style={{ 
                               padding: '8px 15px', 
                               borderRadius: '8px', 
                               border: 'none', 
                               background: item.status === 'Unavailable' ? '#cbd5e1' : '#1e293b', 
                               color: 'white', 
                               fontWeight: 'bold', 
                               cursor: item.status === 'Unavailable' ? 'not-allowed' : 'pointer', 
                               fontSize: '12px' 
                             }}
                           >
                              {item.status === 'Unavailable' ? 'Sold Out' : 'Add to Order'}
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         )}

         {/* Cart Drawer */}
         <AnimatePresence>
            {isCartOpen && (
               <>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsCartOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}
                  />
                  <motion.div 
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'var(--admin-sidebar)', zIndex: 1001, padding: '40px', display: 'flex', flexDirection: 'column' }}
                  >
                     <div className="card-header-flex m-b-30">
                        <h3 className="serif" style={{ fontSize: '24px' }}>Your Order</h3>
                        <X size={24} onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer' }} />
                     </div>

                     <div style={{ flex: 1, overflowY: 'auto' }}>
                        {cart.length === 0 ? (
                           <p className="text-muted">Your cart is empty.</p>
                        ) : (
                           cart.map(item => (
                              <div key={item._id} className="flex-between" style={{ padding: '15px 0', borderBottom: '1px solid var(--admin-border)' }}>
                                 <div>
                                    <p style={{ fontWeight: '700' }}>{item.name}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>Qty: {item.qty} × ${item.price}</p>
                                 </div>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ fontWeight: '800' }}>${item.qty * item.price}</span>
                                    <X size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeFromCart(item._id)} />
                                 </div>
                              </div>
                           ))
                        )}
                     </div>

                     <div style={{ paddingTop: '30px', borderTop: '2px solid var(--admin-border)' }}>
                        <div className="flex-between m-b-20">
                           <span style={{ fontWeight: '600' }}>Total Amount</span>
                           <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--sona-gold)' }}>${total}</span>
                        </div>
                        <button 
                          disabled={cart.length === 0 || loading || !activeBooking}
                          className="btn-sona-primary w-full" 
                          style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'center' }}
                          onClick={async () => { 
                             if (!activeBooking) return toast.error("Booking Required", "You need an active booking to order food.");
                             
                             await dispatch(createServiceRequest({
                                booking: activeBooking._id,
                                room: activeBooking.room._id || activeBooking.room,
                                type: 'Food',
                                items: cart.map(item => ({ name: item.name, quantity: item.qty, price: item.price })),
                                totalAmount: total,
                                notes: "Order from Food Menu"
                             })).unwrap()
                               .then(() => {
                                  setCart([]); 
                                  setIsCartOpen(false); 
                                  toast.success("Order Received", "Your gourmet selection has been sent to our chefs.");
                               })
                               .catch(err => toast.error("Order Failed", err));
                          }}
                        >
                           {loading ? <Loader2 className="animate-spin" /> : "CONFIRM ORDER"}
                        </button>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </div>
   );
};

export default FoodMenu;
