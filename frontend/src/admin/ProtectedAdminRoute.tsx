import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export const ProtectedAdminRoute = (): JSX.Element => {
  const { state } = useAdminAuth();
  const location = useLocation();

  if (state === 'loading') {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">กำลังตรวจสอบสิทธิ์...</div>;
  }

  if (state === 'unauthenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
