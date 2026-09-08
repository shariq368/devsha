import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { CONTACT_EMAIL, WHATSAPP_LINK, WHATSAPP_DISPLAY_NUMBER } from '../constants';
import logoImg from '../Assets/logo-transparent.png';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // ScrollToTop already resets the scroll position on route change, so this
  // must not also fire its own scroll (the two used to race each other).
  const handleNav = (path: string) => {
    navigate(path);
  }

  /*
   * The app uses HashRouter, so window.location.pathname is always "/" and
   * window.location.hash looks like "#/portfolio". Both of the old checks were
   * therefore wrong, which left this button dead on every non-home page.
   * The router's own location is the only reliable source.
   */
  const handleServices = () => {
    if (location.pathname === '/') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/#services');
    }
  }

  return (
    <footer className="bg-dark border-t border-white/10 pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => handleNav('/')}
            >
              <img
                src={logoImg}
                alt="DevSha"
                className="h-8 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
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
                <button onClick={() => handleNav('/software')} className="text-gray-400 hover:text-brand-primary transition-colors text-sm">
                  Software
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
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-start gap-3 text-gray-400 group hover:text-white transition-colors">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary transition-colors text-brand-primary group-hover:text-white">
                    <Mail size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Email</span>
                    <span className="text-sm break-words">{CONTACT_EMAIL}</span>
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
                    <span className="text-sm">{WHATSAPP_DISPLAY_NUMBER}</span>
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