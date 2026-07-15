import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageCircle, Mail, Clock, MapPin, 
  Send, ChevronRight, Map, 
  Sparkles, ShieldCheck, HeartHandshake, Zap, Globe, Image as ImageIcon
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const ContactPage: React.FC = () => {
  useEffect(() => {
    logUserAction('VIEW_PAGE_CONTACT');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: '',
    message: '',
    consent: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('กรุณากดยอมรับเงื่อนไขการเก็บข้อมูลก่อนส่งข้อความครับ');
      return;
    }
    logUserAction('SUBMIT_CONTACT_FORM', formData);
    alert('ส่งข้อความสำเร็จ! ระบบได้บันทึก Log และเจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุดครับ');
    setFormData({ name: '', phone: '', email: '', topic: '', message: '', consent: false }); 
  };

  const servicesList = [
    'แจ้งเข้า - เปลี่ยนย้ายนายจ้าง', 'ขึ้นทะเบียนแรงงาน', 'รายงานตัว 90D', 
    'แจ้งออก - ของพนักงาน', 'ทำเล่ม CI, Passport, PJ', 'ต่อ มติ ต่างๆ'
  ];

  return (
    <div className="w-full pb-16 bg-[#f8fafc] font-sans relative overflow-hidden">
      
      {/* --- ฝัง Custom CSS สำหรับ Animations --- */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s linear infinite;
        }
      `}</style>

      {/* แสง Glow พื้นหลัง */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse pointer-events-none translate-x-1/4 -translate-y-1/4"></div>

      {/* 1. Header Section (ปรับให้กระชับขึ้น) */}
      <section className="relative bg-white pt-16 pb-12 px-6 border-b border-gray-100 shadow-sm z-10">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full mb-4 border border-green-200 shadow-sm hover:scale-105 transition-all duration-300 cursor-default">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-bold tracking-wide">เราพร้อมดูแลคุณในทุกช่องทาง</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-[1.2] text-gray-900 tracking-tight">
            ติดต่อเรา<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-800 animate-gradient-x drop-shadow-sm">
              PDA BLISS COMPANY LIMITED
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl leading-relaxed font-medium">
            สอบถามข้อมูล ขอใบเสนอราคา หรือปรึกษาเรื่องเอกสารแรงงาน 
            ทีมงานผู้เชี่ยวชาญของเราสแตนด์บายพร้อมให้คำแนะนำคุณ <span className="font-bold text-green-700">ปรึกษาฟรี ไม่มีค่าใช้จ่าย!</span>
          </p>

          {/* Contact Info Cards (บีบช่องว่างให้แน่นขึ้น gap-3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { icon: <Phone />, title: '02-123-4567', desc: 'โทรศัพท์ พร้อมให้บริการด่วน', highlight: true },
              { icon: <MessageCircle />, title: '@pdabliss', desc: 'LINE Official ตอบไวที่สุด', highlight: true },
              { icon: <Mail />, title: 'info@pdabliss.co.th', desc: 'อีเมล ตอบกลับใน 24 ชม.' },
              { icon: <Clock />, title: 'เวลาทำการ', desc: 'จันทร์ - ศุกร์ 08:30 - 17:30 น.' },
              { icon: <Globe />, title: 'ช่องทางออนไลน์', desc: 'ให้บริการทั่วประเทศไทย' }
            ].map((info, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 hover:-translate-y-1 hover:shadow-md hover:border-green-200 transition-all duration-300 group cursor-default">
                <div className={`p-2.5 rounded-lg flex-shrink-0 transition-colors duration-300 ${info.highlight ? 'bg-green-600 text-white shadow-sm' : 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white'}`}>
                  {React.cloneElement(info.icon as React.ReactElement, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h4 className={`font-black text-[13px] mb-0.5 transition-colors ${info.highlight ? 'text-green-800' : 'text-gray-900 group-hover:text-green-700'}`}>{info.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-tight font-medium">{info.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid (แบ่งเป็น 2 คอลัมน์หลัก ซ้าย 5 ส่วน / ขวา 7 ส่วน เพื่อลดช่องว่าง) */}
      <section className="py-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= ฝั่งซ้าย (ฟอร์ม + SLA) ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* ฟอร์มติดต่อ */}
            <div className="bg-white p-7 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:border-green-200 transition-colors duration-500">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-green-700"></div>
              
              <h3 className="text-xl font-black text-gray-900 mb-2">ฝากข้อความถึงเรา</h3>
              <p className="text-[12px] text-gray-500 mb-6 font-medium">กรอกข้อมูลเพื่อให้เจ้าหน้าที่ติดต่อกลับอย่างรวดเร็ว</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 mb-1 ml-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                     <input type="text" name="name" placeholder="คุณสมชาย..." required value={formData.name} onChange={handleInputChange} className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all hover:bg-white" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 mb-1 ml-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                     <input type="tel" name="phone" placeholder="08X-XXX-XXXX" required value={formData.phone} onChange={handleInputChange} className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all hover:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 ml-1">อีเมล (ถ้ามี)</label>
                  <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleInputChange} className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all hover:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 ml-1">หัวข้อที่ต้องการติดต่อ <span className="text-red-500">*</span></label>
                  <select name="topic" required value={formData.topic} onChange={handleInputChange} className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none text-gray-700 transition-all hover:bg-white cursor-pointer">
                    <option value="">-- เลือกบริการที่สนใจ --</option>
                    {servicesList.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    <option value="อื่นๆ">ปรึกษาเรื่องอื่นๆ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1 ml-1">รายละเอียดข้อความ <span className="text-red-500">*</span></label>
                  <textarea name="message" placeholder="ระบุความต้องการของคุณเพิ่มเติม..." rows={3} required value={formData.message} onChange={handleInputChange} className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none resize-none transition-all hover:bg-white"></textarea>
                </div>
                
                <label className="flex items-start gap-2 cursor-pointer p-2.5 bg-green-50/50 rounded-xl border border-green-100 hover:bg-green-50 transition-colors">
                  <input type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} className="mt-0.5 w-3.5 h-3.5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer" />
                  <span className="text-[10px] text-gray-600 font-medium leading-relaxed">ฉันยินยอมให้เก็บข้อมูลเพื่อติดต่อกลับและนำเสนอสิทธิประโยชน์ ตามนโยบาย PDPA</span>
                </label>
                
                <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center text-[14px] shadow-[0_5px_15px_rgba(22,163,74,0.25)] hover:shadow-[0_10px_25px_rgba(22,163,74,0.35)] hover:-translate-y-0.5 active:scale-95 group mt-2">
                  ส่งข้อมูล <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* SLA การันตี (เสริมความน่าเชื่อถือ) */}
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-3xl shadow-sm border border-green-100 hover:border-green-200 transition-colors">
               <h3 className="text-[14px] font-black text-green-900 mb-4 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-green-600 mr-2" /> มาตรฐานการบริการของเรา
               </h3>
               <div className="space-y-4">
                  <div className="flex items-start">
                     <div className="bg-white shadow-sm p-1.5 rounded-md mr-3 mt-0.5"><Zap className="w-4 h-4 text-green-600" /></div>
                     <div>
                        <h4 className="text-[12px] font-bold text-gray-900">ตอบกลับรวดเร็ว (Fast Response)</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium">เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมงทำการ</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>

          {/* ================= ฝั่งขวา (รูปภาพ + แผนที่ + แชท) ================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 📍 พื้นที่สำหรับใส่รูปภาพ (Image Banner) ช่วยลดช่องว่างด้านบน */}
            <div className="relative w-full h-[220px] md:h-[280px] bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 group">
              {/* เปลี่ยน src เป็นพาทรูปของคุณ เช่น /images/office.jpg */}
              <img 
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80" 
                alt="ออฟฟิศ PDA BLISS" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                 <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 text-white">
                    <ImageIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-white font-black text-lg drop-shadow-md">ทีมงาน PDA BLISS ยินดีให้บริการ</h3>
                    <p className="text-green-50 text-[12px] font-medium drop-shadow-sm">ดูแลเอกสารของคุณด้วยความเชี่ยวชาญและใส่ใจ</p>
                 </div>
              </div>
            </div>

            {/* Grid ย่อยด้านล่างรูปภาพ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              
              {/* ฝั่งซ้ายของ Grid ย่อย: โปรโมชั่นแชท + FAQ */}
              <div className="flex flex-col gap-6 h-full">
                {/* Promo Box: Chat & Call */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-[2rem] shadow-lg border border-gray-700 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                      <HeartHandshake className="w-32 h-32 text-white" />
                  </div>
                  <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/20 rounded-full border border-green-400/30 text-green-400 text-[10px] font-bold mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        ออนไลน์พร้อมให้คำปรึกษา
                      </div>
                      <h4 className="font-black text-white text-lg mb-1.5">ทักแชท หรือ โทรหาเรา</h4>
                      <p className="text-[11px] text-gray-400 mb-5 leading-relaxed">
                        ทีมแอดมินสแตนด์บายตอบทุกข้อสงสัย ฟรี! ไม่มีค่าใช้จ่าย
                      </p>
                      <div className="flex flex-col gap-2">
                        <button className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-2.5 rounded-xl text-[12px] transition-colors flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 mr-2" /> แชทผ่าน LINE
                        </button>
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2.5 rounded-xl text-[12px] transition-colors flex items-center justify-center">
                            <Phone className="w-4 h-4 mr-2" /> โทรหาเรา
                        </button>
                      </div>
                  </div>
                </div>

                {/* Quick FAQ Preview */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[15px] font-black text-gray-900">คำถามที่พบบ่อย</h3>
                    <a href="/process" className="text-[10px] font-bold text-green-700 hover:underline bg-green-50 px-2.5 py-1 rounded-full">ดูทั้งหมด</a>
                  </div>
                  <div className="space-y-2">
                    {[
                      'ใช้เอกสารอะไรบ้างในการรับบริการ?',
                      'ระยะเวลาดำเนินการนานแค่ไหน?',
                      'มีค่าบริการเพิ่มเติมจากที่แจ้งหรือไม่?'
                    ].map((q, i) => (
                      <div key={i} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl hover:bg-green-50 cursor-pointer transition-colors group">
                        <span className="text-[11px] font-bold text-gray-700 group-hover:text-green-800 flex items-center gap-2">
                          <span className="bg-gray-200 text-gray-500 group-hover:bg-green-600 group-hover:text-white transition-colors rounded-full w-4 h-4 flex items-center justify-center text-[9px]">?</span>
                          <span className="truncate">{q}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ฝั่งขวาของ Grid ย่อย: แผนที่ + บริการ */}
              <div className="flex flex-col gap-6 h-full">
                {/* Map & Address */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-black text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 text-green-600 mr-1.5" /> แผนที่สำนักงาน
                  </h3>
                  
                  <div className="w-full h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center border border-gray-200 relative overflow-hidden group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" alt="Map" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg relative z-10 animate-bounce">
                          <MapPin className="w-5 h-5" />
                        </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50/50 p-3 rounded-xl border border-green-100 mb-3 flex-1">
                    <p className="text-[12px] font-black text-gray-900 mb-0.5">PDA BLISS CO., LTD.</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed font-medium">123/45 อาคารบลิส ทาวเวอร์ ชั้น 12 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ 10110</p>
                  </div>

                  <a href="#" className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all hover:border-green-600 hover:text-green-700 flex items-center justify-center text-[11px] group/btn">
                    เปิดแผนที่บน Google Maps <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-1 transition-transform"/>
                  </a>
                </div>

                {/* Mini Services List */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <h3 className="text-[14px] font-black text-gray-900 mb-3">บริการหลักของเรา</h3>
                  <div className="flex flex-wrap gap-2">
                    {servicesList.slice(0, 4).map((service, i) => (
                      <span key={i} className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors cursor-default">
                        {service}
                      </span>
                    ))}
                    <a href="/services" className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-colors">
                      + ดูทั้งหมด
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};