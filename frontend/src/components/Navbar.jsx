import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cachedGet, BASE_URL } from '../api/index.js';

// ─── Module-level constant — never recreated on re-render ────────────────────
const NAV_LINKS = [
  { name: 'Home',     path: '/' },
  { name: 'About',   path: '/about' },
  { name: 'Services',path: '/services' },
  { name: 'Projects',path: '/projects' },
  { name: 'Team',    path: '/team' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  // useCallback: stable reference — prevents addEventListener/removeEventListener
  // from re-registering on every render
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const { data } = await cachedGet('/settings');
        if (!cancelled) setSettings(data.data);
      } catch (_err) {
        // silently handled — navbar falls back to hardcoded defaults
      }
    };
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="bg-corporateBlue text-white text-sm py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {settings?.phone || '+91 9079139959'}</span>
            <span className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {settings?.email || 'Jankiballabh2510@gmail.com'}</span>
          </div>
          <div>
            <span className="font-semibold text-corporateGold">ISO 9001:2015 Certified Company</span>
          </div>
        </div>
      </div>

      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4 md:py-6'} ${isScrolled ? 'top-0' : 'md:top-[36px] top-0'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            {settings?.logo ? (
              <img src={settings?.logo ? `${BASE_URL}${settings.logo.replace(/\\/g, '/')}` : ''} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div className="flex flex-col">
                <span className="text-2xl font-heading font-bold text-corporateBlue leading-tight">{settings?.company_name || 'Janki Ballabh'}</span>
                <span className="text-sm font-semibold text-corporateGold tracking-widest uppercase">Services</span>
              </div>
            )}
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`font-medium transition-colors hover:text-corporateGold ${location.pathname === link.path ? 'text-corporateGold' : 'text-slate-700'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact" className="bg-corporateBlue text-white px-6 py-2.5 rounded-sm font-semibold hover:bg-corporateBlue-light transition-colors min-h-[44px] flex items-center">
              Get Quote
            </Link>
          </div>

          <button className="md:hidden text-corporateBlue p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Toggle menu" onClick={handleMobileMenuToggle}>
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col h-[100dvh] overflow-y-auto"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleMobileMenuClose}
                className={`py-4 min-h-[44px] border-b border-gray-100 text-lg font-medium flex items-center ${location.pathname === link.path ? 'text-corporateGold' : 'text-slate-800'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={handleMobileMenuClose}
              className="mt-6 bg-corporateBlue text-center text-white px-6 py-3 min-h-[44px] flex items-center justify-center rounded-sm font-semibold"
            >
              Get Quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Navbar);
