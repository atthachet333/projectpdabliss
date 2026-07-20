import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, CalendarDays, 
  LogOut, BookOpen, FileCheck,
  CheckCircle2, Clock, UserCheck, Zap, ShieldCheck, Heart, Send, Sparkles, ChevronRight
} from 'lucide-react';
import { logUserAction } from '../utils/logger';
import { trackEvent, trackFormEvent } from '../utils/analytics';
import { API_BASE_URL } from '../config/api';

const contactApiUrl = `${API_BASE_URL}/api/contact`;

export const ServicesPage: React.FC = () => {
  useEffect(() => {
    logUserAction('VIEW_PAGE_SERVICES');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    trackFormEvent('contact_form_start', 'services_page_form');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');
    trackFormEvent('contact_form_submit', 'services_page_form');
    setIsSubmitting(true);
    try {
      const response = await fetch(contactApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, pageUrl: window.location.href }),
      });
      if (!response.ok) throw new Error('Contact request failed');
      trackFormEvent('contact_form_success', 'services_page_form', 'success');
      logUserAction('SUBMIT_SERVICE_FORM', { page: 'services' });
      setSubmitMessage('ส่งข้อความเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด');
      setFormData({ name: '', phone: '', email: '', service: '', details: '' });
    } catch {
      trackFormEvent('contact_form_error', 'services_page_form', 'error');
      setSubmitMessage('ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    { id: '01', title: 'แจ้งเข้า - เปลี่ยนย้ายนายจ้าง', desc: 'ดำเนินการแจ้งรับคนต่างด้าวเข้าทำงาน และเปลี่ยนย้ายนายจ้างอย่างถูกต้อง', icon: <Users /> },
    { id: '02', title: 'ขึ้นทะเบียนพนักงาน', desc: 'ดำเนินการขึ้นทะเบียนพนักงาน ตามกฎหมายอย่างครบถ้วน', icon: <FileText /> },
    { id: '03', title: 'รายงานตัว 90D', desc: 'ดำเนินการรายงานตัว 90 วัน ให้ถูกต้องตรงเวลา', icon: <CalendarDays /> },
    { id: '04', title: 'แจ้งออก - ของพนักงาน', desc: 'ดำเนินการแจ้งออกเมื่อพนักงานสิ้นสุดสัญญาหรือออกจากงาน', icon: <LogOut /> },
    { id: '05', title: 'ทำเล่ม CI, Passport, PJ', desc: 'ดำเนินการจัดทำเอกสาร CI, Passport, PJ สำหรับคนต่างด้าว', icon: <BookOpen /> },
    { id: '06', title: 'ต่อ มติ ต่างๆ', desc: 'ดำเนินการต่ออายุขอมติและเอกสารต่างๆ ให้ครบถ้วน ถูกต้อง', icon: <FileCheck /> },
  ];

  return (
    <div className="w-full pb-20 relative bg-slate-50/30">
      
      {/* 1. Hero Section - ปรับ Layout ใหม่ให้ดูพรีเมียมและมีมิติ */}
      <section className="relative bg-transparent pt-16 sm:pt-20 pb-14 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* แสง Glow พื้นหลัง */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-green-400/15 blur-[120px] rounded-[100%] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center animate-fadeInUp">
          
          {/* Badge ลูกเล่นน่ารักๆ */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-100 text-green-800 text-sm font-bold mb-8 shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300 cursor-default group">
            <Sparkles className="w-4 h-4 text-green-500 group-hover:text-green-600 group-hover:animate-spin" />
            <span>บริการเอกสารแบบ One-Stop Service</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-950 via-green-900 to-green-600 drop-shadow-sm pb-2">
            บริการเอกสาร
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-relaxed">
            รวดเร็ว ถูกต้อง เชื่อถือได้ <span className="text-green-600 relative inline-block">ดูแลครบ จบทุกขั้นตอน<span className="absolute -bottom-2 left-0 w-full h-1 bg-green-200 rounded-full opacity-50"></span></span>
          </h2>
          <p className="text-gray-600 max-w-2xl leading-relaxed font-medium text-[15px] md:text-lg">
            ทีมงานมืออาชีพ พร้อมดูแลเอกสารของคุณอย่างถูกต้องตามกฎหมาย 
            ประหยัดเวลา ลดความกังวล ให้เราดูแลทุกขั้นตอนแทนคุณ
          </p>
        </div>
      </section>

      {/* 2. Services Grid - เพิ่มลูกเล่น Card Hover */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div 
                key={service.id} 
                className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-green-300 hover:shadow-[0_15px_40px_rgba(34,197,94,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer group overflow-hidden flex flex-col"
                data-analytics-id={`service_${service.id}`}
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => trackEvent('service_click', `service_${service.id}`, { metadata: { serviceKey: service.id } })}
              >
                {/* ลายน้ำตัวเลขพื้นหลัง */}
                <div className="absolute -bottom-4 -right-2 text-9xl font-black text-gray-50 group-hover:text-green-50 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 pointer-events-none z-0">
                  {service.id}
                </div>

                <div className="relative z-10 flex-1">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-500 group-hover:-rotate-6 group-hover:shadow-lg">
                     {React.cloneElement(service.icon, { className: 'w-7 h-7 text-green-700 group-hover:text-white transition-colors duration-500' })}
                  </div>
                  <h4 className="font-bold text-gray-950 text-base sm:text-lg mb-3 group-hover:text-green-800 transition-colors flex items-center justify-between gap-3">
                    {service.title}
                    <ChevronRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-green-600" />
                  </h4>
                  <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Info & Form Section */}
      <section className="pb-16 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,1.8fr] gap-8 xl:items-start">
            
            {/* ฝั่งซ้าย */}
            <div className="space-y-8 xl:sticky xl:top-28">
              {/* 3.1 เอกสารที่ต้องเตรียม */}
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-green-200 transition-colors duration-300">
                <h4 className="font-bold text-gray-950 mb-6 text-[18px] flex items-center tracking-tight">
                  <div className="w-2 h-6 bg-green-500 rounded-full mr-3 shadow-sm"></div>เอกสารที่ลูกค้าต้องเตรียม
                </h4>
                <ul className="space-y-4">
                  {['สำเนาหนังสือเดินทาง (Passport)', 'สำเนาใบอนุญาตทำงาน (Work Permit)', 'สำเนาบัตรประจำตัวคนต่างด้าว (CI)', 'สำเนาทะเบียนบ้าน', 'หนังสือรับรองบริษัท / หนังสือรับรองนิติบุคคล', 'เอกสารอื่นๆ (ตามประเภทบริการ)'].map((doc, idx) => (
                    <li key={idx} className="flex items-start text-[14px] text-gray-700 font-medium group cursor-default">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                      <span className="group-hover:text-gray-950 transition-colors">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3.2 ทำไมต้องเลือกเรา */}
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-green-200 transition-colors duration-300">
                <h4 className="font-bold text-gray-950 mb-6 text-[18px] flex items-center tracking-tight">
                  <div className="w-2 h-6 bg-green-500 rounded-full mr-3 shadow-sm"></div>ทำไมต้องเลือก PDA BLISS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  {[
                    { icon: <UserCheck />, title: 'เชี่ยวชาญ', desc: 'ทีมงานมืออาชีพ ประสบการณ์สูง' },
                    { icon: <Zap />, title: 'รวดเร็ว', desc: 'ดำเนินการไว ลดระยะเวลารอคอย' },
                    { icon: <ShieldCheck />, title: 'ถูกต้อง', desc: 'เอกสารถูกต้องตามกฎหมาย 100%' },
                    { icon: <Heart />, title: 'ไว้วางใจได้', desc: 'บริการด้วยความซื่อสัตย์ โปร่งใส' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group cursor-default">
                      <div className="text-green-600 bg-green-50 p-3.5 rounded-2xl group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 group-hover:rotate-6">
                        {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-950 text-[14px] mb-1 group-hover:text-green-700 transition-colors">{item.title}</h5>
                        <p className="text-[12px] text-gray-500 font-medium leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ฝั่งขวา */}
            <div className="space-y-8">
              {/* 3.3 ระยะเวลาดำเนินงาน */}
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-green-200 transition-colors duration-300 flex flex-col md:flex-row gap-8 md:gap-10 items-center">
                <div className="flex-1 space-y-7 w-full">
                  <h4 className="font-bold text-gray-950 mb-4 text-[18px] flex items-center tracking-tight">
                    <div className="w-2 h-6 bg-green-500 rounded-full mr-3 shadow-sm"></div>ระยะเวลาโดยประมาณ
                  </h4>
                  {[
                    { title: '7-15 วันทำการ', desc: 'บริการขึ้นทะเบียนพนักงาน' },
                    { title: '3-7 วันทำการ', desc: 'รายงานตัว 90D / แจ้งเข้า - แจ้งออก' },
                    { title: '15-30 วันทำการ', desc: 'ทำเล่ม CI, Passport, PJ' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 group border-b border-gray-100 pb-5 last:border-0 last:pb-0 cursor-default">
                      <div className="bg-white p-3 rounded-full text-green-600 shadow-md border border-gray-50 group-hover:bg-green-600 group-hover:text-white group-hover:-rotate-12 group-hover:scale-110 transition-all duration-300">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-[15px] group-hover:text-green-700 transition-colors">{item.title}</h5>
                        <p className="text-[13px] text-gray-500 mt-0.5 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* รูปภาพประกอบ */}
                <div className="relative w-full md:w-[320px] h-64 sm:h-[320px] rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
                  <img 
                    src="/images/ser.png" 
                    alt="ขั้นตอนการทำงาน" 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 to-transparent mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* 3.4 Contact Form */}
              <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(34,197,94,0.08)] border border-green-200 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 p-4 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12">
                  <Send className="w-64 h-64 text-green-900" />
                </div>
                
                <div className="relative z-10">
                  <h4 className="font-bold text-gray-950 mb-2 text-[20px] sm:text-[22px] tracking-tight flex flex-wrap items-center gap-2">
                     สอบถามหรือใช้บริการ
                     <span className="text-[12px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full border border-green-200">ปรึกษาฟรี</span>
                  </h4>
                  <p className="text-[14px] text-gray-500 font-medium mb-8">ให้เราเป็นผู้ช่วยดูแลเอกสารของคุณ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-2 ml-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full text-[14px] placeholder:text-gray-400 text-gray-900 border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none bg-gray-50/50 transition-all hover:bg-white" placeholder="กรอกชื่อของคุณ" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-2 ml-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full text-[14px] placeholder:text-gray-400 text-gray-900 border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none bg-gray-50/50 transition-all hover:bg-white" placeholder="08X-XXX-XXXX" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-2 ml-1">อีเมล</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full text-[14px] placeholder:text-gray-400 text-gray-900 border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none bg-gray-50/50 transition-all hover:bg-white" placeholder="example@email.com" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-2 ml-1">บริการที่ต้องการ</label>
                      <div className="relative">
                        <select name="service" value={formData.service} onChange={handleInputChange} className="w-full text-[14px] text-gray-700 border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none bg-gray-50/50 transition-all hover:bg-white appearance-none cursor-pointer">
                          <option value="">-- กรุณาเลือกบริการ --</option>
                          {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                        </select>
                        <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-2 ml-1">รายละเอียดเพิ่มเติม</label>
                      <textarea name="details" rows={3} value={formData.details} onChange={handleInputChange} className="w-full text-[14px] placeholder:text-gray-400 text-gray-900 border border-gray-200 rounded-2xl px-5 py-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none resize-none bg-gray-50/50 transition-all hover:bg-white" placeholder="ระบุความต้องการของคุณเพิ่มเติม..."></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} data-analytics-id="services_page_form_submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 flex min-h-14 items-center justify-center text-[15px] shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:shadow-[0_15px_30px_rgba(22,163,74,0.35)] hover:-translate-y-1 active:scale-95 group mt-4">
                      {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อมูลเพื่อรับคำปรึกษา'} <Send className="w-5 h-5 ml-2.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    {submitMessage && <p className="text-[12px] text-gray-500 font-medium">{submitMessage}</p>}
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
