import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import type { Toast as ToastType } from '@/types';

const config: Record<ToastType['type'], { icon: React.ReactNode; bg: string; ring: string }> = {
  success: { icon: <CheckCircle2 size={18} />, bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
  error: { icon: <XCircle size={18} />, bg: 'bg-red-50', ring: 'ring-red-200' },
  info: { icon: <Info size={18} />, bg: 'bg-sky-50', ring: 'ring-sky-200' },
  warning: { icon: <AlertTriangle size={18} />, bg: 'bg-amber-50', ring: 'ring-amber-200' },
};

const text: Record<ToastType['type'], string> = {
  success: 'text-emerald-800',
  error: 'text-red-800',
  info: 'text-sky-800',
  warning: 'text-amber-800',
};

const iconColor: Record<ToastType['type'], string> = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  info: 'text-sky-600',
  warning: 'text-amber-600',
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5">
      {toasts.map((t) => {
        const c = config[t.type];
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-xl ${c.bg} px-4 py-3 shadow-lg ring-1 ${c.ring} animate-slide-in-right min-w-[280px] max-w-[400px]`}
          >
            <span className={iconColor[t.type]}>{c.icon}</span>
            <p className={`flex-1 text-sm font-medium ${text[t.type]}`}>{t.message}</p>
            <button onClick={() => dismiss(t.id)} className={`rounded p-0.5 ${text[t.type]} opacity-60 hover:opacity-100`}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
