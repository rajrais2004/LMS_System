'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white hover:text-cyan-300">
          Loan Management System
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="text-right text-sm">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-slate-400">{user.role}</p>
              </div>
              <Button className="rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white hover:bg-slate-700" type="button" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-slate-300 transition hover:text-white">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm text-cyan-400 transition hover:text-cyan-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
