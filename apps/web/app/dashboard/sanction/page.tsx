'use client';

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Toast } from '../../../components/ui/toast';
import { apiFetch } from '../../../services/api';

export default function SanctionDashboardPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ loans: any[] }>('/api/dashboard/sanction');
      setLoans(data.loans);
    } catch (err: any) {
      setError(err.message || 'Unable to load loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAction = async (loanId: string, action: 'approve' | 'reject') => {
    try {
      await apiFetch('/api/dashboard/loan-action', {
        method: 'POST',
        body: JSON.stringify({ loanId, action, reason: action === 'reject' ? 'Does not meet sanction criteria' : undefined }),
      });
      fetchLoans();
    } catch (err: any) {
      setError(err.message || 'Action failed');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Sanction module</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Approve or reject applied loans</h1>
            </div>
            <p className="text-sm text-slate-400">Every decision is logged and reflected in the loan lifecycle.</p>
          </div>
        </Card>
        {loading ? (
          <p className="text-slate-300">Loading applied loans…</p>
        ) : loans.length === 0 ? (
          <Card><p className="text-slate-400">No applied loans are awaiting sanction.</p></Card>
        ) : (
          <div className="grid gap-4">
            {loans.map((loan) => (
              <Card key={loan._id} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{loan.borrower.name}</p>
                    <p className="text-sm text-slate-400">{loan.borrower.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Applied</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <p className="text-sm text-slate-300">Amount: ₹{loan.amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-300">Tenure: {loan.tenureDays} days</p>
                  <p className="text-sm text-slate-300">Repayment: ₹{loan.totalRepayment.toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={() => handleAction(loan._id, 'approve')}>Approve</Button>
                  <Button type="button" onClick={() => handleAction(loan._id, 'reject')} className="bg-rose-500 text-slate-950 hover:bg-rose-400">Reject</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
        {error && <Toast message={error} />}
      </div>
    </main>
  );
}
