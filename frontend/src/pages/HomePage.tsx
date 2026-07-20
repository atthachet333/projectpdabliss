import React, { useState } from 'react';
import { 
  FileText, Users, CalendarDays, 
  LogOut, BookOpen, FileCheck,
  ShieldCheck, Zap, Heart, MessageSquare, 
  Search, ChevronRight, CheckCircle2, ChevronDown, Star, ArrowRight, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { logUserAction } from '../utils/logger';

export const HomePage: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0); 

  const services = [
    { id: '01', title: 'แจ้งเข้า -\nเปลี่ยนย้ายนายจ้าง', icon: <Users className="w-8 h-8" />, route: '/services', intendedRoute: '/services/employee-transfer' },
    { id: '02', title: 'ขึ้นทะเบียนแรงงาน', icon: <FileText className="w-8 h-8" />, route: '/services', intendedRoute: '/services/registration' },
    { id: '03', title: 'รายงานตัว 90D', icon: <CalendarDays className="w-8 h-8" />, route: '/services', intendedRoute: '/services/90-days' },
    { id: '04', title: 'แจ้งออก -\nของพนักงาน', icon: <LogOut className="w-8 h-8" />, route: '/services', intendedRoute: '/services/employee-exit' },
    { id: '05', title: 'ทำเล่ม CI,\nPassport, PJ', icon: <BookOpen className="w-8 h-8" />, route: '/services', intendedRoute: '/services/passport' },
    { id: '06', title: 'ต่อ มติ ต่างๆ', icon: <FileCheck className="w-8 h-8" />, route: '/services', intendedRoute: '/services/resolution-extension' },
  ];

  const faqs = [
    { 
      q: 'ใช้เวลาดำเนินการเอกสารแต่ละประเภทนานแค่ไหน?', 
      a: 'ระยะเวลาจะขึ้นอยู่กับประเภทของเอกสารครับ แต่ทางเราการันตีความรวดเร็วและมีทีมงานคอยอัปเดตสถานะงานให้คุณทราบในทุกขั้นตอนแบบ Real-time' 
    },
    { 
      q: 'ต้องเตรียมเอกสารอะไรบ้างสำหรับการขึ้นทะเบียนแรงงาน?', 
      a: 'ทางเราจะมีเจ้าหน้าที่ประเมินและส่ง Checklist รายการเอกสารที่จำเป็นให้คุณลูกค้าเตรียมล่วงหน้า เพื่อให้เอกสารถูกต้องครบถ้วนตั้งแต่ครั้งแรก ลดปัญหาเอกสารตีกลับ' 
    },
    { 
      q: 'สามารถปรึกษาพูดคุยก่อนตัดสินใจใช้บริการได้หรือไม่?', 
      a: 'ได้แน่นอนครับ! เรามีบริการให้คำปรึกษาฟรี ไม่มีค่าใช้จ่ายเบื้องต้น สามารถทัก Line หรือโทรสอบถามได้ในเวลาทำการ ทีมงานผู้เชี่ยวชาญพร้อมดูแลครับ' 
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
    if(openFaq !== index) logUserAction('CLICK_FAQ', { question: faqs[index].q });
  };

  return (
    <div className="w-full font-sans pb-20 bg-[#f8fafc] overflow-hidden">
      
      {/* --- ฝัง Custom CSS สำหรับ Animations สุดว้าว --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }
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

      {/* 1. Hero Section (ปรับเอฟเฟกต์และลูกเล่นแสง) */}
      <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-24 sm:pb-32 lg:pb-40 px-4 sm:px-6 border-b border-gray-100 bg-white overflow-hidden">
        {/* แสง Glow พื้นหลังวิ่งไปมา */}
        <div className="absolute top-0 left-1/4 h-72 w-72 sm:h-[500px] sm:w-[500px] bg-green-300/20 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 h-80 w-80 sm:h-[600px] sm:w-[600px] bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse pointer-events-none delay-700"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="flex flex-col items-start pr-0 z-20">
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 sm:px-5 py-2.5 rounded-full mb-6 border border-green-200 shadow-sm hover:scale-105 transition-transform cursor-default group">
              <Sparkles className="w-5 h-5 group-hover:text-yellow-500 transition-colors" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">พาร์ทเนอร์ที่คุณไว้วางใจ One-Stop Service</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.15] tracking-tight">
              บริการจัดทำ <br/>
              {/* ข้อความไล่สีวิ่งได้ */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-emerald-500 to-green-900 animate-gradient-x">
                เอกสารครบวงจร
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 mb-6 font-bold tracking-tight flex flex-wrap items-center">
              รวดเร็ว <span className="mx-2 text-green-500">•</span> ถูกต้อง <span className="mx-2 text-green-500">•</span> เชื่อถือได้
            </p>
            <p className="text-base md:text-lg text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
              ทีมงานมืออาชีพ พร้อมดูแลเอกสารแรงงานและธุรกิจของคุณอย่างถูกต้องตามกฎหมาย 
              ประหยัดเวลา ลดความกังวล ให้เราดูแลทุกขั้นตอนแทนคุณ
            </p>
            
            <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:flex-wrap gap-4 items-stretch sm:items-center">
              <Link
                to="/contact"
                onClick={() => logUserAction('CLICK_CONSULT_BUTTON', { location: 'HomePage_Hero' })}
                className="min-h-11 justify-center bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-4 px-6 sm:px-10 text-base sm:text-lg rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.3)] hover:shadow-[0_15px_40px_rgba(22,163,74,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center">สอบถามบริการ <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></span>
              </Link>
              <Link to="/services" data-analytics-id="hero_view_all_services" onClick={() => logUserAction('NAV_VIEW_SERVICES', { path: '/services' })} className="min-h-11 justify-center bg-white text-gray-700 border-2 border-gray-200 font-bold py-4 px-6 sm:px-10 text-base sm:text-lg rounded-2xl shadow-sm hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all duration-300 flex items-center group">
                ดูบริการทั้งหมด <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* เพิ่ม Trust Badge */}
            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" loading="lazy" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                ))}
              </div>
              <p>บริษัทชั้นนำกว่า <span className="text-green-700 font-black">1,000+</span> แห่งเลือกใช้</p>
            </div>
          </div>

          {/* รูปภาพพร้อมเอฟเฟกต์ลอยตัว */}
          <div className="relative w-full h-[300px] sm:h-[380px] md:h-[550px] z-10 flex justify-center items-center">
            {/* กล่องตกแต่งด้านหลัง */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[3rem] rotate-3 scale-95 animate-float-delayed -z-10"></div>
            
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[8px] border-white animate-float group">
              <img 
                src="/images/oo.png" 
                alt="บริการเอกสาร" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" 
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80" }} // Fallback รูปชั่วคราว
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Badge ลอยๆ ซ้อนรูปภาพ */}
            <div className="absolute bottom-3 left-3 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 sm:gap-4 animate-float-delayed z-20">
              <div className="bg-green-100 p-3 rounded-full text-green-600"><Star className="w-6 h-6 fill-current" /></div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-0.5">ความพึงพอใจ</p>
                <p className="text-lg font-black text-gray-900">98% รีวิวบวก</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Bar (เด้งทะลุกรอบขึ้นมา) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-30 -mt-10 sm:-mt-14">
        <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] p-4 flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100">
          {[
            { icon: <Zap />, title: 'รวดเร็ว', desc: 'ดำเนินการไวตรงกำหนด' },
            { icon: <CheckCircle2 />, title: 'ถูกต้อง', desc: 'เอกสารถูกต้อง 100%' },
            { icon: <Users />, title: 'ดูแลครบ', desc: 'จบทุกขั้นตอนที่เดียว' },
            { icon: <ShieldCheck />, title: 'เชี่ยวชาญ', desc: 'ทีมงานมืออาชีพ' },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4 px-4 sm:px-6 py-5 flex-1 hover:-translate-y-2 transition-transform duration-300 cursor-default group bg-white hover:bg-green-50/50 rounded-2xl">
              <div className="flex-shrink-0 bg-green-50 p-3.5 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-green-200 group-hover:scale-110">
                {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[15px] group-hover:text-green-700 transition-colors">{stat.title}</h4>
                <p className="text-[12px] text-gray-500 mt-0.5 font-medium">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Content Grid (บริการ & ขั้นตอน) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* ซ้าย: บริการของเรา */}
          <div className="xl:col-span-5 bg-white p-5 sm:p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group/section">
            {/* วงกลมตกแต่ง */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-50 rounded-full blur-2xl group-hover/section:bg-green-100 transition-colors duration-700"></div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 sm:mb-10 flex items-center relative z-10">
              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-700 rounded-full mr-4 shadow-sm"></div>
              บริการของเรา
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              {services.map((service) => (
                <Link
                  key={service.id} 
                  to={service.route}
                  className="relative bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-green-400 hover:bg-white hover:shadow-[0_10px_25px_rgba(34,197,94,0.15)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                  data-analytics-id={`service_card_${service.id}`}
                  onClick={() => logUserAction('VIEW_SERVICE_DETAIL', { serviceId: service.id, serviceName: service.title, route: service.intendedRoute })}
                  onKeyDown={(event) => {
                    if (event.key === ' ') {
                      event.preventDefault();
                      event.currentTarget.click();
                    }
                  }}
                >
                  {/* ลายน้ำตัวเลข (Watermark) ใหญ่ๆ */}
                  <div className="absolute -bottom-4 -right-2 text-6xl font-black text-gray-100 group-hover:text-green-50 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 z-0 select-none">
                    {service.id}
                  </div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="text-gray-400 bg-white p-3 rounded-xl shadow-sm group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-[14px] leading-relaxed group-hover:text-green-700 transition-colors whitespace-pre-line relative z-10">
                    {service.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* ขวา: ทำไมต้องเลือกเรา & ขั้นตอน (ใช้ลูกเล่นเส้นวิ่งแบบเต็มขั้น) */}
          <div className="xl:col-span-7 space-y-10">
            
            {/* ทำไมต้องเลือกเรา */}
            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 sm:mb-10 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-700 rounded-full mr-4 shadow-sm"></div>
                ทำไมต้องเลือก PDA BLISS
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { title: 'แนะนำชัดเจน', desc: 'อธิบายครบ\nเข้าใจง่าย', icon: <MessageSquare /> },
                  { title: 'ติดตามใกล้ชิด', desc: 'อัปเดตงาน\nตลอดเวลา', icon: <Search /> },
                  { title: 'ลดความยุ่งยาก', desc: 'ประหยัดเวลา\nไม่ยุ่งยาก', icon: <Heart /> },
                  { title: 'เอกสารครบ', desc: 'บริการครบ\nเรื่องเอกสาร', icon: <FileText /> },
                  { title: 'เชื่อถือได้', desc: 'ถูกต้องตาม\nกฎหมาย 100%', icon: <ShieldCheck /> },
                ].map((item, idx) => (
                  <div key={idx} className="text-center group flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-default">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm text-green-600 flex items-center justify-center mb-5 group-hover:bg-green-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                      {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-7 h-7" })}
                    </div>
                    <h4 className="font-bold text-gray-900 text-[14px] mb-2 group-hover:text-green-700 transition-colors">{item.title}</h4>
                    <p className="text-[12px] text-gray-500 whitespace-pre-line leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ขั้นตอนการให้บริการ (เส้นวิ่งเทพๆ) */}
            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group/process" onMouseLeave={() => setHoveredStep(null)}>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 sm:mb-14 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-700 rounded-full mr-4 shadow-sm"></div>
                ขั้นตอนการให้บริการ
              </h2>
              
              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start px-2">
                {/* เส้น Background */}
                <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[4px] bg-gray-100 -z-10 rounded-full overflow-hidden">
                  {/* แถบสีเขียว (Progress Bar) ที่ขยับตามเมาส์ */}
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    style={{ width: hoveredStep !== null ? `${(hoveredStep / 4) * 100}%` : '0%' }}
                  ></div>
                </div>
                
                {[
                  { num: '01', title: 'รับข้อมูล', desc: 'แจ้งความต้องการ' },
                  { num: '02', title: 'ตรวจเอกสาร', desc: 'ตรวจสอบละเอียด' },
                  { num: '03', title: 'ยื่นดำเนินการ', desc: 'ยื่นตามขั้นตอน' },
                  { num: '04', title: 'ติดตามผล', desc: 'ประสานงานตลอด' },
                  { num: '05', title: 'ส่งมอบงาน', desc: 'งานเสร็จสมบูรณ์' }
                ].map((step, idx) => (
                  <div 
                    key={idx} 
                    className="relative z-10 flex flex-col items-center group/step w-full md:w-auto mb-10 md:mb-0 cursor-pointer"
                    onMouseEnter={() => setHoveredStep(idx)}
                  >
                    {/* ไอคอนหมายเลข */}
                    <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-lg font-black mb-5 transition-all duration-300 
                      ${hoveredStep !== null && idx <= hoveredStep 
                        ? 'bg-green-600 border-green-600 text-white scale-110 shadow-[0_10px_20px_rgba(34,197,94,0.3)] -translate-y-1' 
                        : 'bg-white border-gray-200 text-gray-400 group-hover/step:border-green-300'}`}>
                      {step.num}
                    </div>
                    
                    <h4 className={`font-bold text-[15px] mb-2 transition-colors duration-300 
                      ${hoveredStep !== null && idx <= hoveredStep ? 'text-green-700' : 'text-gray-900'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[12px] text-gray-500 text-center font-medium">{step.desc}</p>
                    
                    {/* ลูกศรเชื่อม (แสดงเฉพาะจอคอม) */}
                    {idx < 4 && (
                      <ChevronRight className={`hidden md:block absolute top-4 -right-[calc(50%+16px)] w-6 h-6 transition-colors duration-500 
                        ${hoveredStep !== null && idx < hoveredStep ? 'text-green-500 translate-x-1' : 'text-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Banner เรียกน้ำย่อยก่อน FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
         <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-[2rem] p-6 sm:p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
            {/* วงกลมตกแต่ง */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 relative z-10">พร้อมให้เราดูแลเอกสารของคุณแล้วหรือยัง?</h2>
            <p className="text-green-100 text-base sm:text-lg mb-8 relative z-10 max-w-2xl mx-auto">ติดต่อทีมงานผู้เชี่ยวชาญของเราวันนี้ ปรึกษาฟรี ไม่มีค่าใช้จ่ายเบื้องต้น</p>
            <Link
              to="/contact"
              data-analytics-id="home_banner_contact_consultation"
              onClick={() => logUserAction('CLICK_CONSULT_BUTTON', { location: 'HomePage_Banner' })}
              className="relative z-10 bg-white text-green-800 font-bold py-4 px-6 sm:px-10 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:scale-105 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-300 flex min-h-11 items-center justify-center mx-auto group"
            >
              ติดต่อรับคำปรึกษา <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
         </div>
      </section>

      {/* 5. FAQ Section (สมูทขึ้น สวยขึ้น) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-white p-5 sm:p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          <div className="lg:w-1/3 flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-700 rounded-full mr-4 shadow-sm"></div>
              คำถามที่พบบ่อย
            </h2>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed pr-4">
              รวบรวมข้อสงสัยเกี่ยวกับการให้บริการของเรา เพื่อให้คุณเข้าใจขั้นตอนได้ง่ายขึ้น 
              หากมีคำถามเพิ่มเติมสามารถติดต่อสอบถามทีมงานได้ตลอดเวลา
            </p>
          </div>

          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaq === idx 
                    ? 'border-green-400 bg-green-50/30 shadow-[0_4px_20px_rgba(34,197,94,0.1)]' 
                    : 'border-gray-200 hover:border-green-300 bg-white'
                }`}
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-4 sm:px-8 py-5 flex items-start justify-between gap-3 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                >
                  <span className={`font-bold text-[15px] flex items-center gap-4 ${openFaq === idx ? 'text-green-800' : 'text-gray-900'}`}>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs transition-colors ${openFaq === idx ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>Q</span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${openFaq === idx ? 'rotate-180 text-green-600' : 'text-gray-400'}`} />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaq === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 sm:px-8 pb-6 pt-2 text-[14px] text-gray-600 font-medium leading-relaxed flex gap-4">
                    <span className="font-bold text-green-600 pt-0.5 mt-0.5">A</span>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
