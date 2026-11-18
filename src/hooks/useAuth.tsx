
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import type { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('authToken');
    const saved = localStorage.getItem('currentUser');

    if (!token || !saved) return null;

    try {
      return JSON.parse(saved) as User;
    } catch {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);

    setUser(loggedInUser);
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string
  ) => {
    await authService.register(name, email, password);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('fphr_user');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
