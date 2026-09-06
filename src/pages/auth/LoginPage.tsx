import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export function LoginPage() {
  const { login } = useAuth();
  const { notify } = useToast();
  const [email, setEmail] = useState('aarav.mehta@kimoclothing.in');
  const [password, setPassword] = useState('demo1234');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      notify('success', 'Welcome back! Logged in successfully.');
    } catch {
      notify('error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="Enter your credentials to access the HR dashboard.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} error={errors.email}
          placeholder="you@kimoclothing.in" required
        />

        <div className="relative">
          <Input
            label="Password" type={showPwd ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)} error={errors.password}
            placeholder="••••••••" required className="pr-11"
          />
          <button type="button" onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600">
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20" defaultChecked />
            Remember me
          </label>
          <a href="#forgot" className="text-sm font-medium text-brand-600 hover:text-brand-700">Forgot password?</a>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full" icon={!loading ? <ArrowRight size={18} /> : undefined}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Mail size={14} /> Demo Credentials
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Lock size={14} className="text-slate-400" /> aarav.mehta@kimoclothing.in
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <Lock size={14} className="text-slate-400" /> demo1234
          </div>
        </div>

        <p className="text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <a href="#register" className="font-semibold text-brand-600 hover:text-brand-700">Create one</a>
        </p>
      </form>
    </AuthLayout>
  );
}
