'use client';

import type { ReactNode } from 'react';

const steps = [
  { key: 'BRE', label: 'BRE evaluation' },
  { key: 'SLIP', label: 'Slip upload' },
  { key: 'APPLIED', label: 'Loan applied' },
  { key: 'SANCTIONED', label: 'Sanction' },
  { key: 'DISBURSED', label: 'Disbursed' },
  { key: 'CLOSED', label: 'Closed' },
];

function statusOrder(status: string) {
  return steps.findIndex((step) => step.key === status);
}

export function LoanTimeline({ current }: { current: string }) {
  const activeIndex = statusOrder(current);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6">
      <h2 className="text-lg font-semibold text-white">Loan lifecycle</h2>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const completed = index <= activeIndex;
          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold" aria-hidden="true" style={{ borderColor: completed ? '#22d3ee' : '#334155', color: completed ? '#22d3ee' : '#cbd5e1' }}>
                {index + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${completed ? 'text-white' : 'text-slate-400'}`}>{step.label}</p>
                <p className="text-xs text-slate-500">{completed ? 'Completed' : 'Pending'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
