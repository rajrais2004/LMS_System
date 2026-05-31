'use client';

import { useEffect, useState } from 'react';

export function Toast({ message }: { message: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 4500);
    return () => clearTimeout(timer);
  }, []);

  if (!message || hidden) return null;

  return (
    <div className="fixed bottom-6 right-6 rounded-3xl bg-slate-900/95 px-5 py-4 text-sm text-slate-100 shadow-soft ring-1 ring-white/10">
      {message}
    </div>
  );
}
