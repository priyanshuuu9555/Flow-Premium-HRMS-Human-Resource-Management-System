import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name too short';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      notify('success', 'Account created! Welcome to Flow Premium HR.');
    } catch {
      notify('error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join Flow Premium HR to manage your workforce.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)}
          error={errors.name} placeholder="Aarav Mehta" required />
        <Input label="Work Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
          error={errors.email} placeholder="you@kimoclothing.in" required />
        <Input label="Password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
          error={errors.password} placeholder="Min 6 characters" required />
        <Input label="Confirm Password" type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)}
          error={errors.confirm} placeholder="Re-enter password" required />

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20" defaultChecked />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <a href="#login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</a>
        </p>
      </form>
    </AuthLayout>
  );
}
