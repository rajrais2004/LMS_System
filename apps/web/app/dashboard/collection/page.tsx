'use client';

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Toast } from '../../../components/ui/toast';
import { apiFetch } from '../../../services/api';

export default function CollectionDashboardPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loanId, setLoanId] = useState('');
  const [utr, setUtr] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ loans: any[] }>('/api/dashboard/collection');
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('');
    try {
      await apiFetch('/api/payments', {
        method: 'POST',
        body: JSON.stringify({ loanId, utr, amount, date }),
      });
      setStatus('Payment recorded successfully.');
      setUtr('');
      setAmount('');
      setDate('');
      fetchLoans();
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Collection module</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Record payments and close loans</h1>
            </div>
            <p className="text-sm text-slate-400">Unique UTR and outstanding validations protect collections.</p>
          </div>
        </Card>
        {loading ? (
          <p className="text-slate-300">Loading disbursed loans…</p>
        ) : loans.length === 0 ? (
          <Card><p className="text-slate-400">No disbursed loans are pending collection.</p></Card>
        ) : (
          <div className="grid gap-4">
            {loans.map((loan) => (
              <Card key={loan._id} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{loan.borrower.name}</p>
                    <p className="text-sm text-slate-400">Outstanding: ₹{(loan.totalRepayment - loan.totalPaid).toLocaleString()}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Disbursed</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-slate-300">Amount: ₹{loan.amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-300">Paid: ₹{loan.totalPaid.toLocaleString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        <Card>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold text-white">Record a payment</h2>
            <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" value={loanId} onChange={(event) => setLoanId(event.target.value)} required>
              <option value="">Select loan</option>
              {loans.map((loan) => (
                <option key={loan._id} value={loan._id}>{loan.borrower.name} - ₹{(loan.totalRepayment - loan.totalPaid).toLocaleString()} outstanding</option>
              ))}
            </select>
            <Input value={utr} onChange={(event) => setUtr(event.target.value)} placeholder="UTR number" required />
            <Input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="1" placeholder="Payment amount" required />
            <Input value={date} onChange={(event) => setDate(event.target.value)} type="date" required />
            <Button type="submit">Save payment</Button>
          </form>
        </Card>
        {(error || status) && <Toast message={error || status} />}
      </div>
    </main>
  );
}
