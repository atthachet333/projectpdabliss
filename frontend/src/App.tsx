import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminLayout } from './admin/AdminLayout';
import { ProtectedAdminRoute } from './admin/ProtectedAdminRoute';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminAnalyticsPage } from './admin/pages/AdminAnalyticsPage';
import { AdminLeadDetailPage } from './admin/pages/AdminLeadDetailPage';
import { AdminLeadsPage } from './admin/pages/AdminLeadsPage';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminSeoPage } from './admin/pages/AdminSeoPage';
import { AdminSeoPageDetailPage } from './admin/pages/AdminSeoPageDetailPage';
import { AdminSeoPagesPage } from './admin/pages/AdminSeoPagesPage';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProcessPage } from './pages/ProcessPage';
import { ServicesPage } from './pages/ServicesPage';
import { SeoHead } from './seo/SeoHead';
import { appLogger } from './utils/appLogger';
import { logUserAction } from './utils/logger'; // นำเข้าฟังก์ชัน Log ของเรา
import { initializeAnalytics } from './utils/analytics';

// Component ตัวช่วยสำหรับดักจับเวลาผู้ใช้เปลี่ยนหน้าเว็บ
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    // ส่ง Log ไปที่ Backend ทันทีที่มีการเปลี่ยน URL (Page View)
    logUserAction('PAGE_VIEW', { path: location.pathname });
  }, [location]);

  return null;
}

function AppRoutes(): JSX.Element {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdminRoute) return;
    document.title = 'PDA Bliss Admin';
    document.querySelector('script#pda-json-ld')?.remove();
    document.querySelector('link[rel="canonical"]')?.remove();
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex,nofollow';
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/leads" element={<AdminLeadsPage />} />
              <Route path="/admin/leads/:id" element={<AdminLeadDetailPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/seo" element={<AdminSeoPage />} />
              <Route path="/admin/seo/pages" element={<AdminSeoPagesPage />} />
              <Route path="/admin/seo/pages/:id" element={<AdminSeoPageDetailPage />} />
            </Route>
          </Route>
          <Route path="*" element={<AdminLoginPage />} />
        </Routes>
      </AdminAuthProvider>
    );
  }

  return (
    <>
      <SeoHead />
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
    </>
  );
}

export default function App(): JSX.Element {
  useEffect(() => {
    initializeAnalytics();
    appLogger.info('app_initialized', 'Frontend application initialized');
  }, []);

  return (
    <BrowserRouter>
      {/* ใส่ RouteTracker ไว้ด้านใน BrowserRouter เพื่อให้มันอ่านค่า URL ได้ */}
      <RouteTracker /> 
      <AppRoutes />
    </BrowserRouter>
  );
}
