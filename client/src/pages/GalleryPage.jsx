import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image } from 'lucide-react';

const galleryItems = [
  // Videos
  {
    id: 1,
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=80',
    title: 'Luxury Swimming Pool',
    category: 'Pool & Spa',
  },
  {
    id: 2,
    type: 'video',
    src: 'https://vjs.zencdn.net/v/oceans.mp4',
    poster: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    title: 'Resort Poolside Experience',
    category: 'Pool & Spa',
  },
  {
    id: 3,
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    title: 'Aerial Resort View',
    category: 'Exterior',
  },
  // Images - Rooms
  {
    id: 4,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    title: 'King Suite',
    category: 'Rooms',
  },
  {
    id: 5,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    title: 'Royal Bedroom',
    category: 'Rooms',
  },
  {
    id: 6,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    title: 'Deluxe Room',
    category: 'Rooms',
  },
  {
    id: 7,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    title: 'Premium Twin Room',
    category: 'Rooms',
  },
  // Images - Dining
  {
    id: 8,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    title: 'Le Gourmet Restaurant',
    category: 'Dining',
  },
  {
    id: 9,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1618773928120-2e15dc9c6943?auto=format&fit=crop&w=800&q=80',
    title: 'Rooftop Lounge & Bar',
    category: 'Dining',
  },
  {
    id: 10,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    title: 'Breakfast Café',
    category: 'Dining',
  },
  // Images - Play Area / Activities
  {
    id: 11,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    title: 'Kids Play Zone',
    category: 'Play Area',
  },
  {
    id: 12,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    title: 'Grand Lobby',
    category: 'Interior',
  },
  {
    id: 13,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    title: 'Resort Exterior',
    category: 'Exterior',
  },
  {
    id: 14,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    title: 'Hotel Garden',
    category: 'Exterior',
  },
  {
    id: 15,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    title: 'Spa & Wellness',
    category: 'Pool & Spa',
  },
  {
    id: 16,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1618773928120-2e15dc9c6943?auto=format&fit=crop&w=800&q=80',
    title: 'Fitness Center',
    category: 'Play Area',
  },
];

const categories = ['All', 'Rooms', 'Dining', 'Pool & Spa', 'Exterior', 'Interior', 'Play Area'];

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(i => i.category === activeFilter);

  return (
    <div style={{ background: 'var(--sona-bg)', minHeight: '100vh' }}>

      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #19191a 0%, #2d1f0e 100%)',
        padding: '100px 0 70px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=40)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2,
        }} />
        <div className="container-sona" style={{ position: 'relative' }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ color: 'var(--sona-gold)', letterSpacing: '4px', fontWeight: 700, fontSize: '13px', display: 'block', marginBottom: '15px' }}
          >SONA HOTEL</motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="serif" style={{ fontSize: '58px', color: 'white', lineHeight: 1.1, marginBottom: '20px' }}
          >Our Photo & Video Gallery</motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', maxWidth: '550px', margin: '0 auto' }}
          >
            Experience the luxury of Sona Hotel through our curated collection of spaces, suites, dining, and recreational areas.
          </motion.p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section style={{ padding: '40px 0 20px', background: 'var(--sona-bg-alt)', borderBottom: '1px solid var(--sona-border)' }}>
        <div className="container-sona" style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '10px', justifyContent: 'flex-start' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '10px 24px',
                border: activeFilter === cat ? 'none' : '1px solid var(--sona-border)',
                borderRadius: '50px',
                background: activeFilter === cat ? 'var(--sona-gold)' : 'var(--sona-bg)',
                color: activeFilter === cat ? 'white' : 'var(--sona-text)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
              }}
            >{cat}</button>
          ))}
        </div>
      </section>

      {/* Masonry-Style Gallery Grid */}
      <section className="section-padding">
        <div className="container-sona">
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLightbox(item)}
                  style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    background: '#000',
                    height: item.type === 'video' ? '280px' : '240px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                >
                  {item.type === 'video' ? (
                    <>
                      <img src={item.poster} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, transition: 'transform 0.5s ease', }} className="gallery-img" />
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{
                          width: '58px', height: '58px', borderRadius: '50%',
                          background: 'rgba(223,169,116,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
                        }}>
                          <Play size={24} color="white" fill="white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={item.src} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="gallery-img" />
                  )}

                  {/* Overlay on hover */}
                  <div className="gallery-overlay" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(25,25,26,0.85) 0%, transparent 60%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: '20px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}>
                    <span style={{ color: 'var(--sona-gold)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', marginBottom: '5px' }}>{item.category.toUpperCase()}</span>
                    <h4 style={{ color: 'white', fontSize: '17px', fontWeight: 700 }}>{item.title}</h4>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--sona-text-muted)' }}>
              <Image size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p>No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
              zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '900px', width: '100%', borderRadius: '15px',
                overflow: 'hidden', position: 'relative',
              }}
            >
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                  width: '42px', height: '42px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: 'white',
                }}
              ><X size={20} /></button>

              {lightbox.type === 'video' ? (
                <video
                  key={`video-${lightbox.id}`}
                  autoPlay controls playsInline muted
                  poster={lightbox.poster}
                  style={{ width: '100%', maxHeight: '80vh', display: 'block', borderRadius: '10px' }}
                >
                  <source src={lightbox.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={lightbox.src} alt={lightbox.title} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', borderRadius: '10px' }} />
              )}

              <div style={{ background: '#19191a', padding: '20px 25px' }}>
                <span style={{ color: 'var(--sona-gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px' }}>{lightbox.category}</span>
                <h3 className="serif" style={{ color: 'white', fontSize: '22px', marginTop: '5px' }}>{lightbox.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GalleryPage;
