import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AdminApiError, getCurrentAdmin, loginAdmin, logoutAdmin, type AdminUser } from '../services/admin-api';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

type AdminAuthContextValue = {
  admin: AdminUser | null;
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [state, setState] = useState<AuthState>('loading');

  const refresh = useCallback(async () => {
    setState('loading');
    try {
      const current = await getCurrentAdmin();
      setAdmin(current);
      setState('authenticated');
    } catch {
      setAdmin(null);
      setState('unauthenticated');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const loggedIn = await loginAdmin(email, password);
    setAdmin(loggedIn);
    setState('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      if (!(error instanceof AdminApiError) || error.status !== 401) throw error;
    } finally {
      setAdmin(null);
      setState('unauthenticated');
    }
  }, []);

  const value = useMemo(() => ({ admin, state, login, logout, refresh }), [admin, state, login, logout, refresh]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = (): AdminAuthContextValue => {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return value;
};
