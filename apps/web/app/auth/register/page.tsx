'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Toast } from '../../../components/ui/toast';
import { useAuth } from '../../../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
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
      await register(name, email, password);
      router.push('/borrower/personal-details');
    } catch (err: any) {
      setError(err.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
      <section className="w-full space-y-8 rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-10 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">New borrower</p>
          <h1 className="text-3xl font-semibold text-white">Create an account and start your loan journey</h1>
          <p className="text-slate-400">Register with your email to proceed through the borrower flow and apply for a loan.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Full name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="John Doe" required />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Password</label>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Create a secure password" required />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Registering…' : 'Create account'}</Button>
        </form>
        <p className="text-sm text-slate-400">Already registered? <a href="/auth/login" className="text-cyan-400 hover:text-cyan-300">Login</a>.</p>
      </section>
      {error && <Toast message={error} />}
    </main>
  );
}
