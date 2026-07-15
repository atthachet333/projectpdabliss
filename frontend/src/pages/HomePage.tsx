import React, { useState } from 'react';
import { 
  FileText, Users, CalendarDays, 
  LogOut, BookOpen, FileCheck,
  ShieldCheck, Zap, Heart, MessageSquare, 
  Search, ChevronRight, CheckCircle2, ChevronDown
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const HomePage: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0); 

  const services = [
    { id: '01', title: 'แจ้งเข้า -\nเปลี่ยนย้ายนายจ้าง', icon: <Users className="w-8 h-8 text-green-700" /> },
    { id: '02', title: 'ขึ้นทะเบียนแรงงาน', icon: <FileText className="w-8 h-8 text-green-700" /> },
    { id: '03', title: 'รายงานตัว 90D', icon: <CalendarDays className="w-8 h-8 text-green-700" /> },
    { id: '04', title: 'แจ้งออก -\nของพนักงาน', icon: <LogOut className="w-8 h-8 text-green-700" /> },
    { id: '05', title: 'ทำเล่ม CI,\nPassport, PJ', icon: <BookOpen className="w-8 h-8 text-green-700" /> },
    { id: '06', title: 'ต่อ มติ ต่างๆ', icon: <FileCheck className="w-8 h-8 text-green-700" /> },
  ];

  const faqs = [
    { 
      q: 'ใช้เวลาดำเนินการเอกสารแต่ละประเภทนานแค่ไหน?', 
      a: 'ระยะเวลาจะขึ้นอยู่กับประเภทของเอกสารครับ แต่ทางเราการันตีความรวดเร็วและมีทีมงานคอยอัปเดตสถานะงานให้คุณทราบในทุกขั้นตอน' 
    },
    { 
      q: 'ต้องเตรียมเอกสารอะไรบ้างสำหรับการขึ้นทะเบียนแรงงาน?', 
      a: 'ทางเราจะมีเจ้าหน้าที่ประเมินและส่ง Checklist รายการเอกสารที่จำเป็นให้คุณลูกค้าเตรียมล่วงหน้า เพื่อให้เอกสารถูกต้องครบถ้วนตั้งแต่ครั้งแรก' 
    },
    { 
      q: 'สามารถปรึกษาพูดคุยก่อนตัดสินใจใช้บริการได้หรือไม่?', 
      a: 'ได้แน่นอนครับ! เรามีบริการให้คำปรึกษาฟรี ไม่มีค่าใช้จ่ายเบื้องต้น สามารถทัก Line หรือโทรสอบถามได้ในเวลาทำการเลยครับ' 
    }
  ];

  const handleConsultClick = () => {
    logUserAction('CLICK_CONSULT_BUTTON', { location: 'HomePage_Hero' });
    alert('ระบบบันทึก Log การกดปุ่ม "สอบถามบริการ" เรียบร้อยครับ!');
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full font-sans pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-32 px-6 border-b border-white/50 overflow-hidden bg-white/70 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="flex flex-col items-start pr-8">
            <div className="flex items-center space-x-2 bg-green-50/80 backdrop-blur-sm text-green-700 px-5 py-2 rounded-full mb-6 border border-green-100 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wide">ผู้ช่วยด้านเอกสารที่คุณไว้วางใจ</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-black mb-6 leading-[1.15] text-gray-900 tracking-tight">
              บริการจัดทำ<br/>เอกสารครบวงจร
            </h1>
            
            <p className="text-2xl md:text-3xl text-green-700 mb-6 font-bold tracking-tight">
              รวดเร็ว ถูกต้อง เชื่อถือได้ ดูแลครบ จบทุกขั้นตอน
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-10 max-w-lg leading-relaxed">
              ทีมงานมืออาชีพ พร้อมดูแลเอกสารของคุณอย่างถูกต้องตามกฎหมาย 
              ประหยัดเวลา ลดความกังวล ให้เราดูแลทุกขั้นตอนแทนคุณ
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleConsultClick}
                className="bg-green-800 text-white font-bold py-4 px-10 text-lg rounded-full shadow-lg hover:bg-green-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center group"
              >
                สอบถามบริการ <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-green-800 border border-green-200 font-bold py-4 px-10 text-lg rounded-full shadow-sm hover:bg-green-50 transition-all duration-300 flex items-center group">
                ดูบริการทั้งหมด <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform text-green-500" />
              </button>
            </div>
          </div>

          <div className="relative h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl group border border-white/50">
            <img 
              src="/images/tw.png" 
              alt="บริการเอกสาร" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
          </div>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 relative z-20 -mt-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-gray-200/50 border border-white/50">
          {[
            { icon: <Zap className="w-8 h-8 text-green-600" />, title: 'รวดเร็ว', desc: 'ดำเนินการไวตรงตามกำหนด' },
            { icon: <CheckCircle2 className="w-8 h-8 text-green-600" />, title: 'ถูกต้อง', desc: 'เอกสารถูกต้องตามกฎหมาย' },
            { icon: <Users className="w-8 h-8 text-green-600" />, title: 'ดูแลครบ', desc: 'ครบทุกขั้นตอนจบที่เดียว' },
            { icon: <ShieldCheck className="w-8 h-8 text-green-600" />, title: 'มีประสบการณ์', desc: 'ทีมงานมืออาชีพเชี่ยวชาญ' },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-5 px-6 py-4 md:py-2 flex-1 hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <div className="flex-shrink-0 bg-white/60 p-4 rounded-full border border-white/50 shadow-sm">{stat.icon}</div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">{stat.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center border-b border-gray-200/50 pb-4">
              <div className="w-2 h-7 bg-green-600 rounded-full mr-3"></div>
              บริการของเรา
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-white/50 hover:border-green-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  onClick={() => logUserAction('VIEW_SERVICE_DETAIL', { serviceId: service.id, serviceName: service.title })}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-green-700 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <span className="text-sm font-black text-gray-400 group-hover:text-green-300 transition-colors">{service.id}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-[15px] leading-relaxed group-hover:text-green-700 transition-colors whitespace-pre-line">
                    {service.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center border-b border-gray-200/50 pb-4">
                <div className="w-2 h-7 bg-green-600 rounded-full mr-3"></div>
                ทำไมต้องเลือก PDA BLISS
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { title: 'แนะนำชัดเจน', desc: 'อธิบายครบ\nเข้าใจง่าย', icon: <MessageSquare className="w-7 h-7" /> },
                  { title: 'ติดตามใกล้ชิด', desc: 'อัปเดตงาน\nตลอดเวลา', icon: <Search className="w-7 h-7" /> },
                  { title: 'ลดความยุ่งยาก', desc: 'ประหยัดเวลา\nไม่ยุ่งยาก', icon: <Heart className="w-7 h-7" /> },
                  { title: 'เอกสารครบ', desc: 'บริการครบ\nเรื่องเอกสาร', icon: <FileText className="w-7 h-7" /> },
                  { title: 'เชื่อถือได้', desc: 'ถูกต้องตาม\nกฎหมาย 100%', icon: <ShieldCheck className="w-7 h-7" /> },
                ].map((item, idx) => (
                  <div key={idx} className="text-center group flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm text-green-700 flex items-center justify-center mb-4 group-hover:bg-green-700 group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-800 text-[13px] md:text-sm mb-1.5 group-hover:text-green-700 transition-colors">{item.title}</h4>
                    <p className="text-[11px] text-gray-600 whitespace-pre-line leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50" onMouseLeave={() => setHoveredStep(null)}>
              <h2 className="text-2xl font-bold text-gray-900 mb-10 flex items-center border-b border-gray-200/50 pb-4">
                <div className="w-2 h-7 bg-green-600 rounded-full mr-3"></div>
                ขั้นตอนการให้บริการ
              </h2>
              
              <div className="relative flex flex-col sm:flex-row justify-between items-center sm:items-start px-4">
                <div className="hidden sm:block absolute top-[24px] left-[10%] right-[10%] h-[4px] bg-gray-200/60 -z-10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-700 ease-out"
                    style={{ width: hoveredStep !== null ? `${(hoveredStep / 4) * 100}%` : '0%' }}
                  ></div>
                </div>
                
                {[
                  { num: '01', title: 'รับข้อมูล', desc: 'รับข้อมูลความต้องการ' },
                  { num: '02', title: 'ตรวจเอกสาร', desc: 'ตรวจสอบอย่างละเอียด' },
                  { num: '03', title: 'ยื่นดำเนินการ', desc: 'ยื่นเอกสารตามขั้นตอน' },
                  { num: '04', title: 'ติดตามผล', desc: 'ติดตามและประสานงาน' },
                  { num: '05', title: 'ส่งมอบงาน', desc: 'ส่งมอบงานเรียบร้อย' }
                ].map((step, idx) => (
                  <div 
                    key={idx} 
                    className="relative z-10 flex flex-col items-center group w-full sm:w-auto mb-8 sm:mb-0 cursor-pointer"
                    onMouseEnter={() => setHoveredStep(idx)}
                  >
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-bold mb-4 shadow-sm transition-all duration-300 ${hoveredStep !== null && idx <= hoveredStep ? 'bg-green-700 border-green-700 text-white scale-110 shadow-green-200 shadow-lg' : 'bg-white/80 border-green-700 text-green-700'}`}>
                      {step.num}
                    </div>
                    <h4 className={`font-bold text-[14px] md:text-sm mb-1.5 transition-colors duration-300 ${hoveredStep !== null && idx <= hoveredStep ? 'text-green-700' : 'text-gray-900'}`}>{step.title}</h4>
                    <p className="text-[11px] text-gray-600 text-center">{step.desc}</p>
                    
                    {idx < 4 && (
                      <ChevronRight className={`hidden sm:block absolute top-3.5 -right-[calc(50%+12px)] w-6 h-6 transition-colors duration-500 ${hoveredStep !== null && idx < hoveredStep ? 'text-green-600' : 'text-gray-400'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-sm border border-white/50 flex flex-col lg:flex-row gap-10">
          
          <div className="lg:w-1/3 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-7 bg-green-600 rounded-full mr-3"></div>
              คำถามที่พบบ่อย (FAQ)
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed pr-4">
              รวบรวมข้อสงสัยเกี่ยวกับการให้บริการของเรา เพื่อให้คุณเข้าใจขั้นตอนได้ง่ายขึ้น 
              หากมีคำถามเพิ่มเติมสามารถติดต่อสอบถามทีมงานได้ตลอดเวลา
            </p>
          </div>

          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-white/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-green-300 bg-white/40"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/60 transition-colors"
                >
                  <span className={`font-bold text-sm ${openFaq === idx ? 'text-green-700' : 'text-gray-800'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-green-700' : 'text-gray-500'}`} />
                </button>
                
                <div 
                  className={`px-6 text-sm text-gray-700 leading-relaxed transition-all duration-300 ease-in-out ${
                    openFaq === idx ? 'max-h-40 py-4 border-t border-white/50 opacity-100 bg-transparent' : 'max-h-0 py-0 opacity-0 bg-transparent'
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};