import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { RouterProvider, useRouter } from '@/hooks/useRouter';
import { AppLayout } from '@/layouts/AppLayout';
import { ToastContainer } from '@/components/ui';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { AttendancePage } from '@/pages/AttendancePage';
import { LeavePage } from '@/pages/LeavePage';
import { RecruitmentPage } from '@/pages/RecruitmentPage';
import { JobsPage } from '@/pages/JobsPage';
import { SettingsPage } from '@/pages/SettingsPage';

type AuthMode = 'login' | 'register' | 'forgot';

function AuthGate() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');

  if (isAuthenticated) return null;

  if (mode === 'register') return <RegisterPage />;
  if (mode === 'forgot') return <ForgotPasswordPage />;
  return <LoginPage />;
}

function AppRoutes() {
  const { route } = useRouter();

  switch (route) {
    case 'dashboard': return <DashboardPage />;
    case 'employees': return <EmployeesPage />;
    case 'attendance': return <AttendancePage />;
    case 'leave': return <LeavePage />;
    case 'recruitment': return <RecruitmentPage />;
    case 'jobs': return <JobsPage />;
    case 'settings': return <SettingsPage />;
    default: return <DashboardPage />;
  }
}

function AppShell() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <AuthGate />;

  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider>
          <AppShell />
          <ToastContainer />
        </RouterProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
