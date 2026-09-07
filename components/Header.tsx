import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WHATSAPP_LINK } from '../constants';
import { Menu, X } from 'lucide-react';
import logoImg from '../Assets/logo-transparent.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Prevent body scroll while the drawer is open, and allow Escape to close it.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  /*
   * Closing the mobile drawer releases the <body> scroll lock in an effect
   * cleanup, so a scroll issued in the same tick would be swallowed while
   * `overflow: hidden` is still applied. Deferring two frames lets the unlock
   * land first. (Navigation and window.open are NOT deferred — they must stay
   * inside the user gesture so popup blockers don't fire.)
   */
  const deferScroll = (scroll: () => void) => {
    requestAnimationFrame(() => requestAnimationFrame(scroll));
  };

  const goHome = useCallback(() => {
    if (isHome) {
      deferScroll(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    } else {
      navigate('/');
    }
  }, [isHome, navigate]);

  const goToServices = useCallback(() => {
    if (isHome) {
      deferScroll(() =>
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } else {
      navigate('/#services');
    }
  }, [isHome, navigate]);

  const handleNavClick = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium transition-colors ${active ? 'text-white' : 'text-gray-300 hover:text-white'}`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] py-3.5 px-6 md:px-12 transition-all duration-300 backdrop-blur-md bg-dark/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          <button
            type="button"
            aria-label="DevSha — go to home"
            className="flex items-center cursor-pointer z-20 group"
            onClick={goHome}
          >
            <img
              src={logoImg}
              alt="DevSha"
              width={144}
              height={36}
              className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          {/* Centered Navigation - Desktop */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <button onClick={goHome} className={navLinkClass(isHome && !location.hash)}>Home</button>
            <button onClick={goToServices} className={navLinkClass(false)}>Services</button>
            <button onClick={() => navigate('/portfolio')} className={navLinkClass(location.pathname === '/portfolio')}>Portfolio</button>
            <button onClick={() => navigate('/contact')} className={navLinkClass(location.pathname === '/contact')}>Contact</button>
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4 z-20">
            <button
              onClick={() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')}
              className="hidden md:block bg-white text-dark px-6 py-2 rounded-full text-sm font-bold hover:bg-brand-primary hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Hire Me
            </button>

            <button
              className="md:hidden text-white p-1"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
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

      {/*
        Mobile Menu Drawer.
        `visibility` is toggled alongside the transform so the off-screen links
        are removed from the tab order instead of being invisibly focusable.
      */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        style={{ transition: 'transform 300ms ease-in-out, visibility 300ms ease-in-out' }}
        className={`fixed top-0 right-0 z-[58] h-full w-72 bg-dark/95 backdrop-blur-md border-l border-white/10 shadow-2xl transform md:hidden ${mobileMenuOpen ? 'translate-x-0 visible' : 'translate-x-full invisible'
          }`}
      >
        <nav className="flex flex-col pt-24 px-6 gap-2" aria-label="Mobile menu">
          <button
            onClick={() => handleNavClick(goHome)}
            className="text-left text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-200"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick(goToServices)}
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
            onClick={() => handleNavClick(() => window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer'))}
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
