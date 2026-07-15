import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Globe, MapPin, Clock, Send} from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logUserAction('SUBMIT_FOOTER_FORM', formData);
    alert('ระบบได้บันทึก Log การส่งข้อความจาก Footer แล้วครับ!');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    /* เปลี่ยนพื้นหลังเป็น bg-white/85 และใส่ backdrop-blur-md */
    <footer className="bg-white/85 backdrop-blur-md border-t border-white/50 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="flex flex-col group">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/images/logo.png" 
                alt="PDA BLISS Logo" 
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="flex flex-col">
                <span className="font-bold text-green-700 text-[15px] tracking-wide leading-tight group-hover:text-green-800 transition-colors">
                  PDA BLISS COMPANY LIMITED
                </span>
                <span className="text-[11px] text-gray-500 mt-1">
                  บริการเอกสารครบ จบที่เดียว
                </span>
              </div>
            </div>
            
            <p className="text-[13px] text-gray-600 leading-relaxed mb-6 pr-4">
              เราพร้อมเป็นผู้ช่วยจัดการเอกสารของคุณอย่างมืออาชีพ รวดเร็ว ถูกต้อง และเชื่อถือได้
            </p>

            <div className="flex gap-3">
  {[ { icon: MessageCircle, href: '#' }, { icon: Mail, href: '#' } ].map((item, index) => (
    <a key={index} href={item.href} className="w-10 h-10 rounded-full bg-green-700 hover:bg-green-800 text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 hover:shadow-md">
      <item.icon className="w-5 h-5" />
    </a>
  ))}
</div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-[15px] relative inline-block group">
              ติดต่อเรา
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
            </h4>
            <ul className="space-y-4">
              {[ 
                { icon: Phone, text: '02-123-4567' }, 
                { icon: MessageCircle, text: '@pdabliss' }, 
                { icon: Mail, text: 'info@pdabliss.co.th' }, 
                { icon: Globe, text: 'www.pdabliss.co.th' } 
              ].map((item, index) => (
                <li key={index} className="flex items-center text-[13px] text-gray-600 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-green-50/80 group-hover:bg-green-100 flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110">
                    <item.icon className="w-4 h-4 text-green-700 group-hover:text-green-800" />
                  </div>
                  <span className="group-hover:text-green-800 transition-colors group-hover:translate-x-1 inline-block transform duration-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-[15px] relative inline-block group">
              ที่อยู่สำนักงาน
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
            </h4>
            <div className="flex items-start text-[13px] text-gray-600 mb-8 group hover:text-green-800 transition-colors cursor-default">
              <MapPin className="w-5 h-5 text-green-700 mr-3 flex-shrink-0 mt-0.5 group-hover:animate-bounce" />
              <span className="leading-relaxed">123/45 อาคารบลิส ทาวเวอร์ ชั้น 12 ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-4 text-[15px] relative inline-block group">
              เวลาทำการ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
            </h4>
            <div className="flex items-center text-[13px] text-gray-600 group hover:text-green-800 transition-colors cursor-default">
              <Clock className="w-5 h-5 text-green-700 mr-3 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span>จันทร์ - ศุกร์ 09:00 - 18:00 น.</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-[15px] relative inline-block group">
              สอบถามบริการ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" name="name" placeholder="ชื่อ-นามสกุล" required
                  value={formData.name} onChange={handleInputChange}
                  className="w-full text-[13px] border border-white/50 rounded-md px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80"
                />
                <input 
                  type="tel" name="phone" placeholder="เบอร์โทรศัพท์" required
                  value={formData.phone} onChange={handleInputChange}
                  className="w-full text-[13px] border border-white/50 rounded-md px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80"
                />
              </div>
              <input 
                type="email" name="email" placeholder="อีเมล" required
                value={formData.email} onChange={handleInputChange}
                className="w-full text-[13px] border border-white/50 rounded-md px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80"
              />
              <textarea 
                name="message" placeholder="รายละเอียดที่ต้องการสอบถาม" rows={2} required
                value={formData.message} onChange={handleInputChange}
                className="w-full text-[13px] border border-white/50 rounded-md px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80"
              ></textarea>
              <button 
                type="submit" 
                className="w-full bg-green-800 hover:bg-green-900 text-white text-[13px] font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 group"
              >
                ส่งข้อความ <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-gray-200/50 pt-6 mt-4 text-center">
          <p className="text-[11px] text-gray-500 hover:text-green-700 transition-colors duration-300 cursor-default">
            © {new Date().getFullYear()} PDA BLISS COMPANY LIMITED. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};