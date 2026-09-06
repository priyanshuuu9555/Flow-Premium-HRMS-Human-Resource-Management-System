import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input, Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';

export function ForgotPasswordPage() {
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      notify('success', 'Password reset link sent to your email.');
    } catch {
      notify('error', 'Could not send reset email. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we’ll send you a reset link.">
      {sent ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Mail size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Check your inbox</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              We’ve sent a password reset link to <span className="font-medium text-slate-700">{email}</span>.
              Follow the link to set a new password.
            </p>
          </div>
          <a href="#login" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
            <ArrowLeft size={16} /> Back to sign in
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email Address" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} error={error}
            placeholder="you@kimoclothing.in" required />
          <Button type="submit" size="lg" loading={loading} className="w-full">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </Button>
          <a href="#login" className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} /> Back to sign in
          </a>
        </form>
      )}
    </AuthLayout>
  );
}
