'use client';

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Toast } from '../../../components/ui/toast';
import { apiFetch } from '../../../services/api';

export default function DisbursementDashboardPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ loans: any[] }>('/api/dashboard/disbursement');
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

  const handleDisburse = async (loanId: string) => {
    try {
      await apiFetch('/api/dashboard/loan-action', {
        method: 'POST',
        body: JSON.stringify({ loanId, action: 'disburse' }),
      });
      fetchLoans();
    } catch (err: any) {
      setError(err.message || 'Disbursement failed');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Disbursement module</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Mark sanctioned loans as disbursed</h1>
            </div>
            <p className="text-sm text-slate-400">The loan moves to the collection stage once disbursed.</p>
          </div>
        </Card>
        {loading ? (
          <p className="text-slate-300">Loading sanctioned loans…</p>
        ) : loans.length === 0 ? (
          <Card><p className="text-slate-400">No sanctioned loans are waiting for disbursement.</p></Card>
        ) : (
          <div className="grid gap-4">
            {loans.map((loan) => (
              <Card key={loan._id} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{loan.borrower.name}</p>
                    <p className="text-sm text-slate-400">{loan.borrower.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Sanctioned</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-slate-300">Amount: ₹{loan.amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-300">Repayment: ₹{loan.totalRepayment.toLocaleString()}</p>
                </div>
                <Button type="button" onClick={() => handleDisburse(loan._id)}>Mark disbursed</Button>
              </Card>
            ))}
          </div>
        )}
        {error && <Toast message={error} />}
      </div>
    </main>
  );
}
