import React, { useState } from 'react';
import { 
  Phone, MessageCircle, Mail, MapPin, 
  Send, ChevronRight, FileText, Clock, Sparkles
} from 'lucide-react';
import { logUserAction } from '../utils/logger';
import { trackEvent, trackFormEvent } from '../utils/analytics';
import { API_BASE_URL } from '../config/api';

const contactApiUrl = `${API_BASE_URL}/api/contact`;

export const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    trackFormEvent('contact_form_start', 'footer_urgent_contact');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');
    trackFormEvent('contact_form_submit', 'footer_urgent_contact');
    setIsSubmitting(true);
    try {
      const response = await fetch(contactApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: 'ฝากข้อความด่วน', pageUrl: window.location.href }),
      });
      if (!response.ok) throw new Error('Contact request failed');
      trackFormEvent('contact_form_success', 'footer_urgent_contact', 'success');
      logUserAction('SUBMIT_FOOTER_FORM', { location: 'Footer' });
      setSubmitMessage('ส่งข้อความเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด');
      setFormData({ name: '', phone: '', message: '' });
    } catch (err) {
      trackFormEvent('contact_form_error', 'footer_urgent_contact', 'error');
      console.error(err);
      setSubmitMessage('ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const servicesList = [
    'แจ้งเข้า - เปลี่ยนย้ายนายจ้าง',
    'ขึ้นทะเบียนแรงงาน',
    'รายงานตัว 90D',
    'แจ้งออก - ของพนักงาน',
    'ทำเล่ม CI, Passport, PJ',
    'ต่อ มติ ต่างๆ'
  ];

  return (
    // ดีไซน์โปร่งแสงสไตล์ Glassmorphism คุมโทนสีเขียวพรีเมียม สวยงามและมีชีวิตชีวา
    <footer className="relative bg-white/70 backdrop-blur-xl border-t border-white/60 pt-16 pb-8 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      
      {/* แสง Glow พื้นหลังตกแต่งความสวยงามใต้กระจกขุ่น */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[80px] pointer-events-none translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* ================= คอลัมน์ 1: ข้อมูลแบรนด์ ชื่อเต็มบริษัท & LINE ช่องทางหลัก ================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
              {/* ตรงนี้คือจุดที่ควรใส่โลโก้ครับ */}
                <img 
                  src="/images/logo.png" 
                  alt="PDA BLISS Logo" 
                  className="h-16 w-auto object-contain" 
                  />
                </div>
              {/* ปรับเป็นชื่อเต็มบริษัทตามที่ขอครับ */}
              <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight block">
                PDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">BLISS COMPANY LIMITED</span>
              </span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium pr-4">
              ผู้เชี่ยวชาญด้านการจัดทำเอกสารแรงงานและธุรกิจแบบครบวงจร บริการรวดเร็ว โปร่งใส ตรวจสอบได้ ให้คุณมั่นใจและถูกต้องตามกฎหมาย 100%
            </p>
            
            {/* ปุ่ม LINE ช่องทางติดต่อหลักพร้อม Hover Animation เด้งนุ่มๆ */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://line.me/R/ti/p/@593oiwec" target="_blank" rel="noopener noreferrer" data-analytics-id="line_official_contact" onClick={() => trackEvent('line_click', 'line_official_contact', { metadata: { linkType: 'line' } })} className="flex cursor-pointer items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-gray-100 text-[#06C755] font-bold text-sm hover:bg-[#06C755] hover:text-white hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(6,199,85,0.25)] transition-all duration-300 group shadow-sm">
                <MessageCircle className="w-4 h-4 fill-current text-[#06C755] group-hover:text-white transition-colors" />
                <span>ติดต่อผ่าน LINE Official</span>
              </a>
            </div>
          </div>

          {/* ================= คอลัมน์ 2: รายการบริการเอกสารของเรา ================= */}
          <div className="lg:col-span-3">
            <h4 className="text-[15px] font-black text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" /> บริการเอกสารของเรา
            </h4>
            <ul className="space-y-3.5">
              {servicesList.map((service, idx) => (
                <li key={idx}>
                  <a href="/services" className="flex items-center text-[13px] text-gray-600 hover:text-green-700 font-medium transition-colors group">
                    <ChevronRight className="w-4 h-4 mr-2 text-green-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= คอลัมน์ 3: ข้อมูลการติดต่อ & เวลาทำการ (เน้นเด่น + เพิ่มลูกเล่นขยับ) ================= */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-[15px] font-black text-gray-900 mb-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" /> ข้อมูลติดต่อ
              </h4>
              <ul className="space-y-3.5">
                <li>
                  {/* เพิ่มลูกเล่น Hover ขยับยกลอย และเปลี่ยนสีไอคอนอย่างนุ่มนวล */}
                  <a href="tel:021234567" className="flex items-center gap-3 text-gray-600 hover:text-green-700 hover:translate-x-1 transition-all duration-300 group">
                    <div className="p-2 bg-white/80 border border-gray-100 rounded-lg shadow-sm group-hover:bg-green-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                      <Phone className="w-3.5 h-3.5 text-green-600 group-hover:text-white" />
                    </div>
                    <span className="text-[13px] font-black tracking-tight">02-123-4567</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-700 hover:translate-x-1 transition-all duration-300 group">
                    <div className="p-2 bg-white/80 border border-gray-100 rounded-lg shadow-sm group-hover:bg-[#06C755] group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                      <MessageCircle className="w-3.5 h-3.5 text-[#06C755] group-hover:text-white fill-current" />
                    </div>
                    <span className="text-[13px] font-black tracking-tight">@pdabliss</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@pdabliss.co.th" className="flex items-center gap-3 text-gray-600 hover:text-green-700 hover:translate-x-1 transition-all duration-300 group">
                    <div className="p-2 bg-white/80 border border-gray-100 rounded-lg shadow-sm group-hover:bg-green-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                      <Mail className="w-3.5 h-3.5 text-green-600 group-hover:text-white" />
                    </div>
                    <span className="text-[13px] font-black tracking-tight">info@pdabliss.co.th</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* ส่วนแสดงเวลาทำการสำนักงานเด่นชัดขึ้น พร้อมลูกเล่นกล่องขยับและเงาเรืองแสง */}
            <div className="pt-4 border-t border-gray-200/60 bg-white/40 border border-white/50 p-4 rounded-2xl shadow-sm hover:shadow-[0_8px_25px_rgba(34,197,94,0.15)] hover:border-green-300 hover:-translate-y-1 transition-all duration-500 cursor-default group/time">
              <h4 className="text-[13px] font-black mb-2.5 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-600">
                <Clock className="w-4 h-4 text-green-600 group-hover/time:rotate-12 transition-transform duration-300" /> เวลาทำการสำนักงาน
              </h4>
              <p className="text-[13px] text-gray-900 font-black tracking-tight">จันทร์ - ศุกร์ : 08:30 - 17:30 น.</p>
              <p className="text-[11px] text-gray-500 mt-1 font-semibold leading-relaxed">หยุดวันเสาร์ - อาทิตย์ และวันหยุดราชการ</p>
            </div>
          </div>

          {/* ================= คอลัมน์ 4: ฟอร์มติดต่อด่วนใสกระจก ================= */}
          <div className="lg:col-span-3">
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-500">
              <h4 className="text-[13px] font-black text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" /> ฝากข้อความด่วน
              </h4>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input 
                  type="text" name="name" placeholder="ชื่อ-นามสกุล" required
                  value={formData.name} onChange={handleInputChange}
                  className="w-full text-[12px] bg-white/70 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-500/10 transition-all placeholder:text-gray-400"
                />
                <input 
                  type="tel" name="phone" placeholder="เบอร์ติดต่อ" required
                  value={formData.phone} onChange={handleInputChange}
                  className="w-full text-[12px] bg-white/70 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-500/10 transition-all placeholder:text-gray-400"
                />
                <textarea 
                  name="message" placeholder="ข้อความที่ต้องการสอบถาม..." rows={2} required
                  value={formData.message} onChange={handleInputChange}
                  className="w-full text-[12px] bg-white/70 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-500/10 resize-none transition-all placeholder:text-gray-400"
                ></textarea>
                <button type="submit" disabled={isSubmitting} data-analytics-id="footer_urgent_contact_submit" className="w-full bg-green-700 hover:bg-green-800 text-white text-[13px] font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md active:scale-95 group">
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'} <Send className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                {submitMessage && <p className="text-[11px] text-gray-500 font-medium">{submitMessage}</p>}
              </form>
            </div>
          </div>

        </div>

        {/* ================= Copyright ด้านล่างสุด ================= */}
        <div className="border-t border-gray-200/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-500 font-medium">
            © {new Date().getFullYear()} PDA BLISS COMPANY LIMITED. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="#" className="text-[12px] text-gray-400 hover:text-green-600 font-bold transition-colors">Privacy Policy</a>
            <a href="#" className="text-[12px] text-gray-400 hover:text-green-600 font-bold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
