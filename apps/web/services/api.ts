type ApiFetchOptions = RequestInit & {
  skipAuthRedirect?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = new Headers(fetchOptions.headers ?? {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const body = fetchOptions.body;
  if (!(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    credentials: 'include',
    ...fetchOptions,
    headers,
  });

  let json: any = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        if (response.status === 401 && !skipAuthRedirect) {
          window.location.href = '/auth/login';
        }
      }
      const errorMessage =
        response.status === 401
          ? 'Unauthorized. Please sign in again.'
          : 'You do not have permission to access this resource.';
      throw new Error(json?.error || errorMessage);
    }

    throw new Error(json?.error || 'Server error');
  }

  return json as T;
}
