'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Toast } from '../../../components/ui/toast';
import { useAuth } from '../../../hooks/useAuth';

function getRedirectPath(role?: string) {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin';
    case 'SALES':
      return '/dashboard/sales';
    case 'SANCTION':
      return '/dashboard/sanction';
    case 'DISBURSEMENT':
      return '/dashboard/disbursement';
    case 'COLLECTION':
      return '/dashboard/collection';
    case 'BORROWER':
    default:
      return '/borrower/personal-details';
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      router.push(getRedirectPath(user?.role));
    } catch (err: any) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
      <section className="w-full space-y-8 rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-10 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            LMS Access
          </p>

          <h1 className="text-3xl font-semibold text-white">
            Login to continue
          </h1>

          <p className="text-slate-400">
            Use borrower or staff credentials to access the relevant workflow dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Email</label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm text-slate-300">Password</label>
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="********"
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-sm text-slate-400">
          Need a borrower account?{' '}
          <a
            href="/auth/register"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Register here
          </a>
          .
        </p>
      </section>

      {error && <Toast message={error} />}
    </main>
  );
}