import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleServices = () => {
    if (window.location.hash === '#/') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  return (
    <footer className="bg-dark border-t border-white/10 pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <div
              className="text-2xl font-bold font-sans cursor-pointer tracking-tighter"
              onClick={() => handleNav('/')}
            >
              <span className="text-white">Dev</span>
              <span className="text-brand-primary">Sha</span>
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Helping brands grow through premium design, robust technology, and performance-driven marketing strategies.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={handleServices} className="text-gray-400 hover:text-brand-primary transition-colors text-sm">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/portfolio')} className="text-gray-400 hover:text-brand-primary transition-colors text-sm">
                  Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="text-gray-400 hover:text-brand-primary transition-colors text-sm">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:muhammadshariq368@gmail.com" className="flex items-start gap-3 text-gray-400 group hover:text-white transition-colors">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary transition-colors text-brand-primary group-hover:text-white">
                    <Mail size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Email</span>
                    <span className="text-sm">muhammadshariq368@gmail.com</span>
                  </div>
                </a>
              </li>
              <li>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-gray-400 group hover:text-white transition-colors">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-green transition-colors text-brand-green group-hover:text-white">
                    <Phone size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">WhatsApp</span>
                    <span className="text-sm">03082891023</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} DevSha. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-gray-600 text-xs">Designed & Built by Muhammad Shariq</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;