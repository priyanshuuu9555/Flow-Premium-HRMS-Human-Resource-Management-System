import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Route =
  | 'dashboard' | 'employees' | 'attendance' | 'leave'
  | 'recruitment' | 'jobs' | 'settings';

interface RouterValue {
  route: Route;
  params: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('dashboard');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = useCallback((r: Route, p: Record<string, string> = {}) => {
    setRoute(r);
    setParams(p);
  }, []);

  return (
    <RouterContext.Provider value={{ route, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
