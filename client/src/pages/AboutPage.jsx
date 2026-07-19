
const AboutPage = () => {
  return (
    <div className="about-page">
      <section style={{
        background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)',
        padding: '120px 0 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2,
        }} />
        <div className="container-sona" style={{ position: 'relative', zIndex: 2 }}>
           <h1 className="serif" style={{fontSize: '56px', marginBottom: '15px', color: '#fff'}}>About Sona Hotel</h1>
           <p className="text-muted" style={{fontSize: '16px', maxWidth: '600px', margin: '0 auto 20px', color: 'rgba(255,255,255,0.7)'}}>
              Learn more about our heritage, mission, and the people behind the luxury.
           </p>
           <div className="flex-center gap-10" style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)'}}>
              <span style={{color: '#fff', fontWeight: '700'}}>Home</span> / <span>About Us</span>
           </div>
        </div>
      </section>

      <section className="section-padding">
         <div className="container-sona">
            <div className="grid-2" style={{alignItems: 'center', gap: '60px'}}>
               <div className="about-img-box" style={{position: 'relative'}}>
                  <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80" alt="Hotel Luxury" style={{width: '100%', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}} />
                  <div style={{position: 'absolute', bottom: '-20px', right: '-20px', background: 'var(--sona-gold)', padding: '30px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
                     <h3 style={{fontSize: '36px', fontWeight: '800'}}>50+</h3>
                     <span style={{fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px'}}>Years of Excellence</span>
                  </div>
               </div>
               <div className="about-content">
                  <span className="text-primary" style={{letterSpacing: '3px', fontWeight: '700', fontSize: '13px'}}>OUR STORY</span>
                  <h2 className="serif" style={{fontSize: '42px', margin: '15px 0', lineHeight: '1.2'}}>Luxury, Comfort <br /> & Pure Elegance</h2>
                  <p className="text-muted" style={{fontSize: '16px', lineHeight: '1.8', marginBottom: '25px'}}>
                     Founded in 1976, Sona Hotel has grown into a world-renowned destination for luxury and peace. We believe that hospitality is not just about a room, it&apos;s about the experience that stays with you forever.
                  </p>
                  <div className="flex-col gap-15">
                     <div className="flex-center gap-15" style={{justifyContent: 'flex-start'}}>
                        <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--sona-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                           <div style={{width: '10px', height: '10px', background: 'var(--sona-gold)', borderRadius: '50%'}}></div>
                        </div>
                        <div>
                           <h4 style={{fontSize: '16px', fontWeight: '700'}}>Certified 5 Star Service</h4>
                           <p style={{fontSize: '13px', color: '#777'}}>Award winning standards of care and luxury.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
