import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, CalendarDays, 
  LogOut, BookOpen, FileCheck,
  CheckCircle2, Clock, UserCheck, Zap, ShieldCheck, Heart, Send, PlusCircle
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logUserAction('SUBMIT_SERVICE_FORM', formData);
    alert('ระบบได้รับข้อมูลของคุณและบันทึก Log เรียบร้อยแล้วครับ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด');
    setFormData({ name: '', phone: '', email: '', service: '', details: '' }); 
  };

  const services = [
    { id: '01', title: 'แจ้งเข้า - เปลี่ยนย้ายนายจ้าง', desc: 'ดำเนินการแจ้งรับคนต่างด้าวเข้าทำงาน และเปลี่ยนย้ายนายจ้างอย่างถูกต้อง', icon: <Users className="w-8 h-8 text-green-700" /> },
    { id: '02', title: 'ขึ้นทะเบียนพนักงาน', desc: 'ดำเนินการขึ้นทะเบียนพนักงาน ตามกฎหมายอย่างครบถ้วน', icon: <FileText className="w-8 h-8 text-green-700" /> },
    { id: '03', title: 'รายงานตัว 90D', desc: 'ดำเนินการรายงานตัว 90 วัน ให้ถูกต้องตรงเวลา', icon: <CalendarDays className="w-8 h-8 text-green-700" /> },
    { id: '04', title: 'แจ้งออก - ของพนักงาน', desc: 'ดำเนินการแจ้งออกเมื่อพนักงานสิ้นสุดสัญญาหรือออกจากงาน', icon: <LogOut className="w-8 h-8 text-green-700" /> },
    { id: '05', title: 'ทำเล่ม CI, Passport, PJ', desc: 'ดำเนินการจัดทำเอกสาร CI, Passport, PJ สำหรับคนต่างด้าว', icon: <BookOpen className="w-8 h-8 text-green-700" /> },
    { id: '06', title: 'ต่อ มติ ต่างๆ', desc: 'ดำเนินการต่ออายุขอมติและเอกสารต่างๆ ให้ครบถ้วน ถูกต้อง', icon: <FileCheck className="w-8 h-8 text-green-700" /> },
  ];

  return (
    <div className="w-full pb-20 relative">
      
      {/* 1. Header Section */}
      {/* ถอด backdrop-blur ออก และใช้ bg-transparent เพื่อให้ใสทะลุ 100% */}
      <section className="bg-transparent pt-16 pb-12 px-6 border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto relative z-10 animate-fadeInDown">
          <div className="text-sm text-gray-800 mb-4 flex items-center gap-2">
            <span className="flex items-center text-green-900 font-bold"><CheckCircle2 className="w-4 h-4 mr-1"/> หน้าแรก</span> 
            <span className="text-gray-500">&gt;</span> 
            <span className="font-bold text-gray-950">บริการเอกสาร</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 mb-4 tracking-tight">บริการเอกสาร</h1>
          <h2 className="text-2xl font-bold text-green-800 mb-4">รวดเร็ว ถูกต้อง เชื่อถือได้ ดูแลครบ จบทุกขั้นตอน</h2>
          <p className="text-gray-900 max-w-2xl leading-relaxed font-semibold">
            ทีมงานมืออาชีพ พร้อมดูแลเอกสารของคุณอย่างถูกต้องตามกฎหมาย 
            ประหยัดเวลา ลดความกังวล ให้เราดูแลทุกขั้นตอนแทนคุณ
          </p>
        </div>
      </section>

      {/* 2. Services Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-950 mb-10 flex items-center animate-fadeIn">
            <div className="w-1.5 h-7 bg-green-600 rounded-full mr-3 shadow-[0_0_10px_rgba(22,163,74,0.5)]"></div>
            บริการของเรา <span className="text-green-800 ml-2">ครอบคลุม 6 บริการหลัก</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div 
                key={service.id} 
                /* ใช้ bg-transparent และเหลือแค่เส้นขอบบางๆ */
                className={`bg-transparent p-6 rounded-2xl shadow-sm border border-gray-300/40 hover:bg-white/10 hover:border-green-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex gap-4 animate-fadeInUp`}
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => logUserAction('CLICK_SERVICE_DETAIL', { serviceId: service.id, serviceName: service.title })}
              >
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                  {service.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-950 text-[15px] flex items-start gap-2 mb-1.5 group-hover:text-green-800 transition-colors">
                    <span className="text-green-700 font-black">{service.id}</span> {service.title}
                  </h4>
                  <p className="text-[12px] text-gray-800 leading-relaxed font-semibold">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Image Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-16 animate-fadeIn">
        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-300/30 group hover:shadow-2xl transition-all duration-500">
          <img 
            src="/images/service.png" 
            alt="พนักงานให้บริการ" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 transition-all group-hover:translate-x-2">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 shadow-sm drop-shadow-lg">ผู้ช่วยด้านเอกสารของคุณ</h3>
            <p className="text-white/90 text-sm md:text-base font-semibold drop-shadow-md">ให้บริการครบวงจร จบทุกขั้นตอนด้วยทีมงานมืออาชีพ</p>
          </div>
        </div>
      </section>

      {/* 4. Info & Form Section */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,1.8fr] gap-8 xl:items-start animate-fadeInUp">
            
            {/* ฝั่งซ้าย */}
            <div className="space-y-8 xl:sticky xl:top-28">
              {/* 4.1 เอกสารที่ต้องเตรียม */}
              <div className="bg-transparent p-8 rounded-3xl shadow-sm border border-gray-300/40 hover:border-green-400 hover:bg-white/5 transition-all">
                <h4 className="font-bold text-gray-950 mb-6 text-[16px] flex items-center tracking-tight">
                  <div className="w-2 h-6 bg-green-600 rounded-full mr-3 shadow-sm"></div>เอกสารที่ลูกค้าต้องเตรียม
                </h4>
                <ul className="space-y-4">
                  {['สำเนาหนังสือเดินทาง (Passport)', 'สำเนาใบอนุญาตทำงาน (Work Permit)', 'สำเนาบัตรประจำตัวคนต่างด้าว (CI)', 'สำเนาทะเบียนบ้าน', 'หนังสือรับรองบริษัท / หนังสือรับรองนิติบุคคล', 'เอกสารอื่นๆ (ตามประเภทบริการ)'].map((doc, idx) => (
                    <li key={idx} className="flex items-start text-[13px] text-gray-950 leading-snug font-semibold group cursor-default">
                      <CheckCircle2 className="w-5 h-5 text-green-700 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-green-900 transition-colors">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4.2 ทำไมต้องเลือกเรา */}
              <div className="bg-transparent p-8 rounded-3xl shadow-sm border border-gray-300/40 hover:border-green-400 hover:bg-white/5 transition-all">
                <h4 className="font-bold text-gray-950 mb-6 text-[16px] flex items-center tracking-tight">
                  <div className="w-2 h-6 bg-green-600 rounded-full mr-3 shadow-sm"></div>ทำไมต้องเลือก PDA BLISS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                  {[
                    { icon: <UserCheck />, title: 'เชี่ยวชาญ', desc: 'ทีมงานมืออาชีพ ประสบการณ์สูง' },
                    { icon: <Zap />, title: 'รวดเร็ว', desc: 'ดำเนินการไว ลดระยะเวลารอคอย' },
                    { icon: <ShieldCheck />, title: 'ถูกต้อง', desc: 'เอกสารถูกต้องตามกฎหมาย 100%' },
                    { icon: <Heart />, title: 'ไว้วางใจได้', desc: 'บริการด้วยความซื่อสัตย์ โปร่งใส' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="text-green-700 bg-white/30 p-3 rounded-full border border-gray-200/50 shadow-sm group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all">
                        {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5' })}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-950 text-[13px] group-hover:text-green-800 transition-colors">{item.title}</h5>
                        <p className="text-[11px] text-gray-800 mt-0.5 font-semibold leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ฝั่งขวา */}
            <div className="space-y-8">
              {/* 4.3 ระยะเวลาดำเนินงาน */}
              <div className="bg-transparent p-8 md:p-10 rounded-3xl shadow-sm border border-gray-300/40 hover:border-green-400 hover:bg-white/5 transition-all flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-7">
                  <h4 className="font-bold text-gray-950 mb-2 text-[16px] flex items-center tracking-tight">
                    <div className="w-2 h-6 bg-green-600 rounded-full mr-3 shadow-sm"></div>ระยะเวลาโดยประมาณ
                  </h4>
                  {[
                    { title: '7-15 วันทำการ', desc: 'บริการขึ้นทะเบียนพนักงาน' },
                    { title: '3-7 วันทำการ', desc: 'รายงานตัว 90D / แจ้งเข้า - แจ้งออก' },
                    { title: '15-30 วันทำการ', desc: 'ทำเล่ม CI, Passport, PJ' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 group border-b border-gray-300/30 pb-5 last:border-0 last:pb-0">
                      <div className="bg-white/30 p-3 rounded-full text-green-700 shadow-sm border border-gray-200/50 group-hover:bg-green-700 group-hover:text-white group-hover:rotate-12 transition-all"><Clock className="w-5 h-5" /></div>
                      <div>
                        <h5 className="font-bold text-gray-950 text-base group-hover:text-green-800 transition-colors">{item.title}</h5>
                        <p className="text-[12px] text-gray-800 mt-1 font-semibold whitespace-nowrap">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 📍 พิกัดสำหรับใส่รูปภาพที่ 2 */}
                <div className="relative w-full md:w-[280px] h-[280px] md:h-[300px] rounded-2xl overflow-hidden shadow-xl border border-gray-300/40 group hover:border-gray-400/60 transition-all">
                  <img 
                    src="/images/ser.png" 
                    alt="ขั้นตอนการทำงาน" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PlusCircle className="w-12 h-12 text-white/50 group-hover:scale-90 group-hover:opacity-0 transition-all duration-300" />
                  </div>
                </div>
              </div>

              {/* 4.4 Contact Form */}
              <div className="bg-transparent p-8 md:p-10 rounded-3xl shadow-sm border border-green-500/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] hover:border-green-500 hover:bg-white/5 transition-all duration-500 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 p-4 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110 group-hover:opacity-10">
                  <Send className="w-48 h-48 text-green-900" />
                </div>
                
                <div className="relative z-10">
                  <h4 className="font-bold text-gray-950 mb-1 text-[18px] tracking-tight relative flex items-center">
                     สอบถามหรือใช้บริการ
                     <span className="ml-3 text-[12px] bg-green-100/80 text-green-900 font-black px-3 py-1 rounded-full animate-pulse border border-green-200">ปรึกษาฟรี</span>
                  </h4>
                  <p className="text-[13px] text-gray-900 font-semibold mb-8 relative">ให้เราเป็นผู้ช่วยดูแลเอกสารของคุณ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-800 mb-1.5 ml-1">ชื่อ-นามสกุล <span className="text-red-600">*</span></label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full text-[13px] placeholder:text-gray-500 text-gray-950 border border-gray-300/50 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none bg-white/20 transition-all hover:bg-white/30" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-800 mb-1.5 ml-1">เบอร์โทรศัพท์ <span className="text-red-600">*</span></label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full text-[13px] placeholder:text-gray-500 text-gray-950 border border-gray-300/50 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none bg-white/20 transition-all hover:bg-white/30" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-800 mb-1.5 ml-1">อีเมล</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full text-[13px] placeholder:text-gray-500 text-gray-950 border border-gray-300/50 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none bg-white/20 transition-all hover:bg-white/30" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-800 mb-1.5 ml-1">บริการที่ต้องการ</label>
                      <select name="service" value={formData.service} onChange={handleInputChange} className="w-full text-[13px] text-gray-800 border border-gray-300/50 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none bg-white/20 transition-all hover:bg-white/30">
                        <option value="">-- เลือกบริการที่ต้องการ --</option>
                        {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-800 mb-1.5 ml-1">รายละเอียดเพิ่มเติม</label>
                      <textarea name="details" rows={3} value={formData.details} onChange={handleInputChange} className="w-full text-[13px] placeholder:text-gray-500 text-gray-950 border border-gray-300/50 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none resize-none bg-white/20 transition-all hover:bg-white/30"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center text-sm shadow-md hover:shadow-[0_10px_20px_rgba(22,163,74,0.3)] hover:-translate-y-1 active:scale-95 group mt-3">
                      ส่งข้อมูลเพื่อรับคำปรึกษา <Send className="w-5 h-5 ml-2.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
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