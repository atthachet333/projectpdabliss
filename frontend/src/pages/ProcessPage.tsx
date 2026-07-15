import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, FileText, Search, Send, BarChart, CheckCircle2, Truck,
  ChevronDown, ChevronUp, Clock, ShieldCheck, Heart, Zap, FileCheck, CheckCircle
} from 'lucide-react';
import { logUserAction } from '../utils/logger';

export const ProcessPage: React.FC = () => {
  // บันทึก Log เมื่อเปิดหน้า Process
  useEffect(() => {
    logUserAction('VIEW_PAGE_PROCESS');
  }, []);

  // State สำหรับเปิด/ปิด FAQ
  const [openFaqId, setOpenFaqId] = useState<number | null>(0);

  const toggleFaq = (index: number, question: string) => {
    if (openFaqId === index) {
      setOpenFaqId(null);
    } else {
      setOpenFaqId(index);
      logUserAction('CLICK_FAQ', { question });
    }
  };

  const processSteps = [
    { id: '01', title: 'ปรึกษาเบื้องต้น', desc: 'ติดต่อสอบถาม แจ้งความต้องการ ทีมงานให้คำแนะนำ และประเมินเบื้องต้น', icon: <MessageCircle className="w-6 h-6 text-green-700" /> },
    { id: '02', title: 'จัดเตรียมเอกสาร', desc: 'ลูกค้าจัดเตรียมเอกสารตามเช็คลิสต์ที่แจ้ง หรือให้ทีมช่วยตรวจสอบ', icon: <FileText className="w-6 h-6 text-green-700" /> },
    { id: '03', title: 'ตรวจสอบเอกสาร', desc: 'ทีมงานตรวจสอบความถูกต้อง ครบถ้วน และแจ้งเพิ่มเติม หากไม่ครบ', icon: <Search className="w-6 h-6 text-green-700" /> },
    { id: '04', title: 'ยื่นดำเนินการ', desc: 'ดำเนินการยื่นเอกสารต่อหน่วยงานที่เกี่ยวข้อง แทนลูกค้า', icon: <Send className="w-6 h-6 text-green-700" /> },
    { id: '05', title: 'ติดตามผล', desc: 'ติดตามสถานะอย่างใกล้ชิด อัปเดตความคืบหน้า ให้ลูกค้าทราบ', icon: <BarChart className="w-6 h-6 text-green-700" /> },
    { id: '06', title: 'ดำเนินการเสร็จสิ้น', desc: 'งานเสร็จสมบูรณ์ตามกำหนด ตรวจรับเอกสาร ก่อนส่งมอบ', icon: <CheckCircle2 className="w-6 h-6 text-green-700" /> },
    { id: '07', title: 'จัดส่งเอกสาร', desc: 'จัดส่งเอกสารให้ลูกค้า รวดเร็ว ปลอดภัย ถึงมือคุณ', icon: <Truck className="w-6 h-6 text-green-700" /> },
  ];

  const faqs = [
    { q: 'ต้องเตรียมเอกสารอะไรบ้าง?', a: 'เอกสารที่ต้องใช้ขึ้นอยู่กับประเภทงานที่ท่านต้องการดำเนินการ โดยทีมงานจะส่งเช็คลิสต์เอกสารให้ท่านทราบหลังจากประเมินรายละเอียดเบื้องต้นแล้ว เพื่อให้เตรียมเอกสารได้ครบถ้วนและถูกต้อง ลดระยะเวลาในการดำเนินการ' },
    { q: 'ใช้เวลาดำเนินการนานแค่ไหน?', a: 'ระยะเวลาดำเนินการจะแตกต่างกันไปตามประเภทของบริการ (เช่น 3-7 วัน สำหรับรายงานตัว 90 วัน หรือ 15-30 วัน สำหรับทำเล่ม Passport/CI) เราจะแจ้งกรอบเวลาที่ชัดเจนให้ทราบก่อนเริ่มงาน' },
    { q: 'สามารถติดตามสถานะได้ทำงานได้อย่างไร?', a: 'ลูกค้าสามารถสอบถามสถานะการดำเนินการได้ตลอดเวลาผ่านช่องทาง LINE Official ของบริษัท ทีมงานจะคอยอัปเดตความคืบหน้าให้ทราบเป็นระยะ' },
    { q: 'ข้อมูลของลูกค้าปลอดภัยหรือไม่?', a: 'เราให้ความสำคัญกับความลับของข้อมูลลูกค้าเป็นอันดับหนึ่ง ข้อมูลทั้งหมดจะถูกเก็บรักษาอย่างปลอดภัยและไม่ถูกนำไปเผยแพร่หรือใช้งานนอกเหนือจากการดำเนินการเอกสาร' },
    { q: 'รับงานด่วน / งานเร่งได้หรือไม่?', a: 'ทางเรารับพิจารณางานด่วนเป็นกรณีไป ขึ้นอยู่กับความพร้อมของเอกสารลูกค้าและระเบียบของหน่วยงานราชการ กรุณาติดต่อทีมงานเพื่อประเมินเบื้องต้น' },
    { q: 'ให้บริการครอบคลุมพื้นที่ใดบ้าง?', a: 'เราให้บริการครอบคลุมพื้นที่กรุงเทพมหานคร ปริมณฑล และจังหวัดใกล้เคียง สำหรับพื้นที่อื่นๆ สามารถติดต่อสอบถามเพิ่มเติมได้' },
  ];

  return (
    <div className="w-full pb-20">
      {/* 1. Header Section */}
      <section className="bg-white pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">ขั้นตอนบริการ & <br/>คำถามที่พบบ่อย</h1>
            <h2 className="text-xl font-bold text-green-700 mb-4">รวดเร็ว ถูกต้อง เชื่อถือได้ ดูแลครบ จบทุกขั้นตอน</h2>
            <p className="text-gray-600">
              ทีมงานมืออาชีพ พร้อมดูแลเอกสารของคุณอย่างถูกต้องตามกฎหมาย 
              ประหยัดเวลา ลดความกังวล ให้เราดูแลทุกขั้นตอนแทนคุณ
            </p>
          </div>
          <div className="flex-1 hidden md:block">
            {/* พื้นที่สำหรับใส่รูปภาพประกอบ */}
            <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
              <img 
              src="/images/procress.png" 
              alt="บริการเอกสาร" 
              className="w-full h-full object-cover rounded-2xl"
            />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        
        {/* ซ้าย: ขั้นตอนการให้บริการ (กินพื้นที่ 2 ส่วน) */}
        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-10">ขั้นตอนการให้บริการ</h3>
            
            <div className="relative">
              {/* เส้นเชื่อมระหว่างขั้นตอน (ซ่อนในจอมือถือ) */}
              <div className="hidden md:block absolute top-8 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-6 md:gap-2">
                {processSteps.map((step, idx) => (
                  <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center md:text-center group">
                    {/* วงกลมไอคอน */}
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-green-700 flex items-center justify-center mb-4 flex-shrink-0 group-hover:bg-green-700 transition-colors shadow-sm mr-4 md:mr-0">
                      <div className="group-hover:text-white transition-colors">
                        {step.icon}
                      </div>
                    </div>
                    {/* หมายเลข & ข้อความ */}
                    <div className="flex-1">
                      <div className="text-xs font-bold text-green-700 bg-green-50 rounded-full px-2 py-0.5 inline-block mb-2 md:mx-auto">
                        {step.id}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h4>
                      <p className="text-[10px] text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges ด้านล่างขั้นตอน */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12 pt-8 border-t border-gray-100">
              {[
                { title: 'ประหยัดเวลา', icon: <Clock className="w-5 h-5 text-green-700" /> },
                { title: 'ถูกต้องตามกฎหมาย', icon: <ShieldCheck className="w-5 h-5 text-green-700" /> },
                { title: 'อัปเดตทุกความคืบหน้า', icon: <FileCheck className="w-5 h-5 text-green-700" /> },
                { title: 'ปลอดภัย เป็นความลับ', icon: <CheckCircle className="w-5 h-5 text-green-700" /> },
                { title: 'บริการด้วยใจ', icon: <Heart className="w-5 h-5 text-green-700" /> },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center p-2">
                  <div className="bg-green-50 p-2 rounded-lg mb-2">{badge.icon}</div>
                  <span className="text-[11px] font-bold text-gray-700">{badge.title}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ขวา: FAQ (คำถามที่พบบ่อย) */}
        <div className="lg:col-span-1">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">คำถามที่พบบ่อย (FAQ)</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-green-50 transition-colors"
                    onClick={() => toggleFaq(index, faq.q)}
                  >
                    <span className="font-bold text-sm text-gray-800 flex items-center gap-2">
                      <span className="bg-green-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">Q</span>
                      {faq.q}
                    </span>
                    {openFaqId === index ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  
                  {/* เนื้อหาคำตอบ */}
                  {openFaqId === index && (
                    <div className="p-4 bg-white text-sm text-gray-600 border-t border-gray-200 flex gap-2">
                      <span className="text-green-700 font-bold">A</span>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Trust & Stats Section */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs text-gray-500 mb-1">ลูกค้ามากกว่า</p>
              <p className="text-3xl font-black text-green-700">2,000+</p>
              <p className="text-xs font-bold text-gray-700">รายไว้วางใจใช้บริการกับเรา</p>
            </div>
            <div className="text-center md:text-left border-l border-gray-200 pl-6">
              <p className="text-xs text-gray-500 mb-1">ความพึงพอใจของลูกค้า</p>
              <p className="text-3xl font-black text-green-700">98%</p>
              <p className="text-xs font-bold text-gray-700">บริการดี ถูกต้อง และนำต่อ</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors shadow-md flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" /> ปรึกษาฟรี
            </button>
            <button className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold py-2 px-6 rounded-full text-sm transition-colors flex items-center">
              02-123-4567
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};