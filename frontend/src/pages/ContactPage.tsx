import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageCircle, Mail, Clock, MapPin, 
  Send, CheckCircle2, ChevronRight, Map
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const ContactPage: React.FC = () => {
  // บันทึก Log เมื่อเปิดหน้า Contact
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
    setFormData({ name: '', phone: '', email: '', topic: '', message: '', consent: false }); // เคลียร์ฟอร์ม
  };

  const servicesList = [
    'แจ้งเข้า - เปลี่ยนย้ายนายจ้าง', 'ขึ้นทะเบียน', 'ขึ้นทะเบียนเถื่อน', 
    'รายงานตัว 90D', 'แจ้งออก - ของพนักงาน', 'MOU นำเข้า', 
    'ต่อ MOU 2 ปีหลัง', 'ทำเล่ม CI, Passport, PJ', 'ต่อ มติ ต่างๆ'
  ];

  return (
    <div className="w-full pb-20 bg-gray-50">
      {/* 1. Header Section */}
      <section className="bg-white pt-12 pb-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <span className="flex items-center text-green-700"><CheckCircle2 className="w-4 h-4 mr-1"/> หน้าหลัก</span> 
            <span>&gt;</span> 
            <span>ติดต่อเรา</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            ติดต่อเรา <span className="text-green-700">PDA BLISS</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            เราพร้อมให้บริการและดูแลคุณในทุกขั้นตอน <br/>
            <span className="text-sm">ติดต่อสอบถาม ขอใบเสนอราคา หรือปรึกษาเรื่องเอกสารกับเราได้เลย</span>
          </p>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: <Phone />, title: '02-123-4567', desc: 'โทรศัพท์ พร้อมให้บริการ' },
              { icon: <MessageCircle />, title: '@pdabliss', desc: 'LINE Official ตอบไวที่สุด' },
              { icon: <Mail />, title: 'info@pdabliss.co.th', desc: 'อีเมล ตอบกลับภายใน 24 ชม.' },
              { icon: <Clock />, title: 'จันทร์ - ศุกร์ 08:30 - 17:30', desc: '(หยุดวันเสาร์ - อาทิตย์ และวันหยุดนักขัตฤกษ์)' },
              { icon: <MapPin />, title: 'อาคารบลิส ทาวเวอร์ ชั้น 12', desc: 'ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ', link: 'Google Maps ↗' }
            ].map((info, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3 hover:border-green-500 transition-colors">
                <div className="bg-green-50 p-2 rounded-full text-green-700 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{info.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-tight">{info.desc}</p>
                  {info.link && <a href="#" className="text-[11px] font-bold text-green-700 mt-1 block hover:underline">{info.link}</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid (3 Columns) */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Form & Promo */}
          <div className="space-y-6">
            {/* Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ส่งข้อความถึงเรา</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder="ชื่อ - นามสกุล" required value={formData.name} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:border-green-500 focus:outline-none" />
                  <input type="tel" name="phone" placeholder="เบอร์โทรศัพท์" required value={formData.phone} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:border-green-500 focus:outline-none" />
                </div>
                <input type="email" name="email" placeholder="อีเมล" required value={formData.email} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:border-green-500 focus:outline-none" />
                <select name="topic" required value={formData.topic} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:border-green-500 focus:outline-none text-gray-500">
                  <option value="">หัวข้อที่ต้องการติดต่อ</option>
                  {servicesList.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
                <textarea name="message" placeholder="รายละเอียดข้อความของคุณ" rows={4} required value={formData.message} onChange={handleInputChange} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:border-green-500 focus:outline-none resize-none"></textarea>
                
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} className="mt-1 accent-green-700" />
                  <span className="text-[11px] text-gray-500">ฉันยินยอมให้บริษัทเก็บข้อมูลเพื่อการติดต่อกลับและนำเสนอสิทธิประโยชน์</span>
                </label>
                
                <button type="submit" className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3 rounded-md transition-colors flex items-center justify-center text-sm shadow-md">
                  ส่งข้อความ <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>

            {/* Promo Box */}
            <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                {/* Placeholder for Agent Image */}
                <div className="w-full h-full bg-green-200 flex items-center justify-center text-xs text-green-700">รูป จนท.</div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">ปรึกษาเรื่องเอกสารกับเรา <span className="text-green-700">ฟรี!</span></h4>
                <p className="text-[10px] text-gray-500 mb-2">ทีมงานมืออาชีพ ยินดีให้คำแนะนำและช่วยเหลือคุณ</p>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-600 mb-3">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600"/> ตอบไวใน 1 นาที</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600"/> ให้คำปรึกษาโดยผู้เชี่ยวชาญ</span>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-700 text-white text-[11px] px-3 py-1.5 rounded-full flex items-center"><MessageCircle className="w-3 h-3 mr-1"/> แชทกับเราเลย</button>
                  <button className="bg-white border border-green-700 text-green-700 text-[11px] px-3 py-1.5 rounded-full flex items-center"><Phone className="w-3 h-3 mr-1"/> โทรหาเรา</button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Map & FAQ */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">แผนที่สำนักงาน</h3>
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center border border-gray-200 relative overflow-hidden">
                 {/* Map Placeholder */}
                 <Map className="w-10 h-10 text-gray-300" />
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-md w-4/5 flex gap-3 items-center">
                    <MapPin className="w-8 h-8 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-900">PDA BLISS COMPANY LIMITED</p>
                      <p className="text-[9px] text-gray-500 line-clamp-2">123/45 อาคารบลิส ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110</p>
                    </div>
                 </div>
              </div>
              <a href="#" className="text-sm font-bold text-green-700 flex items-center justify-center hover:underline">ดูเส้นทางบน Google Maps <ChevronRight className="w-4 h-4 ml-1"/></a>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">คำถามที่พบบ่อย</h3>
                <a href="/process" className="text-xs font-bold text-green-700 hover:underline">ดูทั้งหมด</a>
              </div>
              <div className="space-y-2">
                {[
                  'ใช้เอกสารอะไรบ้างในการรับบริการ?',
                  'ระยะเวลาดำเนินการนานแค่ไหน?',
                  'สามารถมอบอำนาจให้ดำเนินการแทนได้หรือไม่?',
                  'มีค่าบริการเพิ่มเติมจากที่แจ้งหรือไม่?'
                ].map((q, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 cursor-pointer transition-colors group">
                    <span className="text-xs font-bold text-gray-700 group-hover:text-green-700 flex items-center gap-2">
                      <span className="bg-green-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">?</span>
                      {q}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Services List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">บริการของเรา</h3>
            <div className="space-y-4">
              {servicesList.map((service, i) => (
                <a key={i} href="/services" className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-xs font-black mr-4 group-hover:bg-green-700 group-hover:text-white transition-colors">
                    0{i + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">{service}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};