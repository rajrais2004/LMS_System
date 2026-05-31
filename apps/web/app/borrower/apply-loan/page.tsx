'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Toast } from '../../../components/ui/toast';
import { apiFetch } from '../../../services/api';

export default function ApplyLoanPage() {
  const router = useRouter();

  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(90);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const interest = useMemo(
    () => Number(((amount * 12 * tenure) / (365 * 100)).toFixed(2)),
    [amount, tenure]
  );

  const total = useMemo(
    () => Number((amount + interest).toFixed(2)),
    [amount, interest]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await apiFetch('/api/borrower/apply', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          tenureDays: tenure,
        }),
      });

      setStatus('Loan applied successfully. Redirecting to status page...');

      setTimeout(() => {
        router.push('/borrower/status');
      }, 1200);
    } catch (error: any) {
      setStatus(error.message || 'Unable to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <section className="rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-10 shadow-soft">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            Step 3
          </p>

          <h1 className="text-3xl font-semibold text-white">
            Configure your loan
          </h1>

          <p className="text-slate-400">
            Choose the amount and repayment tenure before applying.
          </p>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <label>Loan amount</label>
                <span>₹{amount.toLocaleString()}</span>
              </div>

              <input
                type="range"
                min="50000"
                max="500000"
                step="5000"
                value={amount}
                onChange={(event) =>
                  setAmount(Number(event.target.value))
                }
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <label>Tenure (days)</label>
                <span>{tenure} days</span>
              </div>

              <input
                type="range"
                min="30"
                max="365"
                step="5"
                value={tenure}
                onChange={(event) =>
                  setTenure(Number(event.target.value))
                }
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-slate-800/90 bg-slate-900/90 p-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-400">Interest rate</p>
              <p className="mt-2 text-xl font-semibold text-white">
                12% p.a.
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Interest amount</p>
              <p className="mt-2 text-xl font-semibold text-white">
                ₹{interest.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Total repayment</p>
              <p className="mt-2 text-xl font-semibold text-white">
                ₹{total.toLocaleString()}
              </p>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Applying…' : 'Apply for loan'}
          </Button>
        </form>

        {status && (
          <p className="mt-4 text-sm text-slate-300">
            {status}
          </p>
        )}
      </section>

      {status && <Toast message={status} />}
    </main>
  );
}