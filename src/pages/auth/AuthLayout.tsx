import { Briefcase } from 'lucide-react';
import { type ReactNode } from 'react';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between bg-brand-900 p-12 text-white lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800')" }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-lg font-bold">Flow Premium HR</p>
              <p className="text-sm text-white/60">KIMO Clothing Design Concept</p>
            </div>
          </div>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Manage your workforce<br />with elegance and ease.
          </h2>
          <p className="max-w-md text-white/70">
            A complete human resource management platform — employees, attendance, leave,
            recruitment, and analytics, all in one premium dashboard.
          </p>
          <div className="flex gap-8">
            {[
              { n: '25+', l: 'Employees' },
              { n: '6', l: 'Departments' },
              { n: '6', l: 'Open Jobs' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-bold">{s.n}</p>
                <p className="text-sm text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/40">© 2026 KIMO Clothing Design Concept Pvt. Ltd.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">Flow Premium HR</p>
              <p className="text-xs text-slate-400">KIMO Clothing</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
