import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingChat from '../components/FloatingChat';

const GuestLayout = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{background: 'var(--sona-bg)', color: 'var(--sona-text)'}}>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingChat />
    </div>

  );
};

export default GuestLayout;
