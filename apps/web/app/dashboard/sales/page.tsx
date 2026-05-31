'use client';

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Toast } from '../../../components/ui/toast';
import { apiFetch } from '../../../services/api';

export default function SalesDashboardPage() {
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ borrowers: any[] }>('/api/dashboard/sales')
      .then((data) => setBorrowers(data.borrowers))
      .catch((err) => setError(err.message || 'Unable to load borrowers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Sales module</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Borrowers waiting to start loan flow</h1>
            </div>
            <p className="text-sm text-slate-400">Review candidates before they proceed to application.</p>
          </div>
        </Card>
        {loading ? (
          <p className="text-slate-300">Loading borrowers…</p>
        ) : borrowers.length === 0 ? (
          <Card><p className="text-slate-400">No borrowers are pending review right now.</p></Card>
        ) : (
          <div className="grid gap-4">
            {borrowers.map((borrower) => (
              <Card key={borrower._id} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{borrower.borrower.name}</p>
                    <p className="text-sm text-slate-400">{borrower.borrower.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{borrower.breApproved ? 'BRE OK' : 'BRE review'}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-slate-400">Employment: {borrower.employmentMode}</p>
                  <p className="text-sm text-slate-400">Salary: ₹{borrower.monthlySalary.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">PAN: {borrower.pan}</p>
                  <p className="text-sm text-slate-400">Slip uploaded: {borrower.slipUrl ? 'Yes' : 'No'}</p>
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
