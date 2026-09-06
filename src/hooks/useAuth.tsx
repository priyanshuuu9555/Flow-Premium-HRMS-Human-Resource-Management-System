import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { currentUser as mockUser } from '@/data/mockData';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fphr_user');
    return saved ? (JSON.parse(saved) as User) : null;
  });

  const persist = (u: User | null) => {
    if (u) localStorage.setItem('fphr_user', JSON.stringify(u));
    else localStorage.removeItem('fphr_user');
    setUser(u);
  };

  const login = useCallback(async (email: string, _password: string) => {
    await delay(700);
    persist({ ...mockUser, email: email || mockUser.email });
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await delay(700);
    persist({ ...mockUser, name, email });
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
