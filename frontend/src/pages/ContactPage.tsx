import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageCircle, Mail, Clock, MapPin, 
  Send, Sparkles, ShieldCheck, HeartHandshake, Zap, Globe, ArrowRight, CheckCircle2, Image as ImageIcon, Lock, Award, Star
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
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans pb-24 relative overflow-hidden">
      
      {/* --- ฝัง Custom CSS สำหรับลูกเล่นแอนิเมชันให้เว็บมีชีวิต --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate ease-in-out;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer::after {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 3s infinite;
          content: '';
        }
        @keyframes contact-wiggle {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        .animate-wiggle {
          animation: contact-wiggle 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* แสง Glow เคลื่อนไหวจางๆ ที่พื้นหลัง */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-300/10 rounded-full filter blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/10 rounded-full filter blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* 1. Hero Title Header */}
      <section className="relative bg-white pt-24 pb-20 px-6 border-b border-gray-100 shadow-sm z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-800 text-sm font-bold mb-6 shadow-sm cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>เจ้าหน้าที่พร้อมให้บริการ | ตอบกลับรวดเร็วทันใจภายในเวลาทำการ</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            ติดต่อเราเพื่อรับ <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">คำปรึกษาฟรี</span>
          </h1>
          <p className="text-gray-600 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
            สอบถามข้อมูล ขอใบเสนอราคา หรือปรึกษาเรื่องเอกสารแรงงานต่างด้าว 
            ทีมงานผู้เชี่ยวชาญของ <span className="text-green-700 font-bold">PDA BLISS</span> ยินดีดูแลคุณอย่างใกล้ชิด
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Content Layout */}
      <section className="max-w-7xl mx-auto px-6 relative z-20 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ================= ฝั่งซ้าย (ฟอร์ม + Trust Section จัดเต็มเพื่อไม่ให้ว่าง) กว้าง 5 ส่วน ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 📝 ฟอร์มติดต่อ */}
            <div className="bg-white p-7 md:p-9 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:border-green-200 transition-colors duration-500">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-green-700"></div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-2">ฝากข้อความถึงเรา</h3>
              <p className="text-[12px] text-gray-500 mb-7 font-medium">กรอกข้อมูลเพื่อให้เจ้าหน้าที่ติดต่อกลับอย่างรวดเร็ว</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                     <input type="text" name="name" placeholder="คุณสมชาย..." required value={formData.name} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all hover:bg-white" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                     <input type="tel" name="phone" placeholder="08X-XXX-XXXX" required value={formData.phone} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all hover:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">อีเมล (ถ้ามี)</label>
                  <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all hover:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">หัวข้อที่ต้องการติดต่อ <span className="text-red-500">*</span></label>
                  <select name="topic" required value={formData.topic} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none text-gray-700 transition-all hover:bg-white cursor-pointer">
                    <option value="">-- เลือกบริการที่สนใจ --</option>
                    {servicesList.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    <option value="อื่นๆ">ปรึกษาเรื่องอื่นๆ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">รายละเอียดข้อความ <span className="text-red-500">*</span></label>
                  <textarea name="message" placeholder="ระบุความต้องการของคุณเพิ่มเติม..." rows={3} required value={formData.message} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none resize-none transition-all hover:bg-white"></textarea>
                </div>
                
                <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-green-50/60 rounded-xl border border-green-100 hover:bg-green-50 transition-colors">
                  <input type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} className="mt-0.5 w-3.5 h-3.5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer" />
                  <span className="text-[11px] text-gray-600 font-medium leading-relaxed">ฉันยินยอมให้เก็บข้อมูลเพื่อติดต่อกลับและนำเสนอสิทธิประโยชน์ ตามนโยบายการรักษาข้อมูล <span className="text-green-700 font-bold">(PDPA)</span></span>
                </label>
                
                <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center text-[15px] shadow-[0_5px_15px_rgba(22,163,74,0.25)] hover:shadow-[0_10px_25px_rgba(22,163,74,0.35)] hover:-translate-y-0.5 active:scale-95 group mt-2 animate-shimmer">
                  ส่งข้อมูล <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* 🛡️ Trust & Credibility Section (กล่องการันตีและ Social Proof) */}
            <div className="bg-white p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group/trust">
               <div className="absolute -right-8 -top-8 text-green-50 opacity-60 group-hover/trust:scale-110 group-hover/trust:rotate-12 transition-transform duration-700 pointer-events-none">
                  <ShieldCheck className="w-40 h-40" />
               </div>

               <div>
                  <h3 className="text-[16px] font-black text-gray-900 mb-5 flex items-center gap-2 relative z-10">
                     <ShieldCheck className="w-5 h-5 text-green-600" /> ทำไมลูกค้าถึงไว้วางใจเรา
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                     {[
                        { icon: <Zap />, title: 'SLA การันตีเวลา', desc: 'ตอบกลับทันทีใน 15 นาที' },
                        { icon: <CheckCircle2 />, title: 'ถูกต้อง 100%', desc: 'เอกสารผ่านฉลุย ไม่ตีกลับ' },
                        { icon: <Lock />, title: 'PDPA Compliant', desc: 'ข้อมูลลับปลอดภัยสูงสุด' },
                        { icon: <Award />, title: 'ทีมงานมืออาชีพ', desc: 'ประสบการณ์ตรง 10+ ปี' },
                     ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-green-50/80 border border-transparent hover:border-green-100 transition-all duration-300 group/item cursor-default">
                           <div className="p-2 bg-gray-50 text-gray-400 rounded-xl group-hover/item:bg-green-600 group-hover/item:text-white group-hover/item:shadow-md group-hover/item:-rotate-6 transition-all duration-300">
                              {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
                           </div>
                           <div>
                              <h4 className="text-[12px] font-bold text-gray-900 group-hover/item:text-green-800 transition-colors">{item.title}</h4>
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* แถบ Social Proof */}
               <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between relative z-10">
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                     ))}
                     <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-[10px] font-black text-green-700 z-10">+2k</div>
                  </div>
                  <div className="text-right">
                     <p className="text-[12px] font-black text-gray-800">ลูกค้าองค์กรไว้วางใจ</p>
                     <p className="text-[10px] text-gray-500 font-medium">บอกต่อและใช้บริการซ้ำกว่า 98%</p>
                  </div>
               </div>
            </div>

            {/* ✨ เพิ่มใหม่: กล่อง "หลังจากส่งข้อความ จะเกิดอะไรขึ้น?" (ลดช่องว่างฝั่งซ้ายได้สมบูรณ์แบบ) */}
            <div className="bg-gradient-to-br from-gray-900 to-green-950 p-7 rounded-[2rem] shadow-xl border border-gray-800 relative overflow-hidden group/steps">
               <div className="absolute right-0 top-0 opacity-5 pointer-events-none group-hover/steps:scale-110 group-hover/steps:rotate-12 transition-transform duration-700">
                  <Clock className="w-48 h-48 text-white" />
               </div>

               <h3 className="text-[16px] font-black text-white mb-6 flex items-center gap-2 relative z-10">
                  <Clock className="w-5 h-5 text-green-400" /> หลังจากส่งข้อความ จะเกิดอะไรขึ้น?
               </h3>

               <div className="space-y-5 relative z-10">
                  {[
                     { step: '01', title: 'รับเรื่องทันที', desc: 'ระบบแจ้งเตือนทีมงานผู้เชี่ยวชาญแบบ Real-time' },
                     { step: '02', title: 'ประเมินฟรี', desc: 'ทีมงานวิเคราะห์ข้อมูลและตรวจสอบเอกสารเบื้องต้น' },
                     { step: '03', title: 'ติดต่อกลับ', desc: 'ให้คำปรึกษาพร้อมเสนอแนวทางที่ประหยัดเวลาที่สุด' },
                  ].map((item, idx) => (
                     <div key={idx} className="flex items-start gap-4 group/step cursor-default">
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-green-300 flex items-center justify-center text-xs font-black shrink-0 group-hover/step:bg-green-500 group-hover/step:text-white group-hover/step:border-green-400 group-hover/step:scale-110 transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0)] group-hover/step:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                           {item.step}
                        </div>
                        <div>
                           <h4 className="text-[13px] font-bold text-green-50 group-hover/step:text-white transition-colors">{item.title}</h4>
                           <p className="text-[11px] text-green-100/60 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* ✨ เพิ่มใหม่: กล่อง "เสียงจากลูกค้า" (Review Box) */}
            <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-green-200 transition-colors duration-500">
               <div className="flex items-center gap-1 mb-3 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
               </div>
               <p className="text-[12px] text-gray-600 italic leading-relaxed mb-4">"ทีมงานดูแลดีมากค่ะ แนะนำละเอียด จัดการเอกสารให้ครบถ้วน ไม่ต้องปวดหัววิ่งเต้นเองเลย รวดเร็วทันใจ ประทับใจมากค่ะ"</p>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-xs shadow-sm">ก.</div>
                  <div>
                     <h4 className="text-[11px] font-bold text-gray-900">คุณ กนกวรรณ (HR Manager)</h4>
                     <p className="text-[10px] text-gray-500">ลูกค้าใช้บริการแจ้งเข้า-ออกแรงงาน</p>
                  </div>
               </div>
            </div>

          </div>

          {/* ================= ฝั่งขวา (รูปภาพ + แผนที่ + แชท) กว้าง 7 ส่วน ================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 📍 แผนที่สำนักงานใหญ่ */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-gray-100 group/map flex flex-col hover:border-green-200 hover:shadow-[0_15px_40px_rgba(34,197,94,0.06)] transition-all duration-500">
               <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
                  <MapPin className="w-6 h-6 text-green-600" /> แผนที่ตั้งสำนักงานใหญ่
               </h3>
               
               <div className="w-full h-56 md:h-64 bg-gray-100 rounded-2xl mb-5 flex items-center justify-center border border-gray-200 relative overflow-hidden cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map Location" className="w-full h-full object-cover opacity-70 group-hover/map:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-green-900/5 group-hover/map:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                     <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-xl relative z-10 animate-bounce">
                        <MapPin className="w-6 h-6" />
                     </div>
                  </div>
               </div>
               
               <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/70 mb-4 flex-1">
                  <p className="text-sm font-black text-green-900 mb-1">PDA BLISS COMPANY LIMITED</p>
                  <p className="text-[13px] text-gray-600 leading-relaxed font-semibold">
                     อาคารบลิส ทาวเวอร์ ชั้น 12 ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร 10110
                  </p>
               </div>
               
               <a href="#" className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all hover:border-green-600 hover:text-green-700 flex items-center justify-center text-xs group/btn shadow-sm">
                  เปิดนำทางด้วย Google Maps <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
               </a>
            </div>

            {/* 📸 กล่องใส่รูปภาพประกอบ (ดุ๊กดิ๊ก) */}
            <div className="relative w-full h-[20rem] bg-gray-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-200 group">
              <img 
                src="/images/contact.png" 
                alt="ทีมงานบริการลูกค้า" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 animate-wiggle" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-green-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                 <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white">
                    <ImageIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-white font-black text-lg drop-shadow-md">ทีมงานผู้เชี่ยวชาญพร้อมดูแล</h4>
                    <p className="text-green-200 text-[13px] font-medium drop-shadow-sm">ดูแลสิทธิประโยชน์และเอกสารของคุณอย่างถูกต้องตามกฎหมาย</p>
                 </div>
              </div>
            </div>

            {/* ช่องทางติดต่อด่วนและเวลาทำการ */}
            <div className="bg-white p-6 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 space-y-3.5">
               <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-green-50/50 border border-transparent hover:border-green-100/50 transition-all duration-300 group cursor-default">
                  <div className="p-3 bg-green-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform"><Phone className="w-5 h-5" /></div>
                  <div>
                     <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">สายด่วนโทรศัพท์</h4>
                     <p className="text-base font-black text-gray-900 mt-0.5">02-123-4567</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-green-50/50 border border-transparent hover:border-green-100/50 transition-all duration-300 group cursor-default">
                  <div className="p-3 bg-[#06C755] text-white rounded-xl shadow-md group-hover:scale-105 transition-transform"><MessageCircle className="w-5 h-5 fill-current" /></div>
                  <div>
                     <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">LINE Official</h4>
                     <p className="text-base font-black text-gray-900 mt-0.5">@pdabliss</p>
                  </div>
               </div>

               <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-green-50/50 border border-transparent hover:border-green-100/50 transition-all duration-300 group cursor-default">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors"><Clock className="w-5 h-5" /></div>
                  <div>
                     <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">เวลาทำการสำนักงาน</h4>
                     <p className="text-sm font-black text-gray-900 mt-0.5">จันทร์ - ศุกร์ | 08:30 - 17:30 น.</p>
                  </div>
               </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};