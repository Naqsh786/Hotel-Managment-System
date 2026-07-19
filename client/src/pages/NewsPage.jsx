import { motion } from 'framer-motion';

const NewsPage = () => {
  const newsItems = [
    { title: 'The Art of Hospitality: A New Era', date: 'Oct 12, 2026', category: 'LIFESTYLE', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3' },
    { title: 'Best Suites for Your Summer Stay', date: 'Oct 10, 2026', category: 'ROOMS', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3' },
    { title: 'Executive Chef Joins Sona Kitchen', date: 'Oct 08, 2026', category: 'DINING', img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3' },
    { title: 'Sona Hotel wins Best Luxury Resort', date: 'Oct 05, 2026', category: 'AWARDS', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3' },
  ];

  return (
    <div className="news-page">
      <section style={{
        background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
        padding: '120px 0 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15,
        }} />
        <div className="container-sona" style={{ position: 'relative', zIndex: 2 }}>
           <h1 className="serif" style={{fontSize: '56px', marginBottom: '15px', color: '#fff'}}>Sona News</h1>
           <p className="text-muted" style={{fontSize: '16px', maxWidth: '600px', margin: '0 auto 20px', color: 'rgba(255,255,255,0.7)'}}>
              Stay updated with the latest happenings, events, and luxury travel insights from Sona Hotel.
           </p>
           <div className="flex-center gap-10" style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)'}}>
              <span style={{color: '#fff', fontWeight: '700'}}>Home</span> / <span>Latest News</span>
           </div>
        </div>
      </section>

      <section className="section-padding">
         <div className="container-sona">
            <div className="grid-2">
               {newsItems.map((news, i) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ y: -10 }}
                    style={{background: 'var(--sona-bg-alt)', border: '1px solid var(--sona-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden'}}
                 >
                    <div style={{height: '300px', overflow: 'hidden'}}>
                       <img src={news.img} alt={news.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </div>
                    <div style={{padding: '30px'}}>
                       <span style={{color: 'var(--sona-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '2px'}}>{news.category}</span>
                       <h3 className="serif" style={{fontSize: '24px', margin: '15px 0'}}>{news.title}</h3>
                       <p style={{color: '#777', fontSize: '14px', marginBottom: '20px'}}>
                          Discover the latest updates and stories from Sona Hotel. Stay tuned for luxury travel tips and more.
                       </p>
                       <div className="flex-between" style={{borderTop: '1px solid #eee', paddingTop: '20px'}}>
                          <span style={{fontSize: '13px', color: '#999'}}>{news.date}</span>
                          <button style={{background: 'none', border: 'none', color: 'var(--sona-gold)', fontWeight: '700', fontSize: '12px', cursor: 'pointer'}}>READ FULL STORY</button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default NewsPage;
