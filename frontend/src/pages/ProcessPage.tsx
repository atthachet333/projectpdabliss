import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, FileText, Search, Send, BarChart, CheckCircle2, Truck,
  ChevronDown, ChevronUp, Clock, ShieldCheck, Heart, Zap, FileCheck, CheckCircle, ChevronRight, PhoneCall, Sparkles
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

// --- Component สำหรับทำตัวเลขวิ่ง (Number Counter) ---
const AnimatedNumber: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const ProcessPage: React.FC = () => {
  useEffect(() => {
    logUserAction('VIEW_PAGE_PROCESS');
  }, []);

  const [openFaqId, setOpenFaqId] = useState<number | null>(0);

  const toggleFaq = (index: number, question: string) => {
    setOpenFaqId(openFaqId === index ? null : index);
    if (openFaqId !== index) logUserAction('CLICK_FAQ', { question });
  };

  const processSteps = [
    { id: '01', title: 'ปรึกษาเบื้องต้น', desc: 'ติดต่อสอบถาม แจ้งความต้องการ ทีมงานให้คำแนะนำ', icon: <MessageCircle /> },
    { id: '02', title: 'จัดเตรียมเอกสาร', desc: 'ลูกค้าจัดเตรียมเอกสารตามเช็คลิสต์ที่แจ้ง', icon: <FileText /> },
    { id: '03', title: 'ตรวจสอบเอกสาร', desc: 'ทีมงานตรวจสอบความถูกต้อง ครบถ้วน', icon: <Search /> },
    { id: '04', title: 'ยื่นดำเนินการ', desc: 'ดำเนินการยื่นเอกสารต่อหน่วยงานที่เกี่ยวข้อง', icon: <Send /> },
    { id: '05', title: 'ติดตามผล', desc: 'ติดตามสถานะอย่างใกล้ชิด อัปเดตความคืบหน้า', icon: <BarChart /> },
    { id: '06', title: 'ดำเนินการเสร็จสิ้น', desc: 'งานเสร็จสมบูรณ์ตามกำหนด ตรวจรับเอกสาร', icon: <CheckCircle2 /> },
    { id: '07', title: 'จัดส่งเอกสาร', desc: 'จัดส่งเอกสารให้ลูกค้า รวดเร็ว ปลอดภัย ถึงมือคุณ', icon: <Truck /> },
  ];

  const faqs = [
    { q: 'ต้องเตรียมเอกสารอะไรบ้าง?', a: 'เอกสารที่ต้องใช้ขึ้นอยู่กับประเภทงานที่ท่านต้องการดำเนินการ โดยทีมงานจะส่งเช็คลิสต์เอกสารให้ท่านทราบหลังจากประเมินรายละเอียดเบื้องต้นแล้ว เพื่อให้เตรียมเอกสารได้ครบถ้วนและถูกต้อง ลดระยะเวลาในการดำเนินการ' },
    { q: 'ใช้เวลาดำเนินการนานแค่ไหน?', a: 'ระยะเวลาดำเนินการจะแตกต่างกันไปตามประเภทของบริการ (เช่น 3-7 วัน สำหรับรายงานตัว 90 วัน หรือ 15-30 วัน สำหรับทำเล่ม Passport/CI) เราจะแจ้งกรอบเวลาที่ชัดเจนให้ทราบก่อนเริ่มงาน' },
    { q: 'สามารถติดตามสถานะงานได้อย่างไร?', a: 'ลูกค้าสามารถสอบถามสถานะการดำเนินการได้ตลอดเวลาผ่านช่องทาง LINE Official ของบริษัท ทีมงานจะคอยอัปเดตความคืบหน้าให้ทราบเป็นระยะ' },
    { q: 'ข้อมูลของลูกค้าปลอดภัยหรือไม่?', a: 'เราให้ความสำคัญกับความลับของข้อมูลลูกค้าเป็นอันดับหนึ่ง ข้อมูลทั้งหมดจะถูกเก็บรักษาอย่างปลอดภัยและไม่ถูกนำไปเผยแพร่หรือใช้งานนอกเหนือจากการดำเนินการเอกสาร' },
    { q: 'รับงานด่วน / งานเร่งได้หรือไม่?', a: 'ทางเรารับพิจารณางานด่วนเป็นกรณีไป ขึ้นอยู่กับความพร้อมของเอกสารลูกค้าและระเบียบของหน่วยงานราชการ กรุณาติดต่อทีมงานเพื่อประเมินเบื้องต้น' },
    { q: 'ให้บริการครอบคลุมพื้นที่ใดบ้าง?', a: 'เราให้บริการครอบคลุมพื้นที่กรุงเทพมหานคร ปริมณฑล และจังหวัดใกล้เคียง สำหรับพื้นที่อื่นๆ สามารถติดต่อสอบถามเพิ่มเติมได้' },
  ];

  return (
    <div className="w-full pb-20 bg-[#F8FAFC]">
      
      {/* 1. Hero Section */}
      <section className="bg-white pt-24 pb-20 px-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row gap-16 items-center relative z-10">
          
          {/* ซ้าย: รูปภาพ */}
          <div className="flex-1 w-full relative group perspective-1000">
            <div className="absolute inset-0 bg-green-600 rounded-[2rem] transform rotate-3 scale-105 opacity-10 group-hover:rotate-6 transition-transform duration-700"></div>
            <div className="relative w-full h-[350px] md:h-[420px] rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white group-hover:-translate-y-2 transition-all duration-700 ease-out z-10 bg-gray-100">
              <img 
                src="/images/procress.png" 
                alt="บริการเอกสาร" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* ขวา: ข้อความ */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-bold mb-2 cursor-default hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span>บริการครบวงจร One-Stop Service</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              ขั้นตอนบริการ & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-500">คำถามที่พบบ่อย</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              รวดเร็ว ถูกต้อง เชื่อถือได้ <span className="text-green-600 relative inline-block">ดูแลครบ จบทุกขั้นตอน<span className="absolute -bottom-1 left-0 w-full h-1 bg-green-200 rounded-full opacity-60"></span></span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl font-medium">
              ทีมงานมืออาชีพ พร้อมดูแลเอกสารของคุณอย่างถูกต้องตามกฎหมาย 
              ประหยัดเวลา ลดความกังวล ให้เราดูแลทุกขั้นตอนแทนคุณ
            </p>
          </div>

        </div>
      </section>

      {/* 2. Main Content Grid (ขั้นตอน & FAQ) */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1.8fr,1.2fr] gap-8 mt-12">
        
        {/* ฝั่งซ้าย: ขั้นตอนการให้บริการ (เน้นความน่าเชื่อถือ และเส้นวิ่ง) */}
        <section className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col group/section hover:shadow-[0_15px_40px_rgb(34,197,94,0.08)] transition-shadow duration-500">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-12 flex items-center gap-3">
               <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-700 rounded-full shadow-sm"></div>
               ขั้นตอนการให้บริการ
            </h3>
            
            {/* พื้นที่ของ Steps */}
            <div className="flex flex-col md:flex-row justify-between items-start w-full relative group/steps pb-4">
              
              {/* เส้นประเชื่อม (พื้นหลัง) */}
              <div className="hidden md:block absolute top-8 left-10 right-10 h-[2px] border-t-[3px] border-dotted border-gray-200 z-0"></div>
              
              {/* ✨ ลูกเล่น: เส้นสีเขียววิ่งเมื่อเอาเมาส์วางบริเวณนี้ ✨ */}
              <div className="hidden md:block absolute top-[31px] left-10 right-10 h-[4px] bg-gradient-to-r from-green-400 to-green-600 z-0 origin-left scale-x-0 group-hover/steps:scale-x-100 transition-transform duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>

              {processSteps.map((step, idx) => (
                <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center md:text-center group flex-1 cursor-default">
                  
                  {/* วงกลม Icon */}
                  <div className="relative w-16 h-16 rounded-full bg-white border-[4px] border-gray-50 flex items-center justify-center mb-5 flex-shrink-0 group-hover:border-green-500 group-hover:bg-green-600 group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(34,197,94,0.2)] transition-all duration-300 mr-4 md:mr-0 z-10">
                    {React.cloneElement(step.icon, { className: 'w-6 h-6 text-green-700 group-hover:text-white group-hover:scale-110 transition-all duration-300' })}
                    
                    {/* หมายเลขขั้นตอน */}
                    <div className="absolute -top-2 -right-2 text-[10px] font-black text-white bg-gray-900 group-hover:bg-green-900 rounded-full w-6 h-6 flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-all duration-300">
                      {step.id}
                    </div>
                  </div>
                  
                  {/* ลูกศรคั่นกลาง (แสดงเฉพาะจอใหญ่) */}
                  {idx < processSteps.length - 1 && (
                     <ChevronRight className="hidden md:block absolute -right-3 top-5 w-6 h-6 text-gray-200 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
                  )}

                  {/* ข้อความอธิบาย */}
                  <div className="flex-1 flex flex-col items-start md:items-center">
                    <h4 className="font-bold text-gray-900 text-[14px] mb-1.5 group-hover:text-green-700 transition-colors">{step.title}</h4>
                    <p className="text-[12px] text-gray-500 font-medium leading-snug px-1 md:max-w-[100px]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✨ ส่วนเติมเต็มช่องว่างที่เพิ่มเข้ามาใหม่ (Decorative Fill) ✨ */}
          <div className="flex-1 flex items-center justify-center py-10">
            <div className="w-full bg-gradient-to-r from-gray-50 via-white to-green-50/30 border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group/banner hover:shadow-md hover:border-green-200 transition-all duration-500">
              
              {/* ลายน้ำตกแต่ง */}
              <div className="absolute -right-6 -top-6 text-green-100/40 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <ShieldCheck className="w-32 h-32" />
              </div>
              
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-green-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 relative z-10">
                 <div className="absolute inset-0 bg-green-400 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <CheckCircle2 className="w-8 h-8 text-green-600 relative z-10" />
              </div>
              
              <div className="relative z-10 text-center md:text-left flex-1">
                <h4 className="text-[16px] font-black text-gray-900 mb-1.5 group-hover:text-green-800 transition-colors">ดูแลทุกรายละเอียด ลดข้อผิดพลาด 100%</h4>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                  ทีมงานตรวจสอบเอกสารอย่างละเอียดทุกจุดก่อนยื่นเรื่อง หมดปัญหาเอกสารตีกลับ ช่วยให้คุณประหยัดเวลาและลดความกังวลในทุกขั้นตอน
                </p>
              </div>

              <div className="md:ml-auto relative z-10">
                <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-700 text-sm font-bold rounded-xl hover:bg-green-600 hover:text-white hover:-translate-y-1 transition-all shadow-sm">
                  <PhoneCall className="w-4 h-4" /> ปรึกษาทีมงาน
                </button>
              </div>
            </div>
          </div>

          {/* Badges ด้านล่าง (ดันลงมาด้วย mt-auto) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-auto pt-8 border-t border-gray-100">
            {[
              { title: 'ประหยัดเวลา', icon: <Clock className="w-6 h-6" /> },
              { title: 'ถูกต้องตามกฎหมาย', icon: <ShieldCheck className="w-6 h-6" /> },
              { title: 'อัปเดตทุกความคืบหน้า', icon: <FileCheck className="w-6 h-6" /> },
              { title: 'ปลอดภัย เป็นความลับ', icon: <CheckCircle className="w-6 h-6" /> },
              { title: 'บริการด้วยใจ', icon: <Heart className="w-6 h-6" /> },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 hover:bg-green-50 hover:shadow-sm border border-transparent hover:border-green-100 transition-all duration-300 cursor-default group">
                <div className="text-green-700 mb-2.5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">{badge.icon}</div>
                <span className="text-[12px] font-bold text-gray-800 group-hover:text-green-800">{badge.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ฝั่งขวา: FAQ */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
             <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-700 rounded-full shadow-sm"></div>
             คำถามที่พบบ่อย (FAQ)
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaqId === index ? 'border-green-300 shadow-[0_4px_20px_rgba(34,197,94,0.1)]' : 'border-gray-100 hover:border-green-200'}`}>
                <button 
                  className={`w-full flex justify-between items-center p-5 text-left transition-colors duration-300 ${openFaqId === index ? 'bg-green-50/50' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => toggleFaq(index, faq.q)}
                >
                  <span className="font-bold text-[14px] text-gray-900 flex items-center gap-3">
                    <span className={`rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-black transition-colors ${openFaqId === index ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Q</span>
                    {faq.q}
                  </span>
                  {openFaqId === index ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqId === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-5 pt-0 bg-green-50/50 text-[13px] text-gray-600 flex gap-3">
                    <span className="text-green-600 font-black mt-0.5 ml-1">A</span>
                    <p className="leading-relaxed font-medium">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 3. Bottom Trust & Stats Section */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-10 hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] transition-shadow duration-500">
          
          {/* Logo & Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:w-1/3">
            <div className="text-center md:text-left">
              <h4 className="font-black text-lg text-gray-900 tracking-tight">PDA BLISS COMPANY LIMITED</h4>
              <p className="text-green-700 font-bold text-[13px] mb-2">บริการเอกสารครบ จบที่เดียว</p>
              <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                เราเป็นผู้ช่วยที่คุณวางใจได้ ดูแลงานเอกสารของคุณ<br className="hidden md:block"/>ให้เป็นเรื่องง่าย รวดเร็ว ถูกต้อง และปลอดภัย
              </p>
            </div>
          </div>

          {/* Stats & Avatars */}
          <div className="flex flex-col sm:flex-row items-center gap-8 lg:w-1/3 justify-center border-y sm:border-y-0 sm:border-x border-gray-100 py-6 sm:py-0 sm:px-8">
            <div className="text-center flex flex-col items-center group cursor-default">
              <p className="text-[12px] text-gray-500 font-semibold mb-1">ลูกค้ามากกว่า</p>
              <div className="text-4xl font-black text-green-700 tracking-tight mb-2 flex items-center justify-center min-w-[100px] group-hover:scale-110 transition-transform duration-300">
                <AnimatedNumber end={2000} suffix="+" /> 
              </div>
              
              <div className="flex -space-x-3 mb-2 group-hover:scale-105 transition-transform duration-300">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-green-600 text-white flex items-center justify-center text-[10px] font-bold z-10">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[12px] font-bold text-gray-800">รายไว้วางใจใช้บริการกับเรา</p>
            </div>
            
            <div className="hidden sm:block w-[1px] h-20 bg-gray-200"></div>

            <div className="text-center group cursor-default">
              <p className="text-[12px] text-gray-500 font-semibold mb-1">ความพึงพอใจของลูกค้า</p>
              <div className="text-4xl font-black text-green-700 tracking-tight mb-1 group-hover:scale-110 transition-transform duration-300">
                <AnimatedNumber end={98} suffix="%" />
              </div>
              <p className="text-[12px] font-bold text-gray-800">บริการดี ถูกต้อง<br/>และบอกต่อ</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center lg:items-end lg:w-1/3 text-center lg:text-right gap-4">
            <div>
              <p className="text-[15px] font-bold text-gray-900 mb-1">พร้อมให้เราช่วยดูแลงานเอกสารของคุณ</p>
              <p className="text-[12px] text-gray-500 font-medium">ปรึกษาฟรี ไม่มีค่าใช้จ่าย | ตอบกลับรวดเร็ว</p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full text-sm transition-all shadow-[0_4px_15px_rgba(22,163,74,0.3)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 flex items-center group">
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> ปรึกษาฟรี
              </button>
              <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-full text-sm transition-all flex items-center hover:-translate-y-0.5">
                <PhoneCall className="w-4 h-4 mr-2" /> 02-123-4567
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};