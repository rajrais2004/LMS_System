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
      try {
        const result = await apiFetch<{ application?: unknown }>('/api/borrower/status');
        return result.application ? '/borrower/status' : '/borrower/personal-details';
      } catch {
        return '/borrower/personal-details';
      }
    default:
      return '/auth/login';
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveAuth = (data: AuthResponse) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', data.user.role);
    }

    setUser(data.user);
  };

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }

    setUser(null);
  };

  useEffect(() => {
    const storedUser =
      typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearAuth();
      }
    }

    apiFetch<{ user: UserState }>('/api/auth/me', { skipAuthRedirect: true })
      .then((data) => setUser(data.user))
      .catch(() => {
        if (!storedUser) setUser(null);
      })
      .finally(() => setLoading(false));
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

  const logout = () => {
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