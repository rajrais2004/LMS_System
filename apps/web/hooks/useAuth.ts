'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export type UserState = { id: string; name: string; email: string; role: string } | null;

export function useAuth() {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ user: UserState }>('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const data = await apiFetch<{ user: UserState }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(data.user);
      return data.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const data = await apiFetch<{ user: UserState }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setUser(data.user);
      return data.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { user, loading, error, login, register };
}
