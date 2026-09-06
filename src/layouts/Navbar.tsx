import { Menu, Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { msg: 'Arjun Nair applied for Casual leave', time: '2h ago' },
    { msg: 'New applicant for Senior Full-Stack Engineer', time: '5h ago' },
    { msg: 'Saanvi Iyer’s leave approved', time: '1d ago' },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="relative hidden flex-1 sm:block sm:max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search employees, leave, jobs..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          {showNotif && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
              <div className="absolute right-0 top-12 z-20 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-slide-up">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex gap-3 px-4 py-3 hover:bg-slate-50">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
                      <div>
                        <p className="text-sm text-slate-700">{n.msg}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden items-center gap-2.5 sm:flex">
          <Avatar name={user?.name || 'User'} color={user?.avatarColor || '#6366f1'} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-tight text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
