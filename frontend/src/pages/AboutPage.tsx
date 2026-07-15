import React, { useEffect, useState } from 'react';
import { 
  Target, Eye, ShieldCheck, Heart, Award, 
  TrendingUp, CheckCircle, Clock, Map, Laptop, 
  Briefcase, Lock, CheckCircle2, ChevronRight, 
  Zap, Shield, Users, MapPin, Sparkles, ThumbsUp, Star, Globe
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const AboutPage: React.FC = () => {
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  useEffect(() => {
    logUserAction('VIEW_PAGE_ABOUT');
  }, []);

  const highlights = [
    { title: 'เชี่ยวชาญ', desc: 'ประสบการณ์จริง\nมากกว่า 10 ปี', icon: <Award /> },
    { title: 'ถูกต้อง แม่นยำ', desc: 'ตรวจสอบละเอียด\nทุกขั้นตอน', icon: <CheckCircle2 /> },
    { title: 'รวดเร็ว', desc: 'บริการไว\nตรงตามกำหนด', icon: <Zap /> },
    { title: 'ปลอดภัย', desc: 'ข้อมูลเป็นความลับ\n100%', icon: <Shield /> },
    { title: 'ดูแลครบวงจร', desc: 'ให้คำปรึกษาตั้งแต่ต้น\nจนจบงาน', icon: <Users /> },
  ];

  const coreValues = [
    { title: 'ซื่อสัตย์ โปร่งใส', desc: 'ยึดถือความซื่อสัตย์และความโปร่งใสในการทำงานทุกขั้นตอน', icon: <ShieldCheck /> },
    { title: 'ใส่ใจลูกค้า', desc: 'รับฟัง เข้าใจ และให้บริการด้วยความใส่ใจในทุกความต้องการ', icon: <Heart /> },
    { title: 'มุ่งเน้นคุณภาพ', desc: 'ตรวจสอบความถูกต้อง ละเอียดรอบคอบทุกงาน', icon: <Award /> },
    { title: 'พัฒนาอย่างต่อเนื่อง', desc: 'เรียนรู้ ปรับปรุง และพัฒนาบริการอย่างไม่หยุดยั้ง', icon: <TrendingUp /> },
    { title: 'รับผิดชอบ', desc: 'รับผิดชอบต่องานและข้อมูลของลูกค้าอย่างเต็มที่', icon: <CheckCircle /> },
  ];

  const strengths = [
    { title: 'ประสบการณ์ทำงานกว่า 10 ปี', desc: 'เข้าใจขั้นตอนและข้อกำหนดของหน่วยงานต่างๆ เป็นอย่างดี', icon: <Clock /> },
    { title: 'เครือข่ายหน่วยงานกว้างขวาง', desc: 'ประสานงานได้รวดเร็ว ลดเวลาและขั้นตอนที่ซับซ้อน', icon: <Map /> },
    { title: 'เทคโนโลยีและระบบที่ทันสมัย', desc: 'ติดตามงาน ตรวจสอบสถานะ และสื่อสารได้อย่างมีประสิทธิภาพ', icon: <Laptop /> },
    { title: 'บริการครบ จบในที่เดียว', desc: 'ลดความยุ่งยาก ประหยัดเวลาและค่าใช้จ่ายของลูกค้า', icon: <Briefcase /> },
    { title: 'ข้อมูลปลอดภัย 100%', desc: 'รักษาความลับของข้อมูลและเอกสารอย่างเคร่งครัด', icon: <Lock /> },
  ];

  const timelines = [
    { year: '2557', title: 'ก่อตั้งบริษัท', desc: 'เริ่มต้นธุรกิจการให้บริการ\nจัดทำเอกสารพื้นฐาน' },
    { year: '2559', title: 'ขยายบริการ', desc: 'เพิ่มบริการครอบคลุมมากขึ้น\nตอบโจทย์ความต้องการลูกค้า' },
    { year: '2561', title: 'พัฒนาระบบ', desc: 'นำเทคโนโลยีมาใช้ในการทำงาน\nและติดตามสถานะ' },
    { year: '2563', title: 'ขยายทีมงาน', desc: 'เพิ่มทีมงานมืออาชีพ\nเพื่อรองรับงานที่เพิ่มขึ้น' },
    { year: '2565', title: 'ยกระดับมาตรฐาน', desc: 'พัฒนาระบบการทำงาน\nให้ได้มาตรฐานสูงขึ้น' },
    { year: 'ปัจจุบัน', title: 'เติบโตอย่างมั่นคง', desc: 'ได้รับความไว้วางใจจากลูกค้า\nอย่างต่อเนื่อง' },
  ];

  return (
    <div className="w-full bg-[#f8fafc] font-sans pb-20 relative overflow-hidden">
      
      {/* --- ฝัง Custom CSS สำหรับ Animations --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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

      {/* 1. Hero Section */}
      <section className="relative bg-white pt-20 pb-28 px-6 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-emerald-100/40 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="flex flex-col items-start pr-0 lg:pr-8">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full mb-6 border border-green-200 shadow-sm hover:scale-105 hover:bg-green-100 transition-all duration-300 cursor-default">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">ความน่าเชื่อถือที่คุณสัมผัสได้</span>
            </div>
            
            {/* ลดขนาดฟอนต์จาก 7xl ลงมาเป็น 5xl และใช้ชื่อจริง */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-black mb-4 leading-[1.2] text-gray-900 tracking-tight">
              เกี่ยวกับเรา<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-800 animate-gradient-x drop-shadow-sm">
                PDA BLISS COMPANY LIMITED
              </span>
            </h1>
            
            {/* ลดขนาดหัวข้อย่อยลงมา */}
            <p className="text-lg md:text-xl text-gray-800 mb-5 font-bold tracking-tight">
              ผู้เชี่ยวชาญด้านการจัดทำเอกสารครบวงจร <span className="text-green-600">ที่องค์กรชั้นนำเลือกใช้</span>
            </p>
            <p className="text-sm md:text-base text-gray-600 max-w-xl leading-relaxed font-medium">
              เรามุ่งมั่นให้บริการจัดทำเอกสารด้วยความถูกต้อง รวดเร็ว โปร่งใส และปลอดภัยที่สุด 
              เพื่อให้ลูกค้าสามารถดำเนินธุรกิจและใช้ชีวิตประจำวันได้อย่างมั่นใจไร้กังวล 
              ด้วยทีมงานมืออาชีพที่มีประสบการณ์ยาวนาน
            </p>

            <div className="mt-8 flex gap-6 items-center">
               <div className="flex flex-col group cursor-default">
                  <span className="text-3xl font-black text-green-700 group-hover:text-green-500 transition-colors">10+</span>
                  <span className="text-[11px] font-bold text-gray-500 mt-1">ปีแห่งประสบการณ์</span>
               </div>
               <div className="w-[2px] h-10 bg-green-100"></div>
               <div className="flex flex-col group cursor-default">
                  <span className="text-3xl font-black text-green-700 group-hover:text-green-500 transition-colors">99%</span>
                  <span className="text-[11px] font-bold text-gray-500 mt-1">ความแม่นยำของเอกสาร</span>
               </div>
            </div>
          </div>

          {/* รูปภาพ Hero พร้อมขอบและแสงเรืองแสงสีเขียว */}
          <div className="relative h-[380px] lg:h-[480px] w-full flex justify-center items-center perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-300 to-emerald-100 rounded-[3rem] rotate-3 scale-95 animate-float-delayed opacity-50 -z-10 shadow-[0_0_40px_rgba(34,197,94,0.3)]"></div>
            
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-[6px] border-white animate-float group hover:border-green-100 transition-colors duration-500">
              <img 
                src="/images/about.png" 
                alt="เกี่ยวกับ PDA BLISS" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" 
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Badge ลอยตัว */}
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-green-50 flex items-center gap-3 animate-float-delayed z-20 group-hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-green-50 p-2.5 rounded-full text-green-600 shadow-[0_0_15px_rgba(34,197,94,0.2)]"><ThumbsUp className="w-6 h-6" /></div>
              <div>
                <p className="text-[11px] text-gray-500 font-bold mb-0.5">การันตีคุณภาพ</p>
                <p className="text-base font-black text-green-800">ถูกต้อง 100%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Highlights (Stats Bar) */}
      <section className="max-w-7xl mx-auto px-6 relative z-20 -mt-12 mb-14">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-2 flex flex-wrap lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-green-50 border border-green-50">
          {highlights.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-5 w-full lg:w-1/5 bg-white hover:bg-green-50/60 rounded-xl transition-all duration-300 group cursor-default">
              <div className="flex-shrink-0 w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-green-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                {React.cloneElement(stat.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[14px] group-hover:text-green-700 transition-colors">{stat.title}</h4>
                <p className="text-[11px] text-gray-500 mt-1 whitespace-pre-line font-medium leading-tight">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)] transition-all duration-500 border border-transparent hover:border-green-800/50">
            <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-green-500/10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
              <Target className="w-56 h-56" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 mb-6 group-hover:bg-green-500 group-hover:border-green-400 transition-colors duration-500 shadow-[0_0_15px_rgba(34,197,94,0)] group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <Target className="w-7 h-7 text-green-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">พันธกิจ (Mission)</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                "มอบบริการจัดทำเอกสารที่ถูกต้อง รวดเร็ว โปร่งใส และเป็นมืออาชีพ เพื่อสร้างความสะดวกและความมั่นใจสูงสุดให้กับลูกค้าทุกระดับ"
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-700 to-emerald-600 p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,197,94,0.25)] transition-all duration-500">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <Eye className="w-56 h-56" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 mb-6 group-hover:bg-white transition-colors duration-500 shadow-sm group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <Eye className="w-7 h-7 text-white group-hover:text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">วิสัยทัศน์ (Vision)</h3>
              <p className="text-sm text-green-50 leading-relaxed font-medium">
                "ก้าวเป็นผู้นำอันดับหนึ่งด้านบริการจัดทำเอกสารครบวงจร ที่องค์กรและลูกค้าไว้วางใจ ด้วยมาตรฐานระดับสากล และนวัตกรรมที่พัฒนาอย่างไม่หยุดยั้ง"
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: ภาพรวมบริษัท */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 h-full relative overflow-hidden group hover:border-green-300 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)] transition-all duration-500">
            <div className="absolute -bottom-10 -right-10 text-gray-50 group-hover:text-green-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 pointer-events-none">
              <Globe className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <div className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></div>
                ภาพรวมบริษัท
              </h3>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-6 font-medium">
                <span className="font-bold text-green-700 text-[15px] block mb-1">PDA BLISS COMPANY LIMITED</span> 
                คือผู้เชี่ยวชาญระดับแนวหน้าในการให้บริการจัดทำเอกสารครบวงจร สำหรับบุคคลธรรมดาและนิติบุคคล เราดูแลเอกสารสำคัญที่เกี่ยวข้องกับภาครัฐด้วยความโปร่งใสและแม่นยำ
              </p>
              <ul className="space-y-4">
                {[
                  'ทีมงานมืออาชีพ เชี่ยวชาญกฎหมายและขั้นตอน',
                  'บริการครบถ้วน ครอบคลุมหลากหลายประเภท',
                  'อัปเดตกฎหมายและข้อกำหนดใหม่อย่างต่อเนื่อง',
                  'ใส่ใจรายละเอียด เพื่อความถูกต้องสูงสุด'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start group/li cursor-default">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 group-hover/li:scale-110 transition-transform" />
                    <span className="text-[12px] text-gray-700 font-medium leading-snug group-hover/li:text-green-800 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: ค่านิยมองค์กร */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 h-full relative overflow-hidden hover:border-green-300 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)] transition-all duration-500">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center relative z-10">
              <div className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></div>
              ค่านิยมองค์กร (Core Values)
            </h3>
            <div className="space-y-4 relative z-10">
              {coreValues.map((val, idx) => (
                <div key={idx} className="flex items-start group cursor-default p-2.5 rounded-xl hover:bg-green-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-green-500 transition-colors duration-300 shadow-sm group-hover:scale-110 group-hover:-rotate-3">
                    {React.cloneElement(val.icon, { className: 'w-5 h-5 text-green-600 group-hover:text-white transition-colors' })}
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-gray-900 group-hover:text-green-700 transition-colors">{val.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed font-medium">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: จุดแข็ง + มาตรฐาน */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex-1 relative group overflow-hidden hover:border-green-300 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)] transition-all duration-500">
               <div className="absolute -right-4 -bottom-4 text-green-50 pointer-events-none group-hover:text-green-100/60 group-hover:scale-110 transition-all duration-700">
                  <Award className="w-40 h-40" />
               </div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center relative z-10">
                <div className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></div>
                จุดแข็งของเรา
              </h3>
              <div className="space-y-4 relative z-10">
                {strengths.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start group/item cursor-default">
                    <div className="mr-3 mt-0.5 bg-green-50 p-1.5 rounded-lg text-green-600 group-hover/item:bg-green-500 group-hover/item:text-white transition-colors group-hover/item:scale-110">
                      {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
                    </div>
                    <div>
                      <h4 className="font-bold text-[12px] text-gray-900 group-hover/item:text-green-700 transition-colors">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-3xl shadow-sm border border-green-100 flex-1 hover:border-green-300 hover:shadow-[0_8px_25px_rgba(34,197,94,0.15)] transition-all duration-500">
              <h3 className="text-lg font-black text-green-800 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-600" /> มาตรฐานการบริการ
              </h3>
              <ul className="space-y-2.5 mb-5">
                {[
                  'ไม่รับงานที่ผิดกฎหมาย หรือขัดต่อจริยธรรม',
                  'ดำเนินงานตามขั้นตอนที่กฎหมายกำหนดเป๊ะ 100%'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2.5 mt-2 flex-shrink-0 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[11px] text-gray-700 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex items-start gap-3">
                 <div className="bg-green-100 p-2.5 rounded-full text-green-600"><MapPin className="w-5 h-5" /></div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-xs mb-1">พื้นที่ให้บริการ</h4>
                    <p className="text-[10px] text-gray-600 font-medium">ครอบคลุมทั่วประเทศไทย<br/><span className="text-green-700 font-bold">กทม. ปริมณฑล และต่างจังหวัด</span></p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Timeline แบบมีชีวิต */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-white p-8 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 group/timeline hover:border-green-200 transition-colors" onMouseLeave={() => setHoveredYearIndex(null)}>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">เส้นทางการเติบโตของเรา</h2>
            <p className="text-sm text-gray-500 font-medium">ความสำเร็จที่สร้างจากความไว้วางใจของลูกค้าตลอดหลายปีที่ผ่านมา</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start px-2">
            {/* เส้นประ Background */}
            <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[3px] bg-gray-100 -z-10 rounded-full overflow-hidden">
               {/* เส้นสีเขียววิ่งตามเมาส์ */}
               <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  style={{ width: hoveredYearIndex !== null ? `${(hoveredYearIndex / 5) * 100}%` : '0%' }}
               ></div>
            </div>
            
            {timelines.map((time, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center group/year cursor-pointer w-full md:w-auto mb-8 md:mb-0 relative z-10"
                onMouseEnter={() => setHoveredYearIndex(idx)}
              >
                {/* ไอคอนปี */}
                <div className={`w-14 h-14 rounded-full border-[3px] bg-white flex items-center justify-center mb-4 transition-all duration-500 ${
                  hoveredYearIndex !== null && idx <= hoveredYearIndex 
                     ? 'border-green-500 bg-green-50 scale-110 shadow-[0_5px_15px_rgba(34,197,94,0.25)] -translate-y-1' 
                     : 'border-gray-200 text-gray-400 group-hover/year:border-green-300'
                }`}>
                  {idx === 5 
                     ? <Star className={`w-6 h-6 transition-colors duration-500 ${hoveredYearIndex !== null && idx <= hoveredYearIndex ? 'text-green-500 fill-green-500' : 'text-gray-300'}`} /> 
                     : <CheckCircle2 className={`w-6 h-6 transition-colors duration-500 ${hoveredYearIndex !== null && idx <= hoveredYearIndex ? 'text-green-600' : 'text-gray-300'}`} />}
                </div>
                
                <h3 className={`text-lg font-black transition-colors duration-500 mb-1 ${
                  hoveredYearIndex !== null && idx <= hoveredYearIndex ? 'text-green-700' : 'text-gray-900'
                }`}>
                  {time.year}
                </h3>
                <h4 className={`font-bold text-[13px] transition-colors duration-300 mb-1 ${hoveredYearIndex !== null && idx <= hoveredYearIndex ? 'text-gray-900' : 'text-gray-700'}`}>{time.title}</h4>
                <p className="text-[11px] text-gray-500 whitespace-pre-line leading-relaxed font-medium md:max-w-[130px]">
                  {time.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-gray-900 via-green-900 to-green-800 rounded-[2rem] shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
          
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000 pointer-events-none">
            <ShieldCheck className="w-[24rem] h-[24rem] text-white" />
          </div>
          <div className="absolute left-0 bottom-0 w-56 h-56 bg-green-500/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 mb-6 md:mb-0 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-green-300 text-[11px] font-bold mb-3 backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
               <Sparkles className="w-3.5 h-3.5" /> ปรึกษาฟรี ไม่มีค่าใช้จ่าย
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">ให้เราดูแลเอกสารสำคัญของคุณ</h2>
            <p className="text-green-50 text-sm md:text-base max-w-lg font-medium leading-relaxed">
              ทีมงาน PDA BLISS พร้อมเป็นผู้ช่วยที่คุณไว้วางใจ ลดขั้นตอนที่ยุ่งยาก ประหยัดเวลา และมั่นใจได้ว่าถูกต้องตามกฎหมาย 100%
            </p>
          </div>
          
          <div className="relative z-10 flex-shrink-0">
            <button className="bg-white text-green-900 font-black py-3.5 px-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:bg-green-50 hover:scale-105 hover:shadow-[0_10px_25px_rgba(34,197,94,0.4)] transition-all duration-300 flex items-center group/btn text-base">
              ติดต่อทีมงานผู้เชี่ยวชาญ 
              <div className="ml-3 bg-green-100 p-1.5 rounded-lg group-hover/btn:bg-green-200 transition-colors">
                 <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};