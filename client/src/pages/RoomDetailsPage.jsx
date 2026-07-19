import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomById } from '../Features/roomSlice';
import { Star, MapPin, Users, Wifi, Coffee, Tv, Wind, ShieldCheck, ArrowLeft, Loader2, Calendar, Car, Box, Heart, Music, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import ToastMessage from '../components/ToastMessage';
import { fetchAddons } from '../Features/addonSlice';

const RoomDetailsPage = () => {
   const { id } = useParams();
   const dispatch = useDispatch();
   const { currentRoom: room, loading: roomLoading } = useSelector((state) => state.rooms);
   const { addons, loading: addonsLoading } = useSelector((state) => state.addons);
   const { user } = useSelector((state) => state.auth);
   const [activeImg, setActiveImg] = useState(0);
   const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or '360'
   const [toastMsg, setToastMsg] = useState('');
   const [selectedAmenities, setSelectedAmenities] = useState([]);
   const navigate = useNavigate();

   const toggleAmenity = (amenity) => {
      if (selectedAmenities.find(a => a._id === amenity._id)) {
         setSelectedAmenities(selectedAmenities.filter(a => a._id !== amenity._id));
      } else {
         setSelectedAmenities([...selectedAmenities, amenity]);
      }
   };

   const amenitiesTotal = selectedAmenities.reduce((sum, item) => sum + item.price, 0);
   const finalPrice = room && room.price ? room.price + amenitiesTotal : 0;

   const handleBookRoom = () => {
      if (!user) {
         setToastMsg("Please login first to book a room.");
         setTimeout(() => navigate('/login'), 2000);
         return;
      }
      navigate(`/bookings/${id}`);
   };

   useEffect(() => {
      dispatch(fetchRoomById(id));
      dispatch(fetchAddons());
   }, [id, dispatch]);

   const loading = roomLoading || addonsLoading;

   const iconMap = {
      Wifi: <Wifi size={18} />,
      Coffee: <Coffee size={18} />,
      Tv: <Tv size={18} />,
      Wind: <Wind size={18} />,
      ShieldCheck: <ShieldCheck size={18} />,
      Car: <Car size={18} />,
      Heart: <Heart size={18} />,
      Music: <Music size={18} />,
      Utensils: <Utensils size={18} />,
      Box: <Box size={18} />
   };

   if (loading || !room) return <div className="flex-center" style={{ height: '100vh' }}><Loader2 className="animate-spin" size={40} color="#dfa974" /></div>;

   const amenities = addons || [];

   return (
      <div className="room-details-page" style={{ background: 'var(--sona-bg)', minHeight: '100vh', color: 'var(--sona-text)' }}>
         <ToastMessage message={toastMsg} onClose={() => setToastMsg('')} />
         <section style={{ background: 'var(--sona-bg-alt)', padding: '40px 0', borderBottom: '1px solid var(--sona-border)' }}>
            <div className="container-sona">
               <Link to="/rooms" className="flex-center gap-10" style={{ justifyContent: 'flex-start', color: 'var(--sona-text)', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                  <ArrowLeft size={16} color="var(--sona-gold)" /> BACK TO ROOMS
               </Link>
            </div>
         </section>

         <div className="container-sona" style={{ padding: '60px 20px' }}>
            <div className="rooms-main-container" style={{ columnGap: '60px', alignItems: 'start' }}>
               <div className="gallery-container">
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                     <button onClick={() => setViewMode('gallery')} style={{ padding: '10px 25px', borderRadius: '10px', border: 'none', background: viewMode === 'gallery' ? 'var(--sona-gold)' : 'var(--sona-bg-alt)', color: viewMode === 'gallery' ? 'white' : 'var(--sona-text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition)' }}>Photo Gallery</button>
                     <button onClick={() => setViewMode('360')} style={{ padding: '10px 25px', borderRadius: '10px', border: 'none', background: viewMode === '360' ? 'var(--sona-gold)' : 'var(--sona-bg-alt)', color: viewMode === '360' ? 'white' : 'var(--sona-text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: 'var(--transition)' }}>360° View</button>
                  </div>

                  {viewMode === 'gallery' ? (
                     <>
                        <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '500px', borderRadius: '20px', overflow: 'hidden', background: 'var(--sona-bg-alt)', marginBottom: '20px', border: '1px solid var(--sona-border)', position: 'relative' }}>
                           <img src={room.images[activeImg]} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: room.status?.toLowerCase() !== 'available' ? 'blur(8px)' : 'none' }} />
                           {room.status?.toLowerCase() !== 'available' && (
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}>
                                 <span style={{ background: '#ef4444', color: 'white', padding: '12px 30px', borderRadius: '50px', fontWeight: '900', fontSize: '18px', letterSpacing: '4px', boxShadow: '0 15px 30px rgba(239, 68, 68, 0.4)' }}>ROOM UNAVAILABLE</span>
                              </div>
                           )}
                           <div className="vignette-overlay"></div>
                        </motion.div>
                        <div className="thumbs-row flex gap-15" style={{ overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                           {room.images.map((img, i) => (
                              <div key={i} onClick={() => setActiveImg(i)} style={{ width: '110px', height: '80px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: activeImg === i ? '3px solid #dfa974' : '3px solid var(--sona-border)', transition: '0.3s', flexShrink: 0, opacity: activeImg === i ? 1 : 0.4 }}>
                                 <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                           ))}
                        </div>
                     </>
                  ) : (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '600px', borderRadius: '20px', overflow: 'hidden', background: 'var(--sona-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--sona-border)', position: 'relative' }}>
                        <div style={{ textAlign: 'center' }}>
                           <Loader2 className="animate-spin mb-4 mx-auto" size={40} color="#dfa974" style={{ marginBottom: '20px' }} />
                           <p className="serif" style={{ fontSize: '20px', color: 'var(--sona-text)' }}>Loading 360° Panorama Viewer...</p>
                           <p style={{ color: 'var(--sona-text-muted)', fontSize: '14px', marginTop: '10px' }}>*Placeholder for Matterport/Pannellum integration*</p>
                        </div>
                     </motion.div>
                  )}
               </div>

               <div className="room-info-container">
                  <div className="flex-between" style={{ marginBottom: '15px' }}>
                     <span style={{ letterSpacing: '2px', color: '#dfa974', fontWeight: '800', fontSize: '13px' }}>{room.type.toUpperCase()} COLLECTION</span>
                     <div className="flex gap-5" style={{ color: '#dfa974' }}>
                        <Star size={16} fill="#dfa974" /><span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--sona-text)' }}>4.9</span>
                     </div>
                  </div>
                  <h1 className="serif" style={{ fontSize: '48px', marginBottom: '20px', color: 'var(--sona-text)' }}>{room.name}</h1>
                  <div className="flex gap-30" style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--sona-border)' }}>
                     <div className="flex gap-10" style={{ color: 'var(--sona-text-muted)', fontSize: '15px' }}><MapPin size={18} color="#dfa974" /> {room.location}</div>
                     <div className="flex gap-10" style={{ color: 'var(--sona-text-muted)', fontSize: '15px' }}><Users size={18} color="#dfa974" /> {room.maxPerson} Person Capacity</div>
                  </div>
                  <p style={{ fontSize: '18px', color: 'var(--sona-text)', opacity: 0.8, lineHeight: '1.8', marginBottom: '40px' }}>{room.description}</p>
                  <div style={{ marginBottom: '40px' }}>
                     <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'var(--sona-text)' }}>Premium Room Add-ons</h4>
                     <div className="grid-2" style={{ gap: '15px' }}>
                     {amenities.map((item) => {
                           const isSelected = selectedAmenities.find(a => a._id === item._id);
                           return (
                              <div
                                 key={item._id}
                                 onClick={() => toggleAmenity(item)}
                                 className="flex-between hover-lift"
                                 style={{
                                    background: isSelected ? 'rgba(223, 169, 116, 0.1)' : 'var(--sona-bg-alt)',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: isSelected ? '2px solid var(--sona-gold)' : '1px solid var(--sona-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    userSelect: 'none'
                                 }}
                              >
                                 <div className="flex gap-15">
                                    <div style={{ color: '#dfa974' }}>{iconMap[item.icon] || <Box size={18} />}</div>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: isSelected ? 'var(--sona-gold)' : 'var(--sona-text)' }}>{item.name}</span>
                                 </div>
                                 <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--sona-gold)' }}>+${item.price}</span>
                              </div>
                           );
                        })}
                     </div>
                  </div>
                  <div style={{ background: 'var(--sona-bg-alt)', padding: '30px 40px', borderRadius: '24px', color: 'white', border: '1px solid var(--sona-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }} className="booking-cta-bar">
                     <div className="flex-col">
                        <span style={{ fontSize: '12px', opacity: 0.6, letterSpacing: '1px', marginBottom: '5px' }}>{selectedAmenities.length > 0 ? "TOTAL PRICE" : "STARTING FROM"}</span>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#dfa974' }}>${finalPrice}<span style={{ fontSize: '14px', color: 'white', opacity: 0.6, fontWeight: '400', marginLeft: '5px' }}>/Night</span></div>
                     </div>
                     {room.status?.toLowerCase() === 'available' ? (
                        <button onClick={handleBookRoom} style={{ background: '#dfa974', color: 'white', border: 'none', padding: '18px 40px', fontSize: '14px', fontWeight: '800', borderRadius: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} className="btn-sona-primary"><Calendar size={18} /> BOOK THIS ROOM</button>
                     ) : (
                        <button disabled style={{ background: '#475569', color: 'rgba(255,255,255,0.5)', border: 'none', padding: '18px 40px', fontSize: '14px', fontWeight: '800', borderRadius: '15px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={18} /> ROOM UNAVAILABLE</button>
                     )}
                  </div>
               </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '80px', borderTop: '1px solid var(--sona-border)', paddingTop: '60px' }}>
               <div className="flex-between" style={{ marginBottom: '40px' }}>
                  <h3 className="serif" style={{ fontSize: '32px', color: 'var(--sona-text)' }}>Guest Reviews</h3>
                  <button style={{ background: 'none', border: '1px solid #dfa974', color: '#dfa974', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Write a Review</button>
               </div>

               <div className="grid-2" style={{ gap: '30px' }}>
                  {[1, 2, 3, 4].map(rev => (
                     <div key={rev} style={{ background: 'var(--sona-bg-alt)', padding: '30px', borderRadius: '16px', border: '1px solid var(--sona-border)' }} className="hover-lift">
                        <div className="flex-between" style={{ marginBottom: '15px' }}>
                           <div className="flex gap-15" style={{ alignItems: 'center' }}>
                              <div style={{ width: '45px', height: '45px', background: 'var(--sona-gold)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>G{rev}</div>
                              <div>
                                 <h5 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--sona-text)' }}>Guest Title {rev}</h5>
                                 <p style={{ fontSize: '12px', color: 'var(--sona-text-muted)' }}>2 days ago</p>
                              </div>
                           </div>
                           <div className="flex" style={{ color: '#dfa974' }}>
                              <Star size={14} fill="#dfa974" /><Star size={14} fill="#dfa974" /><Star size={14} fill="#dfa974" /><Star size={14} fill="#dfa974" /><Star size={14} fill="#dfa974" />
                           </div>
                        </div>
                        <p style={{ fontSize: '15px', color: 'var(--sona-text)', opacity: 0.7, lineHeight: '1.8' }}>
                           &quot;Exceptional stay! The room was exactly as pictured, and the amenities were pristine. The staff were very accommodating. Highly recommend for a luxury getaway.&quot;
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default RoomDetailsPage;
