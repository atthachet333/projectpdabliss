import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'เกี่ยวกับเรา', path: '/about' },
    { name: 'บริการเอกสาร', path: '/services' },
    { name: 'ขั้นตอนบริการ', path: '/process' },
    { name: 'ติดต่อเรา', path: '/contact' },
  ];

  const handleConsultClick = () => {
    logUserAction('CLICK_CONSULT_BUTTON', { location: 'Navbar' });
    alert('บันทึก Log การกดปุ่ม "ปรึกษาฟรี" จาก Navbar แล้ว!');
  };

  return (
    /* เปลี่ยนพื้นหลังเป็น bg-white/85 และใส่ backdrop-blur-md */
    <nav className="bg-white/85 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-0 z-50 border-b border-white/50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24 gap-4">
          
          <div className="flex-shrink-0 flex items-center z-10">
            <Link to="/" className="flex items-center gap-4 group">
              <img 
                src="/images/logo.png" 
                alt="PDA BLISS Logo" 
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="flex flex-col">
                <span className="font-bold text-green-700 text-[16px] tracking-wide leading-none mb-1 group-hover:text-green-800 transition-colors whitespace-nowrap">
                  PDA BLISS COMPANY LIMITED
                </span>
                <span className="text-[11px] text-gray-500 leading-none whitespace-nowrap">
                  บริการเอกสารครบ จบที่เดียว
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center space-x-8 xl:space-x-10 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
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

          <div className="flex items-center flex-shrink-0 z-10">
            <button 
              onClick={handleConsultClick}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md text-[14px] font-bold flex items-center transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              ปรึกษาฟรี
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};