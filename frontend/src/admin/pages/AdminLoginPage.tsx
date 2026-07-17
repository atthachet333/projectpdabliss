import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminLoginPage = (): JSX.Element => {
  const { login, state } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (state === 'authenticated') return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate((location.state as { from?: string } | null)?.from ?? '/admin', { replace: true });
    } catch {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <p className="text-sm font-black uppercase tracking-wide text-green-700">PDA Bliss Admin</p>
        <h1 className="mt-2 text-3xl font-black text-gray-950">เข้าสู่ระบบผู้ดูแล</h1>
        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-gray-700">อีเมล</span>
            <input className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-700">รหัสผ่าน</span>
            <input className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
          </label>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-md bg-green-700 px-4 py-3 text-sm font-black text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </form>
    </div>
  );
};
