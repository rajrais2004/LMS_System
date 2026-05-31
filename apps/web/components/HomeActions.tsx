'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth, resolveAuthDestination } from '../hooks/useAuth';

export function HomeActions() {
  const { user, loading, isAuthenticated } = useAuth();
  const [destination, setDestination] = useState<string>('/auth/login');

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      resolveAuthDestination(user.role).then(setDestination);
    }
  }, [loading, isAuthenticated, user]);

  return (
    <section className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-10 shadow-soft backdrop-blur-md">
      {isAuthenticated && user ? (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Welcome back</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Continue your {user.role.toLowerCase()} workflow</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Logged in as {user.name}. Pick up where you left off and continue your current application or dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={destination} className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              {loading ? 'Loading...' : 'Continue session'}
            </Link>
            <Link href="/auth/login" className="text-sm text-slate-300 hover:text-white">
              Change account
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Get started</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Sign in or register to manage loans</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Use the LMS with borrower or staff access. The system remembers your session and sends you to the right dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/auth/login" className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              User login
            </Link>
            <Link href="/auth/register" className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-white">
              Register borrower
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
