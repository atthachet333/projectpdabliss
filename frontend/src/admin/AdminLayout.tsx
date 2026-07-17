import { BarChart3, LayoutDashboard, LogOut, Menu, SearchCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export const AdminLayout = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition ${
      isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-950">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-gray-950 text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="text-lg font-black text-white">PDA Bliss Admin</p>
            <p className="text-xs font-semibold text-green-300">ระบบหลังบ้าน</p>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="ปิดเมนู"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-2 p-4">
          <NavLink to="/admin" end className={navClass} onClick={() => setOpen(false)}><LayoutDashboard className="h-4 w-4" /> แดชบอร์ด</NavLink>
          <NavLink to="/admin/leads" className={navClass} onClick={() => setOpen(false)}><Users className="h-4 w-4" /> ผู้ติดต่อ</NavLink>
          <NavLink to="/admin/analytics" className={navClass} onClick={() => setOpen(false)}><BarChart3 className="h-4 w-4" /> วิเคราะห์เว็บไซต์</NavLink>
          <NavLink to="/admin/seo" className={navClass} onClick={() => setOpen(false)}><SearchCheck className="h-4 w-4" /> SEO</NavLink>
        </nav>
      </aside>
      {open && <button aria-label="ปิดเมนู" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="เปิดเมนู"><Menu className="h-6 w-6" /></button>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-gray-900">{admin?.email}</p>
              <p className="text-xs font-bold text-green-700">{admin?.role}</p>
            </div>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-3 py-2 text-sm font-bold text-white hover:bg-green-700">
              <LogOut className="h-4 w-4" /> ออกจากระบบ
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          {admin?.mustChangePassword && (
            <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-800">
              บัญชีนี้เป็นบัญชีเริ่มต้นสำหรับ Initial Setup ควรเปลี่ยนรหัสผ่านก่อนใช้งานจริง
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
