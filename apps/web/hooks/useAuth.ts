'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export type UserState = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type AuthResponse = {
  token: string;
  user: NonNullable<UserState>;
};

export async function resolveAuthDestination(role?: string) {
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
      return '/borrower/personal-details';
    default:
      return '/auth/login';
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.dispatchEvent(new Event('auth-change'));
    }

    setUser(null);
  };

  const saveAuth = (data: AuthResponse) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', data.user.role);
      window.dispatchEvent(new Event('auth-change'));
    }

    setUser(data.user);
  };

  const loadFromStorage = () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      clearAuth();
    }

    setLoading(false);
  };

  useEffect(() => {
    loadFromStorage();

    const onAuthChange = () => loadFromStorage();

    window.addEventListener('auth-change', onAuthChange);
    window.addEventListener('storage', onAuthChange);

    return () => {
      window.removeEventListener('auth-change', onAuthChange);
      window.removeEventListener('storage', onAuthChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      const data = await apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      saveAuth(data);
      return data.user;
    } catch (err: any) {
      setError(err.message || 'Unable to sign in');
      clearAuth();
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);

      const data = await apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      saveAuth(data);
      return data.user;
    } catch (err: any) {
      setError(err.message || 'Unable to register');
      clearAuth();
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore backend logout failure
    }

    clearAuth();
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };
}