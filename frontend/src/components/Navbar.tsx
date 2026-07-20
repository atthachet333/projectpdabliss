import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, X } from 'lucide-react';
import { logUserAction } from '../utils/logger';
import { trackNavigation } from '../utils/analytics';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'เกี่ยวกับเรา', path: '/about' },
    { name: 'บริการเอกสาร', path: '/services' },
    { name: 'ขั้นตอนบริการ', path: '/process' },
    { name: 'ติดต่อเรา', path: '/contact' },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <nav className="sticky top-0 z-[80] w-full border-b border-gray-200/70 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex justify-between items-center h-20 lg:h-24 gap-3">
          
          <div className="min-w-0 flex items-center z-10">
            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-4 group">
              <img 
                src="/images/logo.png" 
                alt="PDA BLISS Logo" 
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="flex min-w-0 flex-col">
                <span className="font-bold text-green-700 text-[12px] sm:text-[14px] lg:text-[16px] tracking-wide leading-tight mb-1 group-hover:text-green-800 transition-colors">
                  PDA BLISS COMPANY LIMITED
                </span>
                <span className="hidden sm:block text-[11px] text-gray-500 leading-tight">
                  บริการเอกสารครบ จบที่เดียว
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center gap-5 xl:gap-8 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                data-analytics-id={`navbar_${link.path === '/' ? 'home' : link.path.slice(1)}`}
                onClick={() => trackNavigation(`navbar_${link.path === '/' ? 'home' : link.path.slice(1)}`, link.path)}
                className={`${
                  location.pathname === link.path || (link.name === 'หน้าแรก' && location.pathname === '/')
                    ? 'text-green-700 font-bold border-b-[3px] border-green-700 pb-1.5'
                    : 'text-gray-600 hover:text-green-700 font-medium hover:border-b-[3px] hover:border-green-300 pb-1.5'
                } text-[15px] transition-all whitespace-nowrap`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center flex-shrink-0 gap-2 z-10">
            <Link
              to="/contact"
              data-analytics-id="navbar_free_consultation"
              onClick={() => logUserAction('CLICK_CONSULT_BUTTON', { location: 'Navbar' })}
              className="hidden sm:flex bg-green-700 hover:bg-green-800 text-white min-h-11 px-4 lg:px-6 py-3 rounded-md text-[13px] lg:text-[14px] font-bold items-center transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              ปรึกษาฟรี
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(open => !open)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-green-100 bg-white text-green-800 shadow-sm transition hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-200 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="ปิดเมนู"
            className="fixed inset-0 top-20 z-[70] bg-black/20 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div id="mobile-navigation" className="absolute left-3 right-3 top-full z-[90] mt-2 rounded-2xl border border-green-100 bg-white p-3 shadow-2xl lg:hidden">
            <div className="grid gap-1">
              {navLinks.map(link => {
                const active = location.pathname === link.path || (link.path === '/' && location.pathname === '/');
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    data-analytics-id={`mobile_navbar_${link.path === '/' ? 'home' : link.path.slice(1)}`}
                    onClick={() => trackNavigation(`mobile_navbar_${link.path === '/' ? 'home' : link.path.slice(1)}`, link.path)}
                    className={`min-h-11 rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-green-200 ${
                      active ? 'bg-green-700 text-white shadow-sm' : 'text-gray-700 hover:bg-green-50 hover:text-green-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                onClick={() => logUserAction('CLICK_CONSULT_BUTTON', { location: 'Navbar_Mobile' })}
                className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 sm:hidden"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                ปรึกษาฟรี
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
