import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinkStyle = {
    color: '#aaa',
    textDecoration: 'none',
    transition: '0.3s',
    fontSize: '15px'
  };

  return (
    <footer style={{background: '#19191a', color: 'white', padding: '80px 0 30px'}}>
      <div className="container-sona">
        <div className="grid-3" style={{marginBottom: '60px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '60px'}}>
          <div className="flex-col gap-20">
            <h4 className="serif" style={{fontSize: '24px', color: '#dfa974'}}>Sona Hotel</h4>
            <p className="text-muted" style={{fontSize: '15px', lineHeight: '2', color: '#aaa'}}>
              Experience world-class hospitality in the heart of the city. We provide luxury and comfort that you will never forget.
            </p>
            <div className="flex gap-20">
               <Facebook size={20} style={{cursor: 'pointer'}} />
               <Twitter size={20} style={{cursor: 'pointer'}} />
               <Instagram size={20} style={{cursor: 'pointer'}} />
            </div>
          </div>
          
          <div className="flex-col gap-20">
            <h4 className="serif" style={{fontSize: '20px'}}>Internal Links</h4>
            <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px'}}>
               <li><Link to="/" style={footerLinkStyle} className="footer-link">Home</Link></li>
               <li><Link to="/rooms" style={footerLinkStyle} className="footer-link">Rooms</Link></li>
               <li><Link to="/about" style={footerLinkStyle} className="footer-link">About Us</Link></li>
               <li><Link to="/gallery" style={footerLinkStyle} className="footer-link">Gallery</Link></li>
               <li><Link to="/news" style={footerLinkStyle} className="footer-link">News</Link></li>
               <li><Link to="/contact" style={footerLinkStyle} className="footer-link">Contact</Link></li>
            </ul>
          </div>

          <div className="flex-col gap-20">
            <h4 className="serif" style={{fontSize: '20px'}}>Contact Info</h4>
            <ul style={{listStyle: 'none', color: '#aaa', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
               <li className="flex-center gap-10" style={{justifyContent: 'flex-start'}}><MapPin size={18} color="#dfa974" /> 123 Street Name, City</li>
               <li className="flex-center gap-10" style={{justifyContent: 'flex-start'}}><Phone size={18} color="#dfa974" /> (12) 345 67890</li>
               <li className="flex-center gap-10" style={{justifyContent: 'flex-start'}}><Mail size={18} color="#dfa974" /> info@sonahotel.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom flex-between" style={{fontSize: '14px', color: '#888', paddingTop: '30px', gap: '20px'}}>
           <p>© 2026 Sona Hotel. All Rights Reserved.</p>
           <div className="flex gap-20">
              <Link to="#" style={{color: '#888', textDecoration: 'none'}}>Privacy Policy</Link>
              <Link to="#" style={{color: '#888', textDecoration: 'none'}}>Terms & Conditions</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
