import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRooms } from '../Features/roomSlice';
import { Star, ArrowRight, Loader2, MapPin, Users, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

import CustomDropdown from '../components/CustomDropdown';

const RoomsPage = () => {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.rooms);
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: 1000,
    type: 'All',
    location: '',
    ac: false
  });

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTypeChange = (val) => {
    setFilters({
      ...filters,
      type: val
    });
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.type !== 'All' && room.type !== filters.type) return false;
    if (room.price > filters.priceRange) return false;
    if (filters.location && !room.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.ac && !room.amenities.includes('AC')) return false;
    return true;
  });

  return (
    <div className="rooms-page">
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        padding: '120px 0 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2,
        }} />
        <div className="container-sona" style={{ position: 'relative', zIndex: 2 }}>
           <h1 className="serif" style={{fontSize: '56px', marginBottom: '15px', color: '#fff'}}>Our Rooms</h1>
           <p className="text-muted" style={{fontSize: '16px', maxWidth: '600px', margin: '0 auto 20px', color: 'rgba(255,255,255,0.7)'}}>
              Indulge in a world of refined elegance with our curated selection of premium suites, now powered by Redux.
           </p>
           <div className="flex-center gap-10" style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)'}}>
              <span style={{color: '#fff', fontWeight: '700'}}>Home</span> / <span>Rooms</span>
           </div>
        </div>
      </section>
      <section className="section-padding" style={{background: 'var(--sona-bg)'}}>
         <div className="container-sona rooms-main-container">

            {/* Filter Sidebar */}
            <div style={{ width: '300px', background: 'var(--sona-bg-alt)', padding: '30px', borderRadius: '12px', border: '1px solid var(--sona-border)', position: 'sticky', top: '100px' }}>
              <h3 className="serif" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Filter size={20} color="#dfa974"/> Filters</h3>
              
              <div style={{ marginBottom: '25px' }}>
                 <label style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Search Location</label>
                 <div style={{ position: 'relative' }}>
                   <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="City or Branch" style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '6px', border: '1px solid #ddd' }} />
                   <Search size={16} color="#999" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                 </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                 <CustomDropdown 
                    label="Room Type"
                    options={['All', 'Standard', 'Deluxe', 'Suite', 'Family', 'Royal']}
                    value={filters.type}
                    onChange={handleTypeChange}
                 />
              </div>

              <div style={{ marginBottom: '25px' }}>
                 <div className="flex-between">
                   <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Max Price</label>
                   <span style={{color: '#dfa974', fontWeight: 'bold'}}>${filters.priceRange}</span>
                 </div>
                 <input type="range" name="priceRange" min="50" max="10000" value={filters.priceRange} onChange={handleFilterChange} style={{ width: '100%', marginTop: '10px' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                   <input type="checkbox" name="ac" checked={filters.ac} onChange={handleFilterChange} style={{ width: '16px', height: '16px', accentColor: '#dfa974' }} />
                   AC Room Required
                 </label>
              </div>
            </div>

            {/* Room List grid */}
            <div style={{ flex: 1 }}>
              {loading ? (
                <div className="flex-center" style={{padding: '100px 0'}}><Loader2 className="animate-spin" size={40} color="#dfa974" /></div>
              ) : filteredRooms.length === 0 ? (
                <div style={{textAlign: 'center', padding: '100px 0'}}>
                  <h3 className="serif">No Rooms Found</h3>
                  <p className="text-muted">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="grid-2" style={{gap: '30px'}}>
                  {filteredRooms.map((room) => (
                    <div key={room._id} className="premium-room-card" style={{background: 'var(--sona-bg-alt)', border: '1px solid var(--sona-border)', borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s ease', boxShadow: '0 5px 20px rgba(0,0,0,0.02)', opacity: room.status?.toLowerCase() !== 'available' ? 0.9 : 1}}>
                     <div style={{height: '280px', overflow: 'hidden', position: 'relative'}}>
                        <img 
                          src={room.images[0]} 
                          alt={room.name} 
                          style={{width: '100%', height: '100%', objectFit: 'cover', filter: room.status?.toLowerCase() !== 'available' ? 'blur(4px)' : 'none'}} 
                        />
                        <div style={{position: 'absolute', top: '20px', left: '20px', background: 'var(--sona-gold)', color: 'white', padding: '5px 15px', borderRadius: '5px', fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase'}}>
                          {room.type}
                        </div>
                        {room.status?.toLowerCase() !== 'available' && (
                           <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(3px)'}}>
                             <span style={{background: '#ef4444', color: 'white', padding: '10px 25px', borderRadius: '50px', fontWeight: '900', fontSize: '13px', letterSpacing: '2px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)'}}>NOT AVAILABLE</span>
                           </div>
                         )}
                     </div>
                     <div style={{padding: '35px'}}>
                        <div className="flex-between" style={{marginBottom: '15px'}}>
                           <h3 className="serif" style={{fontSize: '26px'}}>{room.name}</h3>
                           <div className="flex-center gap-5" style={{color: '#dfa974'}}>
                              <Star size={14} fill="#dfa974" />
                              <span style={{fontSize: '14px', fontWeight: '800', color: '#19191a'}}>4.9</span>
                           </div>
                        </div>
                        
                        <div className="flex-col gap-10" style={{marginBottom: '25px'}}>
                           <div className="flex gap-10" style={{fontSize: '13px', color: '#666'}}>
                              <MapPin size={14} color="#dfa974" /> {room.location }
                           </div>
                           <div className="flex gap-10" style={{fontSize: '13px', color: '#666'}}>
                              <Users size={14} color="#dfa974" /> {room.maxPerson} Person Capacity
                           </div>
                        </div>

                        <div className="flex-between" style={{paddingTop: '25px', borderTop: '1px solid #f1f1f1'}}>
                           <div style={{fontSize: '24px', fontWeight: '800', color: '#dfa974'}}>
                             ${room.price}<span style={{fontSize: '11px', color: '#94a3b8', fontWeight: '400', marginLeft: '2px'}}>/Night</span>
                           </div>
                           {room.status?.toLowerCase() === 'available' ? (
                              <Link 
                                to={`/rooms/${room._id}`} 
                                style={{textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', textTransform: 'bold', fontSize: '12px', color: 'var(--sona-dark)'}}
                              >
                                 EXPLORE NOW <ArrowRight size={16} color="#dfa974" />
                              </Link>
                           ) : (
                              <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '12px', color: '#94a3b8', cursor: 'not-allowed', opacity: 0.6}}>
                                 UNAVAILABLE
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
                ))}
                </div>
              )}
            </div>
         </div>
      </section>
    </div>
  );
};

export default RoomsPage;
