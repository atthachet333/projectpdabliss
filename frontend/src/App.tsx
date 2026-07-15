import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProcessPage } from './pages/ProcessPage';
import { ServicesPage } from './pages/ServicesPage';
import { logUserAction } from './utils/logger'; // นำเข้าฟังก์ชัน Log ของเรา

// Component ตัวช่วยสำหรับดักจับเวลาผู้ใช้เปลี่ยนหน้าเว็บ
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // ส่ง Log ไปที่ Backend ทันทีที่มีการเปลี่ยน URL (Page View)
    logUserAction('PAGE_VIEW', { path: location.pathname });
  }, [location]);

  return null;
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      {/* ใส่ RouteTracker ไว้ด้านใน BrowserRouter เพื่อให้มันอ่านค่า URL ได้ */}
      <RouteTracker /> 
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* หากพิมพ์ URL ผิด ให้เด้งกลับมาที่หน้าแรก */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}