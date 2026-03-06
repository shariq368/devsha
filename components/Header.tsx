import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WHATSAPP_LINK } from '../constants';
import { Menu } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] py-4 px-6 md:px-12 transition-all duration-300 backdrop-blur-sm bg-dark/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <div
          className="text-2xl font-bold font-sans cursor-pointer tracking-tighter z-20"
          onClick={() => navigate('/')}
        >
          <span className="text-white">Dev</span>
          <span className="text-brand-primary">Sha</span>
        </div>

        {/* Centered Navigation */}
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

          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;