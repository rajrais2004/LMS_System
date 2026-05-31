'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import { Card } from '../../../components/ui/card';
import { Toast } from '../../../components/ui/toast';
import { LoanTimeline } from '../../../components/loan/timeline';

export default function StatusPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ application: any; loan: any }>('/api/borrower/status')
      .then((result) => setData(result))
      .catch((err) => setError(err.message || 'Unable to load status'))
      .finally(() => setLoading(false));
  }, []);

  const progress = data?.loan ? Math.min(100, Math.round((data.loan.totalPaid / data.loan.totalRepayment) * 100)) : 0;

  if (loading) return <main className="min-h-screen px-6 py-12">Loading borrower status…</main>;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-10 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Borrower status</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Loan application overview</h1>
            </div>
            <p className="text-sm text-slate-400">Track BRE, slip upload, and repayment progress in one view.</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,_0.9fr]">
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-white">BRE summary</h2>
            {!data?.application ? (
              <p className="text-slate-400">Submit your personal details first to receive BRE feedback.</p>
            ) : (
              <div className="space-y-3">
                <p className={data.application.breApproved ? 'text-emerald-300' : 'text-rose-300'}>{data.application.breMessage}</p>
                <p className="text-sm text-slate-400">PAN: {data.application.pan}</p>
                <p className="text-sm text-slate-400">Employment: {data.application.employmentMode}</p>
                <p className="text-sm text-slate-400">Salary: ₹{data.application.monthlySalary.toLocaleString()}</p>
              </div>
            )}
          </Card>
         <LoanTimeline
             application={data?.application}
             loan={data?.loan}
         />
        </div>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Loan details</h2>
          {!data?.loan ? (
            <p className="text-slate-400">No loan has been applied yet. Complete the application flow.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1 rounded-3xl border border-slate-800/90 bg-slate-900/90 p-4">
                <p className="text-sm text-slate-400">Amount</p>
                <p className="text-lg font-semibold text-white">₹{data.loan.amount.toLocaleString()}</p>
              </div>
              <div className="space-y-1 rounded-3xl border border-slate-800/90 bg-slate-900/90 p-4">
                <p className="text-sm text-slate-400">Repayment</p>
                <p className="text-lg font-semibold text-white">₹{data.loan.totalRepayment.toLocaleString()}</p>
              </div>
              <div className="space-y-1 rounded-3xl border border-slate-800/90 bg-slate-900/90 p-4">
                <p className="text-sm text-slate-400">Outstanding</p>
                <p className="text-lg font-semibold text-white">₹{(data.loan.totalRepayment - data.loan.totalPaid).toLocaleString()}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
      {error && <Toast message={error} />}
    </main>
  );
}
