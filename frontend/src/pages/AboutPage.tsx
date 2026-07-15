import React, { useEffect, useState } from 'react';
import { 
  Target, Eye, ShieldCheck, Heart, Award, 
  TrendingUp, CheckCircle, Clock, Map, Laptop, 
  Briefcase, Lock, CheckCircle2, ChevronRight, 
  Zap, Shield, Users, MapPin
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const AboutPage: React.FC = () => {
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  useEffect(() => {
    logUserAction('VIEW_PAGE_ABOUT');
  }, []);

  const highlights = [
    { title: 'เชี่ยวชาญ', desc: 'ประสบการณ์จริง\nมากกว่า 10 ปี', icon: <Award className="w-6 h-6 text-green-700" /> },
    { title: 'ถูกต้อง แม่นยำ', desc: 'ตรวจสอบละเอียด\nทุกขั้นตอน', icon: <CheckCircle2 className="w-6 h-6 text-green-700" /> },
    { title: 'รวดเร็ว', desc: 'บริการไว\nตรงตามกำหนด', icon: <Zap className="w-6 h-6 text-green-700" /> },
    { title: 'ปลอดภัย', desc: 'ข้อมูลเป็นความลับ\n100%', icon: <Shield className="w-6 h-6 text-green-700" /> },
    { title: 'ดูแลครบวงจร', desc: 'ให้คำปรึกษาตั้งแต่ต้น\nจนจบงาน', icon: <Users className="w-6 h-6 text-green-700" /> },
  ];

  const coreValues = [
    { title: 'ซื่อสัตย์ โปร่งใส', desc: 'ยึดถือความซื่อสัตย์และความโปร่งใสในการทำงานทุกขั้นตอน', icon: <ShieldCheck className="w-5 h-5 text-green-600" /> },
    { title: 'ใส่ใจลูกค้า', desc: 'รับฟัง เข้าใจ และให้บริการด้วยความใส่ใจในทุกความต้องการ', icon: <Heart className="w-5 h-5 text-green-600" /> },
    { title: 'มุ่งเน้นคุณภาพ', desc: 'ตรวจสอบความถูกต้อง ละเอียดรอบคอบทุกงาน', icon: <Award className="w-5 h-5 text-green-600" /> },
    { title: 'พัฒนาอย่างต่อเนื่อง', desc: 'เรียนรู้ ปรับปรุง และพัฒนาบริการอย่างไม่หยุดยั้ง', icon: <TrendingUp className="w-5 h-5 text-green-600" /> },
    { title: 'รับผิดชอบ', desc: 'รับผิดชอบต่องานและข้อมูลของลูกค้าอย่างเต็มที่', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
  ];

  const strengths = [
    { title: 'ประสบการณ์การทำงานมากกว่า 10 ปี', desc: 'เข้าใจขั้นตอนและข้อกำหนดของหน่วยงานต่างๆ เป็นอย่างดี', icon: <Clock className="w-5 h-5 text-green-600" /> },
    { title: 'เครือข่ายหน่วยงานกว้างขวาง', desc: 'ประสานงานได้รวดเร็ว ลดเวลาและขั้นตอนที่ซับซ้อน', icon: <Map className="w-5 h-5 text-green-600" /> },
    { title: 'เทคโนโลยีและระบบที่ทันสมัย', desc: 'ติดตามงาน ตรวจสอบสถานะ และสื่อสารได้อย่างมีประสิทธิภาพ', icon: <Laptop className="w-5 h-5 text-green-600" /> },
    { title: 'บริการครบ จบในที่เดียว', desc: 'ลดความยุ่งยาก ประหยัดเวลาและค่าใช้จ่ายของลูกค้า', icon: <Briefcase className="w-5 h-5 text-green-600" /> },
    { title: 'ข้อมูลปลอดภัย 100%', desc: 'รักษาความลับของข้อมูลและเอกสารอย่างเคร่งครัด', icon: <Lock className="w-5 h-5 text-green-600" /> },
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
    <div className="w-full bg-[#f8fafc] font-sans pb-20 relative">
      
      {/* 1. Hero Section */}
      <section className="relative bg-white pt-12 pb-24 px-6 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="flex flex-col items-start pr-0 lg:pr-10">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full mb-6 border border-green-100 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">บริการเอกสารครบ จบที่เดียว</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black mb-4 leading-tight text-gray-900 tracking-tight">
              เกี่ยวกับเรา<br/>
              <span className="text-green-700">PDA BLISS COMPANY LIMITED</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-800 mb-6 font-bold tracking-tight">
              ผู้เชี่ยวชาญด้านการจัดทำเอกสารครบวงจร
            </p>
            <p className="text-sm md:text-base text-gray-600 max-w-xl leading-relaxed">
              เรามุ่งมั่นให้บริการจัดทำเอกสารด้วยความถูกต้อง รวดเร็ว โปร่งใส และปลอดภัย 
              เพื่อให้ลูกค้าสามารถดำเนินธุรกิจและใช้ชีวิตประจำวันได้อย่างมั่นใจ
            </p>
          </div>

          {/* รูปภาพ Hero */}
          <div className="relative h-[400px] lg:h-[480px] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
            <img 
              src="/images/about.png" 
              alt="PDA BLISS Binder" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" 
            />
            <div className="absolute top-0 left-0 w-3 h-full bg-green-600"></div>
          </div>
        </div>
      </section>

      {/* 2. Highlights (Stats Bar) */}
      <section className="max-w-[1440px] mx-auto px-6 relative z-20 -mt-12 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-wrap lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {highlights.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4 px-6 py-5 w-full lg:w-1/5 hover:bg-green-50/50 transition-colors group cursor-default">
              <div className="flex-shrink-0 w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-green-200 transition-all duration-300">
                {stat.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[14px] group-hover:text-green-700 transition-colors">{stat.title}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 whitespace-pre-line leading-snug">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="max-w-[1440px] mx-auto px-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-700 transition-colors duration-300">
              <Target className="w-8 h-8 text-green-700 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">พันธกิจ (Mission)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                มอบบริการจัดทำเอกสารที่ถูกต้อง รวดเร็ว โปร่งใส และเป็นมืออาชีพ เพื่อสร้างความสะดวกและความมั่นใจให้กับลูกค้า
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-700 transition-colors duration-300">
              <Eye className="w-8 h-8 text-green-700 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">วิสัยทัศน์ (Vision)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                เป็นผู้นำด้านบริการจัดทำเอกสารครบวงจร ที่ลูกค้าไว้วางใจ ด้วยมาตรฐานระดับสากล และพัฒนาอย่างต่อเนื่อง
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Main Content Grid */}
      <section className="max-w-[1440px] mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: ภาพรวมบริษัท */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full hover:border-green-200 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1.5 h-6 bg-green-600 rounded-full mr-3"></div>
              ภาพรวมบริษัท
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              <span className="font-bold text-gray-900">PDA BLISS COMPANY LIMITED</span> คือผู้ให้บริการจัดทำเอกสารครบวงจร สำหรับบุคคลธรรมดาและนิติบุคคล เราดูแลเอกสารสำคัญที่เกี่ยวข้องกับภาครัฐและหน่วยงานต่างๆ ด้วยความเชี่ยวชาญ ประสบการณ์ และมาตรฐานการทำงานที่เชื่อถือได้
            </p>
            <ul className="space-y-4">
              {[
                'ทีมงานมืออาชีพ เชี่ยวชาญกฎหมายและขั้นตอนเอกสาร',
                'บริการครบถ้วน ครอบคลุมเอกสารหลากหลายประเภท',
                'อัปเดตกฎหมายและข้อกำหนดใหม่อย่างต่อเนื่อง',
                'ใส่ใจทุกรายละเอียด เพื่อความถูกต้องและความพึงพอใจสูงสุด'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-gray-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: ค่านิยมองค์กร */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full hover:border-green-200 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1.5 h-6 bg-green-600 rounded-full mr-3"></div>
              ค่านิยมองค์กร (Core Values)
            </h3>
            <div className="space-y-5">
              {coreValues.map((val, idx) => (
                <div key={idx} className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-green-600 transition-colors duration-300 shadow-sm">
                    <div className="group-hover:text-white transition-colors">{val.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-green-700 transition-colors">{val.title}</h4>
                    <p className="text-[12px] text-gray-500 mt-1 leading-snug">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: จุดแข็ง + มาตรฐาน */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex-1 hover:border-green-200 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1.5 h-6 bg-green-600 rounded-full mr-3"></div>
                จุดแข็งของเรา
              </h3>
              <div className="space-y-4">
                {strengths.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start group">
                    <div className="mr-3 mt-0.5 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-[13px] text-gray-900 group-hover:text-green-700 transition-colors">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex-1 hover:border-green-200 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1.5 h-6 bg-green-600 rounded-full mr-3"></div>
                มาตรฐานการให้บริการ
              </h3>
              <ul className="space-y-2.5 mb-6">
                {[
                  'ไม่รับงานที่ผิดกฎหมาย หรือขัดต่อจริยธรรม',
                  'ให้ข้อมูลตามจริง ไม่เกินจริง',
                  'ดำเนินงานตามขั้นตอนที่กฎหมายกำหนด'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 mt-1.5 flex-shrink-0"></div>
                    <span className="text-[12px] text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 text-green-600 mr-2" /> พื้นที่ให้บริการ
              </h3>
              <p className="text-[12px] text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                ให้บริการครอบคลุมทั่วประเทศไทย<br/>
                <span className="font-bold text-green-700">ทั้งกรุงเทพฯ ปริมณฑล และต่างจังหวัด</span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Timeline */}
      <section className="max-w-[1440px] mx-auto px-6 mb-16">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">ความน่าเชื่อถือและการเติบโต</h2>
          
          <div className="relative">
            <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-gray-100 -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 relative z-10">
              {timelines.map((time, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center text-center group cursor-default"
                  onMouseEnter={() => setHoveredYear(time.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                >
                  <div className={`w-14 h-14 rounded-full border-[3px] bg-white flex items-center justify-center mb-4 transition-all duration-300 ${
                    hoveredYear === time.year ? 'border-green-600 scale-110 shadow-md' : 'border-green-100'
                  }`}>
                    {idx === 5 ? <Award className={`w-6 h-6 ${hoveredYear === time.year ? 'text-green-600' : 'text-gray-400'}`} /> : <CheckCircle2 className={`w-6 h-6 ${hoveredYear === time.year ? 'text-green-600' : 'text-gray-400'}`} />}
                  </div>
                  
                  <h3 className={`text-lg font-black transition-colors duration-300 ${hoveredYear === time.year ? 'text-green-700' : 'text-gray-900'}`}>
                    {time.year}
                  </h3>
                  <h4 className="font-bold text-[13px] text-gray-800 mt-1 mb-2">{time.title}</h4>
                  <p className="text-[11px] text-gray-500 whitespace-pre-line leading-relaxed px-2">
                    {time.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-[1440px] mx-auto px-6">
        <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl shadow-lg p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 mb-6 md:mb-0">
            <h2 className="text-3xl font-black text-white mb-2">พร้อมดูแลเอกสารของคุณ</h2>
            <p className="text-green-100 text-sm">ให้เราเป็นผู้ช่วยที่คุณไว้วางใจ ในทุกเรื่องเอกสาร ปรึกษาฟรี ไม่มีค่าใช้จ่าย</p>
          </div>
          
          <div className="relative z-10">
            <button className="bg-white text-green-800 font-bold py-3.5 px-8 rounded-lg shadow-md hover:bg-green-50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center group/btn">
              ติดต่อเรา <ChevronRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};