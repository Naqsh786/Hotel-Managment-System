import { motion } from 'framer-motion';

const ReviewsPage = () => {
  const testimonials = [
    { name: 'Alexander T.', role: 'CEO', text: '"The hospitality at Sona is unmatched. The rooms are spacious and the service is truly intercontinental."', img: 'https://i.pravatar.cc/150?u=122' },
    { name: 'Lucia Grace', role: 'Vacationer', text: '"A dream stay! The gold accents and the serif aesthetic make you feel like royalty. Highly recommended!"', img: 'https://i.pravatar.cc/150?u=123' },
    { name: 'Robert J.', role: 'Traveler', text: '"Best hotel experience in the city. The rooftop view and the staff attention to detail are exceptional."', img: 'https://i.pravatar.cc/150?u=124' },
    { name: 'Emma Wilson', role: 'Business Traveler', text: '"Impeccable service and a very smooth booking process. The room was perfectly arranged and very comfortable."', img: 'https://i.pravatar.cc/150?u=125' },
    { name: 'David Chen', role: 'Photographer', text: '"A beautiful property. Every corner is meticulously designed. The dining experience was a highlight of my trip."', img: 'https://i.pravatar.cc/150?u=126' },
    { name: 'Sophia Martinez', role: 'Honeymooner', text: '"We spent our romantic getaway here and it was magical. The staff went above and beyond to make us feel special."', img: 'https://i.pravatar.cc/150?u=127' }
  ];

  return (
    <div className="reviews-page">
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '120px 0 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15,
        }} />
        <div className="container-sona" style={{ position: 'relative', zIndex: 2 }}>
           <h1 className="serif" style={{fontSize: '56px', marginBottom: '15px', color: '#fff'}}>Guest Reviews</h1>
           <p className="text-muted" style={{fontSize: '16px', maxWidth: '600px', margin: '0 auto 20px', color: 'rgba(255,255,255,0.7)'}}>
              Discover what our esteemed guests have to say about their magnificent stay at Sona Hotel.
           </p>
           <div className="flex-center gap-10" style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)'}}>
              <span style={{color: '#fff', fontWeight: '700'}}>Home</span> / <span>Reviews</span>
           </div>
        </div>
      </section>

      <section className="section-padding" style={{background: 'var(--sona-bg)'}}>
         <div className="container-sona">
            <div className="grid-3" style={{ gap: '40px' }}>
               {testimonials.map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }} 
                    className="testimonial-card-premium" 
                    style={{ background: 'var(--sona-bg-alt)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                     <p style={{fontSize: '16px', lineHeight: '1.8'}}>{item.text}</p>
                     <div className="testimonial-author" style={{marginTop: '30px'}}>
                        <img src={item.img} alt={item.name} />
                        <span style={{fontWeight: '800', fontSize: '14px', marginTop: '10px'}}>{item.name}</span>
                        <span style={{fontSize: '11px', color: '#dfa974', fontWeight: '600'}}>{item.role}</span>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
