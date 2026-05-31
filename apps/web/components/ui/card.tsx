'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-3xl border border-slate-800/90 bg-slate-900/95 p-6 shadow-soft', className)}>{children}</div>;
}
