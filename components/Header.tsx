import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WHATSAPP_LINK } from '../constants';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] py-4 px-6 md:px-12 transition-all duration-300 backdrop-blur-sm bg-dark/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          <div
            className="text-2xl font-bold font-sans cursor-pointer tracking-tighter z-20"
            onClick={() => navigate('/')}
          >
            <span className="text-white">Dev</span>
            <span className="text-brand-primary">Sha</span>
          </div>

          {/* Centered Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</button>
            <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Services</button>
            <button onClick={() => navigate('/portfolio')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Portfolio</button>
            <button onClick={() => navigate('/contact')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Contact</button>
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4 z-20">
            <button
              onClick={() => window.open(WHATSAPP_LINK, '_blank')}
              className="hidden md:block bg-white text-dark px-6 py-2 rounded-full text-sm font-bold hover:bg-brand-primary hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Hire Me
            </button>

            <button
              className="md:hidden text-white p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 z-[58] h-full w-72 bg-dark/95 backdrop-blur-md border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <nav className="flex flex-col pt-24 px-6 gap-2">
          <button
            onClick={() => handleNavClick(() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); })}
            className="text-left text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-200"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick(() => { navigate('/'); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); })}
            className="text-left text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-200"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick(() => navigate('/portfolio'))}
            className="text-left text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-200"
          >
            Portfolio
          </button>
          <button
            onClick={() => handleNavClick(() => navigate('/contact'))}
            className="text-left text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-200"
          >
            Contact
          </button>

          <div className="border-t border-white/10 my-4" />

          <button
            onClick={() => handleNavClick(() => window.open(WHATSAPP_LINK, '_blank'))}
            className="bg-brand-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand-primary/80 transition-all duration-300 text-center"
          >
            Hire Me
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;