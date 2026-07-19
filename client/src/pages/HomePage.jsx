import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, Waves, Utensils, ShieldCheck, MapPin, 
  Star, ChevronRight, Search
} from "lucide-react";
import { useForm } from "react-hook-form";
import CustomDropdown from "../components/CustomDropdown";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState("");
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // eslint-disable-next-line unused-imports/no-unused-vars
    formState: { errors }
  } = useForm({
    defaultValues: {
      checkIn: "",
      checkOut: "",
      guests: "2 Adults",
      rooms: "1 Room"
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("http://localhost:7000/api/admin/settings/home");
        // Backend returns { status: true, data: settings }
        const settings = data?.data;
        if (settings && settings.visibleCategories) {
          setCategories(settings.visibleCategories.filter(cat => cat.isVisible !== false));
        }
      } catch (error) {
        console.error("Failed to fetch home settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const watchGuests = watch("guests");
  const watchRooms = watch("rooms");

  const onCheckAvailability = (data) => {
    if (!data.checkIn || !data.checkOut) {
      setToastMsg("Please select both dates.");
      return;
    }
    navigate(`/rooms?checkIn=${data.checkIn}&checkOut=${data.checkOut}&guests=${data.guests}`);
  };

  const amenities = [
    { title: "Ultra Fast WiFi", desc: "1GBPS fiber optics throughout the premises.", icon: <Wifi size={32} /> },
    { title: "Infinity Pool", desc: "Temperature controlled rooftop swimming area.", icon: <Waves size={32} /> },
    { title: "Fine Dining", desc: "Experience 5-star cuisines by top chefs.", icon: <Utensils size={32} /> },
    { title: "24/7 Security", desc: "Advanced surveillance and secure stay.", icon: <ShieldCheck size={32} /> },
    { title: "Prime Location", desc: "Located in the heart of the golden city.", icon: <MapPin size={32} /> },
    { title: "Smart Rooms", desc: "Control amenities with a touch of a button.", icon: <Star size={32} /> }
  ];

  return (
    <div className="homepage-main">
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', background: '#333', color: 'white', padding: '15px 30px', borderRadius: '50px', zIndex: 9999 }}>
            {toastMsg} <button onClick={() => setToastMsg("")} style={{ background: 'none', border: 'none', color: '#dfa974', marginLeft: '10px' }}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero-wrapper" style={{ height: 'auto', minHeight: '100vh', padding: '140px 0 100px 0', display: 'flex', alignItems: 'center' }}>
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60" 
          alt="Luxury Lobby" 
          className="hero-slider-img"
        />
        <div className="container-sona" style={{ zIndex: 10, position: 'relative', width: '100%' }}>
           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '60px' }}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 300px', maxWidth: '600px' }}>
                 <div className="hero-text-box" style={{ textAlign: 'left' }}>
                    <motion.span initial={{ opacity: 0, letterSpacing: '2px', fontSize: 'clamp(12px, 2vw, 16px)' }} animate={{ opacity: 1, letterSpacing: '5px' }} transition={{ duration: 0.8 }}>
                       Luxury Stay & High Quality
                    </motion.span>
                    <h1 className="serif leading-tight" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '20px' }}>Sona A Luxury Hotel</h1>
                    <p className="text-white" style={{opacity: 0.8, fontSize: 'clamp(14px, 3vw, 18px)', maxWidth: '450px', marginBottom: '30px', lineHeight: '1.6'}}>
                       Experience the pinnacle of hospitality at Sona Hotel. Where every detail is crafted for your ultimate comfort and luxury.
                    </p>
                    <button 
                        onClick={() => {
                           const token = sessionStorage.getItem("token");
                           if (token) navigate('/rooms');
                           else navigate('/login');
                        }} 
                        className="btn-sona-primary" 
                        style={{border: 'none', cursor: 'pointer'}}
                     >
                        Discover More
                     </button>
                 </div>
              </motion.div>

              {/* Booking Card - Positioned responsively */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="hero-booking-card"
                style={{ 
                  flex: '1 1 350px',
                  maxWidth: '450px',
                  width: '100%',
                  zIndex: 100,
                  padding: '30px',
                  position: 'relative',
                  top: 'auto',
                  right: 'auto',
                  margin: '0 auto'
                }}
              >
                 <h3 className="serif" style={{ fontSize: '22px', marginBottom: '20px' }}>Find Your Suite</h3>
                 <form onSubmit={handleSubmit(onCheckAvailability)} className="flex-col gap-15">
                    <div className="input-group-sona">
                       <label>Check In</label>
                       <input type="date" {...register("checkIn", { required: "Required" })} />
                    </div>
                    <div className="input-group-sona">
                       <label>Check Out</label>
                       <input type="date" {...register("checkOut", { required: "Required" })} />
                    </div>
                    <div className="grid-2" style={{gap: '15px'}}>
                       <CustomDropdown 
                          label="GUESTS" 
                          options={['1 Adult', '2 Adults', '3 Adults', '4 Adults']} 
                          value={watchGuests} 
                          onChange={val => setValue("guests", val)} 
                       />
                       <CustomDropdown 
                          label="ROOM" 
                          options={['1 Room', '2 Rooms', '3 Rooms', '4 Rooms']} 
                          value={watchRooms} 
                          onChange={val => setValue("rooms", val)} 
                       />
                    </div>
                    <button type="submit" className="btn-sona-primary w-full" style={{width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                       <Search size={18} /> Check Availability
                    </button>
                 </form>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Stats - Premium Look */}
      <section style={{ background: '#19191a', padding: '60px 0' }}>
         <div className="container-sona">
            <div className="grid-4" style={{ textAlign: 'center', color: '#fff' }}>
               <div><h2 className="serif" style={{ color: '#dfa974' }}>150+</h2><p style={{ opacity: 0.6, fontSize: '14px' }}>Luxury Rooms</p></div>
               <div><h2 className="serif" style={{ color: '#dfa974' }}>5</h2><p style={{ opacity: 0.6, fontSize: '14px' }}>Restaurants</p></div>
               <div><h2 className="serif" style={{ color: '#dfa974' }}>15</h2><p style={{ opacity: 0.6, fontSize: '14px' }}>Event Halls</p></div>
               <div><h2 className="serif" style={{ color: '#dfa974' }}>10k</h2><p style={{ opacity: 0.6, fontSize: '14px' }}>Happy Guests</p></div>
            </div>
         </div>
      </section>

      {/* Amenities Section */}
      <section className="section-padding" style={{background: 'var(--sona-bg)'}}>
         <div className="container-sona">
            <div className="flex-col flex-center" style={{marginBottom: '40px', textAlign: 'center'}}>
               <span className="text-primary" style={{letterSpacing: '3px', fontWeight: '700', fontSize: '13px'}}>OUR SERVICES</span>
               <h2 className="serif" style={{fontSize: '36px', marginTop: '10px'}}>Why Choose Sona Hotel?</h2>
            </div>
            <div className="grid-3" style={{gap: '30px'}}>
               {amenities.map((item, i) => (
                  <div key={i} className="flex-center gap-20 hover-lift" style={{justifyContent: 'flex-start', padding: '25px', border: '1px solid var(--sona-border)', borderRadius: '20px', background: 'var(--sona-bg-alt)', transition: '0.3s'}}>
                     <div style={{color: 'var(--sona-gold)'}}>{item.icon}</div>
                     <div className="flex-col">
                        <h4 style={{fontSize: '18px', fontWeight: '700'}}>{item.title}</h4>
                        <p className="text-muted" style={{fontSize: '13px', marginTop: '5px'}}>{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--sona-bg-alt)' }}>
          <div className="container-sona">
            <div className="flex-col flex-center" style={{ marginBottom: '40px', textAlign: 'center' }}>
              <span className="text-primary" style={{ letterSpacing: '3px', fontWeight: '700', fontSize: '13px' }}>EXPLORE</span>
              <h2 className="serif" style={{ fontSize: '36px', marginTop: '10px' }}>Our Categories</h2>
            </div>
            <div className="grid-3" style={{ gap: '30px' }}>
              {categories.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover-lift"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid var(--sona-border)',
                    background: 'var(--sona-bg)',
                  }}
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{cat.title}</h4>
                    {cat.desc && (
                      <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>{cat.desc}</p>
                    )}
                    {cat.link && (
                      <Link to={cat.link} className="text-primary" style={{ fontSize: '13px', fontWeight: '600', marginTop: '10px', display: 'inline-block', textDecoration: 'none' }}>
                        Explore <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Rooms Section */}
      <section className="section-padding" style={{background: 'var(--sona-bg)'}}>
         <div className="container-sona">
            <div className="flex-col flex-center" style={{marginBottom: '50px', textAlign: 'center'}}>
               <span className="text-primary" style={{letterSpacing: '3px', fontWeight: '700', fontSize: '13px'}}>OUR PREMIUM OFFERINGS</span>
               <h2 className="serif" style={{fontSize: 'clamp(28px, 4vw, 36px)', marginTop: '10px'}}>Featured Suites</h2>
            </div>
            <div className="grid-3" style={{gap: '30px'}}>
               {[
                 { title: "Presidential Suite", price: "$500", size: "120 sq ft", bed: "King Bed", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80" },
                 { title: "Luxury Penthouse", price: "$350", size: "90 sq ft", bed: "Queen Bed", img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80" },
                 { title: "Ocean View Room", price: "$250", size: "75 sq ft", bed: "Double Bed", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" }
               ].map((room, idx) => (
                  <div key={idx} className="hover-lift" style={{background: 'var(--sona-bg-alt)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--sona-border)'}}>
                     <img src={room.img} alt={room.title} style={{height: '240px', width: '100%', objectFit: 'cover'}} />
                     <div style={{padding: '25px'}}>
                        <h4 style={{fontSize: '22px', fontWeight: '700', marginBottom: '10px'}} className="serif">{room.title}</h4>
                        <div className="flex-between" style={{marginBottom: '20px', fontSize: '14px', color: 'var(--sona-text-muted)'}}>
                           <span>{room.size}</span>
                           <span>{room.bed}</span>
                        </div>
                        <div className="flex-between" style={{alignItems: 'center'}}>
                           <div style={{color: 'var(--sona-gold)', fontSize: '20px', fontWeight: '800'}}>{room.price} <span style={{fontSize: '12px', color: 'var(--sona-text-muted)', fontWeight: '400'}}>/ Night</span></div>
                           <Link to="/rooms" style={{color: 'var(--sona-text)', textDecoration: 'none', fontWeight: '600', fontSize: '14px'}} className="flex gap-10">Book <ChevronRight size={16} /></Link>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '40px'}}>
               <Link to="/rooms" className="btn-sona-secondary">View All Rooms</Link>
            </div>
         </div>
      </section>

      {/* Guest Testimonials Section */}
      <section className="section-padding" style={{background: 'var(--sona-bg-alt)'}}>
         <div className="container-sona">
            <div className="flex-col flex-center" style={{marginBottom: '50px', textAlign: 'center'}}>
               <span className="text-primary" style={{letterSpacing: '3px', fontWeight: '700', fontSize: '13px'}}>TESTIMONIALS</span>
               <h2 className="serif" style={{fontSize: 'clamp(28px, 4vw, 36px)', marginTop: '10px'}}>What Guests Say</h2>
            </div>
            <div className="grid-3" style={{gap: '30px'}}>
               {[
                 { name: "John Doe", text: "The perfect blend of luxury and comfort, their staff is extremely welcoming and the views are absolutely breathtaking.", rating: 5, role: "Business Traveler" },
                 { name: "Emily Smith", text: "I've stayed at 5-star hotels globally but Sona provides an unmatched boutique experience. The rooftop pool is divine.", rating: 5, role: "Tourist" },
                 { name: "Michael Lee", text: "Outstanding service. The dining experience was top-notch. Highly recommend the presidential suite for a flawless stay.", rating: 5, role: "VIP Guest" }
               ].map((test, idx) => (
                  <div key={idx} className="hover-lift" style={{padding: '30px', background: 'var(--sona-bg)', borderRadius: '20px', border: '1px solid var(--sona-border)', position: 'relative'}}>
                     <div style={{color: 'var(--sona-gold)', marginBottom: '15px'}} className="flex gap-10">
                        {Array(test.rating).fill(0).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                     </div>
                     <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.7', fontSize: '15px'}}>&quot;{test.text}&quot;</p>
                     <div className="flex items-center gap-15" style={{alignItems: 'center'}}>
                        <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--sona-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{test.name[0]}</div>
                        <div>
                           <h5 style={{fontSize: '15px', fontWeight: '700', margin: 0}}>{test.name}</h5>
                           <span style={{fontSize: '12px', color: 'var(--sona-text-muted)'}}>{test.role}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="section-padding">
         <div className="container-sona">
            <div className="flex-col flex-center" style={{marginBottom: '50px', textAlign: 'center'}}>
               <span className="text-primary" style={{letterSpacing: '3px', fontWeight: '700', fontSize: '13px'}}>OUR GALLERY</span>
               <h2 className="serif" style={{fontSize: 'clamp(28px, 4vw, 36px)', marginTop: '10px'}}>Discover Sona</h2>
            </div>
            {/* Responsive grid for gallery images */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
               <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" alt="Exquisite Details" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '15px' }} className="hover-lift" />
               <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80" alt="Fine Dining" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '15px' }} className="hover-lift" />
               <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" alt="Relaxing Spa" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '15px' }} className="hover-lift" />
               <img src="https://images.unsplash.com/photo-1618773928120-2e15dc9c6943?auto=format&fit=crop&w=800&q=80" alt="Elegant Lounges" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '15px' }} className="hover-lift" />
            </div>
            <div style={{textAlign: 'center', marginTop: '50px'}}>
               <Link to="/gallery" className="btn-sona-secondary">Explore Full Gallery</Link>
            </div>
         </div>
      </section>

      {/* Visual Experience Section */}
      <section className="section-padding">
         <div className="container-sona">
            <div className="grid-2" style={{gap: '60px', alignItems: 'center'}}>
               <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                  <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" style={{width: '100%', borderRadius: '30px', boxShadow: '20px 20px 60px rgba(0,0,0,0.1)'}} />
               </motion.div>
               <div className="flex-col">
                  <span className="text-primary" style={{fontWeight: '800'}}>ABOUT US</span>
                  <h2 className="serif" style={{fontSize: '44px', margin: '20px 0'}}>Your Premier Destination for World-Class Luxury</h2>
                  <p className="text-muted" style={{lineHeight: '1.8', marginBottom: '30px'}}>
                    Sona Hotel is more than just a place to stay. It&apos;s a sanctuary where modern elegance meets traditional hospitality. Every hallway, every room, and every interaction is designed to make you feel like royalty.
                  </p>
                  <div className="flex-col gap-15">
                     <div className="flex-center gap-10" style={{justifyContent: 'flex-start'}}><CheckCircle2 size={18} color="#dfa974" /> <span>Complimentary Breakfast & Spa</span></div>
                     <div className="flex-center gap-10" style={{justifyContent: 'flex-start'}}><CheckCircle2 size={18} color="#dfa974" /> <span>24/7 Dedicated Concierge</span></div>
                     <div className="flex-center gap-10" style={{justifyContent: 'flex-start'}}><CheckCircle2 size={18} color="#dfa974" /> <span>Valet Parking & Car Wash</span></div>
                  </div>
                  <Link to="/about" className="btn-sona-primary m-t-40" style={{alignSelf: 'flex-start', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px'}}>Read Our History <ChevronRight size={18} /></Link>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

const CheckCircle2 = ({ size, color }) => <ShieldCheck size={size || 20} color={color || "currentColor"} />;

export default HomePage;
