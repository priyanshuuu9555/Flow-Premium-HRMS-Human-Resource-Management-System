import {
  LayoutDashboard, Users, CalendarCheck, CalendarDays,
  UserRoundSearch, Briefcase, Settings, X,
} from 'lucide-react';
import { useRouter, type Route } from '@/hooks/useRouter';
import { currentUser } from '@/data/mockData';
import { Avatar } from '@/components/ui/Avatar';

const navItems: { route: Route; label: string; icon: React.ReactNode }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { route: 'employees', label: 'Employees', icon: <Users size={20} /> },
  { route: 'attendance', label: 'Attendance', icon: <CalendarCheck size={20} /> },
  { route: 'leave', label: 'Leave Management', icon: <CalendarDays size={20} /> },
  { route: 'recruitment', label: 'Recruitment', icon: <UserRoundSearch size={20} /> },
  { route: 'jobs', label: 'Job Postings', icon: <Briefcase size={20} /> },
  { route: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { route, navigate } = useRouter();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">Flow Premium</p>
              <p className="text-xs text-slate-400">HR Management</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</p>
          {navItems.map((item) => {
            const active = route === item.route;
            return (
              <button
                key={item.route}
                onClick={() => { navigate(item.route); onClose(); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={active ? 'text-brand-600' : 'text-slate-400'}>{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{currentUser.name}</p>
              <p className="truncate text-xs text-slate-400">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
