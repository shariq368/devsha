import React from 'react';
import { Home, Layers, Briefcase, MessageSquare, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WHATSAPP_LINK } from '../constants';

const FloatingDock: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', action: () => handleScroll('hero') },
    { icon: Layers, label: 'Services', action: () => handleScroll('services') },
    { icon: Briefcase, label: 'Work', action: () => navigate('/portfolio') },
    { icon: User, label: 'Testimonials', action: () => handleScroll('testimonials') },
    { icon: MessageSquare, label: 'Contact', action: () => window.open(WHATSAPP_LINK, '_blank') },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 sm:gap-2 px-4 py-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-full shadow-2xl shadow-brand-primary/20">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="group relative flex flex-col items-center justify-center p-2 sm:px-4 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            <item.icon size={20} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 bg-white text-black text-xs font-bold px-2 py-1 rounded transition-all duration-200 pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingDock;